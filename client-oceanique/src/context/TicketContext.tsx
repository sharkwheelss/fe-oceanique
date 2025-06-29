import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface TicketContextType {
    loading: boolean;
    error: string | null;
    getAdminTicketCategories: () => Promise<any>;
    getAdminTicketCategoriesById: (id: number) => Promise<any>;
    adminCreateNewTicketCategories: (name: string) => Promise<any>;
    adminUpdateTicketCategories: (id: number, name: string) => Promise<any>;
    adminDeleteTicketCategories: (id: number) => Promise<any>;

    getAdminTicket: () => Promise<any>;
    getAdminTicketById: (id: number) => Promise<any>;
    adminCreateNewTicket: (name: string, description: string, quota: number, price: number, date: string, private_code: string, events_id: number, tickets_categories_id: number) => Promise<any>;
    adminUpdateTicket: (id: number, name: string, description: string, quota: number, price: number, date: string, private_code: string, events_id: number, tickets_categories_id: number) => Promise<any>;
    adminDeleteTicket: (id: number) => Promise<any>;

    getAdminTRansactionReport: () => Promise<any>;
    getAdminTransactionReportById: (id: number) => Promise<any>;
    adminUpdateTransactionReport: (id: number, status: string, rejection_reason: string) => Promise<any>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAdminTicketCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.getAdminTicketCategories();
            return response.data;
        } catch (err) {
            setError('Failed to fetch tickets category');
            console.error('Error fetching tickets category:', err);
        } finally {
            setLoading(false);
        }
    };
    const getAdminTicketCategoriesById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.getAdminTicketCategoriesById(id);
            return response.data;
        } catch (err) {
            setError('Failed to fetch tickets category details');
            console.error('Error fetching tickets category details:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminCreateNewTicketCategories = async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminCreateNewTicketCategories(name);
            return response;
        } catch (err) {
            setError('Failed to add ticket category');
            console.error('Error when add ticket category:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminUpdateTicketCategories = async (id: number, name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminUpdateTicketCategories(id, name);
            return response;
        } catch (err) {
            setError('Failed to edit ticket category');
            console.error('Error edit ticket category:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminDeleteTicketCategories = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminDeleteTicketCategories(id);
            return response;
        } catch (err) {
            setError('Failed to delete ticket category');
            console.error('Error edit ticket category:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAdminTicket = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.getAdminTicket();
            return response.data;
        } catch (err) {
            setError('Failed to fetch tickets');
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };
    const getAdminTicketById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.getAdminTicketById(id);
            return response.data;
        } catch (err) {
            setError('Failed to fetch tickets details');
            console.error('Error fetching tickets details:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminCreateNewTicket = async (name: string, description: string, quota: number, price: number, date: string, private_code: string, events_id: number, tickets_categories_id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminCreateNewTicket(name, description, quota, price, date, private_code, events_id, tickets_categories_id);
            return response;
        } catch (err) {
            setError('Failed to add ticket');
            console.error('Error when add ticket:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminUpdateTicket = async (id: number, name: string, description: string, quota: number, price: number, date: string, private_code: string, events_id: number, tickets_categories_id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminUpdateTicket(id, name, description, quota, price, date, private_code, events_id, tickets_categories_id);
            return response;
        } catch (err) {
            setError('Failed to edit ticket');
            console.error('Error edit ticket:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminDeleteTicket = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminDeleteTicket(id);
            return response;
        } catch (err) {
            setError('Failed to delete ticket category');
            console.error('Error edit ticket category:', err);
        } finally {
            setLoading(false);
        }
    };


    const getAdminTRansactionReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.getAdminTRansactionReport();
            return response.data;
        } catch (err) {
            setError('Failed to fetch tickets');
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    };
    const getAdminTransactionReportById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.getAdminTransactionReportById(id);
            return response.data;
        } catch (err) {
            setError('Failed to fetch tickets details');
            console.error('Error fetching tickets details:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminUpdateTransactionReport = async (id: number, status: string, rejection_reason: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.ticket.adminUpdateTransactionReport(id, status, rejection_reason);
            return response;
        } catch (err) {
            setError('Failed to edit ticket');
            console.error('Error edit ticket:', err);
        } finally {
            setLoading(false);
        }
    };


    const value = {
        loading,
        error,
        getAdminTicketCategories,
        getAdminTicketCategoriesById,
        adminCreateNewTicketCategories,
        adminUpdateTicketCategories,
        adminDeleteTicketCategories,

        getAdminTicket,
        getAdminTicketById,
        adminCreateNewTicket,
        adminUpdateTicket,
        adminDeleteTicket,

        getAdminTRansactionReport,
        getAdminTransactionReportById,
        adminUpdateTransactionReport,
    };

    return (
        <TicketContext.Provider value={value}>
            {children}
        </TicketContext.Provider>
    );
}

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (context === undefined) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};