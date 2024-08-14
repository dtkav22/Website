<%--
  Created by IntelliJ IDEA.
  User: User
  Date: 22.05.2024
  Time: 12:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Create Account</title>
</head>
<body>
    <h1>Create New Account</h1>
    <p>Please enter proposed name and password.</p>
    <form action="CreateAccount" method="post">
        <ol>
            User Name: <input type="input" name="userName" required>
        </ol>
        <ol>
            Password: <input type="password" name="password" required>
            <input type="submit" value="Login">
        </ol>
    </form>
</body>
</html>
