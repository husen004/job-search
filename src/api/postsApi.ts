// Posts API service
import { baseApi } from './baseApi';

// Define the type for a Post object
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Define the Posts API as an extension of the base API
export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all posts
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    
    // Get a single post by ID
    getPostById: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (_, __, id) => [{ type: 'Posts', id }],
    }),
    
    // Create a new post
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: 'posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    
    // Update an existing post
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Posts', id }],
    }),
    
    // Delete a post
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Posts', id }],
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
