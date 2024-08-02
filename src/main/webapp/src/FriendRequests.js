import { useEffect, useState } from "react";
import Friends from "./Friends";

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

            // Cleanup function to unsubscribe
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
        setNewFriend(sender);
    };

    return (
        <div>
            <p>Friend Requests:</p>
            <div>
                {requests.map((value, index) => (
                    <p key={index}>
                        {value}
                        <input type="button" value="Accept" onClick={() => friendRequestAnswer(true, value)}/>
                        <input type="button" value="Reject" onClick={() => friendRequestAnswer(false, value)}/>
                        <br/>
                    </p>
                ))}
            </div>
            <Friends newFriend={newFriend} stompClientRef={stompClientRef}/>
        </div>
    );
}
