import {useEffect, useState} from "react";
import Chat from "./Chat";
export default function Friends({newFriend, stompClientRef}){
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8080/friends/${localStorage.getItem("username")}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setFriends(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);
    useEffect(() => {
        if(newFriend) {
            setFriends((prevState) => [...prevState, newFriend]);
        }
    }, [newFriend]);

    useEffect(() => {
        setChats([]);
    }, []);

    const addChat = (username) => {
        const openChat = chats.reduce(
            (previousValue, chat) => {
                return previousValue && (chat.props.receiverUsername !== username);
            },
            true
        )
        if(openChat && username !== localStorage.getItem("username")) {
            setChats((prevChats) => [
                ...prevChats,
                <Chat
                    key={prevChats.length}
                    stompClientRef={stompClientRef}
                    receiverUsername={username}
                />,
            ]);
        }
    }
    return (
        <div>
            <p>Friends:</p>
            {friends.map((friend, index) => (
                <p key={index}>
                    <strong>{friend}</strong>
                    <input type="button" value="Chat" onClick={() => addChat(friend)}/>
                </p>
            ))}
            <div id={"Chats"}>
                {chats}
            </div>
        </div>
    );
}