import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useSearchEmployersQuery, 
  useGetEmployerByIdQuery
} from '../api/hhApi';
import { getErrorMessage } from '../api/baseApi';
import { companySearchSchema, companyIdSchema } from '../utils/validation';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Company: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Use existing searchEmployersQuery for top employers instead of missing useGetTopEmployersQuery
  const { 
    data: topEmployers,
    isLoading: isLoadingTop,
    error: topError
  } = useSearchEmployersQuery({
    only_with_vacancies: true,
    per_page: 20,
    sort_by: 'by_vacancies_open'
  }, { 
    skip: false // We want this to run immediately without skipping
  });
  
  // Search employers query - keep as is
  const { 
    data: searchResults,
    isLoading: isSearching, 
    error: searchError 
  } = useSearchEmployersQuery(
    { text: searchQuery, per_page: 20 }, 
    { skip: searchQuery.length < 3 }
  );
  
  // Get employer details when selected
  const { 
    data: employerDetails, 
    isLoading: isLoadingDetails, 
    error: detailsError 
  } = useGetEmployerByIdQuery(selectedEmployerId || '', { skip: !selectedEmployerId });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate search query with Zod
    const result = companySearchSchema.safeParse({ 
      text: searchQuery, 
      per_page: 20 
    });
    
    if (!result.success) {
      // Extract the first error message
      const errorMessage = result.error.errors[0]?.message || 'Ошибка валидации';
      setValidationError(errorMessage);
      return;
    }
    
    // Clear validation errors if valid
    setValidationError(null);
    // Form is valid - the query will execute due to searchQuery state change
  };
  
  const handleSelectEmployer = (id: string) => {
    // Validate employer ID with Zod
    const result = companyIdSchema.safeParse(id);
    
    if (!result.success) {
      // This would be an internal error since IDs come from the API
      console.error('Invalid employer ID:', result.error);
      return;
    }
    
    setSelectedEmployerId(id);
  };
  
  const renderEmployerCard = (employer: any) => (
    <div 
      key={employer.id} 
      className="border rounded p-4 cursor-pointer hover:bg-blue-50 transition"
      onClick={() => handleSelectEmployer(employer.id)}
    >
      <div className="flex items-center">
        {employer.logo_urls && (
          <img 
            src={employer.logo_urls['90']} 
            alt={employer.name}
            className="w-12 h-12 mr-3 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div>
          <h4 className="font-semibold text-blue-600">
            <Link to={`/company/${employer.id}`} onClick={(e) => e.stopPropagation()}>
              {employer.name}
            </Link>
          </h4>
          <p className="text-sm text-gray-600">
            {employer.open_vacancies} открытых вакансий
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-6xl mx-auto p-4 min-h-[100vh]">
      <h1 className="text-2xl font-bold mb-6">Профили компаний</h1>
      
      {/* Search Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Поиск компаний</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Введите название компании..."
              className={`w-full p-2 border rounded ${validationError ? 'border-red-500' : ''}`}
              minLength={3}
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-1">{validationError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={searchQuery.length < 3 || isSearching}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-400 whitespace-nowrap"
          >
            {isSearching ? 'Поиск...' : 'Найти компанию'}
          </button>
        </form>
        
        {searchQuery.length > 0 && searchQuery.length < 3 && !validationError && (
          <p className="text-sm text-gray-500 mt-2">Введите минимум 3 символа для поиска</p>
        )}
        
        {/* Search Error */}
        {searchError && (
          <Error message={getErrorMessage(searchError)} />
        )}
        
        {/* Search Results */}
        {searchResults && searchResults.found > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Найдено компаний: {searchResults.found}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {searchResults.items.map(employer => renderEmployerCard(employer))}
            </div>
          </div>
        )}
        
        {searchResults && searchResults.found === 0 && searchQuery.length >= 3 && (
          <div className="mt-6 text-center py-6 bg-gray-100 rounded">
            <p>По запросу "{searchQuery}" компании не найдены</p>
            <p className="text-gray-600 mt-2">Попробуйте другой поисковый запрос</p>
          </div>
        )}
      </div>
      
      {/* Top Employers Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Популярные работодатели</h2>
        
        {isLoadingTop ? (
          <Loading message="Загрузка списка работодателей..." />
        ) : topEmployers?.items && topEmployers.items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topEmployers.items.map(employer => renderEmployerCard(employer))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Список работодателей недоступен</p>
        )}
      </div>
      
      {/* Company Details section remains the same */}
      {selectedEmployerId && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          {isLoadingDetails ? (
            <Loading message="Загрузка информации о компании..." />
          ) : detailsError ? (
            <Error 
              message={getErrorMessage(detailsError)}
              onRetry={() => handleSelectEmployer(selectedEmployerId)}
            />
          ) : employerDetails ? (
            <div>
              <div className="flex items-center mb-6">
                {employerDetails.logo_urls && (
                  <img 
                    src={employerDetails.logo_urls.original} 
                    alt={employerDetails.name}
                    className="w-24 h-24 mr-6 object-contain"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{employerDetails.name}</h2>
                  {employerDetails.site_url && (
                    <a 
                      href={employerDetails.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {employerDetails.site_url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
              
              {/* Company Description */}
              {employerDetails.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">О компании</h3>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: employerDetails.description }}
                  />
                </div>
              )}
              
              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Информация</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-gray-700">Сфера деятельности:</span>{' '}
                      {employerDetails.industries?.map(i => i.name).join(', ') || 'Не указана'}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Размер компании:</span>{' '}
                      {employerDetails.company_size || 'Не указан'}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Количество вакансий:</span>{' '}
                      {employerDetails.open_vacancies || 0}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Регион:</span>{' '}
                      {employerDetails.area?.name || 'Не указан'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Контакты</h3>
                  <div className="space-y-2 text-sm">
                    {employerDetails.site_url && (
                      <p>
                        <span className="font-medium text-gray-700">Веб-сайт:</span>{' '}
                        <a 
                          href={employerDetails.site_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {employerDetails.site_url}
                        </a>
                      </p>
                    )}
                    {employerDetails.alternate_url && (
                      <p>
                        <span className="font-medium text-gray-700">Профиль на HeadHunter:</span>{' '}
                        <a 
                          href={employerDetails.alternate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Перейти к профилю
                        </a>
                      </p>
                    )}
                    {employerDetails.trusted && (
                      <p className="text-green-600 font-semibold">
                        ✓ Проверенный работодатель
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Vacancies Link */}
              <div className="mt-6 text-center">
                <Link 
                  to={`/jobs/${employerDetails.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded inline-block"
                >
                  Показать все вакансии компании
                </Link>
              </div>
            </div>
          ) : (
            <p>Информация о компании не найдена</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Company;