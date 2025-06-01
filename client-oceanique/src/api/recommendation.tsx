
const BASE_URL = 'http://localhost:5000/api';

export const recommendationApi = {
    // all GET methods
    getAllPersonalities: async () => {
        const response = await fetch(`${BASE_URL}/recommendations/personality`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    getUserPersonality: async () => {
        const response = await fetch(`${BASE_URL}/recommendations/personality/user`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    getPreferenceCategories: async () => {
        const response = await fetch(`${BASE_URL}/recommendations/preferences/categories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },

    // all POST methods
    updateUserPersonality: async (personalityId: number) => {
        const response = await fetch(`${BASE_URL}/recommendations/personality/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ personalityId })
        });
        return response.json();
    },
    updateUserPreferences: async (preferences: any) => {
        const response = await fetch(`${BASE_URL}/recommendations/preferences/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(preferences)
        });
        return response.json();
    },
}