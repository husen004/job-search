// filepath: src/components/HhEmployerDetail.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetEmployerByIdQuery, useSearchVacanciesQuery } from '../api/hhApi';
import Loading from './Loading';
import Error from './Error';

/**
 * Component for displaying employer details and their vacancies
 */
const HhEmployerDetail: React.FC = () => {
  // Get employer ID from URL
  const { id } = useParams<{ id: string }>();
  
  // Fetch employer data
  const { 
    data: employer, 
    isLoading: isEmployerLoading, 
    error: employerError 
  } = useGetEmployerByIdQuery(id || '');
  
  // Fetch vacancies by this employer
  const {
    data: vacancies,
    isLoading: isVacanciesLoading,
  } = useSearchVacanciesQuery({ employer_id: id, per_page: 20 });
  
  // Format salary display
  const formatSalary = (salary: { from: number | null; to: number | null; currency: string } | null) => {
    if (!salary) return 'Зарплата не указана';
    
    let result = '';
    if (salary.from !== null) result += `от ${salary.from.toLocaleString('ru-RU')} `;
    if (salary.to !== null) result += `${salary.from !== null ? 'до' : 'До'} ${salary.to.toLocaleString('ru-RU')} `;
    result += salary.currency === 'RUR' ? '₽' : salary.currency;
    
    return result;
  };

  // Handle loading state
  if (isEmployerLoading) {
    return <Loading message="Загрузка информации о компании..." />;
  }
  
  // Handle error state
  if (employerError) {
    return (
      <Error 
        message="Ошибка при загрузке информации о компании."
      />
    );
  }
  
  // Handle missing employer data
  if (!employer) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <p className="text-lg text-gray-700">Информация о компании не найдена</p>
        <Link to="/headhunter" className="inline-block mt-4 text-blue-600 hover:underline">
          Вернуться к поиску
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <Link to="/headhunter" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Вернуться к поиску
      </Link>
      
      {/* Employer header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          {employer.logo_urls && (
            <img 
              src={employer.logo_urls.original} 
              alt={employer.name}
              className="w-20 h-20 mr-6 mb-4 md:mb-0 object-contain"
            />
          )}
          
          <div>
            <h1 className="text-2xl font-bold">{employer.name}</h1>
            
            <div className="mt-2 text-gray-600">
              {employer.industries && employer.industries.map((industry: any) => (
                <span key={industry.id} className="inline-block mr-2 mb-2 bg-gray-100 px-2 py-1 rounded text-sm">
                  {industry.name}
                </span>
              ))}
            </div>
            
            <a 
              href={employer.site_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block mt-2 text-blue-600 hover:underline"
            >
              {employer.site_url}
            </a>
          </div>
        </div>
        
        {/* Company description */}
        {employer.description && (
          <div className="mt-6 prose prose-blue max-w-none" 
              dangerouslySetInnerHTML={{ __html: employer.description }}
          />
        )}
        
        {/* Company info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {employer.area && (
            <div>
              <h3 className="font-medium text-gray-700">Локация</h3>
              <p>{employer.area.name}</p>
            </div>
          )}
          
          {employer.site_url && (
            <div>
              <h3 className="font-medium text-gray-700">Веб-сайт</h3>
              <a 
                href={employer.site_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                {employer.site_url}
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Vacancies section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Актуальные вакансии компании</h2>
        
        {isVacanciesLoading ? (
          <Loading message="Загрузка вакансий..." />
        ) : vacancies && vacancies.items.length > 0 ? (
          <div className="space-y-4">
            {vacancies.items.map(vacancy => (
              <div key={vacancy.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold">
                  <Link to={`/headhunter/vacancy/${vacancy.id}`} className="text-blue-600 hover:underline">
                    {vacancy.name}
                  </Link>
                </h3>
                
                <div className="mt-3">
                  <div className="text-lg font-semibold text-green-600">{formatSalary(vacancy.salary)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {vacancy.area.name} • {vacancy.experience.name} • {vacancy.schedule.name}
                  </div>
                </div>
                
                {vacancy.snippet && (
                  <div className="mt-3 text-gray-700">
                    {vacancy.snippet.requirement && (
                      <div className="mb-2">
                        <strong>Требования:</strong> {vacancy.snippet.requirement.replace(/<highlighttext>|<\/highlighttext>/g, '')}
                      </div>
                    )}
                    {vacancy.snippet.responsibility && (
                      <div>
                        <strong>Обязанности:</strong> {vacancy.snippet.responsibility.replace(/<highlighttext>|<\/highlighttext>/g, '')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p>У этой компании сейчас нет активных вакансий</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HhEmployerDetail;
