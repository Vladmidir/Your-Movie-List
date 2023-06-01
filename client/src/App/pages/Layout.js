import React from 'react';
import {Link, Outlet} from 'react-router-dom'
import './Layout.css'

 function Layout() {
    return (
        <>
        <nav>
            <ul>
                <li>
                    <Link to={'/'}>Home</Link>
                </li>
                <li>
                    <Link to={'/list'}>List</Link>
                </li>
            </ul>
            <form method='GET' action='/movie/search'>
                <input type='search' name='title' id='search-title' placeholder='Search...'/>
                <button>Search</button>
            </form>
            <form className='logout-button' method='POST' action='/api/logout'><button>Logout</button></form>
        </nav>
        <Outlet />
        </>
    )
}

export default Layout