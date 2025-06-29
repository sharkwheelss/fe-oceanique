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


    getAdminTicket: async () => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    getAdminTicketById: async (id: number) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    adminCreateNewTicket: async (name: string, description: string, quota: number, price: number, date: string, private_code: string, events_id: number, tickets_categories_id: number) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, description, quota, price, date, private_code, events_id, tickets_categories_id })
        });
        return response.json();
    },
    adminUpdateTicket: async (id: number, name: string, description: string, quota: number, price: number, date: string, private_code: string, events_id: number, tickets_categories_id: number) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket/${id}/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, description, quota, price, date, private_code, events_id, tickets_categories_id })
        });
        return response.json();
    },
    adminDeleteTicket: async (id: number) => {
        const response = await fetch(`${BASE_URL}/tickets/admin/ticket/${id}/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
}