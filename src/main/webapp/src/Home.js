import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Stomp from "stompjs";
import SockJS from "sockjs-client";

export default function Home() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const [requests, setRequests] = useState([]);
    const [friendName, setFriendName] = useState("");
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
                client.subscribe(`/topic/requests/${localStorage.getItem("username")}`, (request) => {
                    const newRequest = JSON.parse(request.body);
                    setRequests((prevRequests) => [...prevRequests, newRequest]);
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

    const friendNameChange = (e) => {
        setFriendName(e.target.value);
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
    const sendRequest = () => {
        if(friendName.trim() && stompClientRef.current){
            const friendRequest = {
                "sender" : localStorage.getItem("username"),
                "receiver" : friendName
            };
            stompClientRef.current.send('/app/friendRequest', {}, JSON.stringify(friendRequest));
            setFriendName("");
            fetch(`http://localhost:8080/request/${friendRequest.sender}/${friendRequest.receiver}`, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                       'Authorization': `${localStorage.getItem("token")}`,
                   }
               })
                   .then(response => response.text())
                   .then(message => {
                       alert(message);
                       //setNotifications(prevNotifications => prevNotifications.filter(notification => notification !== notificationMessage));
                   })
                   .catch(error => console.error('Error:', error));
           }
    };
    const requestAnswer = (accept, sender) => {
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
                  //setNotifications(prevNotifications => prevNotifications.filter(notification => notification !== notificationMessage));
              })
              .catch(error => console.error('Error:', error));
          setRequests((prevRequests) => prevRequests.filter((req) => req.sender !== sender));
    };
    const navigate = useNavigate();
    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate("/", { replace: true });
    };

    return (
        <div className="App">
            <div style={{display: "flex", alignItems: "center"}}>
                <label>
                    Send Friend Request:
                    <input type="text" onChange={friendNameChange} value={friendName}/>
                    <input type="button" value="Send" onClick={sendRequest}/>
                </label>
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <label>
                    Enter Username:
                    <input type="text" onChange={usernameChange} value={username}/>
                </label>
                <label>
                    Enter Message:
                    <input type="text" onChange={messageChange} value={message}/>
                </label>
                <label>
                    <input type="button" value="Send Message" onClick={sendMessage}/>
                </label>
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                Friend Requests:
                {requests.map((value, index) => (
                    <p key={index}>
                        {value.sender}
                        <input type="button" value="Accept" onClick={requestAnswer.bind(null, true, value.sender)}/>
                        <input type="button" value="Reject" onClick={requestAnswer.bind(null, true, value.sender)}/>
                        <br/>
                    </p>
                ))}
            </div>
            <div id="chat">
                {messages.map((val, index) => (
                    <p key={index}>{val.sender}: {val.message}</p>
                ))}
            </div>
            <input id="logOut" type="button" onClick={logOut} value="Log-Out"/>
        </div>
    );
}
