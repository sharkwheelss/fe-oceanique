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
    getTransactionHistory: async () => {
        const response = await fetch(`${BASE_URL}/events/transaction-history`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    newBooking: async (booking: FormData) => {
        const response = await fetch(`${BASE_URL}/events/booking`, {
            method: 'POST',
            credentials: 'include',
            body: booking // Send FormData directly
        });
        return response.json();
    },
    verifyPrivateCode: async (privateCode: string, ticketId: number) => {
        const response = await fetch(`${BASE_URL}/events/verify-private-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ privateCode, ticketId })
        });
        return response.json();
    }
}