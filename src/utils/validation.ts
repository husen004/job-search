import { z } from 'zod';

export const jobSearchSchema = z.object({
  text: z.string().min(2, 'Введите поисковый запрос'),
  area: z.string().min(1, 'Выберите регион'),
  salary: z.union([z.number().min(0, 'Зарплата не может быть отрицательной'), z.nan()]).optional(),
  only_with_salary: z.boolean().optional(),
  experience: z.string().optional(),
  employment: z.string().optional(),
  schedule: z.string().optional(),
  period: z.union([z.number(), z.nan()]).optional(),
});

// New company search validation schema
export const companySearchSchema = z.object({
  text: z.string().min(3, 'Введите минимум 3 символа для поиска компании'),
  per_page: z.number().min(1).max(100).default(20)
});

// Company ID validation
export const companyIdSchema = z.string().min(1, 'ID компании не может быть пустым');

export type JobSearchFormValues = z.infer<typeof jobSearchSchema>;
export type CompanySearchFormValues = z.infer<typeof companySearchSchema>;
