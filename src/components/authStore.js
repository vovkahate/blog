import { create } from 'zustand';

const useAuthStore = create((set) => ({
    token: null,
    loggedIn: false,
    setToken: (token) => set({ token }),
    setLoggedIn: (loggedIn) => set({ loggedIn }),
}));

export default useAuthStore;
