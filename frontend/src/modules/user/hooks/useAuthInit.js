import { useEffect } from 'react';
import { useAuth } from '../store/userStore';

const useAuthInit = () => {
  const { token, initialize } = useAuth();

  useEffect(() => {
    // If we have a token (restored from localStorage), verify it
    if (token) {
      initialize();
    }
  }, []); // Empty dependency array - only run once on mount
};

export default useAuthInit;
