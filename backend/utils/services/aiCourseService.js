const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = genAI.models;

/**
 * Get AI-recommended courses for a specific field
 * @param {string} recommendedField - The field recommended by the quiz
 * @param {Array} allCourses - All available courses from database
 * @returns {Promise<Object>} AI-filtered and scored courses
 */
const getAIRecommendedCourses = async (recommendedField, allCourses) => {
  try {
    // Create a simplified course list for AI analysis
    const courseList = allCourses.map(course => ({
      id: course._id.toString(),
      name: course.name,
      shortName: course.shortName,
      description: course.description,
      field: course.field,
      stream: course.stream,
      level: course.level,
      careerOptions: course.careerOptions?.slice(0, 3) // Limit to first 3 career options for brevity
    }));

    // Field display names for better AI understanding
    const fieldDisplayNames = {
      // Science PCM fields
      'engineering_technology': 'Engineering & Technology',
      'architecture_design': 'Architecture & Design', 
      'defence_military': 'Defence & Military',
      'computer_it': 'Computer Science & Information Technology',
      'pure_sciences_research': 'Pure Sciences & Research',
      
      // Science PCB fields
      'medicine': 'Medical Sciences',
      'allied_health': 'Allied Health & Nursing',
      'biotechnology': 'Biotechnology & Research',
      'veterinary_science': 'Veterinary Sciences',
      'agriculture_environment': 'Agriculture & Environmental Sciences',
      
      // Commerce fields
      'business_management': 'Business Management',
      'finance_accounting': 'Finance & Accounting',
      'economics_analytics': 'Economics & Analytics',
      'law_commerce': 'Law & Commerce',
      'entrepreneurship': 'Entrepreneurship',
      
      // Arts fields
      'civil_services': 'Civil Services',
      'psychology_counseling': 'Psychology & Counseling',
      'media_journalism': 'Media & Journalism',
      'law_legal_studies': 'Law & Legal Studies',
      'creative_arts_design': 'Creative Arts & Design',
      'social_sciences_research': 'Social Sciences & Research'
    };

    const fieldDisplayName = fieldDisplayNames[recommendedField] || recommendedField;

    const prompt = `
You are an educational counselor specializing in ${fieldDisplayName}. Help students find ONLY the most directly relevant courses.

**Student's Recommended Field:** ${fieldDisplayName}

**Available Courses:**
${JSON.stringify(courseList, null, 2)}

**Critical Requirements:**
- For "Computer Science & Information Technology": ONLY include courses that directly teach programming, software development, computer systems, or IT infrastructure
- For "Engineering & Technology": ONLY include engineering courses in the specific domain
- For "Business & Management": ONLY include business, management, or commerce courses
- Do NOT suggest courses from unrelated fields (e.g., no BBA for computer science, no B.Sc Math unless it's for mathematics field)

**Response Format (JSON only):**
{
  "recommendedCourses": [
    {
      "courseId": "course_id_here",
      "relevanceScore": 95,
      "relevanceLevel": "direct",
      "reasoning": "Brief explanation why this course is directly relevant to ${fieldDisplayName}"
    }
  ]
}

**Strict Relevance Criteria:**
- "direct": Course curriculum directly matches the field (85-100 score)
- "strong": Course has significant overlap with field requirements (70-84 score)
- "moderate": Course provides foundation but requires additional studies (60-69 score)

**Instructions:**
1. ONLY include courses with relevance score >= 70 (strong or direct relevance)
2. Maximum 5 courses to ensure quality over quantity
3. Focus on courses that directly prepare students for careers in ${fieldDisplayName}
4. Exclude courses that are "foundation building" unless they're in the same domain
5. Return only valid JSON, no additional text

Respond with JSON only:`;

    const result = await model.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt
    });
    const text = result.text;

    // Parse AI response
    let aiRecommendations;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiRecommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI Response:', text);
      
      // Improved fallback: return courses from the exact field and closely related fields
      let fallbackCourses = [];
      
      // Define field relationships for fallback
      const fieldRelationships = {
        'computer_it': ['computer_it', 'engineering_technology'], // Include engineering for CS courses
        'engineering_technology': ['engineering_technology'],
        'business_management': ['business_management', 'finance_accounting', 'economics_analytics'],
        'pure_sciences_research': ['pure_sciences_research']
      };
      
      const relatedFields = fieldRelationships[recommendedField] || [recommendedField];
      
      fallbackCourses = allCourses
        .filter(course => relatedFields.includes(course.field))
        .filter(course => {
          // For computer_it, only include CS and IT related courses
          if (recommendedField === 'computer_it') {
            return course.name.toLowerCase().includes('computer') || 
                   course.name.toLowerCase().includes('information technology') ||
                   course.shortName.includes('CS') || 
                   course.shortName.includes('IT');
          }
          return true;
        })
        .map(course => ({
          courseId: course._id.toString(),
          relevanceScore: course.field === recommendedField ? 95 : 80,
          relevanceLevel: course.field === recommendedField ? 'direct' : 'strong',
          reasoning: course.field === recommendedField ? 'Direct field match' : 'Related field match'
        }));
      
      aiRecommendations = { recommendedCourses: fallbackCourses };
    }

    // Get full course details for recommended courses
    const recommendedCourseIds = aiRecommendations.recommendedCourses?.map(rec => rec.courseId) || [];
    const fullCourseDetails = allCourses.filter(course => 
      recommendedCourseIds.includes(course._id.toString())
    );

    // Combine AI recommendations with full course details
    const enrichedCourses = aiRecommendations.recommendedCourses?.map(aiRec => {
      const courseDetails = fullCourseDetails.find(course => 
        course._id.toString() === aiRec.courseId
      );
      
      if (!courseDetails) return null;
      
      return {
        id: courseDetails._id,
        name: courseDetails.name,
        shortName: courseDetails.shortName,
        stream: courseDetails.stream,
        field: courseDetails.field,
        level: courseDetails.level,
        duration: courseDetails.duration,
        description: courseDetails.description,
        eligibility: courseDetails.eligibility,
        careerOptions: courseDetails.careerOptions,
        // AI-generated metadata
        relevanceScore: aiRec.relevanceScore,
        relevanceLevel: aiRec.relevanceLevel,
        aiReasoning: aiRec.reasoning
      };
    }).filter(Boolean) || [];

    // Sort by relevance score (highest first)
    enrichedCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      success: true,
      message: `AI-recommended courses for ${fieldDisplayName} retrieved successfully`,
      data: {
        field: recommendedField,
        fieldDisplayName,
        totalCourses: enrichedCourses.length,
        courses: enrichedCourses,
        aiGenerated: true,
        analysisDate: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error getting AI-recommended courses:', error);
    
    // Fallback to original field-based filtering
    const fallbackCourses = allCourses
      .filter(course => course.field === recommendedField)
      .map(course => ({
        id: course._id,
        name: course.name,
        shortName: course.shortName,
        stream: course.stream,
        field: course.field,
        level: course.level,
        duration: course.duration,
        description: course.description,
        eligibility: course.eligibility,
        careerOptions: course.careerOptions,
        relevanceScore: 90,
        relevanceLevel: 'direct',
        aiReasoning: 'Direct field match (fallback after AI error)'
      }));

    return {
      success: true,
      message: `Courses for ${recommendedField} retrieved successfully (fallback)`,
      data: {
        field: recommendedField,
        totalCourses: fallbackCourses.length,
        courses: fallbackCourses,
        aiGenerated: false,
        error: 'AI analysis failed, using fallback method'
      }
    };
  }
};

module.exports = {
  getAIRecommendedCourses
};