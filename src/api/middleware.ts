import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { isRtkQueryError, getErrorMessage } from './baseApi';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  // Check if the action is an RTK Query error
  if (isRejectedWithValue(action)) {
    console.group('RTK Query Error');
    console.error('Error occurred in API call:', action.error);
    
    // Get a readable error message
    if (isRtkQueryError(action.payload)) {
      console.error('Error message:', getErrorMessage(action.payload));
    }
    
    // Log the endpoint name and arguments
    console.log('Endpoint:', action.meta.arg.endpointName);
    console.log('Arguments:', action.meta.arg.originalArgs);
    console.groupEnd();
  }
  
  return next(action);
};

export const cachePersistMiddleware: Middleware = ({ getState }) => (next) => (action) => {
  const result = next(action);
  
  // Save to localStorage on these actions
  if (
    action.type.endsWith('/executeQuery/fulfilled') ||
    action.type.endsWith('/executeMutation/fulfilled')
  ) {
    try {
      const state = getState();
      const apiState = state.api;
      
      // Store only specific parts of the cache
      const cacheToSave = {
        queries: apiState.queries,
        provided: apiState.provided
      };
      
      localStorage.setItem('rtk_query_cache', JSON.stringify(cacheToSave));
    } catch (error) {
      console.error('Failed to persist cache to localStorage:', error);
    }
  }
  
  return result;
};
