// Application routes configuration
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import Home from './components/Home';
import About from './components/About';
import HhJobSearch from './components/HhJobSearch';
import HhVacancyDetail from './components/HhVacancyDetail';
import HhDashboard from './components/HhDashboard';
import HhEmployerDetail from './components/HhEmployerDetail';
import HhSavedVacancies from './components/HhSavedVacancies';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/headhunter" element={<HhDashboard />}>
        <Route index element={<HhJobSearch />} />
        <Route path="saved" element={<HhSavedVacancies />} />
        <Route path="employer/:id" element={<HhEmployerDetail />} />
        <Route path="vacancy/:id" element={<HhVacancyDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
