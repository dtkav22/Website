package com.example.Website.model;

import lombok.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    private String receiver;
    private String message;
    private Date timestamp;
}
