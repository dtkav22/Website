package com.example.Website.config;

import com.example.Website.service.JwtService;
import com.example.Website.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

public class JwtChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authorization = accessor.getFirstNativeHeader("Authorization");
            String userName = accessor.getFirstNativeHeader("Username");
            accessor.setHeader("Authorization", authorization);
            if(authorization != null) {
                String token = authorization.substring(7);
                JwtService jwtService = new JwtService();
                if(jwtService.validateToken(token, userName)) {
                    return message;
                } else {
                    throw new SecurityException("Invalid Token");
                }
            } else {
                throw new SecurityException("No Token");
            }
        }
        return message;
    }
}
