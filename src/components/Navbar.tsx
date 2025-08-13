import React from 'react';
import { Link } from 'react-router-dom';
import homeButton from '../assets/home-button.png';

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='navbar_logo'>
        <Link to={'/'}>
          <img src={homeButton} alt='navbar_icon' />
        </Link>

        <Link to={'/my-resume'}>
          <h2 className='text-white'>Мои Резюме</h2>
        </Link>
        <Link to={'/help'}>
          <h2 className='text-white'>Помощь</h2>
        </Link>
      </div>
      
      <ul className="navbar_ul">
        <li><Link to="/jobs" className="text-white hover:underline">Job Company</Link></li>
        <li><Link to="/headhunter" className="text-white hover:underline">HeadHunter</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;