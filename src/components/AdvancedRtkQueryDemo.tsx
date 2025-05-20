// Advanced RTK Query techniques demonstration
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { baseApi } from '../api/baseApi';
import { postsApi, useGetPostsQuery } from '../api/postsApi';
import { usersApi } from '../api/usersApi';
import { useAppSelector } from '../store/hooks';

// Advanced RTK Query features demonstration component
const AdvancedRtkQueryDemo: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector(state => !!state.counter.value); // Using counter value as mock auth state
  
  // Conditional fetching based on auth state
  const { data: posts, isLoading, isError } = useGetPostsQuery(undefined, {
    // Skip if not logged in
    skip: !isLoggedIn,
    // Polling configuration - refetch every 60 seconds
    pollingInterval: 60000,
    // Re-fetch when window gets focus
    refetchOnFocus: true,
    // Re-fetch when reconnecting
    refetchOnReconnect: true,
    // Customize tag invalidation - specify what data to use for tags
    selectFromResult: (result) => ({
      ...result,
      // Transform data if needed
      enhancedPosts: result.data?.map(post => ({
        ...post,
        shortTitle: post.title.slice(0, 30) + (post.title.length > 30 ? '...' : '')
      }))
    }),
  });
  
  // Example of prefetching data
  useEffect(() => {
    // Prefetch posts
    dispatch(postsApi.util.prefetch('getPosts', undefined, { force: false }));
    
    // Prefetch users
    dispatch(usersApi.util.prefetch('getUsers', undefined, { force: false }));
    
    // Prefetch a specific post by ID when component mounts
    if (isLoggedIn) {
      dispatch(postsApi.util.prefetch('getPostById', 1, { force: false }));
    }
  }, [dispatch, isLoggedIn]);
  
  // Example of manual cache invalidation
  const handleInvalidateCache = () => {
    // Invalidate specific tags
    dispatch(baseApi.util.invalidateTags(['Posts']));
  };
  
  // Example of manual cache reset
  const handleResetCache = () => {
    dispatch(baseApi.util.resetApiState());
  };
  
  // Conditional render based on auth state
  if (!isLoggedIn) {
    return (
      <div className="p-4 border rounded bg-yellow-50">
        <p className="text-yellow-700">You need to be logged in to view posts.</p>
        <p className="mt-2 text-sm">
          (For this demo, increment the counter on the home page to "log in")
        </p>
      </div>
    );
  }
  
  if (isLoading) {
    return <div>Loading data...</div>;
  }
  
  if (isError) {
    return <div>Error loading data</div>;
  }
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Advanced RTK Query Techniques</h2>
      
      <div className="mb-4 flex space-x-2">
        <button 
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={handleInvalidateCache}
        >
          Invalidate Posts Cache
        </button>
        <button 
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={handleResetCache}
        >
          Reset Entire Cache
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 border rounded">
        <h3 className="font-semibold mb-2">Cache Status</h3>
        <div className="text-sm">
          <div>Posts loaded: {posts ? 'Yes' : 'No'}</div>
          <div>Posts count: {posts?.length || 0}</div>
          <div>Auto-refresh: Every 60 seconds</div>
          <div>RefetchOnFocus: Enabled</div>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Prefetched Data</h3>
        <div className="border p-3 rounded max-h-60 overflow-y-auto">
          {posts?.slice(0, 5).map(post => (
            <div key={post.id} className="mb-2 pb-2 border-b">
              <div className="font-medium">{post.title}</div>
            </div>
          ))}
          {posts && posts.length > 5 && (
            <div className="text-sm text-gray-500">
              And {posts.length - 5} more posts...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedRtkQueryDemo;
