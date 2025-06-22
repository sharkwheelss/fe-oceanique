import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api';

interface BeachContextType {
    loading: boolean;
    error: string | null;
    getAllBeaches: () => Promise<any>;
    getListOptions: () => Promise<any>;
    getWishlist: () => Promise<any>;
    getBeachDetails: (id: string) => Promise<any>;
    getBeachReviews: (id: string) => Promise<any>;
    getDetailsReview: (reviewId: string) => Promise<any>;
    addBeachReviews: (review: any) => Promise<any>;
    editDetailsReview: (review_id: string, review: any) => Promise<any>;
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
    const getWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.getWishlist();
            return response.data;
        } catch (err) {
            setError('Failed to fetch wishlist');
            console.error('Error fetching wishlist:', err);
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
    const getBeachReviews = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.getBeachReviews(id);
            return response.data;
        } catch (err) {
            setError('Failed to fetch beach reviews');
            console.error('Error fetching beach reviews:', err);
        } finally {
            setLoading(false);
        }
    };
    const getListOptions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.getListOptions();
            return response.data;
        } catch (err) {
            setError('Failed to fetch beach options');
            console.error('Error fetching beach options:', err);
        } finally {
            setLoading(false);
        }
    };
    const getDetailsReview = async (reviewId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.getDetailsReview(reviewId);
            return response.data;
        } catch (err) {
            setError('Failed to fetch beach reviews');
            console.error('Error fetching beach reviews:', err);
        } finally {
            setLoading(false);
        }
    };
    const addBeachReviews = async (review: FormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.addBeachReviews(review);
            return response.data;
        } catch (err) {
            setError('Failed to fetch add reviews');
            console.error('Error fetching add reviews:', err);
        } finally {
            setLoading(false);
        }
    };
    const editDetailsReview = async (review_id: string, review: FormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.beach.editDetailsReview(review_id, review);
            return response.data;
        } catch (err) {
            setError('Failed to edit reviews');
            console.error('Error edit reviews:', err);
        } finally {
            setLoading(false);
        }
    }

    const value = {
        loading,
        error,
        getAllBeaches,
        getWishlist,
        getBeachDetails,
        getBeachReviews,
        getListOptions,
        getDetailsReview,
        addBeachReviews,
        editDetailsReview
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