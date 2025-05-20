// Application routes configuration
import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Components
import Home from './components/Home';
import About from './components/About';
import AdvancedPosts from './components/AdvancedPosts';
import PostsManager from './components/PostsManager';
import JobSearch from './components/JobSearch';
import AdvancedRtkQueryDemo from './components/AdvancedRtkQueryDemo';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/advanced" element={<AdvancedPosts />} />
      <Route path="/manage" element={<PostsManager />} />
      <Route path="/jobs" element={<JobSearch />} />
      <Route path="/advanced-rtk" element={<AdvancedRtkQueryDemo />} />
    </Routes>
  );
};

export default AppRoutes;

export default AppRoutes;

export default AppRoutes;
