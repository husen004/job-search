// Example component using RTK Query
import React from 'react';
import { useGetPostsQuery } from '../api/postsApi';

const PostsList: React.FC = () => {
  // Using the auto-generated hook from RTK Query
  const { data: posts, error, isLoading, isFetching, refetch } = useGetPostsQuery();

  if (isLoading) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error loading posts</div>
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      {isFetching && <div className="text-gray-500 mb-2">Refreshing...</div>}
      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.id} className="border p-3 rounded shadow-sm">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
