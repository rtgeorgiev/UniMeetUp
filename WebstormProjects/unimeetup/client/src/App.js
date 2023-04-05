import LandingPage from './webpages/LandingPage'
import Dashboard from './webpages/Dashboard'
import Onboarding from './webpages/Onboarding'
import VerifyEmail from './webpages/VerifyEmail'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useCookies} from 'react-cookie'

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const authToken = cookies.AuthToken

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                {authToken && <Route path="/onboarding" element={<Onboarding/>}/>}
                {authToken && <Route path="/dashboard" element={<Dashboard/>}/>}
                <Route path="/verify/:verificationToken" element={<VerifyEmail/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
