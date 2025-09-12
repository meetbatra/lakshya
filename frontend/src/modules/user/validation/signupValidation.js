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
  
  // Optional fields for stream and field
  stream: z
    .string()
    .optional(),
  
  field: z
    .string()
    .optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
