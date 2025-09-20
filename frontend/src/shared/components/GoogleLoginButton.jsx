import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '../../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../modules/user/store/userStore';
import { authAPI } from '../../modules/user/api/authAPI';
import { toast } from 'sonner';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Use the ID token from Google
      const response = await authAPI.googleLogin(credentialResponse.credential);
      
      // Ensure we have the correct structure for login
      const loginData = {
        user: response.user,
        token: response.token
      };
      
      // Login the user with response data
      login(loginData);
      
      // Check if profile completion is required
      if (response.requiresProfileCompletion) {
        navigate('/auth/complete-profile');
        toast.info('Please complete your profile to get personalized recommendations');
      } else {
        navigate('/');
        toast.success('Successfully logged in with Google!');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="w-full">
      {loading ? (
        <Button disabled className="w-full bg-gray-100 text-gray-400 cursor-not-allowed">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin h-4 w-4 mr-2" />
          Signing in with Google...
        </Button>
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