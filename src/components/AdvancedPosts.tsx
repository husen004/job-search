// Advanced usage of RTK Query features
import React, { useState } from 'react';
import { usePostsWithAuthors, usePostsByUser } from '../api/customHooks';

const AdvancedPosts: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // Use our custom hook that combines posts with their authors
  const { 
    data: postsWithAuthors, 
    isLoading: isLoadingCombined, 
    error: combinedError 
  } = usePostsWithAuthors();
  
  // Conditionally use the filter hook when a user is selected
  const { 
    data: filteredPosts, 
    isLoading: isLoadingFiltered, 
    error: filteredError 
  } = selectedUserId 
    ? usePostsByUser(selectedUserId) 
    : { data: [], isLoading: false, error: undefined };
  
  // Extract unique user IDs from posts
  const userIds = React.useMemo(() => {
    if (!postsWithAuthors) return [];
    return Array.from(new Set(postsWithAuthors.map(post => post.userId)));
  }, [postsWithAuthors]);

  const isLoading = isLoadingCombined || (selectedUserId && isLoadingFiltered);
  const error = combinedError || filteredError;

  if (isLoading) {
    return <div className="p-4">Loading posts data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading data</div>;
  }

  const postsToDisplay = selectedUserId ? filteredPosts : postsWithAuthors;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Advanced Posts Example</h2>
      
      {/* User filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by User
        </label>
        <select 
          className="p-2 border rounded w-full max-w-xs"
          value={selectedUserId || ''}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedUserId(value ? Number(value) : null);
          }}
        >
          <option value="">All Users</option>
          {userIds.map((id) => (
            <option key={id} value={id}>
              User ID: {id}
            </option>
          ))}
        </select>
      </div>
      
      {/* Posts with authors */}
      <div className="space-y-4">
        {postsToDisplay.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow-sm">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-gray-700 mb-2">{post.body}</p>
            {post.author && (
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  <strong>Author:</strong> {post.author.name}
                </p>
                <p>
                  <strong>Email:</strong> {post.author.email}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {postsToDisplay.length === 0 && (
        <p className="text-gray-500">No posts found</p>
      )}
    </div>
  );
};

export default AdvancedPosts;
