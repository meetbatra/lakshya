import React from 'react';
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

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, setError, clearError, isLoading, error } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    clearError();

    try {
      const response = await authAPI.login(data);
      console.log(response);
      login(response); // Now expects { user, token }
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </CardTitle>
            <CardDescription>
              Or{' '}
              <Link to="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
                        {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="text-red-600 text-sm">{error}</p>
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
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
