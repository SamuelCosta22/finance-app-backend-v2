import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z
    .string({
      message: 'First name is required.',
    })
    .trim()
    .min(3, {
      message: 'First name must have at least 3 characters.',
    }),
  last_name: z
    .string({
      message: 'Last name is required.',
    })
    .trim()
    .min(3, {
      message: 'Last name must have at least 3 characters.',
    }),
  email: z
    .string({
      message: 'Email is required.',
    })
    .email({
      message: 'Invalid email. Please provide a valid one.',
    })
    .trim()
    .min(1, {
      message: 'Email is required.',
    }),
  password: z
    .string({
      message: 'Password is required.',
    })
    .trim()
    .min(6, {
      message: 'Password must habe at least 6 characters.',
    }),
});

export const updateUserChema = createUserSchema.partial().strict({
  message: 'Some provided field is not allowed.',
});

export const loginSchema = z.object({
  email: z
    .string({
      message: 'Email is required.',
    })
    .email({
      message: 'Invalid email. Please provide a valid one.',
    })
    .trim()
    .min(1, {
      message: 'Email is required.',
    }),
  password: z
    .string({
      message: 'Password is required.',
    })
    .trim()
    .min(6, {
      message: 'Password must habe at least 6 characters.',
    }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, {
    message: 'Refresh token is required.',
  }),
});

export const getUserBalanceSchema = z.object({
  user_id: z
    .string({
      message: 'User ID is required.',
    })
    .uuid({
      message: 'User ID must be a valid UUID.',
    }),
  from: z
    .string({ message: 'Start Date (from) is required.' })
    .transform((val) => new Date(val)),

  to: z
    .string({ message: 'End Date (to) is required.' })
    .transform((val) => new Date(val)),
});
