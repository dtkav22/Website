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
            const data = {
                "friendRequestSender": newFriend,
                "acceptor": localStorage.getItem("username")
            }
            stompClientRef.current.send('/app/friendRequestAccepted', {}, JSON.stringify(data));
        }
    }, [newFriend]);

    useEffect(() => {
        const subscription = stompClientRef.current.subscribe(
            `/topic/newFriend/${localStorage.getItem("username")}`,
            (request) => {
                setFriends((prevState) => [...prevState, request.body]);
            }
        );
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [stompClientRef]);

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
        } else if(!openChat) {
            setChats(chats.filter(chat => chat.props.receiverUsername !== username));
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