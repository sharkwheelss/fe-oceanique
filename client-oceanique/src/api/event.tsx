const BASE_URL = 'http://localhost:5000/api';

export const eventApi = {
    getAllEvents: async () => {
        const response = await fetch(`${BASE_URL}/events/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    getEventDetails: async (eventId: string) => {
        const response = await fetch(`${BASE_URL}/events/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        return response.json();
    },
}