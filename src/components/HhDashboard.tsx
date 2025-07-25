// filepath: src/components/HhDashboard.tsx
import React, { useState } from 'react';
import { useSearchEmployersQuery } from '../api/hhApi';
import HhJobSearch from './HhJobSearch';
import HhEmployers from './HhEmployers';
import HhSavedVacancies from './HhSavedVacancies';



/**
 * Dashboard component for HeadHunter integration
 * Acts as a container for HeadHunter related features and navigation
 */
const HhDashboard: React.FC = () => {
  // Use state to track active tab instead of routes
  const [activeTab, setActiveTab] = useState('search');
  
  const [employerSearch, setEmployerSearch] = useState('');
  const [showEmployerSearch, setShowEmployerSearch] = useState(false);

  // Define tabs with state values instead of paths
  const tabs = [
    { id: 'search', label: 'Поиск вакансий' },
    { id: 'employers', label: 'Работодатели' },
    { id: 'saved', label: 'Сохраненные вакансии' },
  ];

  // Lazy load employer search results
  const { data: employers, isFetching } = useSearchEmployersQuery(
    { text: employerSearch, per_page: 5 },
    { skip: !showEmployerSearch || employerSearch.length < 3 }
  );

  // Handle employer search submission
  const handleEmployerSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employerSearch.length > 0) {
      setShowEmployerSearch(true);
    }
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <HhJobSearch />;
      case 'employers':
        return <HhEmployers />;
      case 'saved':
        return <HhSavedVacancies />;
      default:
        return <HhJobSearch />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-3 sm:mb-0">HeadHunter Job Search</h1>

        {/* Quick search for employers */}
        <div className="w-full sm:w-auto">
          <form onSubmit={handleEmployerSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Поиск компаний..."
              className="p-2 border rounded-l flex-grow"
              value={employerSearch}
              onChange={(e) => {
                setEmployerSearch(e.target.value);
                if (e.target.value.length >= 3) {
                  setShowEmployerSearch(true);
                } else {
                  setShowEmployerSearch(false);
                }
              }}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r"
              disabled={isFetching}
            >
              {isFetching ? '...' : 'Найти'}
            </button>
          </form>

          {/* Employer search results dropdown */}
          {showEmployerSearch && employers && employers.items && employers.items.length > 0 && (
            <div className="absolute bg-white border shadow-lg rounded-md mt-1 z-10 w-64">
              <div className="p-2 border-b text-sm font-medium">Найдено компаний: {employers.found}</div>
              <ul>
                {employers.items.map(employer => (
                  <li key={employer.id} className="hover:bg-gray-50">
                    <button
                      className="block p-2 text-blue-600 hover:underline w-full text-left"
                      onClick={() => {
                        setActiveTab('employers');
                        setShowEmployerSearch(false);
                        // You may want to pass the employer ID to the Employers component
                      }}
                    >
                      {employer.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b mb-6">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Render the active tab content */}
      {renderTabContent()}
    </div>
  );
};

export default HhDashboard;
