import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetEmployerByIdQuery, useSearchVacanciesQuery } from '../api/hhApi';
import { getErrorMessage } from '../api/baseApi';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CompanyInformation: React.FC = () => {
  // Get company ID from URL params
  const { id } = useParams<{ id: string }>();
  
  // Get employer details
  const { 
    data: employer, 
    isLoading: isLoadingEmployer, 
    error: employerError 
  } = useGetEmployerByIdQuery(id || '');
  
  // Get company vacancies
  const {
    data: vacancies,
    isLoading: isLoadingVacancies,
    error: vacanciesError
  } = useSearchVacanciesQuery({
    employerId: id,
    per_page: 10,
    page: 0
  }, { skip: !id });
  
  // Format salary to readable format
  const formatSalary = (salary: any) => {
    if (!salary) return 'З/п не указана';
    
    let result = '';
    if (salary.from) {
      result += `от ${salary.from.toLocaleString('ru-RU')}`;
    }
    
    if (salary.to) {
      result += `${salary.from ? ' до ' : 'до '}${salary.to.toLocaleString('ru-RU')}`;
    }
    
    if (salary.currency === 'RUR') {
      result += ' ₽';
    } else {
      result += ` ${salary.currency}`;
    }
    
    return result;
  };

  if (isLoadingEmployer) {
    return <Loading message="Загрузка информации о компании..." />;
  }

  if (employerError) {
    return <Error message={getErrorMessage(employerError)} />;
  }

  if (!employer) {
    return <div className="text-center py-10">Информация о компании не найдена</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      {/* Company Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {employer.logo_urls && (
            <img 
              src={employer.logo_urls.original} 
              alt={employer.name}
              className="w-32 h-32 object-contain"
            />
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{employer.name}</h1>
            
            {employer.site_url && (
              <a 
                href={employer.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mb-2 block"
              >
                {employer.site_url.replace(/^https?:\/\//, '')}
              </a>
            )}
            
            <div className="mt-3">
              {employer.trusted && (
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Проверенный работодатель
                </div>
              )}
              
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {employer.open_vacancies} вакансий
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Company Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Company Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">О компании</h2>
            
            <div className="space-y-4">
              {employer.area && (
                <div>
                  <h3 className="text-gray-600 font-medium">Регион</h3>
                  <p>{employer.area.name}</p>
                </div>
              )}
              
              {employer.industries && employer.industries.length > 0 && (
                <div>
                  <h3 className="text-gray-600 font-medium">Сфера деятельности</h3>
                  <ul className="list-disc pl-5">
                    {employer.industries.map((industry, index) => (
                      <li key={index}>{industry.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {employer.company_size && (
                <div>
                  <h3 className="text-gray-600 font-medium">Размер компании</h3>
                  <p>{employer.company_size}</p>
                </div>
              )}
              
              {employer.alternate_url && (
                <div className="pt-2">
                  <a 
                    href={employer.alternate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded inline-flex items-center"
                  >
                    <span>Профиль на HeadHunter</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Vacancies & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Description */}
          {employer.description && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Описание</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: employer.description }}
              />
            </div>
          )}
          
          {/* Company Vacancies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Вакансии компании</h2>
            
            {isLoadingVacancies ? (
              <Loading message="Загрузка вакансий..." />
            ) : vacanciesError ? (
              <Error message={getErrorMessage(vacanciesError)} />
            ) : vacancies && vacancies.items.length > 0 ? (
              <div className="space-y-4">
                {vacancies.items.map(vacancy => (
                  <div key={vacancy.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="text-lg font-semibold">
                      <Link 
                        to={`/headhunter/vacancy/${vacancy.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {vacancy.name}
                      </Link>
                    </h3>
                    
                    <div className="mt-2 text-green-600 font-medium">
                      {formatSalary(vacancy.salary)}
                    </div>
                    
                    <div className="mt-1 text-sm text-gray-600">
                      {vacancy.area.name} • {vacancy.experience.name} • {vacancy.schedule.name}
                    </div>
                    
                    {vacancy.snippet && (
                      <div className="mt-2 text-sm text-gray-700">
                        {vacancy.snippet.requirement && (
                          <div className="line-clamp-2">
                            <strong>Требования:</strong>{' '}
                            {vacancy.snippet.requirement.replace(/<highlighttext>|<\/highlighttext>/g, '')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {vacancies.found > vacancies.items.length && (
                  <div className="text-center pt-4">
                    <a
                      href={`${employer.alternate_url}/vacancies`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded inline-block"
                    >
                      Показать все {vacancies.found} вакансий на сайте HeadHunter
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500">
                У компании нет активных вакансий
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;