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
      <div className="wrapper">
        <Link to="/"><h1 className="bg-red-500">Home</h1> </Link>         
          <nav className="mt-2">
            <ul className="">
              <li><Link to="/jobs" className="text-blue-500 hover:underline">Job Company</Link></li>
              <li><Link to="/headhunter" className="text-blue-500 hover:underline">HeadHunter</Link></li>
              <li><Link to="/favorites" className="">Favorites</Link></li>
            </ul>
          </nav>
      </div>
        <main>
          <AppRoutes />
        </main>
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
