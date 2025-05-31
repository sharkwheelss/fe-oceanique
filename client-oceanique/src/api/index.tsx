import { authApi } from './auth';
import { recommendationApi } from './recommendation';

interface Api {
    auth: {
        checkSession: () => Promise<any>;
        signup: (userData: { username: string; email: string; password: string; confirmPassword: string }) => Promise<any>;
        login: (credentials: { login: string; password: string }) => Promise<any>;
        logout: () => Promise<any>;
    };
    recommendation: {
        getAllPersonalities: () => Promise<any>;
    };

}

const api: Api = {
    auth: authApi,
    recommendation: recommendationApi,
}

export default api