import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    // Extract the verification token from the URL
    const { verificationToken } = useParams();

    // Set up state to store the verification result message
    const [verificationResult, setVerificationResult] = useState(null);

    // Get the navigation object to redirect the user after verification
    const navigate = useNavigate();

    // When the component mounts, verify the email
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Send a GET request to the backend with the verification token
                const response = await axios.get(`http://localhost:8000/verify/${verificationToken}`);

                // If the verification is successful, display a success message
                if (response.status === 200) {
                    setVerificationResult('Email verified successfully. You will now be redirected to the onboarding page.');

                    // After 3 seconds, redirect to the onboarding page
                    setTimeout(() => {
                        navigate('/onboarding');
                    }, 3000);
                }
            } catch (error) {
                // If the verification fails, display an error message
                if (error.response && error.response.status === 404) {
                    setVerificationResult('Invalid verification link. Please try again.');
                } else {
                    setVerificationResult('An error occurred while verifying your email. Please try again later.');
                }
            }
        };

        // Call the verifyEmail function when the component mounts
        verifyEmail();
    }, [verificationToken, navigate]);

    return (
        <div className="verify-email-container">
            <div className="verification-message">
                {verificationResult && verificationResult.includes('successfully') ? (
                    <p>{verificationResult}</p>
                ) : (
                    <p>Email sent for verification</p>
                )}
            </div>
        </div>
    );

};

export default VerifyEmail;
