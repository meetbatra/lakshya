import { z } from 'zod';

// Login validation schema - matching backend
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  
  password: z
    .string()
    .min(1, 'Password is required')
});
