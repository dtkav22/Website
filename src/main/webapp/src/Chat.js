import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Chat.css';

export default function Chat({ stompClientRef, receiverUsername, closeChat }) {
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);

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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line from being added
            sendMessage();
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
                setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
            }
        );

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [receiverUsername, stompClientRef]);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <strong>{receiverUsername}</strong>
                <button className="close-chat-button" onClick={() => closeChat(receiverUsername)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <div className="chat-messages" ref={chatMessagesRef}>
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === localStorage.getItem("username") ? 'sent' : ''}`}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={messageChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
