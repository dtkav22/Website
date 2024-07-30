package com.example.Website.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HelloController {

	@GetMapping("hello")
	public String greet() {
		return "Hello World ";
	}
	
	@GetMapping("about")
	public String about(HttpServletRequest request) {
		return "Telusko "+request.getHeader("Authorization");
	}
}
