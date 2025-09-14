const Quiz = require('../models/Quiz');
const courseService = require('./courseService');
const { generateStreamRecommendation, generatePCMFieldRecommendation, generatePCBFieldRecommendation, generateCommerceFieldRecommendation, generateArtsFieldRecommendation } = require('../utils/services/geminiService');

/**
 * Fisher-Yates shuffle algorithm to randomize array elements
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array (creates a new array, doesn't mutate original)
 */
const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a copy to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get Class 10 Stream Selection Quiz
 * @returns {Promise<Object>} Quiz object with shuffled options
 */
const getClass10Quiz = async () => {
  const quiz = await Quiz.findOne({
    targetClass: '10',
    purpose: 'stream_selection'
  });

  if (!quiz) {
    return {
      success: false,
      message: 'Class 10 quiz not found. Please run the initialization script.',
      data: null
    };
  }

  return {
    success: true,
    message: 'Class 10 quiz fetched successfully',
    data: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      targetClass: quiz.targetClass,
      purpose: quiz.purpose,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map((q, index) => ({
        id: q._id,
        questionNumber: index + 1,
        question: q.question,
        options: shuffleArray(q.options), // Shuffle options for each question
        category: q.category
      }))
    }
  };
};

/**
 * Submit Class 10 Quiz and Calculate Stream Recommendations
 * @param {Object} submission - User's quiz submission
 * @param {string} submission.quizId - Quiz ID
 * @param {Array} submission.answers - Array of user answers
 * @param {string} submission.userId - User ID (optional)
 * @returns {Promise<Object>} Quiz results and stream recommendations
 */
const submitClass10Quiz = async (submission) => {
  const { quizId, answers, userId } = submission;

  // Validate submission
  if (!quizId || !answers || !Array.isArray(answers)) {
      return {
        success: false,
        message: 'Invalid submission format',
        data: null
      };
    }

    // Get the quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return {
        success: false,
        message: 'Quiz not found',
        data: null
      };
    }

    if (quiz.targetClass !== '10' || quiz.purpose !== 'stream-selection') {
      return {
        success: false,
        message: 'Invalid quiz type for Class 10 submission',
        data: null
      };
    }

    // Validate answers count
    if (answers.length !== quiz.questions.length) {
      return {
        success: false,
        message: `Expected ${quiz.questions.length} answers, received ${answers.length}`,
        data: null
      };
    }

    // For Class 10 stream selection quiz, we use preference-based scoring
    const isStreamSelectionQuiz = quiz.purpose === 'stream-selection';
    
    let recommendations, detailedResults;

    if (isStreamSelectionQuiz) {
      // Use Gemini AI for intelligent stream recommendation
      const geminiResult = await generateStreamRecommendation(quiz.questions, answers, { userId });
      
      if (geminiResult.success) {
        // AI-powered recommendation successful
        const aiRecommendation = geminiResult.data;
        
        // Format the recommendation for response
        recommendations = [{
          stream: aiRecommendation.stream,
          streamName: aiRecommendation.streamName,
          explanation: aiRecommendation.explanation,
          keyStrengths: aiRecommendation.keyStrengths,
          studyTips: aiRecommendation.studyTips,
          aiGenerated: true
        }];
        
        // Set a high score for AI recommendation
        streamScores = { [aiRecommendation.stream]: 90 };
        overallScore = 90;
        
      } else {
        // Return error if AI fails - no fallback
        return {
          success: false,
          message: `AI recommendation failed: ${geminiResult.message}`,
          data: null
        };
      }
      
      // For preference-based quiz, we don't have "correct" answers
      detailedResults = quiz.questions.map((question, index) => {
        const userAnswer = answers[index];
        return {
          questionNumber: index + 1,
          question: question.question,
          userAnswer,
          category: question.category || 'general'
        };
      });

      } else {
        // Traditional quiz with correct/incorrect answers (not used for Class 10)
        return {
          success: false,
          message: 'Traditional quiz scoring not implemented for this version',
          data: null
        };
      }

    // Fetch courses for the recommended stream (for Class 10 results)
    let coursesData = null;
    if (recommendations && recommendations.length > 0) {
      const recommendedStream = recommendations[0].stream;
      const coursesResult = await courseService.getCoursesByStream(recommendedStream);
      if (coursesResult.success) {
        coursesData = coursesResult.data;
      }
    }

    return {
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quizId,
        userId,
        totalQuestions: quiz.questions.length,
        recommendations,
        detailedResults,
        courses: coursesData, // Include course recommendations
        submittedAt: new Date()
      }
    };
};

/**
 * Get all available quizzes for a specific class
 * @param {string} targetClass - Target class ('10' or '12')
 * @returns {Promise<Object>} List of available quizzes
 */
const getAvailableQuizzes = async (targetClass) => {
  const quizzes = await Quiz.find({ targetClass })
    .select('title description purpose estimatedTime questions')
    .lean();

  const quizList = quizzes.map(quiz => ({
    id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    purpose: quiz.purpose,
    estimatedTime: quiz.estimatedTime,
    totalQuestions: quiz.questions.length,
    targetClass: quiz.targetClass
  }));

  return {
    success: true,
    message: `Available quizzes for class ${targetClass} fetched successfully`,
    data: {
      targetClass,
      quizzes: quizList,
      total: quizList.length
    }
  };
};

/**
 * Get Class 12 PCM Field Recommendation Quiz
 * Only fetches quizzes with targetClass 12, purpose field-recommendation and stream science-pcm (generic PCM quiz)
 */
const getClass12PCMQuiz = async () => {
  const quiz = await Quiz.findOne({
    targetClass: '12',
    purpose: 'field_recommendation',
    stream: 'science_pcm'
  });

  if (!quiz) {
    return {
      success: false,
      message: 'Class 12 PCM field recommendation quiz not found. Please initialize.',
      data: null
    };
  }

  return {
    success: true,
    message: 'Class 12 PCM quiz fetched successfully',
    data: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      targetClass: quiz.targetClass,
      purpose: quiz.purpose,
      stream: quiz.stream,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map((q, index) => ({
        id: q._id,
        questionNumber: index + 1,
        question: q.question,
        options: shuffleArray(q.options)
      }))
    }
  };
};

/**
 * Submit Class 12 PCM Field Recommendation Quiz
 */
const submitClass12PCMQuiz = async ({ quizId, answers, userId }) => {
  if (!quizId || !answers || !Array.isArray(answers)) {
    return { success: false, message: 'Invalid submission format', data: null };
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return { success: false, message: 'Quiz not found', data: null };
  }

  if (quiz.targetClass !== '12' || quiz.purpose !== 'field_recommendation' || quiz.stream !== 'science_pcm') {
    return { success: false, message: 'Invalid quiz type for Class 12 PCM submission', data: null };
  }

  if (answers.length !== quiz.questions.length) {
    return { success: false, message: `Expected ${quiz.questions.length} answers, received ${answers.length}`, data: null };
  }

  const aiResult = await generatePCMFieldRecommendation(quiz.questions, answers, { userId });
  if (!aiResult.success) {
    return { success: false, message: aiResult.message, data: null };
  }

  const fieldData = aiResult.data;

  // Map field id to display name (consistent naming for frontend similar to Class 10 streamName)
  const fieldDisplayNames = {
    engineering_technology: 'Engineering & Technology',
    architecture_design: 'Architecture & Design',
    defence_military: 'Defence & Military',
    computer_it: 'Computer Science & IT',
    pure_sciences_research: 'Pure Sciences & Research'
  };

  const recommendations = [{
    fieldId: fieldData.fieldId,
    fieldName: fieldDisplayNames[fieldData.fieldId] || fieldData.fieldId,
    explanation: fieldData.explanation,
    keyStrengths: fieldData.keyStrengths || [],
    studyTips: fieldData.studyTips || '',
    aiGenerated: !fieldData.parseError
  }];

  // Fetch AI-recommended courses for the recommended field (for Class 12 results)
  let coursesData = null;
  if (recommendations && recommendations.length > 0) {
    const recommendedField = recommendations[0].fieldId;
    const coursesResult = await courseService.getAIRecommendedCoursesByField(recommendedField);
    if (coursesResult.success) {
      coursesData = coursesResult.data;
    }
  }

  return {
    success: true,
    message: 'Class 12 PCM quiz submitted successfully',
    data: {
      quizId,
      userId: userId || null,
      totalQuestions: quiz.questions.length,
      recommendations, // unified key with Class 10 response structure
      detailedResults: quiz.questions.map((q, i) => ({
        questionNumber: i + 1,
        question: q.question,
        userAnswer: answers[i]
      })),
      courses: coursesData, // Include course recommendations
      submittedAt: new Date()
    }
  };
};

/**
 * Get Class 12 PCB Field Recommendation Quiz
 * Only fetches quizzes with targetClass 12, purpose field-recommendation and stream science-pcb
 */
const getClass12PCBQuiz = async () => {
  const quiz = await Quiz.findOne({
    targetClass: '12',
    purpose: 'field_recommendation',
    stream: 'science_pcb'
  });

  if (!quiz) {
    return {
      success: false,
      message: 'Class 12 PCB field recommendation quiz not found. Please initialize.',
      data: null
    };
  }

  return {
    success: true,
    message: 'Class 12 PCB quiz fetched successfully',
    data: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      targetClass: quiz.targetClass,
      purpose: quiz.purpose,
      stream: quiz.stream,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions.map((q, index) => ({
        id: q._id,
        questionNumber: index + 1,
        question: q.question,
        options: shuffleArray(q.options)
      }))
    }
  };
};

/**
 * Submit Class 12 PCB Field Recommendation Quiz
 */
const submitClass12PCBQuiz = async ({ quizId, answers, userId }) => {
  if (!quizId || !answers || !Array.isArray(answers)) {
    return { success: false, message: 'Invalid submission format', data: null };
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return { success: false, message: 'Quiz not found', data: null };
  }

  if (quiz.targetClass !== '12' || quiz.purpose !== 'field_recommendation' || quiz.stream !== 'science_pcb') {
    return { success: false, message: 'Invalid quiz type for Class 12 PCB submission', data: null };
  }

  if (answers.length !== quiz.questions.length) {
    return { success: false, message: `Expected ${quiz.questions.length} answers, received ${answers.length}`, data: null };
  }

  const aiResult = await generatePCBFieldRecommendation(quiz.questions, answers, { userId });
  if (!aiResult.success) {
    return { success: false, message: aiResult.message, data: null };
  }

  const fieldData = aiResult.data;

  // Map field id to display name (consistent naming for frontend similar to Class 10 streamName)
  const fieldDisplayNames = {
    medicine: 'Medical Sciences',
    allied_health: 'Allied Health & Nursing',
    biotechnology: 'Biotechnology & Research',
    veterinary_science: 'Veterinary Sciences',
    agriculture_environment: 'Agriculture & Environmental Sciences'
  };

  const recommendations = [{
    fieldId: fieldData.fieldId,
    fieldName: fieldDisplayNames[fieldData.fieldId] || fieldData.fieldId,
    explanation: fieldData.explanation,
    keyStrengths: fieldData.keyStrengths || [],
    studyTips: fieldData.studyTips || '',
    aiGenerated: !fieldData.parseError
  }];

  // Fetch AI-recommended courses for the recommended field (for Class 12 results)
  let coursesData = null;
  if (recommendations && recommendations.length > 0) {
    const recommendedField = recommendations[0].fieldId;
    const coursesResult = await courseService.getAIRecommendedCoursesByField(recommendedField);
    if (coursesResult.success) {
      coursesData = coursesResult.data;
    }
  }

  return {
    success: true,
    message: 'Class 12 PCB quiz submitted successfully',
    data: {
      quizId,
      userId: userId || null,
      totalQuestions: quiz.questions.length,
      recommendations, // unified key with Class 10 response structure
      detailedResults: quiz.questions.map((q, i) => ({
        questionNumber: i + 1,
        question: q.question,
        userAnswer: answers[i]
      })),
      courses: coursesData, // Include course recommendations
      submittedAt: new Date()
    }
  };
};

// Class 12 Commerce Quiz Functions
const getClass12CommerceQuiz = async () => {
  try {
    const quiz = await Quiz.findOne({
      targetClass: '12',
      stream: 'commerce',
      purpose: 'field_recommendation'
    });

    if (!quiz) {
      return {
        success: false,
        message: 'Class 12 Commerce quiz not found'
      };
    }

    return {
      success: true,
      message: 'Class 12 Commerce quiz retrieved successfully',
      data: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        targetClass: quiz.targetClass,
        purpose: quiz.purpose,
        stream: quiz.stream,
        instructions: quiz.instructions,
        duration: quiz.duration,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions.map((q, index) => ({
          questionNumber: index + 1,
          question: q.question,
          options: q.options
        }))
      }
    };
  } catch (error) {
    console.error('Error retrieving Class 12 Commerce quiz:', error);
    return {
      success: false,
      message: 'Failed to retrieve quiz'
    };
  }
};

const submitClass12CommerceQuiz = async (quizId, answers, userId = null) => {
  try {
    if (!Array.isArray(answers)) {
      return {
        success: false,
        message: 'Invalid answers format'
      };
    }

    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return {
        success: false,
        message: 'Quiz not found'
      };
    }

    if (!quiz.targetClass === '12' || !quiz.stream === 'commerce' || !quiz.purpose === 'field_recommendation') {
      return {
        success: false,
        message: 'Invalid quiz type'
      };
    }

    if (answers.length !== quiz.questions.length) {
      return {
        success: false,
        message: `Expected ${quiz.questions.length} answers, received ${answers.length}`
      };
    }

    // Generate field recommendation using Gemini AI
    const aiResult = await generateCommerceFieldRecommendation(quiz.questions, answers, { userId });
    if (!aiResult.success) {
      return { success: false, message: aiResult.message, data: null };
    }

    const fieldData = aiResult.data;
    
    // Define Commerce field display names mapping
    const commerceFieldDisplayNames = {
      'business_management': 'Business Management',
      'finance_accounting': 'Finance & Accounting',
      'economics_analytics': 'Economics & Analytics', 
      'law_commerce': 'Law & Commerce',
      'entrepreneurship': 'Entrepreneurship'
    };

    const recommendations = [{
      fieldId: fieldData.recommendedField,
      fieldName: commerceFieldDisplayNames[fieldData.recommendedField] || fieldData.recommendedField,
      explanation: fieldData.explanation,
      keyStrengths: fieldData.keyStrengths || [],
      studyTips: fieldData.studyTips || '',
      aiGenerated: !fieldData.parseError
    }];

    // Fetch AI-recommended courses for the recommended field (for Class 12 results)
    let coursesData = null;
    if (recommendations && recommendations.length > 0) {
      const recommendedField = recommendations[0].fieldId;
      const coursesResult = await courseService.getAIRecommendedCoursesByField(recommendedField);
      if (coursesResult.success) {
        coursesData = coursesResult.data;
      }
    }

    return {
      success: true,
      message: 'Class 12 Commerce quiz submitted successfully',
      data: {
        quizId,
        userId: userId || null,
        totalQuestions: quiz.questions.length,
        recommendations, // unified key with Class 10 response structure
        detailedResults: quiz.questions.map((q, i) => ({
          questionNumber: i + 1,
          question: q.question,
          userAnswer: answers[i]
        })),
        courses: coursesData, // Include course recommendations
        submittedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Error submitting Class 12 Commerce quiz:', error);
    return {
      success: false,
      message: 'Failed to submit quiz'
    };
  }
};

// Class 12 Arts Quiz Functions
const getClass12ArtsQuiz = async () => {
  try {
    const quiz = await Quiz.findOne({
      targetClass: '12',
      stream: 'arts',
      purpose: 'field_recommendation'
    });

    if (!quiz) {
      return {
        success: false,
        message: 'Class 12 Arts quiz not found'
      };
    }

    return {
      success: true,
      message: 'Class 12 Arts quiz retrieved successfully',
      data: {
        id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        targetClass: quiz.targetClass,
        purpose: quiz.purpose,
        stream: quiz.stream,
        instructions: quiz.instructions,
        duration: quiz.duration,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions.map((q, index) => ({
          questionNumber: index + 1,
          question: q.question,
          options: q.options
        }))
      }
    };
  } catch (error) {
    console.error('Error retrieving Class 12 Arts quiz:', error);
    return {
      success: false,
      message: 'Failed to retrieve quiz'
    };
  }
};

const submitClass12ArtsQuiz = async (quizId, answers, userId = null) => {
  try {
    if (!Array.isArray(answers)) {
      return {
        success: false,
        message: 'Invalid answers format'
      };
    }

    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return {
        success: false,
        message: 'Quiz not found'
      };
    }

    if (!quiz.targetClass === '12' || !quiz.stream === 'arts' || !quiz.purpose === 'field_recommendation') {
      return {
        success: false,
        message: 'Invalid quiz type'
      };
    }

    if (answers.length !== quiz.questions.length) {
      return {
        success: false,
        message: `Expected ${quiz.questions.length} answers, received ${answers.length}`
      };
    }

    // Generate field recommendation using Gemini AI
    const aiResult = await generateArtsFieldRecommendation(quiz.questions, answers, { userId });
    if (!aiResult.success) {
      return { success: false, message: aiResult.message, data: null };
    }

    const fieldData = aiResult.data;
    
    // Define Arts field display names mapping
    const artsFieldDisplayNames = {
      'civil_services': 'Civil Services',
      'psychology_counseling': 'Psychology & Counseling',
      'media_journalism': 'Media & Journalism',
      'law_legal_studies': 'Law & Legal Studies',
      'creative_arts_design': 'Creative Arts & Design',
      'social_sciences_research': 'Social Sciences & Research'
    };

    const recommendations = [{
      fieldId: fieldData.recommendedField,
      fieldName: artsFieldDisplayNames[fieldData.recommendedField] || fieldData.recommendedField,
      explanation: fieldData.explanation,
      keyStrengths: fieldData.keyStrengths || [],
      studyTips: fieldData.studyTips || '',
      aiGenerated: !fieldData.parseError
    }];

    // Fetch AI-recommended courses for the recommended field (for Class 12 results)
    let coursesData = null;
    if (recommendations && recommendations.length > 0) {
      const recommendedField = recommendations[0].fieldId;
      const coursesResult = await courseService.getAIRecommendedCoursesByField(recommendedField);
      if (coursesResult.success) {
        coursesData = coursesResult.data;
      }
    }

    return {
      success: true,
      message: 'Class 12 Arts quiz submitted successfully',
      data: {
        quizId,
        userId: userId || null,
        totalQuestions: quiz.questions.length,
        recommendations, // unified key with Class 10 response structure
        detailedResults: quiz.questions.map((q, i) => ({
          questionNumber: i + 1,
          question: q.question,
          userAnswer: answers[i]
        })),
        courses: coursesData, // Include course recommendations
        submittedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Error submitting Class 12 Arts quiz:', error);
    return {
      success: false,
      message: 'Failed to submit quiz'
    };
  }
};

module.exports = {
  getClass10Quiz,
  submitClass10Quiz,
  getAvailableQuizzes,
  getClass12PCMQuiz,
  submitClass12PCMQuiz,
  getClass12PCBQuiz,
  submitClass12PCBQuiz,
  getClass12CommerceQuiz,
  submitClass12CommerceQuiz,
  getClass12ArtsQuiz,
  submitClass12ArtsQuiz
};