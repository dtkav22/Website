package com.example.Website.service;

import com.example.Website.dao.UserRepo;
import com.example.Website.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	@Autowired
	private UserRepo repo;
	private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);


	public User saveUser(User user) {
		user.setPassword(encoder.encode(user.getPassword()));
		return repo.save(user);
	}

	public Optional<User> findByUsername(String username) {
		return Optional.ofNullable(repo.findByUsername(username));
	}

	public List<String> getFriends(String username) {
		return findByUsername(username)
				.map(User::getFriends)
				.orElseThrow(() -> new RuntimeException("User not found"));
	}

	public List<String> getFriendRequests(String username) {
		return findByUsername(username)
				.map(User::getRequests)
				.orElseThrow(() -> new RuntimeException("User not found"));
	}

	public String sendFriendReq(String currentUsername, String username) {
		User user = findByUsername(username).orElse(null);
		User currentUser = findByUsername(currentUsername).orElse(null);

		if (user == null) return "Could not find user";
		if (user.getRequests().contains(currentUsername)) return "You already sent request to that user";
		if (currentUser.getFriends().contains(username)) return "This user is already a friend";
		if (currentUser.getRequests().contains(username)) return "This user has already sent request to you";

		user.getRequests().add(currentUsername);
		repo.save(user);
		return "Friend request sent";
	}

	public String requestAnswer(String currentUsername, String username, boolean accepted) {
		User currentUser = findByUsername(currentUsername).orElse(null);

		if (currentUser == null) return "Current user not found";

		currentUser.getRequests().remove(username);
		if (accepted) {
			User user = findByUsername(username).orElse(null);
			if (user == null) return "User to accept is not found";
			currentUser.getFriends().add(username);
			user.getFriends().add(currentUsername);
			repo.save(user);
		}
		repo.save(currentUser);
		return accepted ? "You and " + username + " are now friends" : "You rejected the friend request from " + username;
	}

	public void removeFriend(String username1, String username2) {
		User user1 = findByUsername(username1).orElseThrow(() -> new RuntimeException("User1 not found"));
		User user2 = findByUsername(username2).orElseThrow(() -> new RuntimeException("User2 not found"));

		user1.getFriends().remove(username2);
		user2.getFriends().remove(username1);

		repo.save(user1);
		repo.save(user2);
	}
}