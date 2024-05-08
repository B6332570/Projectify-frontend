import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import { useEffect, useState } from 'react'


/* Page*/
import Signin from './pages/Signin/Signin'
import Signup from './pages/Signin/Signup'
import Project from './pages/Project/Project'
import Task from './pages/Task/Task'


import ResetPasswordPage from './pages/Signin/ResetPasswordPage'

function App() {
  // const [loggedIn, setLoggedIn] = useState(false)
  // const [email, setEmail] = useState('')

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/project" element={<Project/>} />
          <Route path="/project/:projectId/task" component={Task} />

          <Route path="/task" element={<Task/>} />

          
          
          
          
          {/* <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} /> */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* <Route path="/resetpassword" element={<ResetPasswordPage/>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}



export default App