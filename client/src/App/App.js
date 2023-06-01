import React, { Children, useEffect, useState, useRef} from 'react';
import {createBrowserRouter, RouterProvider, redirect} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Layout from './pages/Layout'
import List from './pages/List'
import Movie from './pages/Movie'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

  const [user,setUser] = useState({id: "", name: ""})

  async function checkAuth() {
    const authenticated =  await fetch('/api/authenticated', {credentials: 'include'})

    if (authenticated.status === 200) {
      //if the user is authenticated, record the user data (id and name)

      authenticated.json().then((data) => { 
        if(data.id !== user.id) {
          setUser(data)
        }})
      return null
    }
      return redirect("/login")
    
  }

  /**
   * Redirect to homepage if authenticated tries to login/register
   */
  async function checkNotAuth() {
    const authenticated =  await fetch('/api/authenticated', {credentials: 'include'})

    if (authenticated.status === 200) {
      return redirect("/")
    }
      return null
    
  }

  //add `errorElement: <ErrorPage />` to each route
  const router = createBrowserRouter([
    {
      path: "/",
      loader: checkAuth,
      element: <Layout />,
      children: [
        {
          path: '',
          element: <Home user={user} />
        },
        {
          path: 'movie/:id',
          element: <Movie />
        },
        {
          path: 'movie/search',
          element: <Search />
        },
        {
          path: "list",
          element: <List />
        }
      ]
    },
    {
      path: "/login",
      loader: checkNotAuth,
      element: <Login />
    },
    {
      path: "/register",
      loader: checkNotAuth,
      element: <Register />
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;
