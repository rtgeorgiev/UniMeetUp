import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { verificationToken } = useParams();
    const [verificationResult, setVerificationResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/verify/${verificationToken}`);
                if (response.status === 200) {
                    setVerificationResult('Email verified successfully. You will now be redirected to the onboarding page.');
                    setTimeout(() => {
                        navigate('/onboarding');
                    }, 3000);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setVerificationResult('Invalid verification link. Please try again.');
                } else {
                    setVerificationResult('An error occurred while verifying your email. Please try again later.');
                }
            }
        };

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
