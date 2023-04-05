import Chat from './Chat'
import ChatInput from './ChatInput'
import axios from 'axios'
import {useState, useEffect} from "react"

const ChatDisplay = ({ user , clickedUser }) => {
    // Store the user IDs of the current user and the clicked user in variables
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id
    // Use state to keep track of the messages sent between the two users
    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    // Get messages sent between the two users
    const getUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId: userId, correspondingUserId: clickedUserId}
            })
            setUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getClickedUsersMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/messages', {
                params: { userId: clickedUserId , correspondingUserId: userId}
            })
            setClickedUsersMessages(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    // Use useEffect to run the above functions when the component mounts
    useEffect(() => {
        getUsersMessages()
        getClickedUsersMessages()
    }, [])

    // Initialize an empty array to store formatted messages
    const messages = []

    // Iterate over the messages sent by the current user and format them
    usersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = user?.first_name
        formattedMessage['img'] = user?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    // Iterate over the messages sent by the clicked user and format them
    clickedUsersMessages?.forEach(message => {
        const formattedMessage = {}
        formattedMessage['name'] = clickedUser?.first_name
        formattedMessage['img'] = clickedUser?.url
        formattedMessage['message'] = message.message
        formattedMessage['timestamp'] = message.timestamp
        messages.push(formattedMessage)
    })

    // Sort the messages in descending order based on timestamp
    const descendingOrderMessages = messages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))

    // Render the Chat and ChatInput components with the formatted messages and user information
    return (
        <>
            <Chat descendingOrderMessages={descendingOrderMessages}/>
            <ChatInput
                user={user}
                clickedUser={clickedUser} getUserMessages={getUsersMessages} getClickedUsersMessages={getClickedUsersMessages}/>
        </>
    )

}

export default ChatDisplay
