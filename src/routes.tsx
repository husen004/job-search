import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Home from './pages/Home';
import HhVacancyDetail from './components/HhVacancyDetail';
import HhDashboard from './components/HhDashboard';
import HhVacancyApply from './components/HhVacancyApply';
import Company from './pages/Company';
import Resume from './pages/Resume';
import Support from './pages/Support';
import CompanyInformation from './pages/CompanyInformation';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Support />} />
      <Route path="/jobs" element={<Company />} />
      <Route path="/my-resume" element={<Resume />} />
      <Route path="/jobs" element={<Company />} />
      <Route path="/jobs/:id" element={<CompanyInformation />} />
      <Route path="/headhunter" element={<HhDashboard />} />
      <Route path="/headhunter/vacancy/:id" element={<HhVacancyDetail />} /> 
      <Route path='/headhunter/vacancy/apply/:id' element={<HhVacancyApply />} />
    </Routes>
  );
};

export default AppRoutes;
