const BASE_URL = 'http://localhost:5000/api';

export const ticketApi = {
    getAdminTicketCategories: async () => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket-categories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    getAdminTicketCategoriesById: async (id: number) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket-categories/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    adminCreateNewTicketCategories: async (name: string) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket-categories/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name })
        });
        return response.json();
    },
    adminUpdateTicketCategories: async (id: number, name: string) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket-categories/${id}/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name })
        });
        return response.json();
    },
    adminDeleteTicketCategories: async (id: number) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket-categories/${id}/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
}