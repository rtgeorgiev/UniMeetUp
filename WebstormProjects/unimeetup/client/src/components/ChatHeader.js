import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

const ChatHeader = ({ user }) => {
    // Get the cookies and functions for setting and removing cookies
    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])
    // Get the navigate function from the react-router-dom library
    const navigate = useNavigate()

    // Function to log the user out and redirect to the home page
    const logout = () => {
        // Remove the UserId and AuthToken cookies
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        // Navigate to the home page
        navigate('/')
    }

    return (
        <div className="chat-container-header">
            <div className="profile">
                <div className="img-container">
                    <img src={user.url} alt={"photo of " + user.first_name}/>
                </div>
                <h3>{user.first_name}</h3>
            </div>
            {/* Icon for logging out, on click run logout function */}
            <i className="log-out-icon" onClick={logout}>⇦</i>
        </div>
    )
}

export default ChatHeader
