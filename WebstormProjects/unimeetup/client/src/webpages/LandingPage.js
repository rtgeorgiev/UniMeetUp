import Navbar from '../components/Navbar'
import Auth from "../components/Auth"
import { useState } from 'react'
import { useCookies } from "react-cookie"

const LandingPage = () => {
    // Use state to manage the modal display and sign up / log in mode
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)

    // Use cookies to store the authentication token
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken

    // Handle the click event on the register / logout button
    const handleLogout = () => {
        // Remove the cookies
        removeCookie('UserId')
        removeCookie('AuthToken')
        // Redirect to the home page
        window.location.href = '/'
    }

    const handleModalDisplay = () => {
        // If the user is not authenticated, show the modal
        if (!authToken) {
            setShowModal(true)
            setIsSignUp(true)
        }
    }

    return (
        <div className="overlay">
            {/* Render the Navbar component */}
            <Navbar
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
            <div className="home">
                <h1 className="primary-title">Meet Students Nearby</h1>
                {/* Render the register / logout button */}
                <button className="primary-button" onClick={authToken ? handleLogout : handleModalDisplay}>
                    {authToken ? 'Log out' : 'Register'}
                </button>
                {/* Render the Auth component if the modal is shown */}
                {showModal && (
                    <Auth setShowModal={setShowModal} isSignUp={isSignUp} />
                )}
            </div>
        </div>
    )
}

export default LandingPage

