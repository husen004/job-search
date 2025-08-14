# HeadHunter API Integration

## Overview

This integration allows users to search for jobs using the HeadHunter API, view detailed job information, manage saved vacancies, and apply to jobs. The implementation uses RTK Query for efficient data fetching and caching.

## Features

- **Job Search**: Search for jobs using various filters like location, experience, salary, and schedule
- **Vacancy Details**: View comprehensive information about a specific job posting
- **Company Profiles**: View company details and all their active vacancies
- **Save Vacancies**: Save interesting job postings for later review
- **Apply to Jobs**: Upload resume and cover letter to apply for jobs
- **Similar Vacancies**: View similar job postings for each vacancy

## Components

- `HhDashboard.tsx` - Main container component with navigation
- `HhJobSearch.tsx` - Job search interface with filters
- `HhVacancyDetail.tsx` - Detailed job posting view
- `HhEmployerDetail.tsx` - Company profile and their vacancies
- `HhSavedVacancies.tsx` - Saved job listings management
- `HhAdvancedFilters.tsx` - Advanced filtering options
- `HhResumeUpload.tsx` - Resume upload modal for job applications
- `HhSimilarVacancies.tsx` - Similar job suggestions

## API Structure

The HeadHunter API integration is built using RTK Query and provides the following endpoints:

- `searchVacancies` - Search for vacancies with filtering options
- `getVacancyById` - Get detailed information about a specific vacancy
- `getAreas` - Get list of regions/areas for location filtering
- `getSimilarVacancies` - Find similar vacancies to a specific job posting
- `searchEmployers` - Search for employers by name
- `getEmployerById` - Get detailed information about a specific employer

## Services

- `HeadHunterService` - Additional service for complex operations like applying to jobs
- `Analytics` - Utility for tracking user activity and job search metrics

## Local Storage

The application utilizes localStorage for:

- Saving vacancies for later viewing (`hh_saved_vacancies`)
- Tracking analytics events (`hh_analytics_events`)
- Persisting RTK Query cache for improved performance

## Future Enhancements

- Authentication with HeadHunter API for accessing user's resumes
- Job recommendations based on viewing history
- Email notifications for new matching jobs
- Full resume builder functionality
- Integration with other job boards
