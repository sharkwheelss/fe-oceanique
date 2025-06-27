const BASE_URL = 'http://localhost:5000/api';

export const authApi = {
    signup: async (userData: { username: string; email: string; password: string; confirmPassword: string, userTypesId: number }) => {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                confirmPassword: userData.confirmPassword,
                userTypesId: userData.userTypesId
            })
        });
        return response.json();
    },
    login: async (credentials: { login: string; password: string }) => {
        const response = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });
        return response.json();
    },
    checkSession: async () => {
        const res = await fetch(`${BASE_URL}/auth/check`, {
            credentials: 'include',
        });
        return res.json();
    },
    logout: async () => {
        return fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    },
};