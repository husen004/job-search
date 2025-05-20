# API Services with RTK Query

This directory contains API services implemented using Redux Toolkit Query (RTK Query). RTK Query is a powerful data fetching and caching tool included in Redux Toolkit.

## Directory Structure

- `baseApi.ts` - Base API configuration with common settings
- `postsApi.ts` - Example API service for posts
- `usersApi.ts` - Example API service for users
- `index.ts` - Re-exports all API services and hooks

## How to Use

### 1. Import the API hooks in your component

```tsx
import { useGetPostsQuery } from '../api/postsApi';
// or
import { apiHooks } from '../api';
// then use apiHooks.useGetPostsQuery
```

### 2. Use the hooks in your components

```tsx
const { data, error, isLoading } = useGetPostsQuery();

if (isLoading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error loading data</div>;
}

return (
  <div>
    {data?.map(post => (
      <div key={post.id}>{post.title}</div>
    ))}
  </div>
);
```

### 3. Using mutations

```tsx
const [createPost, { isLoading }] = useCreatePostMutation();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await createPost({ title, body, userId }).unwrap();
    // Success!
  } catch (error) {
    // Error handling
  }
};
```

## Adding New API Services

1. Create a new file in the `api` directory (e.g., `productsApi.ts`)
2. Use `baseApi.injectEndpoints()` to define your endpoints
3. Export the generated hooks
4. Add the service to `index.ts` for re-export

## Common RTK Query Features

- Automatic re-fetching
- Caching and cache invalidation
- Optimistic updates
- Polling
- Prefetching
- Lazy queries

For more details, see the [RTK Query documentation](https://redux-toolkit.js.org/rtk-query/overview)