import { z } from 'zod';

// Signup validation schema - matching backend
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  class: z
    .string()
    .min(1, 'Class is required')
    .refine((value) => ['10', '12', 'graduate'].includes(value), {
      message: 'Class must be one of: 10, 12, graduate'
    }),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters long')
    .max(50, 'State name cannot exceed 50 characters'),
  
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
