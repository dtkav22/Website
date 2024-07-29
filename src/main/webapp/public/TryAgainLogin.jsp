<%--
  Created by IntelliJ IDEA.
  User: User
  Date: 22.05.2024
  Time: 12:16
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Try Again Login</title>
</head>
<body>
    <h1>Please Try Again</h1>
    <p>Either your user name or password is incorrect. Please try again.</p>
    <form action="Login" method="post">
        <ol>
            User Name: <input type="input" name="userName">
        </ol>
        <ol>
            Password: <input type="password" name="password">
            <input type="submit" value="Login">
        </ol>
    </form>
    <a href = "/CreateAccount"><p>Create New Account</p></a>
</body>
</html>
