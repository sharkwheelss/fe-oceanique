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
    getUserPersonality: () => Promise<Personality | null>;
    getPreferenceCategories: () => Promise<any>;
    updateUserPersonality: (personalityId: number) => Promise<void>;
    updateUserPreferences: (preferences: any) => Promise<void>;
    getAllQuestions: () => Promise<any>;
    beachRecommendation: (userOptions: any) => Promise<any>;
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
    };
    const getAllQuestions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.recommendation.getAllQuestions();
            return response.data;
        } catch (err) {
            setError('Failed to fetch preference categories');
            console.error('Error fetching preference categories:', err);
            return [];
        } finally {
            setLoading(false);
        }
    }


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
    const updateUserPreferences = async (preferences: any) => {
        try {
            setLoading(true);
            setError(null);
            await api.recommendation.updateUserPreferences(preferences);
        } catch (err) {
            setError('Failed to update preferences');
            console.error('Error updating preferences:', err);
        } finally {
            setLoading(false);
        }
    };
    const beachRecommendation = async (userOptions: any) => {
        try {
            setLoading(true);
            setError(null);
            return await api.recommendation.beachRecommendation(userOptions);
        } catch (err) {
            setError('Failed to get recommendation');
            console.error('Error to get recommendation:', err);
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
        getPreferenceCategories,
        updateUserPreferences,
        getAllQuestions,
        beachRecommendation,
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