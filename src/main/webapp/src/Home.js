import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import FriendRequests from "./FriendRequests";

export default function Home() {
    const [friendName, setFriendName] = useState("");
    const [isConnected, setIsConnected] = useState(false); // State to track connection status
    const stompClientRef = useRef(null); // Use ref to persist stompClient across renders

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
            "Authorization": localStorage.getItem("token"),
            "Username": localStorage.getItem("username")
        };

        client.connect(
            headers,
            () => {
                console.log('Connected to WebSocket');
                setIsConnected(true); // Set connection status to true on successful connection
            },
            (error) => {
                console.error('Error connecting to WebSocket', error);
            }
        );

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected from WebSocket');
                });
                stompClientRef.current = null;
                setIsConnected(false); // Set connection status to false on disconnection
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
    };

    const sendFriendRequest = () => {
        if (friendName.trim() && stompClientRef.current) {
            const friendRequest = {
                "sender": localStorage.getItem("username"),
                "receiver": friendName
            };
            stompClientRef.current.send('/app/friendRequest', {}, JSON.stringify(friendRequest));
        }
        setFriendName("");
    };

    const navigate = useNavigate();
    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate("/", { replace: true });
    };

    return (
        <div className="App">
            <div style={{display: "flex", alignItems: "center"}}>
                <label>
                    Send Friend Request:
                    <input type="text" onChange={friendNameChange} value={friendName}/>
                    <input type="button" value="Send" onClick={trySendingFriendRequest}/>
                </label>
            </div>
            {isConnected && <FriendRequests stompClientRef={stompClientRef} />} {/* Render FriendRequests only when connected */}
            <input id="logOut" type="button" onClick={logOut} value="Log-Out"/>
        </div>
    );
}
