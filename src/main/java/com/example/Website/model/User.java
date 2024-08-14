package com.example.Website.model;

import jakarta.persistence.*;
import lombok.Data;

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

}
