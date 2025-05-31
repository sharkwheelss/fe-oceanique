import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface Personality {
    id: number;
    name: string;
    description: string;
    img_path: string;
}

interface RecommendationContextType {
    personalities: Personality[];
    loading: boolean;
    error: string | null;
    getAllPersonalities: () => Promise<void>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider = ({ children }: { children: ReactNode }) => {
    const [personalities, setPersonalities] = useState<Personality[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllPersonalities = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.recommendation.getAllPersonalities();
            setPersonalities(response.data);
            console.log('Fetched personalities:', response.data);
        } catch (err) {
            setError('Failed to fetch personalities');
            console.error('Error fetching personalities:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        personalities,
        loading,
        error,
        getAllPersonalities,
    };

    return (
        <RecommendationContext.Provider value={value}>
            {children}
        </RecommendationContext.Provider>
    );
};

export const useRecommendation = () => {
    const context = useContext(RecommendationContext);
    if (context === undefined) {
        throw new Error('useRecommendation must be used within a RecommendationProvider');
    }
    return context;
};