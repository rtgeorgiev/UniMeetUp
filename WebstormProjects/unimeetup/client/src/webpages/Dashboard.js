import TinderCard from 'react-tinder-card';
import { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [genderedUsers, setGenderedUsers] = useState(null);
    const [lastDirection, setLastDirection] = useState();
    const [cookies] = useCookies(['user']);

    const userId = cookies.UserId;

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: { userId },
            });
            setUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/gendered-users', {
                params: { gender: user?.gender_interest },
            });
            setGenderedUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            getGenderedUsers();
        }
    }, [user]);

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId,
            });
            getUser();
        } catch (err) {
            console.log(err);
        }
    };

    // Define two separate functions for swiping and modal display
    const handleSwipe = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId);
        }
        setLastDirection(direction);
    };

    const handleOutOfFrame = (name) => {
        console.log(name + ' left the screen!');
    };

    // Combine user's own matches and the current user ID into one array
    const matchedUserIds = user?.matches.map(({ user_id }) => user_id).concat(userId);

    // Filter out gendered users that have already been matched
    const filteredGenderedUsers = genderedUsers?.filter(
        (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
    );

    return (
        <>
            {user && (
                <div className="dashboard">
                    <ChatContainer user={user} />
                    <div className="swipe-container">
                        <div className="card-container">
                            {filteredGenderedUsers?.map((genderedUser) => (
                                <TinderCard
                                    className="swipe"
                                    key={genderedUser.user_id}
                                    onSwipe={(dir) => handleSwipe(dir, genderedUser.user_id)}
                                    onCardLeftScreen={() => handleOutOfFrame(genderedUser.first_name)}
                                >
                                    <div
                                        style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
                                        className="card"
                                    >
                                        <h3>{genderedUser.first_name}</h3>
                                        <h4>{genderedUser.university}</h4>
                                        <h5>{genderedUser.course + ', Stage ' + genderedUser.year_of_study}</h5>
                                        <p>{genderedUser.about}</p>
                                    </div>
                                </TinderCard>
                            ))}
                            <div className="swipe-info">
                                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
                            </div>
                        </div>
                    </div>
                </div
                >)}
        </>
    )
}
export default Dashboard
