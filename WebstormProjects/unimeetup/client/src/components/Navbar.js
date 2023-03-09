import mainLogo from "../pictures/mainlogo.png";
import mainLogo1 from "../pictures/mainlogo1.png"


const Navbar = () => {
    const minimal = true

    return (
        <nav>
            <div className="logo-container">
                <img
                    className="logo"
                    src={minimal ? mainLogo1 : mainLogo}
                    alt="logo"
                />
            </div>
        </nav>
    );
};
export default Navbar;
