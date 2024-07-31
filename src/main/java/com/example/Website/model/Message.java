package com.example.Website.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;


@Data
@Table(name = ("messages"))
@Entity
@ToString
public class Message {
    @Id
    private int id;
    private String sender;
    private String receiver;
    private String message;
    private Date timestamp;
}
