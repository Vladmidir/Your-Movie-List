import React, { Children, useEffect, useState } from 'react';
import {createBrowserRouter, RouterProvider, redirect} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Layout from './pages/Layout'
import List from './pages/List'
import Movie from './pages/Movie'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

  async function checkAuth() {
    const authenticated = await (await fetch('/api/authenticated')).status

    console.log(authenticated)

    if (authenticated === 200) {
      return null
    }
      return redirect("/login")
    
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
          element: <Home />
        },
        {
          path: 'movie:id',
          element: <Movie />
        },
        {
          path: "list",
          element: <List />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;
