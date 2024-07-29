package com.example.Website.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;


@Data
@Table(name = "users")
@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@Column(unique = true)
	private String username;
	private String password;

	@ElementCollection
	@CollectionTable(name = "user_requests", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "request")
	private List<String> requests = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "friend")
	private List<String> friends = new ArrayList<>();

	public void addRequest(String request) {
		requests.add(request);
	}

	public void removeRequest(String username){
        requests.removeIf(name -> name.equals(username));
	}

	public boolean containsRequest(String username) {
		return requests.contains(username);
	}

	public void addFriends(String friend) {
		friends.add(friend);
	}

	public boolean containsFriend(String username){
		return friends.contains(username);
	}
}
