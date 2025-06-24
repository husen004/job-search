// filepath: src/components/HhAdvancedFilters.tsx
import React from 'react';
import { HH_EXPERIENCE, HH_SCHEDULE, HH_EMPLOYMENT } from '../api/hhApi';

interface AdvancedFiltersProps {
  filters: any;
  onFilterChange: (name: string, value: any) => void;
  areas: any[] | undefined;
}

/**
 * Component for advanced filtering options in job search
 */
const HhAdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  filters, 
  onFilterChange,
  areas
}) => {
  // Get relevant area options for select element
  const renderAreaOptions = () => {
    if (!areas) return <option value="1">Москва</option>;
    
    // Find Russia in the list of countries
    const russia = areas.find(country => country.name === 'Россия');
    if (!russia) return <option value="1">Москва</option>;
    
    return (
      <>
        <option value="">Вся Россия</option>
        {russia.areas.map(area => (
          <option key={area.id} value={area.id}>{area.name}</option>
        ))}
      </>
    );
  };
  
  // Handle salary input change
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
    onFilterChange('salary', value);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-xl font-semibold mb-4 text-nowrap">Расширенные фильтры</h3>
      
      <div className="flex flex-col justify-start gap-4 mx-4">
        {/* Region selection */}
        <div>
          <label className="block mb-1 text-sm font-medium">Регион</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.area || ''}
            onChange={(e) => onFilterChange('area', e.target.value)}
          >
            {renderAreaOptions()}
          </select>
        </div>
        
        {/* Salary filter */}
        <div>
          <label className="block mb-1 text-sm font-medium">Зарплата от</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Например: 80000"
            value={filters.salary || ''}
            onChange={handleSalaryChange}
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="only_with_salary"
              className="mr-2"
              checked={filters.only_with_salary || false}
              onChange={(e) => onFilterChange('only_with_salary', e.target.checked)}
            />
            <label htmlFor="only_with_salary" className="text-sm">Только с указанной зарплатой</label>
          </div>
        </div>
        
        {/* Experience filter */}
        <div>
          <label className="block mb-1 text-sm font-medium">Опыт работы</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.experience || ''}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          >
            <option value="">Любой опыт</option>
            <option value={HH_EXPERIENCE.noExperience}>Нет опыта</option>
            <option value={HH_EXPERIENCE.between1And3}>От 1 года до 3 лет</option>
            <option value={HH_EXPERIENCE.between3And6}>От 3 до 6 лет</option>
            <option value={HH_EXPERIENCE.moreThan6}>Более 6 лет</option>
          </select>
        </div>
        
        {/* Employment type filter */}
        <div>
          <label className="block mb-1 text-sm font-medium">Тип занятости</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.employment || ''}
            onChange={(e) => onFilterChange('employment', e.target.value)}
          >
            <option value="">Любой тип занятости</option>
            <option value={HH_EMPLOYMENT.full}>Полная занятость</option>
            <option value={HH_EMPLOYMENT.part}>Частичная занятость</option>
            <option value={HH_EMPLOYMENT.project}>Проектная работа</option>
            <option value={HH_EMPLOYMENT.probation}>Стажировка</option>
            <option value={HH_EMPLOYMENT.volunteer}>Волонтерство</option>
          </select>
        </div>
        
        {/* Schedule type filter */}
        <div>
          <label className="block mb-1 text-sm font-medium">График работы</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.schedule || ''}
            onChange={(e) => onFilterChange('schedule', e.target.value)}
          >
            <option value="">Любой график</option>
            <option value={HH_SCHEDULE.fullDay}>Полный день</option>
            <option value={HH_SCHEDULE.shift}>Сменный график</option>
            <option value={HH_SCHEDULE.flexible}>Гибкий график</option>
            <option value={HH_SCHEDULE.remote}>Удаленная работа</option>
            <option value={HH_SCHEDULE.flyInFlyOut}>Вахтовый метод</option>
          </select>
        </div>
        
        {/* Period filter */}
        <div>
          <label className="block mb-1 text-sm font-medium">Период публикации</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.period || ''}
            onChange={(e) => onFilterChange('period', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">За все время</option>
            <option value="1">За сутки</option>
            <option value="3">За 3 дня</option>
            <option value="7">За неделю</option>
            <option value="30">За месяц</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default HhAdvancedFilters;