package com.example.Website.controller;

import com.example.Website.model.User;
import com.example.Website.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    @Autowired
    private UserService userService;

//    @PostMapping("/username/{username}")
//    public String sendFriendReq(@PathVariable("username") String username){
//        String msg = userService.sendFriendReq(username);
//        return msg;
//    }
//
//    @PostMapping("/{username}/{accepted}")
//    public String requestAnswer(@PathVariable("username") String username, @PathVariable("accepted") boolean accepted){
//        return userService.requestAnswer(username, accepted);
//    }
}
