// Example component using RTK Query mutations
import React, { useState } from 'react';
import { 
  useGetPostsQuery, 
  useCreatePostMutation, 
  useDeletePostMutation 
} from '../api/postsApi';

const PostsManager: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Using the auto-generated hooks from RTK Query
  const { data: posts, isLoading: isLoadingPosts } = useGetPostsQuery();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({ 
        title, 
        body,
        userId: 1 // Hardcoded for this example
      }).unwrap();
      // Reset form after successful submission
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id).unwrap();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (isLoadingPosts) {
    return <div className="p-4">Loading posts...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Posts</h2>
      
      {/* Create Post Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">Create New Post</h3>
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 p-2 block w-full border rounded"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-green-300"
        >
          {isCreating ? 'Creating...' : 'Create Post'}
        </button>
      </form>
      
      {/* Posts List */}
      <h3 className="font-semibold mb-2">Posts List</h3>
      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.id} className="border p-3 rounded shadow-sm flex justify-between">
            <div>
              <h4 className="font-semibold">{post.title}</h4>
              <p className="text-gray-700">{post.body}</p>
            </div>
            <button
              onClick={() => handleDelete(post.id)}
              disabled={isDeleting}
              className="px-3 py-1 bg-red-500 text-white rounded h-8 self-start"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsManager;
