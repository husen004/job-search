// filepath: src/components/HhSavedVacancies.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HhVacancy } from '../api/hhApi';

/**
 * Component for displaying and managing saved vacancies
 */
const HhSavedVacancies: React.FC = () => {
  // State for saved vacancies
  const [savedVacancies, setSavedVacancies] = useState<HhVacancy[]>([]);
  
  // Load saved vacancies from localStorage
  useEffect(() => {
    const loadSavedVacancies = () => {
      try {
        const savedData = localStorage.getItem('hh_saved_vacancies');
        if (savedData) {
          setSavedVacancies(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading saved vacancies:', error);
      }
    };
    
    loadSavedVacancies();
  }, []);
  
  // Remove vacancy from saved list
  const removeVacancy = (id: string) => {
    const updatedVacancies = savedVacancies.filter(vacancy => vacancy.id !== id);
    setSavedVacancies(updatedVacancies);
    
    // Update localStorage
    try {
      localStorage.setItem('hh_saved_vacancies', JSON.stringify(updatedVacancies));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };
  
  // Format salary display
  const formatSalary = (salary: { from: number | null; to: number | null; currency: string } | null) => {
    if (!salary) return 'Зарплата не указана';
    
    let result = '';
    if (salary.from !== null) result += `от ${salary.from.toLocaleString('ru-RU')} `;
    if (salary.to !== null) result += `${salary.from !== null ? 'до' : 'До'} ${salary.to.toLocaleString('ru-RU')} `;
    result += salary.currency === 'RUR' ? '₽' : salary.currency;
    
    return result;
  };
  
  // Clear all saved vacancies
  const clearAllSavedVacancies = () => {
    if (window.confirm('Вы уверены, что хотите удалить все сохраненные вакансии?')) {
      setSavedVacancies([]);
      localStorage.removeItem('hh_saved_vacancies');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Сохраненные вакансии</h2>
        
        {savedVacancies.length > 0 && (
          <button
            onClick={clearAllSavedVacancies}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Очистить все
          </button>
        )}
      </div>
      
      {savedVacancies.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-lg mb-4">У вас пока нет сохраненных вакансий</p>
          <Link to="/headhunter" className="text-blue-600 hover:underline">
            Перейти к поиску вакансий
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedVacancies.map((vacancy) => (
            <div key={vacancy.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 relative">
              {/* Remove button */}
              <button
                onClick={() => removeVacancy(vacancy.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                title="Удалить из сохраненных"
              >
                ✕
              </button>
              
              <h3 className="text-xl font-semibold pr-6">
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
                <Link 
                  to={`/headhunter/employer/${vacancy.employer.id}`}
                  className="text-gray-700 hover:underline"
                >
                  {vacancy.employer.name}
                </Link>
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HhSavedVacancies;
