// Job search component using RTK Query
import React, { useState } from 'react';
import { useSearchJobsQuery, JobSearchParams } from '../api/jobsApi';
import { getErrorMessage } from '../api/baseApi';

const JobSearch: React.FC = () => {
  // Search form state
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    query: '',
    location: '',
    page: 1,
    limit: 10
  });
  
  // Track if search has been submitted
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  
  // Use RTK Query hook with skip option to avoid fetching on mount
  const { 
    data, 
    error, 
    isLoading, 
    isFetching,
    refetch
  } = useSearchJobsQuery(searchParams, {
    skip: !searchSubmitted, // Skip the initial fetch
  });
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchSubmitted(true);
    refetch(); // Manually trigger the query
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Find Your Dream Job</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 p-4 bg-gray-50 rounded border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title or Keywords
            </label>
            <input
              type="text"
              id="query"
              name="query"
              value={searchParams.query || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. Software Engineer"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={searchParams.location || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="e.g. New York"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              id="type"
              name="type"
              value={searchParams.type || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading || isFetching}
          >
            {(isLoading || isFetching) ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>
      </form>
      
      {/* Search Results */}
      <div className="mt-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded mb-4 text-red-500">
            Error: {getErrorMessage(error)}
          </div>
        )}
        
        {searchSubmitted && !isLoading && !error && data?.jobs.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
            No jobs found matching your criteria. Try adjusting your search.
          </div>
        )}
        
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Searching for jobs...</p>
          </div>
        ) : (
          <>
            {data?.jobs && data.jobs.length > 0 && (
              <>
                <div className="text-sm text-gray-500 mb-4">
                  Found {data.totalResults} jobs • Page {data.page} of {data.totalPages}
                </div>
                
                <ul className="space-y-4">
                  {data.jobs.map((job) => (
                    <li key={job.id} className="border rounded p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <div className="text-gray-700 mt-1">{job.company} • {job.location}</div>
                      <div className="mt-1 text-gray-500">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                          {job.type}
                        </span>
                        <span className="text-xs">Posted: {job.postedDate}</span>
                      </div>
                      
                      <p className="mt-2 text-gray-600 line-clamp-2">{job.description}</p>
                      
                      <div className="mt-3">
                        <span className="text-sm font-medium">{job.salary}</span>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                          View Details
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                          Save Job
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(Math.max(1, data.page - 1))}
                        disabled={data.page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                        // Show pages around current page
                        const pageToShow = data.page <= 3 
                          ? i + 1 
                          : data.page - 3 + i + 1;
                          
                        if (pageToShow <= data.totalPages) {
                          return (
                            <button
                              key={pageToShow}
                              onClick={() => handlePageChange(pageToShow)}
                              className={`px-3 py-1 border rounded
                                ${data.page === pageToShow ? 'bg-blue-500 text-white' : ''}
                              `}
                            >
                              {pageToShow}
                            </button>
                          );
                        }
                        return null;
                      })}
                      
                      {data.totalPages > 5 && data.page < data.totalPages - 2 && (
                        <span className="px-3 py-1">...</span>
                      )}
                      
                      {data.totalPages > 5 && data.page < data.totalPages - 1 && (
                        <button 
                          onClick={() => handlePageChange(data.totalPages)}
                          className="px-3 py-1 border rounded"
                        >
                          {data.totalPages}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(data.totalPages, data.page + 1))}
                        disabled={data.page === data.totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
