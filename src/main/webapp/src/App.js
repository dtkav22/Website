import {useEffect, useState} from 'react';
function App() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const Login = (event) => {
        event.preventDefault();
        const json = {
            "username" : username,
            "password" : password
        };
        fetch('http://localhost:8080/login', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(json)
        })
            .then(response => response.text())
            .then(data => setToken("Bearer " + data))
            .catch(error => console.error('Error fetching data:', error));
    }
  return (
      <div className="App">
        <h1>Welcome to Xuxulo-Sandzr Website</h1>
        <p>Please log in.</p>
        <form onSubmit={Login}>
          <ol>
            User Name: <input type="input" onChange={(e) => setUserName(e.target.value)}/>
          </ol>
          <ol>
            Password: <input type="password" onChange={(e) => setPassword(e.target.value)}/>
            <input type="submit" value="Login"/>
          </ol>
        </form>
        <a href="/CreateAccount"><p>Create New Account</p></a>
      </div>
  );
}



export default App;
