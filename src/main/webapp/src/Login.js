import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token") !== null) {
            navigate("/Home", { replace: true });
        }
    }, [navigate]);

    const handleError = (error) => {
        document.getElementById("title").innerHTML = "Invalid Username or Password";
    }

    const Login = (event) => {
        event.preventDefault();
        const json = {
            "username": username,
            "password": password
        };
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status.toString());
                }
                return response.text();
            })
            .then(data => {
                localStorage.setItem("token", "Bearer " + data);
                localStorage.setItem("username", username);
                navigate("/Home", { replace: true });
            })
            .catch(error => handleError(error));
    }

    return (
        <div className="App">
            <h1 id="title">Welcome to Xuxulo-Sandzr Website</h1>
            <p>Please log in.</p>
            <form onSubmit={Login}>
                <ol>
                    User Name: <input type="input" onChange={(e) => setUserName(e.target.value)} />
                </ol>
                <ol>
                    Password: <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                    <span>  </span>
                    <input type="submit" value="Login"/>
                </ol>
                <a href={"/Register"}>Register</a>
            </form>
        </div>
    );
}