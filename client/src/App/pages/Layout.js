import React from 'react';
import {Link, Outlet} from 'react-router-dom'
import './Layout.css'
import userIcon from '../images/user-solid.svg'

 function Layout({user}) {
    return (
        <>
        <header>
            <nav>
                <ul className='nav-links'>
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    <li>
                        <Link to={'/list'}>My List</Link>
                    </li>
                </ul>
            </nav>
            <form className='search-form' method='GET' action='/movie/search'>
                <input type='search' name='title' placeholder='Search...'/>
                <button className='btn header-btn'>Search</button>
            </form>
            <form className='logout-form' method='POST' action='/api/logout'>
                <label>
                    {user.name}
                    <img src={userIcon} alt='' />
                </label>
                <button className='btn btn-outline header-btn'>Logout</button>
            </form>
        </header>
        <Outlet />
        </>
    )
}

export default Layout