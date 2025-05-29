import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
            const response = await fetch('http://localhost:5000/api/auth/check', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Session check successful:', data);
                if (data.authenticated && data.user) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        } catch (error) {
            console.error('Session check failed:', error);
        }
    };

    const login = async (emailOrUsername: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    login: emailOrUsername,
                    password: password
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Login error:', data.errors || data.message);
                throw new Error(data.errors ? data.errors[0].msg : data.message || 'Login failed');
            }

            console.log('Login successful:', data.token);
            setIsAuthenticated(true);
            setUser(data.user);

            // Store the token in localStorage for future requests -> optional
            localStorage.setItem('token', data.token);

            return { success: true };

        } catch (error: any) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Something went wrong. Please try again.',
            };
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
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