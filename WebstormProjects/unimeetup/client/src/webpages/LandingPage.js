import Navbar from '../components/Navbar'

const LandingPage = () => {

    const authToken = false
    const handleClick = () => {
        console.log('clicked')
    }

    return (
        <>
        <Navbar/>
            <div className="landingpage">
                <h1 className="primary-title">Meet Students Nearby</h1>
                <button className="primary-button" onClick={handleClick}>
                    {authToken ? 'Log out' : 'Register'}
                </button>
        </div>
        </>

    )
}

export default LandingPage