import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { useAuth } from '../store/userStore';
import { authAPI } from '../api/authAPI';
import { signupSchema } from '../validation/signupValidation';
import GoogleLoginButton from '../../../shared/components/GoogleLoginButton';

const SignUp = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuth();
  
  // Local state for error handling (not persisted in Zustand)
  const [localError, setLocalError] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      class: '',
      state: '',
      stream: '',
      field: ''
    }
  });

  // Watch the class field to conditionally show additional fields
  const selectedClass = watch('class');
  const selectedStream = watch('stream');

  const handleSelectChange = (name, value) => {
    setValue(name, value);
    
    // Reset dependent fields when class changes
    if (name === 'class') {
      setValue('stream', '');
      setValue('field', '');
    }
    
    // Reset field when stream changes
    if (name === 'stream') {
      setValue('field', '');
    }
    
    // Clear local error when user makes changes
    if (localError) setLocalError(null);
  };

  const getStreamOptions = () => {
    if (selectedClass === '10' || selectedClass === '12') {
      return [
        { value: 'science_pcm', label: 'Science (PCM)' },
        { value: 'science_pcb', label: 'Science (PCB)' },
        { value: 'commerce', label: 'Commerce' },
        { value: 'arts', label: 'Arts' }
      ];
    }
    return [];
  };

  const getFieldOptions = () => {
    if (selectedClass !== '12') return [];
    
    const streamFieldMap = {
      'science_pcm': [
        { value: 'engineering_technology', label: 'Engineering' },
        { value: 'architecture_design', label: 'Architecture' },
        { value: 'pure_sciences_research', label: 'Pure Sciences' },
        { value: 'computer_it', label: 'Computer Science' },
        { value: 'defence_military', label: 'Defence & Military' }
      ],
      'science_pcb': [
        { value: 'medicine', label: 'Medicine (MBBS)' },
        { value: 'allied_health', label: 'Allied Health Sciences' },
        { value: 'biotechnology', label: 'Biotechnology' },
        { value: 'veterinary_science', label: 'Veterinary Science' },
        { value: 'agriculture_environment', label: 'Agriculture & Environment' }
      ],
      'commerce': [
        { value: 'business_management', label: 'Business & Management' },
        { value: 'finance_accounting', label: 'Finance & Accounting' },
        { value: 'economics_analytics', label: 'Economics & Analytics' },
        { value: 'law_commerce', label: 'Law (Commerce)' },
        { value: 'entrepreneurship', label: 'Entrepreneurship' }
      ],
      'arts': [
        { value: 'social_sciences', label: 'Social Sciences' },
        { value: 'psychology', label: 'Psychology' },
        { value: 'journalism_media', label: 'Journalism & Media' },
        { value: 'fine_arts_design', label: 'Fine Arts & Design' },
        { value: 'law_arts', label: 'Law (Arts)' },
        { value: 'civil_services', label: 'Civil Services' }
      ]
    };

    return streamFieldMap[selectedStream] || [];
  };

  // Indian states and union territories list
  const states = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
    'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 
    'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const getStreamLabel = () => {
    if (selectedClass === '10') {
      return 'Stream to be Chosen';
    } else if (selectedClass === '12') {
      return 'Stream Studying';
    }
    return 'Stream';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setLocalError(null); // Clear local error

    try {
      // Remove confirmPassword from data before sending to backend
      const { confirmPassword, ...submitData } = data;
      
      // Clean up empty field values - don't send empty strings
      if (submitData.field === '') {
        delete submitData.field;
      }
      
      console.log('Submitting data:', submitData);
      const response = await authAPI.register(submitData);
      login(response); // Now expects { user, token }
      navigate('/'); // Redirect to home page after successful registration
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading overlay during Google OAuth */}
      {isGoogleLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Signing up with Google...</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription>
              Or{' '}
              <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                sign in to existing account
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {localError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{localError}</p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                      {...register("name")}
                      disabled={isGoogleLoading}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500" : ""}
                      {...register("email")}
                      disabled={isGoogleLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className={errors.password ? "border-red-500" : ""}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? "border-red-500" : ""}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Password must be at least 6 characters with uppercase, lowercase, and number
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select
                      value={selectedClass}
                      onValueChange={(value) => handleSelectChange('class', value)}
                    >
                      <SelectTrigger className={`w-full h-12 ${errors.class ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.class && (
                      <p className="text-sm text-red-600">{errors.class.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={watch('state')}
                      onValueChange={(value) => handleSelectChange('state', value)}
                    >
                      <SelectTrigger className={`w-full h-12 ${errors.state ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                {/* Stream Selection - Show for Class 10 and 12 */}
                {(selectedClass === '10' || selectedClass === '12') && (
                  <div className="space-y-2">
                    <Label htmlFor="stream">{getStreamLabel()}</Label>
                    <Select
                      value={selectedStream}
                      onValueChange={(value) => handleSelectChange('stream', value)}
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder={`Select your ${getStreamLabel().toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getStreamOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Field Selection - Show only for Class 12 with selected stream */}
                {selectedClass === '12' && selectedStream && getFieldOptions().length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="field">Field of Interest</Label>
                    <Select
                      value={watch('field')}
                      onValueChange={(value) => handleSelectChange('field', value)}
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Select your field of interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFieldOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>

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
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
