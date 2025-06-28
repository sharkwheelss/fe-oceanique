import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface EventContextType {
    loading: boolean;
    error: string | null;
    getAllEvents: () => Promise<any>;
    getAdminEvents: () => Promise<any>;
    getTransactionHistory: () => Promise<any>;
    getEventDetails: (eventId: string) => Promise<any>;
    getAdminEventDetails: (eventId: number) => Promise<any>;
    newBooking: (booking: FormData) => Promise<any>;
    verifyPrivateCode: (privateCode: string, ticketId: number) => Promise<any>;
    adminCreateNewEvent: (newEvent: FormData) => Promise<any>;
    adminUpdateEvent: (updateEvent: FormData, eventId: number) => Promise<any>;
    adminDeleteEvent: (eventId: number) => Promise<any>;
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
    const getEventDetails = async (eventId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.getEventDetails(eventId);
            return response.data;
        } catch (err) {
            setError('Failed to fetch event details');
            console.error('Error fetching event details:', err);
        } finally {
            setLoading(false);
        }
    };
    const getTransactionHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.getTransactionHistory();
            return response.data;
        } catch (err) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };
    const newBooking = async (booking: FormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.newBooking(booking);
            return response;
        } catch (err) {
            setError('Failed to add new booking');
            console.error('Error add new booking:', err);
        } finally {
            setLoading(false);
        }
    };
    const verifyPrivateCode = async (privateCode: string, ticketId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.verifyPrivateCode(privateCode, ticketId);
            return response;
        } catch (err) {
            setError('Failed to verify private code');
            console.error('Error verifying private code:', err);
        } finally {
            setLoading(false);
        }
    };

    // Admin section
    const getAdminEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.getAdminEvents();
            return response.data;
        } catch (err) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };
    const getAdminEventDetails = async (eventId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.getAdminEventDetails(eventId);
            return response.data;
        } catch (err) {
            setError('Failed to fetch event details');
            console.error('Error fetching event details:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminCreateNewEvent = async (newEvent: FormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.adminCreateNewEvent(newEvent);
            return response;
        } catch (err) {
            setError('Failed to add event');
            console.error('Error when add event:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminUpdateEvent = async (eventId: number, updateEvent: FormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.adminUpdateEvent(updateEvent, eventId);
            return response;
        } catch (err) {
            setError('Failed to edit event');
            console.error('Error edit event:', err);
        } finally {
            setLoading(false);
        }
    };
    const adminDeleteEvent = async (eventId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.event.adminDeleteEvent(eventId);
            return response;
        } catch (err) {
            setError('Failed to delete events');
            console.error('Error edit event:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        error,
        getAllEvents,
        getAdminEvents,
        getTransactionHistory,
        getEventDetails,
        getAdminEventDetails,
        newBooking,
        verifyPrivateCode,
        adminCreateNewEvent,
        adminUpdateEvent,
        adminDeleteEvent,
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