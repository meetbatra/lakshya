import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useAuth } from '../store/userStore';
import { authAPI } from '../api/authAPI';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, getUserInitials, getUserAvatar } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/auth/login');
    return null;
  }

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

  const handleRetakeQuiz = () => {
    navigate('/quiz');
  };

  const avatarUrl = getUserAvatar();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                <img 
                  src={avatarUrl} 
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-3xl">{user.name}</CardTitle>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <Badge className="mt-2">
                  Class {user.class}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border-t pt-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.state}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Stream</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.stream || 'Not specified'}</dd>
                </div>
                {user.field && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Field of Interest</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.field}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex space-x-4">
                <Button className="cursor-pointer">
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={handleRetakeQuiz}
                >
                  Take Quiz
                </Button>
                <Button 
                  variant="destructive" 
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
