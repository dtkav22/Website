package com.example.Website.dao;

import com.example.Website.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MessageRepo  extends JpaRepository<Message, Integer> {
    @Query("Select m From Message m Where m.receiver = ?1 And m.sender = ?2")
    List<Message> getMessagesReceivedFrom(String receiver, String sender);
}
