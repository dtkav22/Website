<%--
  Created by IntelliJ IDEA.
  User: User
  Date: 22.05.2024
  Time: 12:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Retry Create Account</title>
</head>
<body>
  <h1>The Name ${userName}  Is Already In Use</h1>
  <p>Please enter another name and password.</p>
  <form action="CreateAccount" method="post">
    <ol>
      User Name: <input type="input" name="userName">
    </ol>
    <ol>
      Password: <input type="password" name="password">
      <input type="submit" value="Login">
    </ol>
  </form>
</body>
</html>
