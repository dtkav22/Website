package com.example.Website.controller;


import com.example.Website.model.User;
import com.example.Website.service.JwtService;
import com.example.Website.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpRequest;


@RestController
public class UserController {

	@Autowired
	private UserService service;

	@Autowired
	private JwtService jwtService;

	@Autowired
	AuthenticationManager authenticationManager;
	
	@PostMapping("register")
	public User register(@RequestBody User user) {
	  return service.saveUser(user);
	}

	@PostMapping("login")
	public String login(@RequestBody User user, HttpServletRequest request){

		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

		if(authentication.isAuthenticated()) {
			String token = jwtService.generateToken(user.getUsername());
			request.getSession().setAttribute("Authorization", token);
			return token;
		}
		else
			return "Login Failed";

	}

}
