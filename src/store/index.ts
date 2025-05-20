import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { baseApi } from '../api/baseApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import { rtkQueryErrorLogger, cachePersistMiddleware } from '../api/middleware';

const isDevelopment = process.env.NODE_ENV === 'development';

// Function to load persisted RTK Query cache from localStorage
const loadPersistedCache = () => {
  try {
    const persistedCache = localStorage.getItem('rtk_query_cache');
    if (persistedCache) {
      return JSON.parse(persistedCache);
    }
  } catch (error) {
    console.error('Failed to load persisted cache:', error);
  }
  return undefined;
};

export const store = configureStore({
  reducer: rootReducer,
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(baseApi.middleware);
    
    // Add custom middleware in development
    if (isDevelopment) {
      middleware.push(rtkQueryErrorLogger);
    }
    
    // Add cache persistence middleware
    middleware.push(cachePersistMiddleware);
    
    return middleware;
  },
  // Load persisted RTK Query cache
  preloadedState: {
    api: loadPersistedCache()
  },
  // Enable Redux DevTools only in development
  devTools: isDevelopment,
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
