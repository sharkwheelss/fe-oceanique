const BASE_URL = 'http://localhost:5000/api';

export const recommendationApi = {
    getAllPersonalities: async () => {
        const response = await fetch(`${BASE_URL}/recommendations/personality`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    }
}