import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faGraduationCap, faBook, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../store/userStore';
import { authAPI } from '../api/authAPI';
import { toast } from 'sonner';
import * as z from 'zod';

// Profile completion validation schema
const profileSchema = z.object({
  state: z.string().min(1, 'State is required'),
  class: z.enum(['10', '12'], { required_error: 'Class is required' }),
  stream: z.string().optional(),
  field: z.string().optional()
}).refine((data) => {
  // Stream is required for Class 10 and 12
  if ((data.class === '10' || data.class === '12') && !data.stream) {
    return false;
  }
  return true;
}, {
  message: 'Stream is required for Class 10 and 12',
  path: ['stream']
}).refine((data) => {
  // Field is required for Class 12
  if (data.class === '12' && data.stream && !data.field) {
    return false;
  }
  return true;
}, {
  message: 'Field is required for Class 12',
  path: ['field']
});

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      state: '',
      class: '',
      stream: '',
      field: ''
    }
  });

  // Watch form fields for dynamic updates
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

  const getStreamLabel = () => {
    if (selectedClass === '10') {
      return 'Stream to be Chosen';
    } else if (selectedClass === '12') {
      return 'Stream Studying';
    }
    return 'Stream';
  };

  // Indian states list
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Clean up empty field values - don't send empty strings
      const submitData = { ...data };
      if (submitData.field === '') {
        delete submitData.field;
      }
      
      const response = await authAPI.updateProfile(submitData);
      
      // Update user in auth store
      login({ user: response.user, token: response.token });
      
      toast.success('Profile completed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <FontAwesomeIcon icon={faUser} className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome {user?.name}! Please provide a few details to personalize your experience.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* State Selection */}
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

                {/* Class Selection */}
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
              </div>

              {/* Stream Selection - Show for Class 10 and 12 */}
              {(selectedClass === '10' || selectedClass === '12') && (
                <div className="space-y-2">
                  <Label htmlFor="stream">{getStreamLabel()}</Label>
                  <Select
                    value={selectedStream}
                    onValueChange={(value) => handleSelectChange('stream', value)}
                  >
                    <SelectTrigger className={`w-full h-12 ${errors.stream ? "border-red-500" : ""}`}>
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
                  {errors.stream && (
                    <p className="text-sm text-red-600">{errors.stream.message}</p>
                  )}
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
                    <SelectTrigger className={`w-full h-12 ${errors.field ? "border-red-500" : ""}`}>
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
                  {errors.field && (
                    <p className="text-sm text-red-600">{errors.field.message}</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-4 w-4 mr-2" />
                    Completing Profile...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-sm text-gray-600 text-center">
            This information helps us provide personalized course and college recommendations.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default CompleteProfile;