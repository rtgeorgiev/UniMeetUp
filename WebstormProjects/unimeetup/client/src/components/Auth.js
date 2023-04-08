import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'


const Auth = ({ setShowModal,  isSignUp, errorMessage }) => {
    // State variables to hold user input for email, password, and confirmPassword
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    // State variable to hold any errors during authentication
    const [error, setError] = useState(null)
    // Hook to manage cookies
    const [ cookies, setCookie, removeCookie ] = useCookies(null)

    // Hook to navigate to different pages
    let navigate = useNavigate()

    // Console logging email, password, and confirmPassword for debugging
    console.log(email, password, confirmPassword)

    // Function to close modal window
    const handleClick = () => {
        setShowModal(false);
    }

    // Function to handle authentication form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if passwords match for signup
            if (isSignUp && password !== confirmPassword) {
                setError("Passwords do not match!");
                return;
            }

            // Make a POST request to the backend to authenticate user
            const response = await axios.post(
                `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
                { email, password }
            );

            // Set cookies for user authentication
            setCookie("AuthToken", response.data.token);
            setCookie("UserId", response.data.userId);

            // Check if the authentication was successful and redirect the user accordingly
            const success = response.status === 201;

            if (success && isSignUp) {
                // Navigate to verify page if signup is successful
                navigate(`/verify/$verificationToken}`);
            } else if (success && !isSignUp) {
                // Navigate to dashboard if login is successful
                navigate("/dashboard");
            }

            // Reload the page to update the state of the app
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError("Email already exists. Please use a different email.");
            } else {
                console.log(error);
            }
        }
    };

    return (
        <div className="auth">
            <div className="close-icon" onClick={handleClick}>ⓧ</div>

            <h2>{isSignUp ? 'REGISTER': 'LOG IN'}</h2>
            <p>By registering, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    //pattern="^[^@\s]+@[^\s.]+\.ac\.uk$" // only allow valid university email addresses
                    required={true}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        const input = e.target;
                        if (input.validity.patternMismatch) {
                            input.setCustomValidity("Enter a valid university email matching the format `username@university.ac.uk`");
                        } else {
                            input.setCustomValidity("");
                        }
                    }}
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && <input
                    type="password"
                    id="password-check"
                    name="password-check"
                    placeholder="confirm password"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
            </form>
            <hr/>
            <h2>Meet students nearby ®</h2>
        </div>
    )
}
export default Auth
