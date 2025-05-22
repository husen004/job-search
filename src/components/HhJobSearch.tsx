// Компонент для поиска вакансий через HeadHunter API
import React, { useState } from 'react';
import { 
  useSearchVacanciesQuery, 
  useGetAreasQuery, 
  HhSearchParams, 
  HH_EXPERIENCE, 
  HH_SCHEDULE 
} from '../api/hhApi';
import { getErrorMessage } from '../api/baseApi';
import Loading from './Loading';
import Error from './Error';

const HhJobSearch: React.FC = () => {
  // Состояние для параметров поиска
  const [searchParams, setSearchParams] = useState<HhSearchParams>({
    text: '',
    area: '1', // По умолчанию Москва
    only_with_salary: true,
    page: 0,
    per_page: 10
  });
  
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
    refetch();
  };
  
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
    
    return russia.areas.map(area => (
      <option key={area.id} value={area.id}>{area.name}</option>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Поиск вакансий на HeadHunter</h2>
      
      {/* Форма поиска */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Поисковый запрос</label>
            <input
              type="text"
              name="text"
              value={searchParams.text || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Например: React разработчик"
            />
          </div>
          
          <div>
            <label className="block mb-1">Регион</label>
            <select
              name="area"
              value={searchParams.area || '1'}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              {renderMainAreas()}
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Опыт работы</label>
            <select
              name="experience"
              value={searchParams.experience || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Любой опыт</option>
              <option value={HH_EXPERIENCE.noExperience}>Нет опыта</option>
              <option value={HH_EXPERIENCE.between1And3}>От 1 года до 3 лет</option>
              <option value={HH_EXPERIENCE.between3And6}>От 3 до 6 лет</option>
              <option value={HH_EXPERIENCE.moreThan6}>Более 6 лет</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">График работы</label>
            <select
              name="schedule"
              value={searchParams.schedule || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Любой график</option>
              <option value={HH_SCHEDULE.fullDay}>Полный день</option>
              <option value={HH_SCHEDULE.shift}>Сменный график</option>
              <option value={HH_SCHEDULE.flexible}>Гибкий график</option>
              <option value={HH_SCHEDULE.remote}>Удаленная работа</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="only_with_salary"
              checked={searchParams.only_with_salary || false}
              onChange={handleInputChange}
              id="only_with_salary"
              className="mr-2"
            />
            <label htmlFor="only_with_salary">Только с указанной зарплатой</label>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={isLoading || isFetching}
        >
          {isLoading || isFetching ? 'Поиск...' : 'Найти вакансии'}
        </button>
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
          
          <div className="space-y-4">
            {data.items.map(vacancy => (
              <div key={vacancy.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                <h3 className="text-xl font-semibold">
                  <a href={vacancy.alternate_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {vacancy.name}
                  </a>
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
          </div>
          
          {/* Пагинация */}
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
