import { authApi } from './auth';
import { recommendationApi } from './recommendation';
import { beachApi } from './beach';
import { eventApi } from './event';
import { ticketApi } from './ticket';

interface Api {
    auth: {
        checkSession: () => Promise<any>;
        signup: (userData:
            { username: string; email: string; password: string; confirmPassword: string; userTypesId: number }
        ) => Promise<any>;
        login: (credentials: { login: string; password: string }) => Promise<any>;
        logout: () => Promise<any>;
        viewProfile: () => Promise<any>;
        editProfile: (dataProfile: FormData) => Promise<any>;
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
        getWishlist: () => Promise<any>;
        getBeachDetails: (id: string) => Promise<any>;
        getBeachReviews: (id: string) => Promise<any>;
        getDetailsReview: (reviewId: string) => Promise<any>;
        addBeachReviews: (review: FormData) => Promise<any>;
        editDetailsReview: (review_id: string, review: FormData) => Promise<any>;
        addWishlist: (beachId: string) => Promise<any>;
        deleteWishlist: (beachId: string) => Promise<any>;
    },
    event: {
        getAllEvents: () => Promise<any>;
        getTransactionHistory: () => Promise<any>;
        getEventDetails: (eventId: string) => Promise<any>;
        getAdminEventDetails: (eventId: number) => Promise<any>;
        newBooking: (booking: FormData) => Promise<any>;
        verifyPrivateCode: (privateCode: string, ticketId: number) => Promise<any>;
        getAdminEvents: () => Promise<any>;
        adminCreateNewEvent: (newEvent: FormData) => Promise<any>;
        adminUpdateEvent: (updateEvent: FormData, eventId: number) => Promise<any>;
        adminDeleteEvent: (eventId: number) => Promise<any>;
    };
    ticket: {
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
}

const api: Api = {
    auth: authApi,
    recommendation: recommendationApi,
    beach: beachApi,
    event: eventApi,
    ticket: ticketApi,
}

export default api