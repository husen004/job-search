import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './style.css';
import AppRoutes from './routes';

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="container mx-auto">
        <header className="py-4 mb-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Job Search App</h1>          <nav className="mt-2">
            <ul className="flex flex-wrap space-x-4">
              <li><Link to="/" className="text-blue-500 hover:underline">Home</Link></li>
              
             
              
              <li><Link to="/jobs" className="text-blue-500 hover:underline">Job Search</Link></li>
              <li><Link to="/headhunter" className="text-blue-500 hover:underline">HeadHunter</Link></li>
              <li><Link to="/advanced-rtk" className="text-blue-500 hover:underline">RTK Query Demo</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
