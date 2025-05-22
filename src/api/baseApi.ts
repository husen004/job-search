// Base API service using RTK Query
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Custom error handling types
interface CustomError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

// Define the base API service
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '', // Оставляем пустым, так как разные API имеют разные базовые URL
    prepareHeaders: (headers) => {
      // Добавляем User-Agent для API HeadHunter
      headers.set('User-Agent', 'JobSearchApp/1.0 (example@example.com)');
      return headers;
    },
  }),
  tagTypes: ['Posts', 'Users', 'Vacancies', 'Vacancy', 'Areas'], // Добавляем теги для HeadHunter API
  endpoints: () => ({}),
});

// Helper for handling RTK Query errors
export const isRtkQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error != null && 'status' in error;
};

// Convert RTK Query error to a readable format
export const getErrorMessage = (error: unknown): string => {
  if (isRtkQueryError(error)) {
    const err = error as CustomError;
    // Handle different error formats
    if (typeof err.data === 'object' && err.data && 'message' in err.data) {
      return err.data.message as string;
    } else if (typeof err.data === 'string') {
      return err.data;
    } else if (err.status === 401) {
      return 'Unauthorized. Please login again.';
    } else if (err.status === 404) {
      return 'Resource not found.';
    } else if (err.status >= 500) {
      return 'Server error. Please try again later.';
    }
  }
  return 'An unexpected error occurred.';
};
