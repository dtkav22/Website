<%--
  Created by IntelliJ IDEA.
  User: User
  Date: 22.05.2024
  Time: 12:02
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page isELIgnored="false"%>
<html>
<head>
    <title>User Welcome</title>
</head>
<body>
    <h1>Welcome ${userName}</h1>
    <form action="Login" method="get">
        <input type="submit" value="Log Out">
    </form>
</body>
</html>
