import { z } from 'zod';
import validator from 'validator';

export const createTransactionSchema = z.object({
  user_id: z
    .string({
      message: 'User ID is required.',
    })
    .uuid({
      message: 'User ID must be a valid UUID.',
    }),
  name: z
    .string({
      message: 'Name is required.',
    })
    .min(3, {
      message: 'Name must have at least 3 characters.',
    }),
  date: z
    .union([
      z.string().datetime({ message: 'Date must be a valid ISO date.' }),
      z.date(),
    ])
    .transform((val) => (typeof val === 'string' ? new Date(val) : val)),
  type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
    required_error: 'Type is required.',
  }),
  amount: z
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.',
    })
    .min(1, {
      message: 'Amount must be greater than 0.',
    })
    .refine((value) =>
      validator.isCurrency(value.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      }),
    ),
});

export const updateTransactionSchema = createTransactionSchema
  .omit({ user_id: true })
  .partial();

export const getTransactionsByUserIdSchema = z.object({
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
