import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function Home() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const stompClientRef = useRef(null); // Use ref to persist stompClient across renders

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            document.getElementById("logOut").click();
            return;
        }
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        if(stompClientRef.current) {
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
                client.subscribe(`/topic/messages/${localStorage.getItem("username")}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
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
            }
        };
    }, []);

    const usernameChange = (e) => {
        setUsername(e.target.value);
    };

    const messageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (message.trim() && stompClientRef.current) {
            const chatMessage = {
                "sender": localStorage.getItem("username"),
                "receiver": username,
                "message": message
            };
            stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));
            setMessage("");
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
            <input id="logOut" type="button" onClick={logOut} value="Log-Out" />
            <div id="chat">
                {messages.map((val, index) => (
                    <p key={index}>{val.sender}: {val.message}</p>
                ))}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <label>
                    Enter Username:
                    <input type="text" onChange={usernameChange} value={username} />
                </label>
                <label>
                    Enter Message:
                    <input type="text" onChange={messageChange} value={message} />
                </label>
                <label>
                    <input type="button" value="Send Message" onClick={sendMessage} />
                </label>
            </div>
        </div>
    );
}
