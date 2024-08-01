package com.example.Website.controller;

import com.example.Website.model.Message;
import com.example.Website.model.Request;
import com.example.Website.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

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
    public void sendMessage(@RequestBody Request request) {
        String destination = "/topic/requests/" + request.getReceiver();
        messagingTemplate.convertAndSend(destination, request);
    }


}


