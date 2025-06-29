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


    const value = {
        loading,
        error,
        getAdminTicketCategories,
        getAdminTicketCategoriesById,
        adminCreateNewTicketCategories,
        adminUpdateTicketCategories,
        adminDeleteTicketCategories,
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