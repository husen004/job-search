import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => (
  <div className="p-4">
    <h2 className="text-xl font-semibold">About</h2>
    <p className="mt-2">React Router работает!</p>
    
    <div className="mt-6 mb-4">
      
    </div>
    
    <Link to="/" className="text-blue-700 underline">Home</Link>
  </div>
);


export default About;