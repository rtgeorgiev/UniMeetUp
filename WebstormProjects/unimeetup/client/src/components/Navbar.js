import mainLogo from "../pictures/mainlogo.png";
import mainLogo1 from "../pictures/mainlogo1.png"


const Navbar = ({ authToken, minimal, setShowModal, showModal, setIsSignUp, errorMessage }) => {
    const handleClick = () => {
        setShowModal(true);
        setIsSignUp(false);
    };

    return (
        <nav>
            <div className="logo-container">
                <img
                    className="logo"
                    src={minimal ? mainLogo1 : mainLogo}
                    alt="logo"
                />
            </div>
            {!authToken && !minimal && (
                <button
                    className="nav-button"
                    onClick={handleClick}
                    disabled={showModal}
                >
                    Log in
                </button>
            )}
        </nav>
    );
};
export default Navbar;
