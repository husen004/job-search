// Application routes configuration
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import Home from './components/Home';
import About from './components/About';
import HhJobSearch from './components/HhJobSearch';
import HhVacancyDetail from './components/HhVacancyDetail';
import HhDashboard from './components/HhDashboard';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/headhunter" element={<HhDashboard />}>
        <Route index element={<HhJobSearch />} />
        <Route path="vacancy/:id" element={<HhVacancyDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
