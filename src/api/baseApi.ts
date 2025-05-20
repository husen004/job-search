// Base API service using RTK Query
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createLoggingFetch } from './apiUtils';

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
    baseUrl: 'https://api.example.com', // Replace with your actual API base URL
    // Uncomment the line below to enable logging in development
    // fetch: process.env.NODE_ENV === 'development' ? createLoggingFetch() : undefined,
    prepareHeaders: (headers) => {
      // Add authorization header if user is logged in
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Posts', 'Users', 'Jobs', 'RecommendedJobs'], // Add your cache tag types here
  endpoints: () => ({}),
  // Global error handling for all endpoints
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === 'persist/REHYDRATE' && action.payload) {
      return action.payload[reducerPath];
    }
  },
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

// Export hooks for usage in functional components
export const {
  util: { getRunningQueriesThunk },
} = baseApi;

// Export Redux specific API utilities
export const { resetApiState } = baseApi.util;
