import { useState } from 'react'
import axios from 'axios'

const ChatInput = ({ user, clickedUser, getUserMessages, getClickedUsersMessages }) => {
    const [textArea, setTextArea] = useState("")
    const [showBlockMessage, setShowBlockMessage] = useState(false)
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id
    // IDs of blocking and blocked users
    const blockingUserId = user?.user_id
    const blockedUserId = clickedUser?.user_id
    // Array of icebreaker questions
    const [questions] = useState([
        "What's your favorite book or movie?",
        "What's the most interesting place you've ever traveled to?",
        "If you could have dinner with any historical figure, who would it be and why?",
        "What's your favorite hobby or pastime?",
        "If you could switch places with someone for a day, who would it be and why?",
        "What's the best piece of advice you've ever received?",
        "If you could have any superpower, what would it be and why?",
        "What's the most exciting thing you've ever done?",
        "If you could relive any moment in your life, what would it be and why?",
        "What's your favorite thing to do on a lazy Sunday?"
    ]);
    // Sending a message in the chat
    const addMessage = async () => {
        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message: textArea
        }

        try {
            await axios.post('http://localhost:8000/message', { message })
            getUserMessages()
            getClickedUsersMessages()
            setTextArea("")
        } catch (error) {
            console.log(error)
        }
    }
    // Blocking a user
    const blockUser = async () => {
        try {
            await axios.post('http://localhost:8000/block', {
                blockingUserId: blockingUserId, blockedUserId: blockedUserId }
            )
            setShowBlockMessage(true)
            setTimeout(() => setShowBlockMessage(false), 5000);
        } catch (error) {
            console.log(error)
        }
    }
    // Get a random icebreaker question and set it as the text area value
    const handleIcebreaker = () => {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        setTextArea(randomQuestion);
    };

    // Render the chat input component
    return (
        <div className="chat-input">
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="secondary-button" onClick={addMessage}>Submit</button>
            <button className="secondary-button" onClick={handleIcebreaker}>Get an icebreaker question!</button>
            <button className='secondary-button' onClick={blockUser}>Block User</button>
            {showBlockMessage && <p>User successfully blocked</p>}
        </div>
    )
}
export default ChatInput