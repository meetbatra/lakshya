import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../shared/components/Navbar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    class: '',
    state: '',
    stream: '',
    field: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Reset stream and field when class changes
      if (name === 'class') {
        newData.stream = '';
        newData.field = '';
      }
      
      // Reset field when stream changes
      if (name === 'stream') {
        newData.field = '';
      }
      
      return newData;
    });
  };

  const getStreamOptions = () => {
    if (formData.class === '10') {
      return [
        { value: 'science_pcm', label: 'Science (PCM)' },
        { value: 'science_pcb', label: 'Science (PCB)' },
        { value: 'commerce', label: 'Commerce' },
        { value: 'arts', label: 'Arts' }
      ];
    } else if (formData.class === '12') {
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
    if (formData.class !== '12') return [];
    
    switch (formData.stream) {
      case 'science_pcm':
        return [
          { value: 'engineering', label: 'Engineering' },
          { value: 'pure_science', label: 'Pure Science' },
          { value: 'computer_science', label: 'Computer Science' },
          { value: 'mathematics', label: 'Mathematics' }
        ];
      case 'science_pcb':
        return [
          { value: 'medical', label: 'Medical' },
          { value: 'biotechnology', label: 'Biotechnology' },
          { value: 'life_sciences', label: 'Life Sciences' },
          { value: 'pharmacy', label: 'Pharmacy' }
        ];
      case 'commerce':
        return [
          { value: 'business', label: 'Business' },
          { value: 'finance', label: 'Finance' },
          { value: 'accounting', label: 'Accounting' },
          { value: 'economics', label: 'Economics' }
        ];
      case 'arts':
        return [
          { value: 'humanities', label: 'Humanities' },
          { value: 'social_sciences', label: 'Social Sciences' },
          { value: 'literature', label: 'Literature' },
          { value: 'psychology', label: 'Psychology' }
        ];
      default:
        return [];
    }
  };

  const getStreamLabel = () => {
    if (formData.class === '10') {
      return 'Stream to be Chosen';
    } else if (formData.class === '12') {
      return 'Stream Studying';
    }
    return 'Stream';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription>
              Or{' '}
              <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                sign in to existing account
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select onValueChange={(value) => handleSelectChange('class', value)}>
                      <SelectTrigger className="w-full h-12 text-base">
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      required
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Stream Selection - shows when class is selected */}
                {formData.class && (
                  <div className={`grid gap-4 ${formData.class === '12' && formData.stream ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="space-y-2">
                      <Label htmlFor="stream">{getStreamLabel()}</Label>
                      <Select onValueChange={(value) => handleSelectChange('stream', value)} value={formData.stream}>
                        <SelectTrigger className="w-full h-12 text-base">
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

                    {/* Field Selection - only shows for class 12 when stream is selected */}
                    {formData.class === '12' && formData.stream && (
                      <div className="space-y-2">
                        <Label htmlFor="field">Field of Interest</Label>
                        <Select onValueChange={(value) => handleSelectChange('field', value)} value={formData.field}>
                          <SelectTrigger className="w-full h-12 text-base">
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
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
