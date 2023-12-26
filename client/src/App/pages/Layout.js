import React, { useState } from 'react';
import {Link, Outlet} from 'react-router-dom'
import './page-styles/Layout.css'
import userIcon from '../images/user-solid.svg'
import closeMenuIcon from '../images/icon-menu-close.svg'

 function Layout({user}) {

    const [screenWidth, setScreenWidth] = useState(window.innerWidth)//window width
    
    const [menuOpen, setMenuOpen] = useState(false) //menu status (open, closed)

    //update the width on resize
    React.useEffect(() => {
        function handleResize() {
          setScreenWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
    
        return _ => {
          window.removeEventListener('resize', handleResize)
         }
      })

    //desktop version of the form
    const LogoutForm = () =>
        <form className='logout-form' method='POST' action='/api/logout'>
            <label>
                {user.name}
                <img src={userIcon} alt='' />
            </label>
            <button className='btn btn-outline header-btn'>Logout</button>
        </form>

    //Opens the profile menu (mobile)
    const MenuButton = () => 
        <button className='side-menu-btn' onClick={() => setMenuOpen(true)}>
            <img src={userIcon} alt='open profile' />
        </button>
    //Closes the profile menu (mobile)
    const CloseMenuButton = () => 
        <button className='side-menu-btn' onClick={() => setMenuOpen(false)}>
            <img src={closeMenuIcon} alt='close menu' />
        </button>
    //The profile menu (mobile)
    const SideMenu = () =>
        <div className='side-menu'>
            <form className='logout-form' method='POST' action='/api/logout'>
                <label>
                    {user.name}
                </label>
                <button className='btn btn-outline header-btn'>Logout</button>
            </form>
        </div>

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
            {/* Show desktop or the according mobile menu depending on screen width */}
            {screenWidth <= 900 ? (menuOpen ? <CloseMenuButton /> : <MenuButton />)  : <LogoutForm />} 
            
        </header>
        {/* If the menu is open, show it */}
        {menuOpen && <SideMenu />}
        <Outlet />
        </>
    )
}

export default Layout