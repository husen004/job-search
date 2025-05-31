import { z } from 'zod';

// Example: Job Search Form Schema
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

export type JobSearchFormValues = z.infer<typeof jobSearchSchema>;
