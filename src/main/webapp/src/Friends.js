import { useEffect, useState } from "react";
import Chat from "./Chat";
import './Friends.css';

export default function Friends({ newFriend, stompClientRef }) {
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
        if (newFriend) {
            setFriends((prevState) => [...prevState, newFriend]);
            const data = {
                "friendRequestSender": newFriend,
                "acceptor": localStorage.getItem("username")
            };
            stompClientRef.current.send('/app/friendRequestAccepted', {}, JSON.stringify(data));
        }
    }, [newFriend, stompClientRef]);

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
        );
        if (openChat && username !== localStorage.getItem("username")) {
            setChats((prevChats) => [
                ...prevChats,
                <Chat
                    key={prevChats.length}
                    stompClientRef={stompClientRef}
                    receiverUsername={username}
                    closeChat={removeChat}
                />,
            ]);
        } else if (!openChat) {
            setChats(chats.filter(chat => chat.props.receiverUsername !== username));
        }
    };

    const removeChat = (username) => {
        setChats((prevChats) => prevChats.filter(chat => chat.props.receiverUsername !== username));
    };

    const deleteFriend = (username) => {
        fetch(`http://localhost:8080/removeFriend/${localStorage.getItem("username")}/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem("token")}`,
            }
        })
            .then(() => {
                setFriends(prevFriends => prevFriends.filter(friend => friend !== username));
                const data = {
                    exFriend: username,
                    user: localStorage.getItem("username")
                };
                stompClientRef.current.send('/app/removeFriend', {}, JSON.stringify(data));
            })
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        const subscription = stompClientRef.current.subscribe(
            `/topic/removeFriend/${localStorage.getItem("username")}`,
            (username) => {
                setFriends((prevState) => prevState.filter(friend => friend !== username.body));
            }
        );
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [stompClientRef]);

    return (
        <div className="friends-container">
            <div className="friends-header">Friends:</div>
            <div>
                {friends.map((friend, index) => (
                    <div key={index} className="friend-item">
                        <strong>{friend}</strong>
                        <input className="chat-button" type="button" value="Chat" onClick={() => addChat(friend)} />
                        <input className="delete-button" type="button" value="Delete" onClick={() => deleteFriend(friend)} />
                    </div>
                ))}
            </div>
            <div className="chats-container">
                {chats}
            </div>
        </div>
    );
}
