import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface User {
    id: string;
    username: string;
    email: string;
    userTypeId: number;
    avatar?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
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
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const data = await api.auth.checkSession();
            console.log('Session check successful:', data);

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
    };

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
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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