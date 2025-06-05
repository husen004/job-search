import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="underline">Webpack + React + Tailwind + Redux Toolkit</h1>
      <p className="mt-2">Главные паттерны Webpack + современный стек</p>
      <div className="mt-4">
        
      </div>
      <div className="mt-6">
        
      </div>
      <div className="mt-4">
        <Link to="/about" className="text-blue-700 underline">About</Link>
      </div>
    </div>
  );
};

export default Home;