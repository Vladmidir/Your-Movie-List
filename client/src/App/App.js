import React from 'react';
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Layout from './pages/Layout'
import List from './pages/List'

function App() {


  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home />}/>
        <Route path='/list' element={<List/>} />
      </Route>
    </Routes>
  );
}

export default App;
