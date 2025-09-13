import React, { useState } from 'react';
import Navbar from '../../../shared/components/Navbar';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Separator } from '../../../components/ui/separator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faBrain, faBook, faUsers, faStar, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState('intro'); // intro, quiz, results

  const features = [
    {
      icon: faBrain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your responses to provide accurate career recommendations'
    },
    {
      icon: faBullseye,
      title: 'Personalized Results',
      description: 'Get tailored career paths based on your interests, skills, and aspirations'
    },
    {
      icon: faBook,
      title: 'Detailed Insights',
      description: 'Comprehensive reports with course suggestions and college recommendations'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Engineering Student',
      content: 'The quiz helped me choose between Computer Science and Electronics. Best decision ever!',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      role: 'Medical Student',
      content: 'I was confused between different medical fields. This assessment cleared all my doubts.',
      rating: 5
    }
  ];

  const IntroSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faBullseye} className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career Path</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Take our comprehensive AI-powered assessment to uncover your ideal stream, 
            explore career opportunities, and find the perfect college match.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
              <span>15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
              <span>Scientifically designed</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
              <span>Instant results</span>
            </div>
          </div>

          <Button 
            size="lg"
            onClick={() => setCurrentStep('quiz')}
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group"
          >
            Start Assessment
            <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <FontAwesomeIcon icon={feature.icon} className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-gray-600">Join thousands who found their perfect career path</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const QuizSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Career Assessment</h1>
            <span className="text-sm text-gray-600">Question 1 of 20</span>
          </div>
          <Progress value={5} className="h-2" />
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Assessment Coming Soon
              </h2>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FontAwesomeIcon icon={faBrain} className="h-12 w-12 text-white" />
              </div>
              <p className="text-xl text-gray-600 mb-8">
                We're developing an advanced AI-powered assessment that will provide you with personalized career recommendations.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                  <span>Personality analysis</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                  <span>Skill assessment</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                  <span>Interest mapping</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                  <span>Career matching</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep('intro')}
                  className="px-6 py-3"
                >
                  Back to Overview
                </Button>
                <Button 
                  onClick={() => setCurrentStep('results')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Preview Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ResultsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FontAwesomeIcon icon={faBullseye} className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Career Assessment Results</h1>
          <p className="text-xl text-gray-600">Based on your responses, here are your personalized recommendations</p>
        </div>

        <Card className="border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Results Preview</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Recommended Stream</h3>
                <p className="text-blue-600 font-bold text-lg">Science (PCM) - Physics, Chemistry, Mathematics</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Top Career Matches</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Computer Science Engineering</li>
                    <li>• Mechanical Engineering</li>
                    <li>• Data Science</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Colleges</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• IIT Delhi</li>
                    <li>• NIT Trichy</li>
                    <li>• BITS Pilani</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep('intro')}
                className="px-6 py-3"
              >
                Retake Assessment
              </Button>
              <Button 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Explore Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render based on current step
  if (currentStep === 'quiz') {
    return <QuizSection />;
  } else if (currentStep === 'results') {
    return <ResultsSection />;
  } else {
    return <IntroSection />;
  }
};

export default Quiz;
