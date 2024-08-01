import { useEffect, useState } from "react";

export default function FriendRequests({ stompClientRef }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (stompClientRef.current) {
            const subscription = stompClientRef.current.subscribe(
                `/topic/requests/${localStorage.getItem("username")}`,
                (request) => {
                    const newRequest = JSON.parse(request.body);
                    setRequests((prevRequests) => [...prevRequests, newRequest]);
                }
            );

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
        setRequests((prevRequests) => prevRequests.filter((req) => req.sender !== sender));
    };

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            Friend Requests:
            {requests.map((value, index) => (
                <p key={index}>
                    {value.sender}
                    <input type="button" value="Accept" onClick={() => friendRequestAnswer(true, value.sender)}/>
                    <input type="button" value="Reject" onClick={() => friendRequestAnswer(false, value.sender)}/>
                    <br/>
                </p>
            ))}
        </div>
    );
}
