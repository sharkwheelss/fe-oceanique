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
    updateUserPersonality: (personalityId: number) => Promise<void>;
    getUserPersonality: () => Promise<Personality | null>;
    getPreferenceCategories: () => Promise<string[]>;
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
    const getUserPersonality = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.recommendation.getUserPersonality();
            return response.data;
        } catch (err) {
            setError('Failed to fetch user personality');
            console.error('Error fetching user personality:', err);
            return null;
        }
    };
    const updateUserPersonality = async (personalityId: number) => {
        try {
            setLoading(true);
            setError(null);
            await api.recommendation.updateUserPersonality(personalityId);
            await getAllPersonalities();
        } catch (err) {
            setError('Failed to update personality');
            console.error('Error updating personality:', err);
        } finally {
            setLoading(false);
        }
    };
    const getPreferenceCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.recommendation.getPreferenceCategories();
            return response.data;
        } catch (err) {
            setError('Failed to fetch preference categories');
            console.error('Error fetching preference categories:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }


    const value = {
        personalities,
        loading,
        error,
        getAllPersonalities,
        getUserPersonality,
        updateUserPersonality,
        getPreferenceCategories
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