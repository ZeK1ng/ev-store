const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const IS_LOGGED_IN_KEY = 'isLogedIn';

const AuthController = {
    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    isLoggedIn(): boolean {
        return localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
    },

    login(tokens: { accessToken: string; refreshToken: string }) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
    },

    logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(IS_LOGGED_IN_KEY);
    }
};

export default AuthController;
