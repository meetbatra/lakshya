import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../../modules/user/store/userStore';
import { toast } from 'sonner';

const GoogleLoginButton = ({ onLoadingChange }) => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Notify parent component of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);
      
      if (result.success) {
        toast.success(result.message);
        // Add a slight delay to show success before navigation
        setTimeout(() => navigate('/'), 500);
      } else {
        toast.error(result.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
    // Don't set loading to false on success - let navigation handle it
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={true}
        >
          <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin text-blue-600" />
          <span>Verifying with Google...</span>
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          logo_alignment="left"
          auto_select={false}
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;