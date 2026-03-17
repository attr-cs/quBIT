// import { useEffect, useState } from 'react'

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { useUserStore } from './store/authStore'
import './App.css'
import WorkspacesListPage from './pages/WorkspacesListPage'
import WorkspacePage from './pages/WorkspacePage'



function App() {


  const isAuth = useUserStore((state)=> state.isAuthenticated);
  // const username = useUserStore((state)=> state.user?.username);
  return (
    <>
        <BrowserRouter>
      {/* <MainLayout> */}
      {/* current user: {username} */}
          <Routes>
            {/* PUBLIC ROUTES */}

            <Route path='/login' 
              element={!isAuth? <LoginPage/>: <Navigate to="/workspaces" replace/>}/>
            <Route path='/register'
              element={!isAuth? <RegisterPage/>: <Navigate to="/workspaces" replace/>}/>


            {/* PROTECTED ROUTES */}

            <Route path='/workspaces' 
              element={isAuth? <WorkspacesListPage/>: <Navigate to="/login" replace/> }/>
            <Route path='/workspace/:id' 
              element={isAuth? <WorkspacePage/>: <Navigate to="/login" replace/> }/>

            {/* Fallback */}
            <Route path='*' 
              element={<Navigate to={isAuth? "/workspaces" : "/login"} replace/> }/>

      
          </Routes>
      {/* </MainLayout> */}
        </BrowserRouter>
      
    </>
  )
}



export default App
