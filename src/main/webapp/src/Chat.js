import { useEffect, useState } from "react";

export default function Chat({ stompClientRef, receiverUsername }) {
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    const messageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        if (message.trim() && stompClientRef.current) {
            const chatMessage = {
                sender: localStorage.getItem("username"),
                receiver: receiverUsername,
                message: message,
            };
            stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));
            setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
            setMessage("");
        }
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/chat/${localStorage.getItem("username")}/${receiverUsername}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": localStorage.getItem("token"),
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setChatMessages(data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();

        const subscription = stompClientRef.current.subscribe(
            `/topic/messages/${localStorage.getItem("username")}/${receiverUsername}`,
            (message) => {
                const receivedMessage = JSON.parse(message.body);
                console.log(receivedMessage);
                setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
        );

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [receiverUsername, stompClientRef]);

    return (
        <div>
            <p>{receiverUsername}</p>
            <div>
                {chatMessages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={messageChange}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
