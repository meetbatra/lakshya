import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../api/authAPI';

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: ({ user, token }) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null
        });
      },

      logout: () => {
        // Clear user authentication state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
        
        // Clear course filters from courses store
        import('../../courses/store/coursesStore').then(({ useCoursesStore }) => {
          const coursesStore = useCoursesStore.getState();
          coursesStore.clearAllFilters();
        }).catch(error => {
          console.warn('Failed to clear course filters on logout:', error);
        });

        // Clear college filters from colleges store
        import('../../colleges/store/collegesStore').then(({ useCollegesStore }) => {
          const collegesStore = useCollegesStore.getState();
          collegesStore.clearAllFilters();
        }).catch(error => {
          console.warn('Failed to clear college filters on logout:', error);
        });
      },

      // Initialize user from token if available
      initialize: async () => {
        const token = get().token;
        if (token) {
          try {
            const { user } = await authAPI.verifyToken();
            set({ user, isAuthenticated: true });
          } catch (error) {
            console.error('Token verification failed:', error);
            get().logout();
          }
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Helper functions
      getUserInitials: () => {
        const { user } = get();
        if (!user?.name) return 'U';
        return user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      },

      getUserDisplayName: () => {
        const { user } = get();
        return user?.name || 'User';
      },

      getUserAvatar: () => {
        const { user } = get();
        if (!user) return null;
        
        // Check if user has a custom avatar
        if (user.profile?.avatar) {
          return user.profile.avatar;
        }
        
        // Generate avatar using ui-avatars.com API
        const name = user.name || 'User';
        const encodedName = encodeURIComponent(name);
        return `https://ui-avatars.com/api/?name=${encodedName}&size=128&background=2563eb&color=ffffff&bold=true`;
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;
