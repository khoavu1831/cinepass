import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            login: (userData, token, refreshToken) => {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                set({ user: userData, accessToken: token, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({ user: null, accessToken: null, isAuthenticated: false });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
        }
    )
);

export default useAuthStore;
