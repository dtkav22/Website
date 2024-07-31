import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export default function Home() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [username, setUsername] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // WebSocket setup
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                client.subscribe(`/topic/notifications/${username}`, (message) => {
                    displayNotification(message.body);
                });
            },
            onStompError: (frame) => {
                console.error(frame);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [username]);

    const displayNotification = (message) => {
        setNotifications((prevNotifications) => [...prevNotifications, message]);
    };

    const handleSendRequest = () => {
        if (username.trim()) {
            fetch(`http://localhost:8080/api/notifications/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    username,  // The target username to whom you are sending the request
                    message: `You have received a friend request from ${username}`,
                }),
            })
                .then((response) => response.text())
                .then((message) => {
                    alert(message);
                })
                .catch((error) => console.error('Error:', error));
        } else {
            alert('Please enter a username.');
        }
    };

    const handleResponse = (notificationMessage, accepted) => {
        const username = extractUsername(notificationMessage);
        fetch(`http://localhost:8080/${username}/${accepted}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.text())
            .then((message) => {
                alert(message);
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notification) => notification !== notificationMessage)
                );
            })
            .catch((error) => console.error('Error:', error));
    };

    const extractUsername = (message) => {
        const parts = message.split(' ');
        return parts[parts.length - 1];
    };

    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate('/', { replace: true });
    };

    return (
        <div className="App">
            <h1>Friend Request System</h1>

            <div className="search-bar">
                <input
                    type="text"
                    id="searchUser"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button id="sendRequest" onClick={handleSendRequest}>
                    Send Friend Request
                </button>
            </div>

            <div id="notifications" className="notifications">
                <h2>Notifications</h2>
                {notifications.map((notification, index) => (
                    <div key={index} className="notification-item">
                        {notification}
                        <button onClick={() => handleResponse(notification, true)}>Accept</button>
                        <button onClick={() => handleResponse(notification, false)}>Reject</button>
                    </div>
                ))}
            </div>
            <div>
                <input type="button" onClick={logOut} value="Log-Out" />
            </div>
        </div>
    );
}
