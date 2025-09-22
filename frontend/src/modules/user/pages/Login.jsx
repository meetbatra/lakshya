import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { useAuth } from '../store/userStore';
import { authAPI } from '../api/authAPI';
import { loginSchema } from '../validation/loginValidation';
import GoogleLoginButton from '../../../shared/components/GoogleLoginButton';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLocalError(null); // Clear local error

    try {
      const response = await authAPI.login(data);
      console.log(response);
      login(response); // Now expects { user, token }
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading overlay during Google OAuth */}
      {isGoogleLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Signing in with Google...</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Or{' '}
              <Link to="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                create a new account
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {localError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <p className="text-red-600 text-sm">{localError}</p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={errors.email ? "border-red-500" : ""}
                    {...register("email")}
                    disabled={isGoogleLoading}
                    onChange={(e) => {
                      register("email").onChange(e);
                      if (localError) setLocalError(null); // Clear error when user types
                    }}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={errors.password ? "border-red-500" : ""}
                    {...register("password")}
                    disabled={isGoogleLoading}
                    onChange={(e) => {
                      register("password").onChange(e);
                      if (localError) setLocalError(null); // Clear error when user types
                    }}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full cursor-pointer" 
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6">
                <GoogleLoginButton onLoadingChange={setIsGoogleLoading} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
