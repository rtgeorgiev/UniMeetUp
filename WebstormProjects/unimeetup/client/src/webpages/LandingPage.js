import Navbar from '../components/Navbar'
import {useState} from "react";
import Auth from '../components/Auth'

const LandingPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const authToken = false
    const handleClick = () => {
        console.log('clicked')
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div classname="overlay">
        <Navbar
            authToken={authToken}
            minimal={false}
            setShowModal={setShowModal}
            showModal={showModal}
            setIsSignUp={setIsSignUp}
        />
            <div className="landingpage">
                <h1 className="primary-title">Meet Students Nearby</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? 'Log out' : 'Register'}
                </button>

                {showModal && (
                    <Auth setShowModal={setShowModal} isSignUp={isSignUp}/>
                )}

        </div>
        </div>

    )
}

export default LandingPage