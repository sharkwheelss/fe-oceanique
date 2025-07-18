const BASE_URL = 'http://localhost:5000/api';

export const beachApi = {
    // all GET methods
    getAllBeaches: async () => {
        const response = await fetch(`${BASE_URL}/beaches/all`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    getBeachDetails: async (id: string) => {
        const response = await fetch(`${BASE_URL}/beaches/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        return response.json();
    },
    getBeachReviews: async (id: string) => {
        const response = await fetch(`${BASE_URL}/beaches/reviews/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        return response.json();
    },
    getListOptions: async () => {
        const response = await fetch(`${BASE_URL}/beaches/options`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        return response.json();
    },
    getDetailsReview: async (reviewId: string) => {
        const response = await fetch(`${BASE_URL}/beaches/reviews/${reviewId}/edit`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        return response.json();
    },
    getWishlist: async () => {
        const response = await fetch(`${BASE_URL}/beaches/wishlist`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
    addBeachReviews: async (review: FormData) => {
        const response = await fetch(`${BASE_URL}/beaches/reviews`, {
            method: 'POST',
            credentials: 'include',
            body: review // Send FormData directly
        });
        return response.json();
    },
    editDetailsReview: async (review_id: string, review: FormData) => {
        const response = await fetch(`${BASE_URL}/beaches/reviews/${review_id}`, {
            method: 'PUT',
            credentials: 'include',
            body: review // Send FormData directly
        });
        return response.json();
    },
    addWishlist: async (beaches_id: string) => {
        const response = await fetch(`${BASE_URL}/beaches/wishlist`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ beaches_id })
        });
        return response.json();
    },
    deleteWishlist: async (beachId: string) => {
        const response = await fetch(`${BASE_URL}/beaches/wishlist/${beachId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return response.json();
    },
}