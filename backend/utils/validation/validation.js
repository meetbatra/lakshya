const { z } = require('zod');

// User regi  // Field of interest (for Class 12 students)
  field: z
    .enum([
      // Science PCM fields
      'engineering_technology', 'architecture_design', 'defence_military', 'computer_it', 'pure_sciences_research',
      // Science PCB fields  
      'medicine', 'allied_health', 'biotechnology', 'veterinary_science', 'agriculture_environment',
      // Commerce fields
      'business_management', 'finance_accounting', 'economics_analytics', 'law_commerce', 'entrepreneurship',
      // Arts fields
      'social_sciences', 'psychology', 'journalism_media', 'fine_arts_design', 'law_arts', 'civil_services'
    ], {
      errorMap: () => ({ message: 'Invalid field selection' })
    })
    .optional()
const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .transform(str => str.trim()),
  
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .transform(str => str.trim()),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  
  class: z
    .enum(['10', '12'], {
      errorMap: () => ({ message: 'Class must be one of: 10, 12' })
    }),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters long')
    .max(50, 'State name cannot exceed 50 characters')
    .transform(str => str.trim()),

  // Stream validation - required for class 10 and 12
  stream: z
    .enum(['science_pcm', 'science_pcb', 'commerce', 'arts'], {
      errorMap: () => ({ message: 'Stream must be one of: science_pcm, science_pcb, commerce, arts' })
    })
    .optional(),

  // Field validation - for class 12 students
  field: z
    .enum([
      // Science PCM fields
      'engineering', 'architecture', 'pure_sciences', 'computer_science',
      // Science PCB fields  
      'medicine', 'dentistry', 'pharmacy', 'biotechnology', 'nursing',
      // Commerce fields
      'ca', 'cs', 'bcom', 'bba', 'economics',
      // Arts fields
      'ba', 'journalism', 'psychology', 'sociology', 'literature'
    ], {
      errorMap: () => ({ message: 'Invalid field selection' })
    })
    .optional()
}).refine((data) => {
  // Stream is required for class 10 and 12
  if ((data.class === '10' || data.class === '12') && !data.stream) {
    return false;
  }
  return true;
}, {
  message: 'Stream is required for Class 10 and 12 students',
  path: ['stream']
}).refine((data) => {
  // Field is required for class 12 students with a stream
  if (data.class === '12' && data.stream && !data.field) {
    return false;
  }
  return true;
}, {
  message: 'Field of interest is required for Class 12 students',
  path: ['field']
});

// User login schema
const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .transform(str => str.trim()),
  
  password: z
    .string()
    .min(1, 'Password is required')
});

// Profile update schema (partial signup schema without password)
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .transform(str => str.trim())
    .optional(),
  
  class: z
    .enum(['10', '12'], {
      errorMap: () => ({ message: 'Class must be one of: 10, 12' })
    })
    .optional(),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters long')
    .max(50, 'State name cannot exceed 50 characters')
    .transform(str => str.trim())
    .optional(),

  // Stream field for profile updates
  stream: z
    .enum(['science_pcm', 'science_pcb', 'commerce', 'arts'], {
      errorMap: () => ({ message: 'Stream must be one of: science_pcm, science_pcb, commerce, arts' })
    })
    .optional(),

  // Field of interest for profile updates
  field: z
    .enum([
      // Science PCM fields
      'engineering_technology', 'architecture_design', 'defence_military', 'computer_it', 'pure_sciences_research',
      // Science PCB fields  
      'medicine', 'allied_health', 'biotechnology', 'veterinary_science', 'agriculture_environment',
      // Commerce fields
      'business_management', 'finance_accounting', 'economics_analytics', 'law_commerce', 'entrepreneurship',
      // Arts fields
      'social_sciences', 'psychology', 'journalism_media', 'fine_arts_design', 'law_arts', 'civil_services'
    ], {
      errorMap: () => ({ message: 'Invalid field selection' })
    })
    .optional(),
  
  preferences: z
    .object({
      interestedStreams: z.array(z.string()).optional(),
      careerGoals: z.array(z.string()).optional(),
      studyPreference: z.enum(['government', 'private', 'both']).optional()
    })
    .optional(),
  
  profile: z
    .object({
      avatar: z.string().url('Avatar must be a valid URL').optional(),
      bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
      achievements: z.array(z.string()).optional()
    })
    .optional()
});

// Validation functions
const validateSignupData = (data) => {
  try {
    const validatedData = signupSchema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(err => err.message)
      };
    }
    return {
      success: false,
      data: null,
      errors: ['Validation failed']
    };
  }
};

const validateLoginData = (data) => {
  try {
    const validatedData = loginSchema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(err => err.message)
      };
    }
    return {
      success: false,
      data: null,
      errors: ['Validation failed']
    };
  }
};

const validateUpdateProfileData = (data) => {
  try {
    const validatedData = updateProfileSchema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(err => err.message)
      };
    }
    return {
      success: false,
      data: null,
      errors: ['Validation failed']
    };
  }
};

// Safe validation (returns partial data with errors)
const safeValidateSignupData = (data) => {
  const result = signupSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? [] : result.error.issues.map(err => err.message)
  };
};

const safeValidateLoginData = (data) => {
  const result = loginSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? [] : result.error.issues.map(err => err.message)
  };
};

// Export schemas for potential sharing with frontend
module.exports = {
  // Schemas (can be shared with frontend)
  signupSchema,
  loginSchema,
  updateProfileSchema,
  
  // Validation functions
  validateSignupData,
  validateLoginData,
  validateUpdateProfileData,
  
  // Safe validation functions
  safeValidateSignupData,
  safeValidateLoginData,
  
  // Legacy functions (for backward compatibility)
  validateEmail: (email) => z.string().email().safeParse(email).success,
  validatePassword: (password) => {
    const result = z.string().min(6).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/).safeParse(password);
    return {
      isValid: result.success,
      errors: result.success ? [] : ['Password does not meet requirements']
    };
  }
};
