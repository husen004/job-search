// Users API service
import { baseApi } from './baseApi';

// Define the type for a User object
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Define the Users API as an extension of the base API
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    
    // Get a single user by ID
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),
    
    // Create a new user
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    
    // Update an existing user
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Users', id }],
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi;
