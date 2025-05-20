// Re-export all API services for easier imports
export * from './baseApi';
export * from './postsApi';
export * from './usersApi';
export * from './jobsApi';
export * from './customHooks';
export * from './apiUtils';

// Export all RTK Query hooks as a single object
import { 
  useGetPostsQuery, 
  useGetPostByIdQuery, 
  useCreatePostMutation, 
  useUpdatePostMutation, 
  useDeletePostMutation 
} from './postsApi';

import {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from './usersApi';

import {
  useSearchJobsQuery,
  useGetJobByIdQuery,
  useBookmarkJobMutation,
  useApplyForJobMutation,
  useGetRecommendedJobsQuery,
} from './jobsApi';

import {
  usePostsWithAuthors,
  usePostsByUser
} from './customHooks';

// All API hooks consolidated for easier imports
export const apiHooks = {
  // Posts hooks
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  
  // Users hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  
  // Jobs hooks
  useSearchJobsQuery,
  useGetJobByIdQuery,
  useBookmarkJobMutation,
  useApplyForJobMutation,
  useGetRecommendedJobsQuery,
  
  // Custom combined hooks
  usePostsWithAuthors,
  usePostsByUser
};
