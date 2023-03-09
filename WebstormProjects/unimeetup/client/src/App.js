import LandingPage from './webpages/LandingPage'
import Dashboard from './webpages/Dashboard'
import Signup from './webpages/Signup'
import {BrowserRouter, Route, Routes} from 'react-router-dom'


const App = () => {

  const authToken = false

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          {authToken && <Route path="/dashboard" element={<Dashboard/>}/>}
          {authToken && <Route path="/signup" element={<Signup/>}/>}

        </Routes>
      </BrowserRouter>
  )
}

export default App
