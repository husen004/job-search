// RTK Query debugging utilities
import { store } from '../store';
import { baseApi } from './baseApi';

/**
 * Get RTK Query cache data for debugging
 * @param endpointName The name of the endpoint (e.g., 'getPosts')
 * @returns The cached data for the endpoint
 */
export const getQueryData = (endpointName: string): unknown => {
  const state = store.getState();
  return state[baseApi.reducerPath].queries[endpointName]?.data;
};

/**
 * Get RTK Query cache tags for debugging
 * @returns All cache tags in the RTK Query cache
 */
export const getCacheTags = (): string[] => {
  const state = store.getState();
  return Object.keys(state[baseApi.reducerPath].provided || {});
};

/**
 * Manually invalidate cache tags
 * @param tags Array of tag types to invalidate
 */
export const invalidateTags = (tags: string[]): void => {
  store.dispatch(
    baseApi.util.invalidateTags(
      tags.map(tag => ({ type: tag }))
    )
  );
};

/**
 * Clear the entire RTK Query cache
 */
export const clearCache = (): void => {
  store.dispatch(baseApi.util.resetApiState());
};

/**
 * Create a custom fetch wrapper with logging for debugging
 * @returns A fetch implementation with logging
 */
export const createLoggingFetch = () => {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    console.group('RTK Query Request');
    console.log('URL:', typeof input === 'string' ? input : input.toString());
    console.log('Method:', init?.method || 'GET');
    console.log('Headers:', init?.headers);
    console.log('Body:', init?.body);
    console.groupEnd();

    try {
      const response = await fetch(input, init);
      const clone = response.clone();
      const data = await clone.json();

      console.group('RTK Query Response');
      console.log('Status:', response.status);
      console.log('Data:', data);
      console.groupEnd();

      return response;
    } catch (error) {
      console.error('RTK Query Error:', error);
      throw error;
    }
  };
};
