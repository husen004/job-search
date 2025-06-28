// Компонент для поиска вакансий через HeadHunter API
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useSearchVacanciesQuery,
  useGetAreasQuery,
  HhSearchParams,
  HH_EXPERIENCE,
  HH_SCHEDULE
} from '../api/hhApi';
import { getErrorMessage } from '../api/baseApi';
import { Analytics } from '../utils/analytics';
import Loading from './Loading';
import Error from './Error';
import HhAdvancedFilters from './HhAdvancedFilters';
import { jobSearchSchema } from '../utils/validation';

const HhJobSearch: React.FC = () => {  // Состояние для параметров поиска
  const [searchParams, setSearchParams] = useState<HhSearchParams>({
    text: '',
    area: '1', // По умолчанию Москва
    only_with_salary: true,
    page: 0,
    per_page: 10
  });

  // Состояние для отображения расширенных фильтров
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Состояние для ошибок валидации формы
  const [formError, setFormError] = useState<string | null>(null);

  // Получаем данные регионов и вакансий с помощью RTK Query
  const { data: areas, isLoading: areasLoading } = useGetAreasQuery();
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch
  } = useSearchVacanciesQuery(searchParams);
  // Обработчик формы поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form with Zod
    const result = jobSearchSchema.safeParse(searchParams);
    if (!result.success) {
      setFormError(result.error.errors[0]?.message || 'Ошибка валидации');
      return;
    }
    setFormError(null);
    refetch();

    // Track search event if we have results
    if (data) {
      Analytics.trackJobSearch(searchParams, data.found);
    }
  };

  // Track search results when data changes
  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      Analytics.trackJobSearch(searchParams, data.found);
    }
  }, [data, isLoading, isFetching]);

  // Обработка изменения параметров поиска
  const handleParamChange = (key: keyof HhSearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value, page: 0 })); // Сбрасываем страницу при изменении фильтров
  };

  // Обработка изменений в полях ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      handleParamChange(name as keyof HhSearchParams, checked);
    } else {
      handleParamChange(name as keyof HhSearchParams, value);
    }
  };

  // Обработчик пагинации
  const changePage = (pageChange: number) => {
    const newPage = Math.max(0, Math.min((data?.pages || 1) - 1, (searchParams.page || 0) + pageChange));
    handleParamChange('page', newPage);
  };

  // Функция для форматирования зарплаты
  const formatSalary = (salary: { from: number | null; to: number | null; currency: string } | null) => {
    if (!salary) return 'Зарплата не указана';

    let result = '';
    if (salary.from !== null) result += `от ${salary.from.toLocaleString('ru-RU')} `;
    if (salary.to !== null) result += `${salary.from !== null ? 'до' : 'До'} ${salary.to.toLocaleString('ru-RU')} `;
    result += salary.currency === 'RUR' ? '₽' : salary.currency;

    return result;
  };

  // Получаем список регионов России
  const renderMainAreas = () => {
    if (areasLoading || !areas) return <option value="1">Загрузка...</option>;

    // Находим Россию в списке стран
    const russia = areas.find(country => country.name === 'Россия');
    if (!russia) return <option value="1">Москва</option>;

    return russia.areas.map((area) => (
      <option key={area.id} value={area.id}>{area.name}</option>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Поиск вакансий на HeadHunter</h2>
      {/* Форма поиска */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded shadow">
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{formError}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Поисковый запрос</label>
          <div className="flex">
            <input
              type="text"
              name="text"
              value={searchParams.text || ''}
              onChange={handleInputChange}
              className="flex-grow p-2 border rounded-l"
              placeholder="Например: React разработчик"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-r hover:bg-blue-700 whitespace-nowrap"
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? 'Поиск...' : 'Найти вакансии'}
            </button>
          </div>
        </div>

      </form>


      {/* Обработка ошибок */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Ошибка:</strong> {getErrorMessage(error)}
        </div>
      )}

      {/* Отображение результатов */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Загрузка вакансий...</p>
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <div className="mb-4">
            <p>Найдено вакансий: <strong>{data.found.toLocaleString('ru-RU')}</strong></p>
            <p>Страница {(searchParams.page || 0) + 1} из {data.pages}</p>
          </div>


          <div className="flex flex-row gap-4">


            <div>
              <HhAdvancedFilters
                filters={searchParams}
                onFilterChange={handleParamChange}
                areas={areas}
              />
            </div>


            <div className='flex flex-col gap-6'>
              {data.items.map(vacancy => (
                <div key={vacancy.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold">
                    <Link to={`/headhunter/vacancy/${vacancy.id}`} className="text-blue-600 hover:underline">
                      {vacancy.name}
                    </Link>
                  </h3>

                  <div className="flex items-center mt-2">
                    {vacancy.employer.logo_urls?.['90'] && (
                      <img
                        src={vacancy.employer.logo_urls['90']}
                        alt={vacancy.employer.name}
                        className="w-12 h-12 mr-3 object-contain"
                      />
                    )}
                    <a
                      href={vacancy.employer.alternate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:underline"
                    >
                      {vacancy.employer.name}
                    </a>
                  </div>

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

                  <div className="mt-3 text-sm text-gray-500">
                    Опубликовано: {new Date(vacancy.published_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => changePage(-1)}
                  disabled={searchParams.page === 0}
                  className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                >
                  Предыдущая
                </button>
                <button
                  onClick={() => changePage(1)}
                  disabled={(searchParams.page || 0) >= (data.pages - 1)}
                  className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                >
                  Следующая
                </button>
              </div>
              
            </div>
          </div>
        </>
      ) : data?.items && data.items.length === 0 ? (
        <div className="text-center py-8 bg-gray-100 rounded">
          <p className="text-lg">По вашему запросу ничего не найдено</p>
          <p className="text-gray-600 mt-2">Попробуйте изменить параметры поиска</p>
        </div>
      ) : null}
    </div>
  );
};


export default HhJobSearch;
