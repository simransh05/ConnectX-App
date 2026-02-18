import React from 'react'
import {Route, Routes , BrowserRouter as Router} from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Messages from './pages/Messages/Messages'
import Notification from './pages/Notification/Notification'
import Profile from './pages/Profile/Profile'
import ROUTES from './constant/Route/route'
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path={ROUTES.SIGNUP} element={<Signup/>}/>
          <Route path={ROUTES.LOGIN} element={<Login/>}/>
          <Route path={ROUTES.HOME} element={<Home/>}/>
          <Route path={ROUTES.ABOUT} element={<About/>}/>
          <Route path={ROUTES.PROFILE} element={<Profile/>}/>
          <Route path={ROUTES.NOTIFICATION} element={<Notification/>}/>
          <Route path={ROUTES.MESSAGES} element={<Messages/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
