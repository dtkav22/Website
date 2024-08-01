import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import Chat from "./Chat";

export default function Home() {
    const [chats, setChats] = useState([]);
    const [username, setUsername] = useState("");
    const stompClientRef = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            document.getElementById("logOut").click();
            return;
        }

        if (stompClientRef.current) {
            return;
        }

        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        stompClientRef.current = client;

        const headers = {
            Authorization: localStorage.getItem("token"),
            Username: localStorage.getItem("username"),
        };

        client.connect(
            headers,
            () => {
                console.log("Connected to WebSocket");
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
            }
        };
    }, []);

    const usernameChange = (e) => {
        setUsername(e.target.value);
    };

    const showChats = () => {
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
            <div>
                <label>
                    Enter Username:
                    <input type="text" onChange={usernameChange} value={username} />
                </label>
                <label>
                    <input type="button" value="Chat" onClick={showChats} />
                </label>
                <div id="Chats">
                    {chats}
                </div>
            </div>
        </div>
    );
}
