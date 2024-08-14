import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
export default function Register() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("token") !== null) {
            navigate("/Home", {replace : true});
        }
    }, []);
    const handleError = (error) => {
        document.getElementById("title").innerHTML = "User Name Already In Use";
        return false;
    }
    const Register = async (event) => {
        let mustNavigate = false;
        event.preventDefault();
        const json = {
            "username": username,
            "password": password
        };
        await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => {
                response.json()
                    .then(json => {
                        if (json == null)
                            return handleError();
                        return true;
                    })
                    .then(must => {
                        if(must)
                            navigate("/", {replace:true});
                    })
                    .catch(error => handleError(error));
            });
    }
    return (
        <div className={"App"}>
            <h1 id={"title"}>Create New Account</h1>
            <form onSubmit={Register}>
                <ol>
                    User Name: <input type="input" onChange={(e) => setUserName(e.target.value)} required/>
                </ol>
                <ol>
                    Password: <input type="password" onChange={(e) => setPassword(e.target.value)} required/>
                    <span>  </span>
                    <input type={"submit"} value={"Register"}/>
                </ol>
                <a href={"/"}>Login</a>
            </form>
        </div>
    );
}