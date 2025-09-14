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

/**
 * Generate a Class 12 PCM Field Recommendation
 * Recommends a focused field/path within PCM based on student preferences.
 * Possible fields (IDs):
 *  - engineering_technology (Engineering & Technology including core + applied branches)
 *  - architecture_design (Architecture & Spatial Design)
 *  - defence_military (Defence / Armed Forces career track)
 *  - computer_it (Computer Science / IT / Software / Data / AI)
 *  - pure_sciences_research (Pure Physics / Mathematics / Research trajectory)
 */
const generatePCMFieldRecommendation = async (questions, answers, studentContext = {}) => {
  try {
    const ai = initializeGeminiClient();
    const prompt = buildPCMFieldRecommendationPrompt(questions, answers, studentContext);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.35,
        maxOutputTokens: 1100
      }
    });

    const aiResponse = response.text;
    const parsed = parsePCMFieldRecommendation(aiResponse);

    return {
      success: true,
      message: 'PCM field recommendation generated successfully',
      data: {
        ...parsed,
        model: 'gemini-2.5-flash',
        generatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Gemini PCM field recommendation error:', error);
    return {
      success: false,
      message: `AI field recommendation failed: ${error.message}`,
      data: null
    };
  }
};

/**
 * Generate PCB field recommendation using Gemini AI
 * @param {Array} questions - Quiz questions
 * @param {Array} answers - User's answers
 * @param {Object} studentContext - Additional context about the student
 * @returns {Promise<Object>} Recommendation result
 */
const generatePCBFieldRecommendation = async (questions, answers, studentContext = {}) => {
  try {
    const ai = initializeGeminiClient();
    const prompt = buildPCBFieldRecommendationPrompt(questions, answers, studentContext);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.35,
        maxOutputTokens: 1100
      }
    });

    const aiResponse = response.text;
    const parsed = parsePCBFieldRecommendation(aiResponse);

    return {
      success: true,
      message: 'PCB field recommendation generated successfully',
      data: {
        ...parsed,
        model: 'gemini-2.5-flash',
        generatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Gemini PCB field recommendation error:', error);
    return {
      success: false,
      message: `AI field recommendation failed: ${error.message}`,
      data: null
    };
  }
};

/**
 * Generate Commerce field recommendation using Gemini AI
 * @param {Array} questions - Quiz questions
 * @param {Array} answers - User's answers
 * @param {Object} studentContext - Additional context about the student
 * @returns {Promise<Object>} Recommendation result
 */
const generateCommerceFieldRecommendation = async (questions, answers, studentContext = {}) => {
  try {
    const ai = initializeGeminiClient();
    const prompt = buildCommerceFieldRecommendationPrompt(questions, answers, studentContext);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.35,
        maxOutputTokens: 1100
      }
    });

    const aiResponse = response.text;
    const parsed = parseCommerceFieldRecommendation(aiResponse);

    return {
      success: true,
      message: 'Commerce field recommendation generated successfully',
      data: {
        ...parsed,
        model: 'gemini-2.5-flash',
        generatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Gemini Commerce field recommendation error:', error);
    return {
      success: false,
      message: `AI field recommendation failed: ${error.message}`,
      data: null
    };
  }
};

/**
 * Generate a Class 12 Arts Field Recommendation
 * Recommends a focused field/path within Arts based on student preferences.
 * Possible fields (IDs):
 *  - civil_services (Civil Services - IAS, IPS, Administration)
 *  - psychology_counseling (Psychology & Counseling)
 *  - media_journalism (Media & Journalism)
 *  - law_legal_studies (Law & Legal Studies)
 *  - creative_arts_design (Creative Arts & Design)
 *  - social_sciences_research (Social Sciences & Research)
 */
const generateArtsFieldRecommendation = async (questions, answers, studentContext = {}) => {
  try {
    const ai = initializeGeminiClient();
    const prompt = buildArtsFieldRecommendationPrompt(questions, answers, studentContext);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.35,
        maxOutputTokens: 1100
      }
    });

    const aiResponse = response.text;
    const parsed = parseArtsFieldRecommendation(aiResponse);

    return {
      success: true,
      message: 'Arts field recommendation generated successfully',
      data: {
        ...parsed,
        model: 'gemini-2.5-flash',
        generatedAt: new Date()
      }
    };
  } catch (error) {
    console.error('Gemini Arts field recommendation error:', error);
    return {
      success: false,
      message: `AI field recommendation failed: ${error.message}`,
      data: null
    };
  }
};

// Build prompt for PCM field recommendation
const buildPCMFieldRecommendationPrompt = (questions, answers, studentContext) => {
  const qaPairs = questions.map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${answers[i]}\nOptions: ${q.options.join(', ')}`).join('\n\n');

  return `You are an expert career guidance AI for Indian Class 12 (Science PCM) students.
The student has taken a structured preference & aptitude quiz. Recommend EXACTLY ONE best-fit FIELD (not a college) from this WHITELIST (these are backend enum identifiers – DO NOT invent new ones):

Allowed field ids with their proper names:
1. engineering_technology → "Engineering & Technology" (mechanical, civil, electronics, emerging tech blends)
2. architecture_design → "Architecture & Design" (spatial & structural design, urban environment design)
3. defence_military → "Defence & Military" (NDA / Defence services officer / technical defence roles)
4. computer_it → "Computer Science & IT" (software engineering, programming, AI/ML, data science, product tech)
5. pure_sciences_research → "Pure Sciences & Research" (Physics / Mathematics / fundamental research orientation)

Student Responses:\n${qaPairs}\n\n${studentContext.additionalInfo ? 'Additional Context: ' + studentContext.additionalInfo + '\n' : ''}

IMPORTANT: In your explanation, always use the proper field names (e.g., "Computer Science & IT") instead of the field IDs (e.g., "computer_it"). Reference question numbers for evidence.

Return ONLY strict JSON (no markdown) in this schema (keys fixed, no extra keys):
{
  "recommendedField": "engineering_technology|architecture_design|defence_military|computer_it|pure_sciences_research",
  "explanation": "2-3 sentences explaining why this field fits using proper field names (reference Q numbers)",
  "keyStrengths": ["strength 1","strength 2","strength 3"],
  "studyTips": "1-2 specific actionable study or preparation tips tailored to this field"
}`;
};

// Build prompt for PCB field recommendation
const buildPCBFieldRecommendationPrompt = (questions, answers, studentContext) => {
  const qaPairs = questions.map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${answers[i]}\nOptions: ${q.options.join(', ')}`).join('\n\n');

  return `You are an expert career guidance AI for Indian Class 12 (Science PCB) students.
The student has taken a structured preference & aptitude quiz. Recommend EXACTLY ONE best-fit FIELD (not a college) from this WHITELIST (these are backend enum identifiers – DO NOT invent new ones):

Allowed field ids with their proper names:
1. medicine → "Medical Sciences" (MBBS, medical specializations, clinical practice, surgery)
2. allied_health → "Allied Health & Nursing" (nursing, physiotherapy, medical technology, healthcare support)
3. biotechnology → "Biotechnology & Research" (biotech research, genetic engineering, lab sciences, bioinformatics)
4. veterinary_science → "Veterinary Sciences" (veterinary medicine, animal healthcare, livestock management)
5. agriculture_environment → "Agriculture & Environmental Sciences" (agricultural sciences, environmental conservation, sustainable farming)

Student Responses:\n${qaPairs}\n\n${studentContext.additionalInfo ? 'Additional Context: ' + studentContext.additionalInfo + '\n' : ''}

IMPORTANT: In your explanation, always use the proper field names (e.g., "Medical Sciences") instead of the field IDs (e.g., "medicine"). Reference question numbers for evidence.

Return ONLY strict JSON (no markdown) in this schema (keys fixed, no extra keys):
{
  "recommendedField": "medicine|allied_health|biotechnology|veterinary_science|agriculture_environment",
  "explanation": "2-3 sentences explaining why this field fits using proper field names (reference Q numbers)",
  "keyStrengths": ["strength 1","strength 2","strength 3"],
  "studyTips": "1-2 specific actionable study or preparation tips tailored to this field"
}`;
};

// Build prompt for Commerce field recommendation
const buildCommerceFieldRecommendationPrompt = (questions, answers, studentContext) => {
  const qaPairs = questions.map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${answers[i]}\nOptions: ${q.options.join(', ')}`).join('\n\n');

  return `You are an expert career guidance AI for Indian Class 12 Commerce students.
The student has taken a structured preference & aptitude quiz. Recommend EXACTLY ONE best-fit FIELD (not a college) from this WHITELIST (these are backend enum identifiers – DO NOT invent new ones):

Allowed field ids with their proper names:
1. business_management → "Business Management" (corporate management, human resources, operations, leadership)
2. finance_accounting → "Finance & Accounting" (chartered accountancy, banking, financial analysis, auditing)
3. economics_analytics → "Economics & Analytics" (economic research, policy analysis, data analytics, market research)
4. law_commerce → "Law & Commerce" (corporate law, business legal affairs, commercial litigation)
5. entrepreneurship → "Entrepreneurship" (startup ventures, innovation, business development, risk-taking)

Student Responses:\n${qaPairs}\n\n${studentContext.additionalInfo ? 'Additional Context: ' + studentContext.additionalInfo + '\n' : ''}

IMPORTANT: In your explanation, always use the proper field names (e.g., "Business Management") instead of the field IDs (e.g., "business_management"). Reference question numbers for evidence.

Return ONLY strict JSON (no markdown) in this schema (keys fixed, no extra keys):
{
  "recommendedField": "business_management|finance_accounting|economics_analytics|law_commerce|entrepreneurship",
  "explanation": "2-3 sentences explaining why this field fits using proper field names (reference Q numbers)",
  "keyStrengths": ["strength 1","strength 2","strength 3"],
  "studyTips": "1-2 specific actionable study or preparation tips tailored to this field"
}`;
};

// Build prompt for Arts field recommendation
const buildArtsFieldRecommendationPrompt = (questions, answers, studentContext) => {
  const qaPairs = questions.map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${answers[i]}\nOptions: ${q.options.join(', ')}`).join('\n\n');

  return `You are an expert career guidance AI for Indian Class 12 Arts students.
The student has taken a structured preference & aptitude quiz. Recommend EXACTLY ONE best-fit FIELD (not a college) from this WHITELIST (these are backend enum identifiers – DO NOT invent new ones):

Allowed field ids with their proper names:
1. civil_services → "Civil Services" (IAS, IPS, administrative services, governance, public policy)
2. psychology_counseling → "Psychology & Counseling" (clinical psychology, counseling, therapy, mental health)
3. media_journalism → "Media & Journalism" (journalism, broadcasting, digital media, communication)
4. law_legal_studies → "Law & Legal Studies" (litigation, corporate law, legal research, advocacy)
5. creative_arts_design → "Creative Arts & Design" (fine arts, graphic design, visual arts, creative writing)
6. social_sciences_research → "Social Sciences & Research" (sociology, anthropology, history, research, academia)

Student Responses:\n${qaPairs}\n\n${studentContext.additionalInfo ? 'Additional Context: ' + studentContext.additionalInfo + '\n' : ''}

IMPORTANT: In your explanation, always use the proper field names (e.g., "Civil Services") instead of the field IDs (e.g., "civil_services"). Reference question numbers for evidence.

Return ONLY strict JSON (no markdown) in this schema (keys fixed, no extra keys):
{
  "recommendedField": "civil_services|psychology_counseling|media_journalism|law_legal_studies|creative_arts_design|social_sciences_research",
  "explanation": "2-3 sentences explaining why this field fits using proper field names (reference Q numbers)",
  "keyStrengths": ["strength 1","strength 2","strength 3"],
  "studyTips": "1-2 specific actionable study or preparation tips tailored to this field"
}`;
};

// Parse PCM field recommendation
const parsePCMFieldRecommendation = (raw) => {
  try {
    let cleaned = raw.trim().replace(/```json|```/g, '');
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];
    const json = JSON.parse(cleaned);
    const required = ['recommendedField','explanation','keyStrengths','studyTips'];
    const missing = required.filter(k => !json[k]);
    if (missing.length) throw new Error('Missing fields: ' + missing.join(', '));
    return {
      fieldId: json.recommendedField,
      explanation: json.explanation,
      keyStrengths: json.keyStrengths || [],
      studyTips: json.studyTips || '',
    };
  } catch (e) {
    console.error('Parse PCM field recommendation failed:', e, 'RAW:', raw);
    return {
      fieldId: 'computer_it',
      explanation: 'Fallback recommendation due to parse error.',
      keyStrengths: ['Analytical thinking'],
      studyTips: 'Focus on consistent practice in core subjects and build foundational projects.',
      parseError: true
    };
  }
};

// Parse PCB field recommendation
const parsePCBFieldRecommendation = (raw) => {
  try {
    let cleaned = raw.trim().replace(/```json|```/g, '');
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];
    const json = JSON.parse(cleaned);
    const required = ['recommendedField','explanation','keyStrengths','studyTips'];
    const missing = required.filter(k => !json[k]);
    if (missing.length) throw new Error('Missing fields: ' + missing.join(', '));
    return {
      fieldId: json.recommendedField,
      explanation: json.explanation,
      keyStrengths: json.keyStrengths || [],
      studyTips: json.studyTips || '',
    };
  } catch (e) {
    console.error('Parse PCB field recommendation failed:', e, 'RAW:', raw);
    return {
      fieldId: 'medicine',
      explanation: 'Fallback recommendation due to parse error.',
      keyStrengths: ['Analytical thinking', 'Scientific aptitude'],
      studyTips: 'Focus on biology fundamentals and develop strong analytical skills.',
      parseError: true
    };
  }
};

// Parse Commerce field recommendation
const parseCommerceFieldRecommendation = (raw) => {
  try {
    let cleaned = raw.trim().replace(/```json|```/g, '');
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];
    const json = JSON.parse(cleaned);
    const required = ['recommendedField','explanation','keyStrengths','studyTips'];
    const missing = required.filter(k => !json[k]);
    if (missing.length) throw new Error('Missing fields: ' + missing.join(', '));
    return {
      recommendedField: json.recommendedField,
      explanation: json.explanation,
      keyStrengths: json.keyStrengths || [],
      studyTips: json.studyTips || '',
    };
  } catch (e) {
    console.error('Parse Commerce field recommendation failed:', e, 'RAW:', raw);
    return {
      recommendedField: 'business_management',
      explanation: 'Fallback recommendation due to parse error.',
      keyStrengths: ['Leadership potential', 'Business acumen'],
      studyTips: 'Focus on business fundamentals and develop management skills.',
      parseError: true
    };
  }
};

// Parse Arts field recommendation
const parseArtsFieldRecommendation = (raw) => {
  try {
    let cleaned = raw.trim().replace(/```json|```/g, '');
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];
    const json = JSON.parse(cleaned);
    const required = ['recommendedField','explanation','keyStrengths','studyTips'];
    const missing = required.filter(k => !json[k]);
    if (missing.length) throw new Error('Missing fields: ' + missing.join(', '));
    return {
      recommendedField: json.recommendedField,
      explanation: json.explanation,
      keyStrengths: json.keyStrengths || [],
      studyTips: json.studyTips || '',
    };
  } catch (e) {
    console.error('Parse Arts field recommendation failed:', e, 'RAW:', raw);
    return {
      recommendedField: 'civil_services',
      explanation: 'Fallback recommendation due to parse error.',
      keyStrengths: ['Leadership potential', 'Social awareness'],
      studyTips: 'Focus on current affairs and develop strong analytical and communication skills.',
      parseError: true
    };
  }
};

module.exports = {
  generateStreamRecommendation,
  generatePCMFieldRecommendation,
  generatePCBFieldRecommendation,
  generateCommerceFieldRecommendation,
  generateArtsFieldRecommendation,
  testGeminiConnection
};