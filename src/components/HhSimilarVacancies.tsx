// filepath: src/components/HhSimilarVacancies.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useGetSimilarVacanciesQuery, HhVacancy } from '../api/hhApi';
import Loading from './Loading';

interface SimilarVacanciesProps {
  vacancyId: string;
}

/**
 * Component to display similar vacancies based on a reference vacancy
 */
const HhSimilarVacancies: React.FC<SimilarVacanciesProps> = ({ vacancyId }) => {
  const { data, isLoading, error } = useGetSimilarVacanciesQuery(vacancyId);
  
  // Format salary display
  const formatSalary = (salary: { from: number | null; to: number | null; currency: string } | null) => {
    if (!salary) return 'Зарплата не указана';
    
    let result = '';
    if (salary.from !== null) result += `от ${salary.from.toLocaleString('ru-RU')} `;
    if (salary.to !== null) result += `${salary.from !== null ? 'до' : 'До'} ${salary.to.toLocaleString('ru-RU')} `;
    result += salary.currency === 'RUR' ? '₽' : salary.currency;
    
    return result;
  };
  
  if (isLoading) {
    return <Loading message="Загрузка похожих вакансий..." />;
  }
  
  if (error || !data || data.items.length === 0) {
    return null;
  }
  
  // Take only first 3 similar vacancies
  const similarVacancies = data.items.slice(0, 3);
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Похожие вакансии</h3>
      <div className="space-y-3">
        {similarVacancies.map((vacancy: HhVacancy) => (
          <div key={vacancy.id} className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-400">
            <Link to={`/headhunter/vacancy/${vacancy.id}`} className="text-blue-600 hover:underline font-medium">
              {vacancy.name}
            </Link>
            
            <div className="flex items-center mt-2 text-sm">
              <span className="text-gray-700">{vacancy.employer.name}</span>
              <span className="mx-2">•</span>
              <span>{vacancy.area.name}</span>
            </div>
            
            <div className="mt-2 text-green-600">{formatSalary(vacancy.salary)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HhSimilarVacancies;
