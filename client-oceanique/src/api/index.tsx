import { authApi } from './auth';
import { recommendationApi } from './recommendation';
import { beachApi } from './beach';
import { eventApi } from './event';

interface Api {
    auth: {
        checkSession: () => Promise<any>;
        signup: (userData: { username: string; email: string; password: string; confirmPassword: string }) => Promise<any>;
        login: (credentials: { login: string; password: string }) => Promise<any>;
        logout: () => Promise<any>;
    };
    recommendation: {
        getAllPersonalities: () => Promise<any>;
        updateUserPersonality: (personalityId: number) => Promise<any>;
        getUserPersonality: () => Promise<any>;
        getPreferenceCategories: () => Promise<any>;
        updateUserPreferences: (preferences: any) => Promise<any>;
        getAllQuestions: () => Promise<any>;
        beachRecommendation: (userOptions: any) => Promise<any>;
    };
    beach: {
        getAllBeaches: () => Promise<any>;
        getListOptions: () => Promise<any>;
        getBeachDetails: (id: string) => Promise<any>;
        getBeachReviews: (id: string) => Promise<any>;
        getDetailsReview: (reviewId: string) => Promise<any>;
        addBeachReviews: (review: FormData) => Promise<any>;
        editDetailsReview: (review_id: string, review: FormData) => Promise<any>;
    },
    event: {
        getAllEvents: () => Promise<any>;
        getTransactionHistory: () => Promise<any>;
        getEventDetails: (eventId: string) => Promise<any>;
        newBooking: (booking: FormData) => Promise<any>;
    };
}

const api: Api = {
    auth: authApi,
    recommendation: recommendationApi,
    beach: beachApi,
    event: eventApi,
}

export default api