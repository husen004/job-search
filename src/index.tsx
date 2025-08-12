import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './styles/index.css';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import ScrollUp from './components/ScrollUp';

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="bg-black">
        <nav className="wrapper">
          <Navbar />        
        </nav>
      </div>
      <main>
        <AppRoutes />
      </main>
      <ScrollUp />
    </BrowserRouter>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
