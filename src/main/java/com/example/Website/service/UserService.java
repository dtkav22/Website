package com.example.Website.service;

import com.example.Website.dao.UserRepo;
import com.example.Website.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;


@Service
public class UserService {
	
	@Autowired
	private UserRepo repo;
	private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

	public User saveUser(User user) {
		user.setPassword(encoder.encode(user.getPassword()));
		return repo.save(user) ;
	}

	public User findByUsername(String username) {
		return repo.findByUsername(username);
	}

	public User getUser(String username) {
		return repo.findByUsername(username);
	}

	public String sendFriendReq(String currentUsername, String username){
		User user = getUser(username);
		User currentUser = getUser(currentUsername);

		if (user==null) return "Could not find user";
		if(currentUser.containsFriend(username)) return "This user is already friend";
		if(currentUser.containsRequest(username)) return "This user has already sent request to you";
		if(user.containsRequest(currentUsername)) return "You already sent request to that user";

		user.addRequest(currentUsername);
		repo.save(user);
		return "Friend request sent";
	}

	public String requestAnswer(String currentUsername, String username, boolean accepted){
		User currentUser = getUser(currentUsername);
		currentUser.removeRequest(username);
		if(accepted) {
			User user = getUser(username);
			currentUser.addFriends(username);
			user.addFriends(currentUsername);
			repo.save(user);
			repo.save(currentUser);
			return "You and " + username + " become friends";
		}
		repo.save(currentUser);
        return "You rejected friend request from " + username;
	}

}
