import Navbar from "../components/Navbar";
import Auth from "../components/Auth";
import {useState} from "react";
import {useCookies} from "react-cookie";

const LandingPage = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken

    const handleClick = () => {
        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div className="cover">
            <Navbar
                authToken={authToken}
                minimal={false}
                setShowModal={setShowModal}
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />
            <div className="home">
                <h1 className="main-title">Meet Students Nearby</h1>
                <button className="main-button" onClick={handleClick}>
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
