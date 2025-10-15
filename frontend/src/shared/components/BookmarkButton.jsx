import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { Button } from '../../components/ui/button';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useAuth } from '../../modules/user/store/userStore';

const BookmarkButton = ({ 
  type, 
  itemId, 
  className = '', 
  size = 'sm',
  showTooltip = true 
}) => {

  
  const { user, token, isAuthenticated } = useAuth();
  const {
    isBookmarked,
    toggleBookmark,
    loading,
    fetchBookmarks
  } = useBookmarkStore();

  const [localLoading, setLocalLoading] = useState(false);
  
  // Don't render if no itemId is provided
  if (!itemId) {
    console.warn('BookmarkButton: No itemId provided');
    return null;
  }
  
  const bookmarked = isBookmarked(type, itemId);

  // Fetch bookmarks when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBookmarks(token);
    }
  }, [isAuthenticated, token, fetchBookmarks]);

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Show a user-friendly message for unauthenticated users
      alert('Please log in to bookmark courses and save them for later!');
      return;
    }

    if (!token) {
      alert('Authentication required. Please log in again.');
      return;
    }

    setLocalLoading(true);
    
    try {
      const result = await toggleBookmark(type, itemId, token);
      if (!result.success) {
        console.error('Failed to toggle bookmark:', result.message);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  // Show bookmark button even for unauthenticated users, but handle login prompt
  // if (!isAuthenticated) {
  //   return null;
  // }

  const isLoading = loading || localLoading;

  return (
    <Button
      onClick={handleToggleBookmark}
      variant="outline"
      size={size}
      disabled={isLoading || !isAuthenticated}
      className={`p-2 h-auto aspect-square min-w-0 ${
        bookmarked && isAuthenticated
          ? 'text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100' 
          : 'text-gray-500 border-gray-300 hover:text-yellow-600 hover:border-yellow-300'
      } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={showTooltip ? (
        !isAuthenticated ? 'Login to bookmark' : 
        (bookmarked ? 'Remove bookmark' : 'Add bookmark')
      ) : undefined}
    >
      {isLoading ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <FontAwesomeIcon 
          icon={bookmarked ? faBookmarkSolid : faBookmarkRegular}
          className="h-4 w-4"
        />
      )}
    </Button>
  );
};

export default BookmarkButton;