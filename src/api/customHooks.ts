// Example of a custom hook with transformResponse
import { useMemo } from 'react';
import { useGetPostsQuery } from './postsApi';
import { useGetUsersQuery } from './usersApi';

// Interface for post with author information
export interface PostWithAuthor {
  id: number;
  title: string;
  body: string;
  userId: number;
  author: {
    name: string;
    email: string;
  } | null;
}

/**
 * Custom hook that combines posts and users data to create posts with author information
 */
export const usePostsWithAuthors = () => {
  // Fetch posts and users in parallel
  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useGetPostsQuery();
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useGetUsersQuery();

  // Combine the data when both requests are successful
  const postsWithAuthors = useMemo(() => {
    if (!posts || !users) return [];

    return posts.map(post => {
      const author = users.find(user => user.id === post.userId) || null;
      
      return {
        ...post,
        author: author ? {
          name: author.name,
          email: author.email
        } : null
      };
    });
  }, [posts, users]);

  // Combined loading and error states
  const isLoading = isLoadingPosts || isLoadingUsers;
  const error = postsError || usersError;

  return {
    data: postsWithAuthors,
    isLoading,
    error
  };
};

/**
 * Filter posts by user ID
 */
export const usePostsByUser = (userId: number) => {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => post.userId === userId);
  }, [posts, userId]);
  
  return {
    data: filteredPosts,
    isLoading,
    error
  };
};
