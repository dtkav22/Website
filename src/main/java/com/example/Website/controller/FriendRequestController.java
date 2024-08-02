package com.example.Website.controller;

import com.example.Website.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class FriendRequestController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService service;

    @Autowired
    public FriendRequestController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/friendRequest")
    public void sendRequest(@Payload Map<String, String> payload) {
        String username1 = payload.get("username1");
        String username2 = payload.get("username2");
        String destination = "/topic/requests/" + username2;
        messagingTemplate.convertAndSend(destination, username1);
    }
    @MessageMapping("/friendRequestAccepted")
    public void sendNewFriend(@Payload Map<String, String> payload) {
        String acceptor = payload.get("acceptor");
        String friendRequestSender = payload.get("friendRequestSender");
        String destination = "/topic/newFriend/" + friendRequestSender;
        messagingTemplate.convertAndSend(destination, acceptor);
    }

}
