const { z } = require('zod');

// User registration schema
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
    .enum(['10', '12', 'graduate'], {
      errorMap: () => ({ message: 'Class must be one of: 10, 12, graduate' })
    }),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters long')
    .max(50, 'State name cannot exceed 50 characters')
    .transform(str => str.trim())
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
    .enum(['10', '12', 'graduate'], {
      errorMap: () => ({ message: 'Class must be one of: 10, 12, graduate' })
    })
    .optional(),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters long')
    .max(50, 'State name cannot exceed 50 characters')
    .transform(str => str.trim())
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
