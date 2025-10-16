import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faTachometerAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../store/userStore';
import { authAPI } from '../api/authAPI';

const UserAvatar = () => {
  const navigate = useNavigate();
  const { user, logout, getUserInitials, getUserDisplayName, getUserAvatar } = useAuth();
  const [imageError, setImageError] = useState(false);

  const avatarUrl = getUserAvatar();

  // Reset image error when avatar URL changes
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/');
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleDailyQuiz = () => {
    navigate('/practice-quiz');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full overflow-hidden p-0 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
        >
          {!imageError && avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={getUserDisplayName()}
              className="h-full w-full object-cover rounded-full transition-all duration-200"
              onError={handleImageError}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-medium">
              {getUserInitials()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDashboard}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDailyQuiz}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-2 h-4 w-4" />
          <span>Practice Quiz</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleProfile}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
