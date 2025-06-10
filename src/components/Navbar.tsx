import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='navbar_logo'>
        <h4 className='text-white'>Logo</h4>

        <h2 className='text-white'>Мои Резюме</h2>
        <h2 className='text-white'>Помощь</h2>
      </div>
        <ul className="navbar_ul">
            <li><Link to="/jobs" className="text-white hover:underline">Job Company</Link></li>
            <li><Link to="/headhunter" className="text-white hover:underline">HeadHunter</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar