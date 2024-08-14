# Real-Time Messaging and Authentication System

## Project Overview
This project is a comprehensive web application that provides real-time communication and secure authentication features. 
It includes functionality for user registration, login, friend requests, and chat. 
The application leverages WebSockets to provide live updates and interactions without requiring page refreshes.

## Features
- **User Authentication:** Secure login and registration using JWT (JSON Web Tokens).
- **Friend Requests:** Users can send, accept, and manage friend requests.
- **Real-Time Chat:** WebSockets are used for real-time messaging, ensuring that users receive and send messages instantly.
- **Security:** Implements robust security measures including token-based authentication and custom JWT validation.

## Technologies Used
- **Spring Boot:** For building the back-end services.
- **Spring Security:** For handling authentication and security.
- **JWT (JSON Web Tokens):** For secure user authentication.
- **Spring WebSocket:** For real-time communication.
- **React:** For the front-end application.
- **SockJS and STOMP:** For WebSocket communication in the front-end.
- **BCrypt:** For password hashing and security.

## Contributors
- [Nika-Sard](https://github.com/https://github.com/Nika-Sard)
- [dtkav22](https://github.com/dtkav22)

## Demo Video
Check out the demo video of the project:

[![Watch the video](https://youtu.be/57VvCOS6KUo)

## How It Works
- **WebSocket Configuration:** The application uses WebSockets to enable real-time features such as chat and friend requests. This allows users to see updates and messages instantly without refreshing the page.
- **JWT Authentication:** The security of the application is managed through JWT, which provides a secure way to authenticate users and validate their sessions.
- **Channel Interceptor:** Custom channel interceptor checks JWT tokens for WebSocket connections, ensuring that only authenticated users can connect and interact with the system.
