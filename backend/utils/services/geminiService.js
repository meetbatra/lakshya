const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const initializeGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  
  return new GoogleGenAI({ apiKey });
};

const generateStreamRecommendation = async (questions, answers, studentContext = {}) => {
  try {
    const ai = initializeGeminiClient();
    
    // Prepare the context for Gemini
    const prompt = buildStreamRecommendationPrompt(questions, answers, studentContext);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Disable thinking for faster responses and lower costs
        thinkingConfig: { thinkingBudget: 0 },
        // Set temperature for consistent but creative responses
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });

    const aiResponse = response.text;
    const parsedResponse = parseStreamRecommendation(aiResponse);
    
    return {
      success: true,
      message: 'Stream recommendation generated successfully',
      data: {
        ...parsedResponse,
        generatedAt: new Date(),
        model: 'gemini-2.5-flash',
        confidence: parsedResponse.confidence || 'Medium'
      }
    };

  } catch (error) {
    console.error('Gemini AI service error:', error);
    
    // Fallback to basic recommendation if AI fails
    return {
      success: false,
      message: `AI recommendation failed: ${error.message}`,
      data: null,
      fallback: true
    };
  }
};

/**
 * Build a comprehensive prompt for stream recommendation
 * @private
 */
const buildStreamRecommendationPrompt = (questions, answers, studentContext) => {
  const questionAnswerPairs = questions.map((q, index) => ({
    question: q.question,
    answer: answers[index],
    options: q.options
  }));

  return `You are an educational counselor AI helping Class 10 students choose the right academic stream for Class 11 and 12. Based on the quiz responses below, recommend ONE stream from these four options:

**Available Streams:**
1. **science_pcm** (Physics, Chemistry, Mathematics) - For Engineering, Technology, Pure Sciences
2. **science_pcb** (Physics, Chemistry, Biology) - For Medicine, Life Sciences, Biotechnology  
3. **commerce** (Business Studies, Economics, Accountancy) - For Business, Finance, Management
4. **arts** (Literature, History, Psychology, etc.) - For Social Sciences, Creative Fields

**Student's Quiz Responses:**
${questionAnswerPairs.map((qa, index) => 
  `Q${index + 1}: ${qa.question}
   Answer: ${qa.answer}
   Available Options: ${qa.options.join(', ')}`
).join('\n\n')}

${studentContext.additionalInfo ? `\n**Additional Context:** ${studentContext.additionalInfo}` : ''}

**Instructions:**
1. Analyze the student's preferences, strengths, and interests from their responses
2. Recommend the MOST suitable stream with high confidence
3. Provide your response in this EXACT JSON format (no markdown, no extra text):

{
  "recommendedStream": "science_pcm|science_pcb|commerce|arts",
  "explanation": "2-3 sentence explanation of why this stream suits the student based on their quiz responses",
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "studyTips": "1-2 sentences of specific advice for success in this stream"
}

Respond with ONLY the JSON object, no additional text before or after.`;
};

/**
 * Parse Gemini's response into structured recommendation
 * @private
 */
const parseStreamRecommendation = (aiResponse) => {
  try {
    // Clean the response - remove any markdown formatting or extra text
    let cleanResponse = aiResponse.trim();
    
    // Remove markdown code blocks if present
    cleanResponse = cleanResponse.replace(/```json\s*|\s*```/g, '');
    cleanResponse = cleanResponse.replace(/```\s*|\s*```/g, '');
    
    // Find JSON object in the response
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanResponse);
    
    // Validate required fields
    const requiredFields = ['recommendedStream', 'explanation', 'keyStrengths', 'studyTips'];
    const missingFields = requiredFields.filter(field => !parsed[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Normalize stream name - no conversion needed since AI returns schema format
    const streamDisplayNames = {
      'science_pcm': 'Science - PCM',
      'science_pcb': 'Science - PCB', 
      'commerce': 'Commerce',
      'arts': 'Arts/Humanities'
    };
    
    return {
      stream: parsed.recommendedStream, // Use AI response directly (schema format)
      streamName: streamDisplayNames[parsed.recommendedStream] || parsed.recommendedStream,
      explanation: parsed.explanation,
      keyStrengths: parsed.keyStrengths || [],
      studyTips: parsed.studyTips || '',
      aiGenerated: true
    };
    
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw response:', aiResponse);
    
    // Return a fallback response
    return {
      stream: 'science_pcm',
      streamName: 'Science - PCM',
      explanation: 'AI analysis could not be completed. This is a general recommendation.',
      keyStrengths: ['Analytical thinking', 'Problem solving'],
      studyTips: 'Focus on building strong mathematical and analytical skills.',
      aiGenerated: false,
      parseError: true
    };
  }
};

/**
 * Test Gemini AI connectivity and configuration
 * @returns {Promise<Object>} Health check result
 */
const testGeminiConnection = async () => {
  try {
    const ai = initializeGeminiClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Respond with just "OK" to confirm you are working.',
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 10
      }
    });

    const responseText = response.text.trim();
    
    return {
      success: true,
      message: 'Gemini AI service is operational',
      data: {
        status: 'healthy',
        model: 'gemini-2.5-flash',
        responseTime: new Date(),
        testResponse: responseText
      }
    };
    
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    
    return {
      success: false,
      message: `Gemini AI service is unavailable: ${error.message}`,
      data: {
        status: 'unhealthy',
        error: error.message,
        testTime: new Date()
      }
    };
  }
};

module.exports = {
  generateStreamRecommendation,
  testGeminiConnection
};