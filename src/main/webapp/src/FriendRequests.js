import { useEffect, useState } from "react";
import Friends from "./Friends";
import './FriendRequests.css';

export default function FriendRequests({ stompClientRef }) {
    const [requests, setRequests] = useState([]);
    const [newFriend, setNewFriend] = useState(null);

    useEffect(() => {
        if (stompClientRef.current) {
            const subscription = stompClientRef.current.subscribe(
                `/topic/requests/${localStorage.getItem("username")}`,
                (request) => {
                    console.log(request.body);
                    setRequests((prevRequests) => [...prevRequests, request.body]);
                }
            );

            fetch(`http://localhost:8080/friendRequests/${localStorage.getItem("username")}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem("token")}`,
                }
            })
                .then(response => response.json())
                .then(data => setRequests(data))
                .catch(error => console.error('Error:', error));

            return () => {
                if (subscription) subscription.unsubscribe();
            };
        }
    }, [stompClientRef]);

    const friendRequestAnswer = (accept, sender) => {
        fetch(`http://localhost:8080/request/${localStorage.getItem("username")}/${sender}/${accept}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.text())
            .then(message => {
                alert(message);
            })
            .catch(error => console.error('Error:', error));
        setRequests((prevRequests) => prevRequests.filter((req) => req !== sender));
        if (accept) setNewFriend(sender);
    };

    return (
        <div className="friend-requests-container">
            <div className="friend-requests-header">Friend Requests:</div>
            <div>
                {requests.map((value, index) => (
                    <div key={index} className="friend-request-item">
                        {value}
                        <button className="accept-button" onClick={() => friendRequestAnswer(true, value)}>Accept</button>
                        <button className="reject-button" onClick={() => friendRequestAnswer(false, value)}>Reject</button>
                    </div>
                ))}
            </div>
            <div className="friend-requests-footer">
                <Friends newFriend={newFriend} stompClientRef={stompClientRef}/>
            </div>
        </div>
    );
}