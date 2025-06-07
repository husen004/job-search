import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className=''>
        <h4>Image</h4>
        <ul className="">
            <li><Link to="/jobs" className="text-blue-500 hover:underline">Job Company</Link></li>
            <li><Link to="/headhunter" className="text-blue-500 hover:underline">HeadHunter</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar