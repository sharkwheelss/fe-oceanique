const BASE_URL = 'http://localhost:5000/api';

export const authApi = {
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