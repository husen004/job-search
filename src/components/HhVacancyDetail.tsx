// filepath: src/components/HhVacancyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetVacancyByIdQuery } from '../api/hhApi';
import Loading from './Loading';
import Error from './Error';
import HhResumeUpload from './HhResumeUpload';
import HhSimilarVacancies from './HhSimilarVacancies';
import { Analytics, AnalyticsEventType } from '../utils/analytics';

// Component for displaying detailed information about a vacancy
const HhVacancyDetail: React.FC = () => {
  // Get vacancy ID from URL params
  const { id } = useParams<{ id: string }>();
  // State for resume upload modal
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  // State for vacancy saved status
  const [isSaved, setIsSaved] = useState(false);
  
  // Fetch vacancy data
  const { 
    data: vacancy, 
    isLoading, 
    error,
    refetch
  } = useGetVacancyByIdQuery(id || '');
    // Format salary display
  const formatSalary = (salary: { from: number | null; to: number | null; currency: string; gross: boolean; } | null) => {
    if (!salary) return 'Зарплата не указана';
    
    let result = '';
    if (salary.from !== null) result += `от ${salary.from.toLocaleString('ru-RU')} `;
    if (salary.to !== null) result += `${salary.from !== null ? 'до' : 'До'} ${salary.to.toLocaleString('ru-RU')} `;
    result += salary.currency === 'RUR' ? '₽' : salary.currency;
    
    if (salary.gross) {
      result += ' (до вычета налогов)';
    }
    
    return result;
  };
  
  // Check if vacancy is saved when component mounts or vacancy changes
  useEffect(() => {
    const checkIfVacancyIsSaved = () => {
      try {
        const savedVacanciesString = localStorage.getItem('hh_saved_vacancies');
        if (!savedVacanciesString) {
          setIsSaved(false);
          return;
        }
        
        const savedVacancies = JSON.parse(savedVacanciesString);
        const isCurrentVacancySaved = savedVacancies.some((saved: any) => saved.id === id);
        setIsSaved(isCurrentVacancySaved);
      } catch (error) {
        console.error('Error checking saved vacancies:', error);
        setIsSaved(false);
      }
    };
    
    checkIfVacancyIsSaved();
  }, [id]);
    // Toggle save/unsave vacancy
  const toggleSaveVacancy = () => {
    if (!vacancy) return;
    
    try {
      // Get current saved vacancies
      const savedVacanciesString = localStorage.getItem('hh_saved_vacancies');
      const savedVacancies = savedVacanciesString ? JSON.parse(savedVacanciesString) : [];
      
      if (isSaved) {
        // Remove from saved
        const updatedVacancies = savedVacancies.filter((saved: any) => saved.id !== vacancy.id);
        localStorage.setItem('hh_saved_vacancies', JSON.stringify(updatedVacancies));
        setIsSaved(false);
        
        // Track unsave event
        Analytics.trackEvent(AnalyticsEventType.UnsaveVacancy, {
          vacancyId: vacancy.id,
          vacancyTitle: vacancy.name,
          employerName: vacancy.employer.name
        });
      } else {
        // Add to saved
        savedVacancies.push(vacancy);
        localStorage.setItem('hh_saved_vacancies', JSON.stringify(savedVacancies));
        setIsSaved(true);
        
        // Track save event
        Analytics.trackEvent(AnalyticsEventType.SaveVacancy, {
          vacancyId: vacancy.id,
          vacancyTitle: vacancy.name,
          employerName: vacancy.employer.name
        });
      }
    } catch (error) {
      console.error('Error updating saved vacancies:', error);
    }
  };
  
  // Track vacancy view
  useEffect(() => {
    if (vacancy) {
      Analytics.trackJobView(
        vacancy.id,
        vacancy.name,
        vacancy.employer.name
      );
    }
  }, [vacancy]);
  
  // Handle loading state
  if (isLoading) {
    return <Loading message="Загрузка информации о вакансии..." />;
  }
  
  // Handle error state
  if (error) {
    return (
      <Error 
        message="Ошибка при загрузке вакансии. Возможно, вакансия уже не актуальна."
        onRetry={refetch}
      />
    );
  }
  
  // Handle missing vacancy data
  if (!vacancy) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <p className="text-lg text-gray-700">Информация о вакансии не найдена</p>
        <Link to="/headhunter" className="inline-block mt-4 text-blue-600 hover:underline">
          Вернуться к поиску
        </Link>
      </div>
      
      
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Back to search button */}
      <Link to="/headhunter" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Вернуться к поиску
      </Link>
      
      {/* Vacancy header with title and salary */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold mb-2">{vacancy.name}</h1>
        <div className="text-xl font-semibold text-green-600 mb-3">
          {formatSalary(vacancy.salary)}
        </div>
        
        {/* Employer information */}
        <div className="flex items-center mb-4">
          {vacancy.employer.logo_urls?.['90'] && (
            <img 
              src={vacancy.employer.logo_urls['90']} 
              alt={vacancy.employer.name}
              className="w-16 h-16 mr-3 object-contain"
            />
          )}
          <div>
            <h2 className="font-semibold">{vacancy.employer.name}</h2>
            <a 
              href={vacancy.employer.alternate_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Профиль компании на HeadHunter
            </a>
          </div>
        </div>
        
        {/* Key details */}
        <div className="bg-gray-50 p-3 rounded mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">Опыт работы:</span> {vacancy.experience.name}
            </div>
            <div>
              <span className="font-semibold">График работы:</span> {vacancy.schedule.name}
            </div>
            <div>
              <span className="font-semibold">Регион:</span> {vacancy.area.name}
            </div>
            <div>
              <span className="font-semibold">Дата публикации:</span> {new Date(vacancy.published_at).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
        
        {/* Requirements and responsibilities from snippet */}
        {vacancy.snippet && (
          <div className="mb-4">
            {vacancy.snippet.requirement && (
              <div className="mb-3">
                <h3 className="font-semibold mb-1">Требования:</h3>
                <p className="text-gray-700">{vacancy.snippet.requirement.replace(/<highlighttext>|<\/highlighttext>/g, '')}</p>
              </div>
            )}
            
            {vacancy.snippet.responsibility && (
              <div>
                <h3 className="font-semibold mb-1">Обязанности:</h3>
                <p className="text-gray-700">{vacancy.snippet.responsibility.replace(/<highlighttext>|<\/highlighttext>/g, '')}</p>
              </div>
            )}
          </div>
        )}        {/* Apply button */}
        <div className="mt-5 flex flex-wrap gap-3">
          <button 
            onClick={() => setShowResumeUpload(true)}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded font-medium"
          >
            Откликнуться с резюме
          </button>
          
          <button
            onClick={toggleSaveVacancy}
            className={`py-2 px-6 rounded font-medium flex items-center ${
              isSaved 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-500' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{isSaved ? '★' : '☆'}</span>
            {isSaved ? 'Сохранено' : 'Сохранить'}
          </button>
          
          <a 
            href={vacancy.alternate_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-blue-500 text-blue-500 hover:bg-blue-50 py-2 px-6 rounded inline-block font-medium"
          >
            Открыть на HeadHunter
          </a>
        </div>
          {/* Resume upload modal */}
        {showResumeUpload && (
          <HhResumeUpload 
            vacancyId={vacancy.id} 
            onClose={() => setShowResumeUpload(false)}
          />
        )}
        
        {/* Similar vacancies section */}
        <HhSimilarVacancies vacancyId={vacancy.id} />
      </div>
    </div>
  );
};

export default HhVacancyDetail;
