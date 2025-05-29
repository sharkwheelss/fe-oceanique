import { authApi } from './auth';

interface Api {
    auth: {
        checkSession: () => Promise<any>;
        login: (credentials: { login: string; password: string }) => Promise<any>;
        logout: () => Promise<any>;
    };
}

const api: Api = {
    auth: authApi
}

export default api