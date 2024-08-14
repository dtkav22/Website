import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import FriendRequests from "./FriendRequests";
import './Home.css';

export default function Home() {
    const [friendName, setFriendName] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            document.getElementById("logOut").click();
            return;
        }
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        if (stompClientRef.current) {
            return;
        }
        stompClientRef.current = client;

        const headers = {
            Authorization: localStorage.getItem("token"),
            Username: localStorage.getItem("username"),
        };

        client.connect(
            headers,
            () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);
            },
            (error) => {
                console.error("Error connecting to WebSocket", error);
            }
        );

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => {
                    console.log("Disconnected from WebSocket");
                });
                stompClientRef.current = null;
                setIsConnected(false);
            }
        };
    }, []);

    const friendNameChange = (e) => {
        setFriendName(e.target.value);
    };

    const trySendingFriendRequest = () => {
        fetch(`http://localhost:8080/request/${localStorage.getItem("username")}/${friendName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
                if (message === "Friend request sent") sendFriendRequest();
            })
            .catch(error => console.error('Error:', error));
        setFriendName("");
    };

    const sendFriendRequest = () => {
        if (friendName.trim() && stompClientRef.current) {
            const friendRequest = {
                "username1": localStorage.getItem("username"),
                "username2": friendName
            };
            stompClientRef.current.send('/app/friendRequest', {}, JSON.stringify(friendRequest));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default action (e.g., form submission)
            trySendingFriendRequest();
        }
    };

    const navigate = useNavigate();
    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate("/", { replace: true });
    };

    return (
        <div className="App">
            <h1>Username: {localStorage.getItem("username")}</h1>
            <div className="friend-request-container">
                <label>
                    Send Friend Request:
                    <input
                        type="text"
                        onChange={friendNameChange}
                        value={friendName}
                        onKeyDown={handleKeyDown}
                    />
                    <input
                        className="send-button"
                        type="button"
                        value="Send"
                        onClick={trySendingFriendRequest}
                    />
                </label>
            </div>
            {isConnected && <FriendRequests stompClientRef={stompClientRef} />}
            <input id="logOut" className="logout-button" type="button" onClick={logOut} value="Log-Out" />
        </div>
    );
}
