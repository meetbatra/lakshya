import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faSpinner,
  faCalendarAlt,
  faCheckCircle,
  faBook,
  faExternalLinkAlt,
  faClipboardList,
  faGraduationCap,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import useExamsStore from '../store/examsStore';
import BookmarkButton from '../../../shared/components/BookmarkButton';

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const {
    selectedExam,
    error,
    fetchExamById,
    clearSelectedExam,
    clearError
  } = useExamsStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchExamById(id).finally(() => setLoading(false));
    }
    
    return () => clearSelectedExam();
  }, [id]);

  const handleBack = () => {
    navigate('/exams');
  };

  const getStreamBadgeColor = (stream) => {
    const colors = {
      'science_pcm': 'bg-blue-100 text-blue-800',
      'science_pcb': 'bg-green-100 text-green-800',
      'commerce': 'bg-yellow-100 text-yellow-800',
      'arts': 'bg-purple-100 text-purple-800'
    };
    return colors[stream] || 'bg-gray-100 text-gray-800';
  };

  const getStreamBorderColor = (stream) => {
    const borderColors = {
      'science_pcm': 'border-l-blue-500',
      'science_pcb': 'border-l-green-500',
      'commerce': 'border-l-yellow-500',
      'arts': 'border-l-purple-500'
    };
    return borderColors[stream] || 'border-l-gray-500';
  };

  const formatStreamName = (stream) => {
    const names = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)',
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return names[stream] || stream;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-blue-600 animate-spin mr-3" />
            <span className="text-base text-gray-600">Loading exam details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back to Exams
          </Button>
          
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!selectedExam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mb-6 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Back to Exams
          </Button>
          
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faClipboardList} className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Exam not found</h3>
            <p className="text-gray-600">The exam you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const exam = selectedExam;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            onClick={handleBack} 
            variant="ghost" 
            className="mb-4 hover:bg-white/50"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Exams
          </Button>
          
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                {exam.name}
              </h1>
              <BookmarkButton 
                type="exams" 
                itemId={exam._id}
                className="ml-4"
              />
            </div>
            
            {exam.shortName && (
              <p className="text-xl text-gray-600 font-medium mb-4">
                {exam.shortName}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className="text-sm border-blue-200 text-blue-700 bg-white">
                {exam.shortName}
              </Badge>
              {exam.examMonth && (
                <Badge variant="outline" className="text-sm border-green-200 text-green-700 bg-white">
                  {exam.examMonth}
                </Badge>
              )}
              {exam.streams && exam.streams.length > 0 && (
                <Badge variant="outline" className="text-sm border-purple-200 text-purple-700 bg-white">
                  {exam.streams.length} Stream{exam.streams.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
                <span>Exam Month: {exam.examMonth || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
        
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {exam.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 mr-2 text-blue-600" />
                    About the Exam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{exam.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Eligibility - Show early on mobile */}
            <div className="lg:hidden">
              {exam.eligibility && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 mr-2 text-blue-600" />
                      Eligibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{exam.eligibility}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Syllabus & Subjects */}
            {exam.syllabus && exam.syllabus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faBook} className="h-5 w-5 mr-2 text-blue-600" />
                    Syllabus & Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exam.syllabus.map((subject, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <FontAwesomeIcon 
                          icon={faCheckCircle} 
                          className="text-green-500 mr-3 flex-shrink-0 h-4 w-4" 
                        />
                        <span className="text-gray-800 font-medium">
                          {subject}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Applicable Streams */}
            {exam.streams && exam.streams.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 mr-2 text-blue-600" />
                    Applicable Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exam.streams.map((stream, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${getStreamBorderColor(stream)} ${getStreamBadgeColor(stream)}`}
                      >
                        <h4 className="font-semibold">{formatStreamName(stream)}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Exam Month */}
                {exam.examMonth && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Exam Month</span>
                    <Badge variant="secondary">{exam.examMonth}</Badge>
                  </div>
                )}

                {/* Number of Subjects */}
                {exam.syllabus && exam.syllabus.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subjects</span>
                    <Badge variant="secondary">
                      {exam.syllabus.length} subject{exam.syllabus.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}

                {/* Streams Count */}
                {exam.streams && exam.streams.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Streams</span>
                    <Badge variant="secondary">
                      {exam.streams.length} stream{exam.streams.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Eligibility - Desktop */}
            <div className="hidden lg:block">
              {exam.eligibility && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 mr-2 text-blue-600" />
                      Eligibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{exam.eligibility}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Official Information - Desktop */}
            <div className="hidden lg:block">
              {exam.officialLink && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="h-5 w-5 mr-2 text-blue-600" />
                      Official Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => window.open(exam.officialLink, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-3"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 h-4 w-4" />
                      Visit Official Website
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      Get the latest updates, application forms, and detailed information
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;