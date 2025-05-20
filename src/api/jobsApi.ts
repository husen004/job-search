// Job search API service
import { baseApi } from './baseApi';

// Types
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  postedDate: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  type?: Job['type'];
  page?: number;
  limit?: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  totalResults: number;
  page: number;
  totalPages: number;
}

// Define the Jobs API as an extension of the base API
export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Search for jobs
    searchJobs: builder.query<JobSearchResponse, JobSearchParams>({
      query: (params) => ({
        url: 'jobs/search',
        method: 'GET',
        params
      }),
      // Transform response to standardize data
      transformResponse: (response: any) => {
        // Handle different API response formats
        if (response.results) {
          return {
            jobs: response.results.map((job: any) => ({
              ...job,
              requirements: job.requirements?.split(',') || []
            })),
            totalResults: response.totalResults || 0,
            page: response.page || 1,
            totalPages: response.totalPages || 1
          };
        }
        
        return {
          jobs: [],
          totalResults: 0,
          page: 1,
          totalPages: 1
        };
      },
      providesTags: (result) => 
        result?.jobs
          ? [
              ...result.jobs.map(({ id }) => ({ type: 'Jobs' as const, id })),
              { type: 'Jobs', id: 'LIST' },
            ]
          : [{ type: 'Jobs', id: 'LIST' }]
    }),
    
    // Get job details by ID
    getJobById: builder.query<Job, number>({
      query: (id) => `jobs/${id}`,
      providesTags: (_, __, id) => [{ type: 'Jobs', id }],
    }),
    
    // Save/bookmark a job
    bookmarkJob: builder.mutation<void, number>({
      query: (id) => ({
        url: `jobs/${id}/bookmark`,
        method: 'POST',
      }),
    }),
    
    // Apply for a job
    applyForJob: builder.mutation<{ success: boolean, applicationId: string }, { jobId: number, resume: File, coverLetter?: string }>({
      query: ({ jobId, resume, coverLetter }) => {
        const formData = new FormData();
        formData.append('resume', resume);
        if (coverLetter) {
          formData.append('coverLetter', coverLetter);
        }
        
        return {
          url: `jobs/${jobId}/apply`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    
    // Get recommended jobs based on profile
    getRecommendedJobs: builder.query<Job[], void>({
      query: () => 'jobs/recommended',
      providesTags: ['RecommendedJobs'],
    }),
  }),
});

// Export hooks for using the endpoints
export const {
  useSearchJobsQuery,
  useGetJobByIdQuery,
  useBookmarkJobMutation,
  useApplyForJobMutation,
  useGetRecommendedJobsQuery,
} = jobsApi;
