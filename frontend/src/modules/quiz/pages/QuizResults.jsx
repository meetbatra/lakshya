import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Trophy, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Download, 
  Share2,
  RefreshCw,
  Home,
  Sparkles
} from 'lucide-react';

const QuizResults = () => {
  const navigate = useNavigate();
  const {
    quizResults,
    isQuizCompleted,
    error,
    resetQuiz,
    clearError
  } = useQuizStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!isQuizCompleted || !quizResults) {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const { recommendations, totalQuestions, submittedAt, courses } = quizResults;
  const primaryRecommendation = recommendations?.[0];

  const getStreamDisplayName = (stream) => {
    const streamMap = {
      'science_pcm': 'Science (PCM)',
      'science_pcb': 'Science (PCB)',
      'commerce': 'Commerce',
      'arts': 'Arts'
    };
    return streamMap[stream] || stream;
  };

  const getFieldDisplayName = (fieldId) => {
    const fieldMap = {
      // PCM fields
      'engineering_technology': 'Engineering & Technology',
      'architecture_design': 'Architecture & Design',
      'defence_military': 'Defence & Military',
      'computer_it': 'Computer Science & IT',
      'pure_sciences_research': 'Pure Sciences & Research',
      // PCB fields
      'medicine': 'Medical Sciences',
      'allied_health': 'Allied Health & Nursing',
      'biotechnology': 'Biotechnology & Research',
      'veterinary_science': 'Veterinary Sciences',
      'agriculture_environment': 'Agriculture & Environmental Sciences'
    };
    return fieldMap[fieldId] || fieldId;
  };

  const getStreamColor = (stream) => {
    const colorMap = {
      'science_pcm': 'bg-blue-100 text-blue-800 border-blue-200',
      'science_pcb': 'bg-green-100 text-green-800 border-green-200',
      'commerce': 'bg-purple-100 text-purple-800 border-purple-200',
      'arts': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colorMap[stream] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFieldColor = (fieldId) => {
    const colorMap = {
      // PCM fields
      'engineering_technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'architecture_design': 'bg-purple-100 text-purple-800 border-purple-200',
      'defence_military': 'bg-red-100 text-red-800 border-red-200',
      'computer_it': 'bg-green-100 text-green-800 border-green-200',
      'pure_sciences_research': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      // PCB fields
      'medicine': 'bg-red-100 text-red-800 border-red-200',
      'allied_health': 'bg-pink-100 text-pink-800 border-pink-200',
      'biotechnology': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'veterinary_science': 'bg-amber-100 text-amber-800 border-amber-200',
      'agriculture_environment': 'bg-lime-100 text-lime-800 border-lime-200'
    };
    return colorMap[fieldId] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleTakeNewQuiz = () => {
    resetQuiz();
    navigate('/quiz/start');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleDownloadResults = () => {
    // Determine if this is a stream or field recommendation
    const isFieldRecommendation = primaryRecommendation.fieldId;
    const recommendationType = isFieldRecommendation ? 'Field' : 'Stream';
    const recommendationValue = isFieldRecommendation 
      ? getFieldDisplayName(primaryRecommendation.fieldId)
      : getStreamDisplayName(primaryRecommendation.stream);

    const resultsText = `
Quiz Results - ${new Date(submittedAt).toLocaleDateString()}

Recommended ${recommendationType}: ${recommendationValue}

Explanation:
${primaryRecommendation.explanation}

Key Strengths:
${primaryRecommendation.keyStrengths?.map(strength => `• ${strength}`).join('\n')}

Study Tips:
${primaryRecommendation.studyTips}
    `;
    
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">Your Quiz Results</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your responses, our AI has analyzed your interests and preferences 
            to provide personalized recommendations for your educational journey.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
            <Button 
              onClick={clearError} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Dismiss
            </Button>
          </Alert>
        )}

        {/* Quiz Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Quiz Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                <p className="text-sm text-gray-600">Questions Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">AI Powered</p>
                <p className="text-sm text-gray-600">Analysis Method</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {new Date(submittedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Completion Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Recommendation */}
        {primaryRecommendation && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                {primaryRecommendation.fieldId ? 'Recommended Field' : 'Recommended Stream'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stream/Field Badge */}
                <div className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 ${
                      primaryRecommendation.fieldId 
                        ? getFieldColor(primaryRecommendation.fieldId)
                        : getStreamColor(primaryRecommendation.stream)
                    }`}
                  >
                    {primaryRecommendation.fieldId 
                      ? (primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId))
                      : (primaryRecommendation.streamName || getStreamDisplayName(primaryRecommendation.stream))
                    }
                  </Badge>
                </div>

                {/* Explanation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Why This {primaryRecommendation.fieldId ? 'Field' : 'Stream'}?
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border">
                    {primaryRecommendation.explanation}
                  </p>
                </div>

                {/* Key Strengths */}
                {primaryRecommendation.keyStrengths && primaryRecommendation.keyStrengths.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      Your Key Strengths
                    </h3>
                    <div className="bg-white p-4 rounded-lg border">
                      <ul className="space-y-2">
                        {primaryRecommendation.keyStrengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Study Tips */}
                {primaryRecommendation.studyTips && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                      Study Tips
                    </h3>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-gray-700 leading-relaxed">
                        {primaryRecommendation.studyTips}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Generated Badge */}
                {primaryRecommendation.aiGenerated && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generated Recommendation
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Recommendations */}
        {courses && courses.courses && courses.courses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                {primaryRecommendation?.fieldId ? 
                  `Courses in ${primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId)}` : 
                  `Course Options for ${primaryRecommendation?.streamName || getStreamDisplayName(primaryRecommendation?.stream)}`
                }
              </CardTitle>
              <p className="text-sm text-gray-600">
                Based on your {primaryRecommendation?.fieldId ? 'recommended field' : 'recommended stream'}, here are relevant courses you can pursue:
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.courses.map((course, index) => (
                  <div key={course.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Course Header */}
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-600">({course.shortName})</p>
                      </div>
                      
                      {/* Course Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {course.level}
                          </Badge>
                          <span className="text-gray-600">
                            {course.duration.years} year{course.duration.years > 1 ? 's' : ''}
                            {course.duration.months > 0 && ` ${course.duration.months} months`}
                          </span>
                        </div>
                        
                        {course.description && (
                          <p className="text-gray-700 text-xs line-clamp-3">
                            {course.description}
                          </p>
                        )}
                        
                        {/* Career Options Preview */}
                        {course.careerOptions && course.careerOptions.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-800 mb-1">Career Options:</p>
                            <div className="flex flex-wrap gap-1">
                              {course.careerOptions.slice(0, 3).map((career, careerIndex) => (
                                <Badge key={careerIndex} variant="secondary" className="text-xs">
                                  {typeof career === 'string' ? career : career.jobTitle}
                                </Badge>
                              ))}
                              {course.careerOptions.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{course.careerOptions.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Course Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{courses.totalCourses}</strong> course{courses.totalCourses > 1 ? 's' : ''} available in your {primaryRecommendation?.fieldId ? 'recommended field' : 'recommended stream'}. 
                  These programs can help you build the skills needed for your career goals.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleDownloadResults} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Results
          </Button>
          
          <Button onClick={handleTakeNewQuiz} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Take New Quiz
          </Button>
          
          <Button onClick={handleGoHome} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              {primaryRecommendation.fieldId ? (
                // Next steps for Class 12 PCM field recommendations
                <>
                  <p>• Research specific career paths in {primaryRecommendation.fieldName || getFieldDisplayName(primaryRecommendation.fieldId)}</p>
                  <p>• Explore entrance exams and admission requirements for your field</p>
                  <p>• Connect with professionals and mentors in your chosen domain</p>
                  <p>• Build relevant technical skills and create portfolio projects</p>
                  <p>• Consider internships or competitions in your field of interest</p>
                </>
              ) : (
                // Next steps for Class 10 stream recommendations  
                <>
                  <p>• Explore detailed career paths in your recommended stream</p>
                  <p>• Connect with mentors and professionals in your field of interest</p>
                  <p>• Research colleges and courses that align with your goals</p>
                  <p>• Take specialized assessments for deeper career insights</p>
                  <p>• Start building relevant skills and portfolio projects</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizResults;