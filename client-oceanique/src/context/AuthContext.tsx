import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface User {
    id: number;
    username: string;
    email: string;
    user_types_id: number;
    user_personality_id?: number | null;
    avatar?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    checkSession: () => Promise<User | null>;
    signup: (
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ) => Promise<{ success: boolean; message?: string }>;
    login: (
        emailOrUsername: string,
        password: string
    ) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            setIsLoading(true);
            const data = await api.auth.checkSession();
            console.log('Session check', data.authenticated ? 'success' : 'failed', ':', data);

            if (data.authenticated && data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Session check failed:', error);
        }
        finally {
            setIsLoading(false);
        }
        return user;
    };

    const signup = async (
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const data = await api.auth.signup({
                username,
                email,
                password,
                confirmPassword,
            });

            if (data.errors || !data.user) {
                const message = data.errors?.[0]?.msg || data.message || 'Sign up failed';
                console.error('Sign up error:', message);
                throw new Error(message);
            }

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Something went wrong. Please try again.',
            };
        }
    }

    const login = async (
        emailOrUsername: string,
        password: string
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const data = await api.auth.login({
                login: emailOrUsername,
                password,
            });

            if (data.errors || !data.user) {
                const message = data.errors?.[0]?.msg || data.message || 'Login failed';
                console.error('Login error:', message);
                throw new Error(message);
            }

            setIsAuthenticated(true);
            setUser(data.user);
            localStorage.setItem('token', data.token);

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Something went wrong. Please try again.',
            };
        }
    };

    const logout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, checkSession, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};