package com.example.Website.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;


@Data
@Table(name = "messages")
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String sender;
    private String receiver;
    private String message;
    private Date timestamp;
}
