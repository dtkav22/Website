package com.example.Website.controller;


import com.example.Website.model.Message;
import com.example.Website.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private MessageService service;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void sendMessage(@RequestBody Message message) {
        message.setTimestamp(new Date());
        service.save(message);
        String destination = "/topic/messages/" + message.getReceiver();
        messagingTemplate.convertAndSend(destination, message);
    }
}
