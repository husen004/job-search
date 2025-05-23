// filepath: src/utils/analytics.ts
/**
 * Analytics utility for tracking job search related activities
 */

/**
 * Types of events that can be tracked
 */
export enum AnalyticsEventType {
  JobSearch = 'job_search',
  JobView = 'job_view',
  JobApplication = 'job_application',
  EmployerView = 'employer_view',
  SaveVacancy = 'save_vacancy',
  UnsaveVacancy = 'unsave_vacancy',
}

/**
 * Interface for event data
 */
interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  timestamp: number;
  data: Record<string, any>;
}

/**
 * Analytics service for tracking user activity
 */
export class Analytics {
  /**
   * Track a user event
   * @param eventType Type of event
   * @param data Event data
   */
  static trackEvent(eventType: AnalyticsEventType, data: Record<string, any>): void {
    try {
      const event: AnalyticsEvent = {
        eventType,
        timestamp: Date.now(),
        data,
      };
      
      // In a real implementation, you would send this to your analytics service
      // For now, we'll just store it in localStorage and log to console
      
      // Get existing events or initialize empty array
      const eventsJson = localStorage.getItem('hh_analytics_events') || '[]';
      const events: AnalyticsEvent[] = JSON.parse(eventsJson);
      
      // Add new event
      events.push(event);
      
      // Limit to last 100 events to avoid localStorage size issues
      const limitedEvents = events.slice(-100);
      
      // Save back to localStorage
      localStorage.setItem('hh_analytics_events', JSON.stringify(limitedEvents));
      
      // Log to console in dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics event:', event);
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }
  
  /**
   * Track a job search event
   * @param searchParams Search parameters used
   * @param resultsCount Number of results found
   */
  static trackJobSearch(searchParams: Record<string, any>, resultsCount: number): void {
    this.trackEvent(AnalyticsEventType.JobSearch, {
      searchParams,
      resultsCount,
    });
  }
  
  /**
   * Track a job view event
   * @param vacancyId ID of the vacancy viewed
   * @param vacancyTitle Title of the vacancy
   * @param employerName Name of the employer
   */
  static trackJobView(vacancyId: string, vacancyTitle: string, employerName: string): void {
    this.trackEvent(AnalyticsEventType.JobView, {
      vacancyId,
      vacancyTitle,
      employerName,
    });
  }
  
  /**
   * Track a job application event
   * @param vacancyId ID of the vacancy applied to
   * @param vacancyTitle Title of the vacancy
   * @param hasCoverLetter Whether a cover letter was included
   */
  static trackJobApplication(
    vacancyId: string,
    vacancyTitle: string,
    hasCoverLetter: boolean
  ): void {
    this.trackEvent(AnalyticsEventType.JobApplication, {
      vacancyId,
      vacancyTitle,
      hasCoverLetter,
    });
  }
}
