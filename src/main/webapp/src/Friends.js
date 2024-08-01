import {useEffect, useState} from "react";

export default function Friends({newFriend}){
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8080/friends/${localStorage.getItem("username")}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem("token")}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setFriends(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);
    useEffect(() => {
        if(newFriend) {
            setFriends((prevState) => [...prevState, newFriend]);
        }
    }, [newFriend]);
    return (
        <div>
            <p>Friends:</p>
            {friends.map((friend, index) => (
                <p key={index}>
                    <strong>{friend}</strong>
                    <input type="button" value="Chat"/>
                </p>
            ))}
        </div>
    );
}