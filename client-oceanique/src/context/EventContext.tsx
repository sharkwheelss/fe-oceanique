import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface EventContextType {
    loading: boolean;
    error: string | null;
    getAllEvents: () => Promise<any>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.getAllEvents();
            return response.data;
        } catch (err) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        error,
        getAllEvents
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
}

export const useEvents = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within a EventProvider');
    }
    return context;
};