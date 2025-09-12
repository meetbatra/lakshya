import { z } from 'zod';

// Profile update schema - matching backend
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .optional(),
  
  class: z
    .string()
    .refine((value) => ['10', '12', 'graduate'].includes(value), {
      message: 'Class must be one of: 10, 12, graduate'
    })
    .optional(),
  
  state: z
    .string()
    .min(2, 'State name must be at least 2 characters long')
    .max(50, 'State name cannot exceed 50 characters')
    .optional()
});
