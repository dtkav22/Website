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

	public String getCurrentUsername() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}

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

	public String sendFriendReq(String username){
		User user = getUser(username);
		String currentUsername = getCurrentUsername();
		User currentUser = getUser(currentUsername);

		if (user==null) return "Could not find user";
		if(currentUser.containsFriend(username)) return "This user is already friend";
		if(currentUser.containsRequest(username)) return requestAnswer(username, true);

		user.addRequest(currentUsername);
		repo.save(user);
		User user2 = getUser(username);
		System.out.println(user2.toString());
		return "Friend request sent";
	}

	public String requestAnswer(String username, boolean accepted){
		String currentUsername = getCurrentUsername();
		User currentUser = getUser(currentUsername);
		currentUser.removeRequest(username);
		if(accepted) {
			User otherUser = getUser(username);
			currentUser.addFriends(username);
			otherUser.addFriends(currentUsername);
			repo.save(otherUser);
			repo.save(currentUser);
			return "You and " + username + " become friends";
		}
        return "You rejected friend request from " + username;
	}

}
