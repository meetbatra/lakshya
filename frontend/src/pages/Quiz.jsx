import React, { useState } from 'react';
import Navbar from '../shared/components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Brain, 
  Target, 
  Clock, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Lightbulb
} from 'lucide-react';

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState('intro');

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your responses to provide accurate career matches'
    },
    {
      icon: Target,
      title: 'Personalized Results',
      description: 'Get customized recommendations based on your unique interests and strengths'
    },
    {
      icon: Clock,
      title: 'Quick Assessment',
      description: 'Complete the quiz in just 10-15 minutes at your own pace'
    },
    {
      icon: Award,
      title: 'Expert Guidance',
      description: 'Results reviewed by career counselors and education experts'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      course: 'B.Tech CSE',
      text: 'The quiz helped me realize my passion for technology. Now I\'m pursuing computer science!',
      rating: 5
    },
    {
      name: 'Rahul Gupta',
      course: 'MBBS',
      text: 'Thanks to Lakshya, I discovered my calling in medicine. The results were spot-on!',
      rating: 5
    },
    {
      name: 'Ananya Singh',
      course: 'B.Com',
      text: 'I was confused between multiple streams. This quiz gave me clarity and confidence.',
      rating: 5
    }
  ];

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
    // Navigate to actual quiz implementation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {currentStep === 'intro' && (
        <>
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                🎯 Career Discovery Tool
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Discover Your Perfect
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Career Path
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Take our comprehensive career assessment to uncover your ideal stream and course. 
                Get personalized recommendations based on your interests, skills, and aspirations.
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  50K+ Students Assessed
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  95% Accuracy Rate
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-600" />
                  10-15 Minutes
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={handleStartQuiz}
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
              >
                Start Career Assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Features Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose Our Assessment?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                How It Works
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Answer Questions</h3>
                    <p className="text-gray-600">Complete our carefully designed questionnaire about your interests and preferences</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                    <p className="text-gray-600">Our advanced AI analyzes your responses to identify patterns and preferences</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Get Results</h3>
                    <p className="text-gray-600">Receive personalized course recommendations with detailed career insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                What Students Say
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <CardDescription className="text-gray-700 italic">
                        "{testimonial.text}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.course}</p>
                        </div>
                        <Badge variant="outline">Verified</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
              <Lightbulb className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Discover Your Future?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have found their perfect career path through our assessment.
              </p>
              <Button 
                size="lg" 
                onClick={handleStartQuiz}
                variant="secondary"
                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 group"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </>
      )}

      {currentStep === 'quiz' && (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="mb-4">
                <Progress value={25} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">Question 1 of 20</p>
              </div>
              <CardTitle className="text-2xl">Career Assessment</CardTitle>
              <CardDescription className="text-lg">
                Choose the option that best describes your preference
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-6">
                  What type of activities do you enjoy the most?
                </h3>
                <div className="space-y-3">
                  {[
                    'Solving complex mathematical problems',
                    'Working with technology and computers',
                    'Helping others and providing care',
                    'Creating and designing things',
                    'Analyzing data and patterns'
                  ].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start py-4 px-6 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => setCurrentStep('results')}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 'results' && (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-3xl">Assessment Complete!</CardTitle>
              <CardDescription className="text-lg">
                Here are your personalized career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Top Career Matches
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { course: 'Computer Science Engineering', match: '95%', color: 'bg-green-500' },
                    { course: 'Information Technology', match: '87%', color: 'bg-blue-500' },
                    { course: 'Data Science', match: '82%', color: 'bg-purple-500' }
                  ].map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 ${result.color} rounded-full`}></div>
                        <span className="font-semibold">{result.course}</span>
                      </div>
                      <Badge variant="secondary">{result.match} Match</Badge>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button size="lg" className="mr-4">
                    View Detailed Report
                  </Button>
                  <Button variant="outline" size="lg">
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Quiz;
