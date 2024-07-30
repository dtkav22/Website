import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import Button from "@mui/material/Button";
import { List, Avatar, ListItem, TextField, ListItemText, ListItemAvatar, Typography } from "@mui/material";

export default function Home() {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);
        const headers = {
            "Authorization": localStorage.getItem("token")
        };

        client.connect(
            headers,
            () => {
                console.log('Connected to WebSocket');
                client.subscribe('/topic/messages', (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            (error) => {
                console.error('Error connecting to WebSocket', error);
            }
        );
        setStompClient(client);

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('Disconnected from WebSocket');
                });
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
        if (message.trim()) {
            const chatMessage = {
                username,
                message
            };
            stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
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
            <input type="button" onClick={logOut} value="Log-Out" />
            <List>
                {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar>{msg.username.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography variant="subtitle1" gutterBottom>{msg.username}</Typography>}
                            secondary={msg.message}
                        />
                    </ListItem>
                ))}
            </List>
            <div style={{ display: "flex", alignItems: "center" }}>
                <TextField id="standard-basic" label="username" variant="standard" value={username} onChange={usernameChange} />
                <TextField id="standard-basic" label="message" variant="standard" value={message} onChange={messageChange} />
                <Button variant="contained" onClick={sendMessage}>Send Message</Button>
            </div>
        </div>
    );
}