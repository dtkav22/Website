package com.example.Website.controller;

import com.example.Website.model.User;
import com.example.Website.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/friendRequests/{username}")
    public List<String> getFriendRequests(@PathVariable String username) {
        return userService.getFriendRequests(username);
    }

    @GetMapping("/friends/{username}")
    public List<String> getFriends(@PathVariable String username){
        return userService.getFriends(username);
    }

    @PostMapping("/request/{username1}/{username2}")
    public String sendFriendReq(@PathVariable String username1, @PathVariable String username2){
        String msg = userService.sendFriendReq(username1, username2);
        return msg;
    }

    @PostMapping("/request/{username1}/{username2}/{accepted}")
    public String requestAnswer(@PathVariable String username1, @PathVariable String username2, @PathVariable boolean accepted){
        return userService.requestAnswer(username1, username2, accepted);
    }
}

