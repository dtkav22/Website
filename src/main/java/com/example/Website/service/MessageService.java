package com.example.Website.service;

import com.example.Website.dao.MessageRepo;
import com.example.Website.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepo repo;
    public void save(Message message) {
        repo.save(message);
    }

    public List<Message> getMessagesReceivedFrom(String receiver, String sender) {
        return repo.getMessagesReceivedFrom(receiver, sender);
    }
}
