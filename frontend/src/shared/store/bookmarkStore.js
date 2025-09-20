import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const useBookmarkStore = create((set, get) => ({
  // State
  bookmarks: {
    courses: [],
    colleges: [],
    exams: []
  },
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Add bookmark
  addBookmark: async (type, itemId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookmarks/add`,
        { type, itemId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        set({ 
          bookmarks: response.data.bookmarks,
          loading: false 
        });
        return { success: true };
      } else {
        set({ 
          error: response.data.message || 'Failed to add bookmark',
          loading: false 
        });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add bookmark';
      set({ 
        error: errorMessage,
        loading: false 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Remove bookmark
  removeBookmark: async (type, itemId, token) => {
    // Optimistic update - remove from UI immediately
    const currentState = get();
    const optimisticBookmarks = { ...currentState.bookmarks };
    optimisticBookmarks[type] = optimisticBookmarks[type].filter(item => item._id !== itemId);
    
    set({ 
      bookmarks: optimisticBookmarks,
      loading: true, 
      error: null 
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookmarks/remove`,
        { type, itemId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        set({ 
          bookmarks: response.data.bookmarks,
          loading: false 
        });
        return { success: true };
      } else {
        // Revert optimistic update on failure
        set({ 
          bookmarks: currentState.bookmarks,
          error: response.data.message || 'Failed to remove bookmark',
          loading: false 
        });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      // Revert optimistic update on error
      const errorMessage = error.response?.data?.message || 'Failed to remove bookmark';
      set({ 
        bookmarks: currentState.bookmarks,
        error: errorMessage,
        loading: false 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Get all bookmarks
  fetchBookmarks: async (token) => {
    
    if (!token) {
      set({ 
        error: 'No authentication token provided',
        loading: false 
      });
      return { success: false, message: 'No authentication token' };
    }

    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookmarks`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        set({ 
          bookmarks: response.data.bookmarks,
          loading: false 
        });
        return { success: true };
      } else {
        set({ 
          error: response.data.message || 'Failed to fetch bookmarks',
          loading: false 
        });
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch bookmarks';
      set({ 
        error: errorMessage,
        loading: false 
      });
      return { success: false };
    }
  },

  // Check if item is bookmarked
  isBookmarked: (type, itemId) => {
    const { bookmarks } = get();
    return bookmarks[type]?.some(bookmark => 
      bookmark._id === itemId || bookmark === itemId
    ) || false;
  },

  // Toggle bookmark (add/remove)
  toggleBookmark: async (type, itemId, token) => {
    const { isBookmarked, addBookmark, removeBookmark } = get();
    
    if (isBookmarked(type, itemId)) {
      return await removeBookmark(type, itemId, token);
    } else {
      return await addBookmark(type, itemId, token);
    }
  },

  // Get bookmark counts
  getBookmarkCounts: () => {
    const { bookmarks } = get();
    return {
      courses: bookmarks.courses?.length || 0,
      colleges: bookmarks.colleges?.length || 0,
      exams: bookmarks.exams?.length || 0,
      total: (bookmarks.courses?.length || 0) + 
             (bookmarks.colleges?.length || 0) + 
             (bookmarks.exams?.length || 0)
    };
  },

  // Clear all bookmarks (for logout)
  clearBookmarks: () => set({
    bookmarks: {
      courses: [],
      colleges: [],
      exams: []
    },
    loading: false,
    error: null
  })
}));

export { useBookmarkStore };
export default useBookmarkStore;