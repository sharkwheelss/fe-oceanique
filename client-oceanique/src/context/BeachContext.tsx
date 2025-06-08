import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface BeachContextType {
    loading: boolean;
    error: string | null;
    getAllBeaches: () => Promise<any>;
    getBeachDetails: (id: string) => Promise<any>;
}

const BeachContext = createContext<BeachContextType | undefined>(undefined);

export const BeachProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllBeaches = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.getAllBeaches();
            return response.data;
        } catch (err) {
            setError('Failed to fetch beaches');
            console.error('Error fetching beaches:', err);
        } finally {
            setLoading(false);
        }
    };
    const getBeachDetails = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.getBeachDetails(id);
            return response.data;
        } catch (err) {
            setError('Failed to fetch beach detail');
            console.error('Error fetching beach detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        loading,
        error,
        getAllBeaches,
        getBeachDetails
    };

    return (
        <BeachContext.Provider value={value}>
            {children}
        </BeachContext.Provider>
    );
}

export const useBeaches = () => {
    const context = useContext(BeachContext);
    if (context === undefined) {
        throw new Error('useBeaches must be used within a BeachesProvider');
    }
    return context;
};