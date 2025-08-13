// Application routes configuration
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import Home from './components/Home';
import HhVacancyDetail from './components/HhVacancyDetail';
import HhDashboard from './components/HhDashboard';
import HhSavedVacancies from './components/HhSavedVacancies'; 
import HhVacancyApply from './components/HhVacancyApply';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/headhunter" element={<HhDashboard />} />
      <Route path="/jobs" element={<Company />} />
      <Route path="/headhunter/vacancy/:id" element={<HhVacancyDetail />} /> 
      <Route path='/headhunter/vacancy/apply/:id' element={<HhVacancyApply />} />
    </Routes>
  );
};

export default AppRoutes;
