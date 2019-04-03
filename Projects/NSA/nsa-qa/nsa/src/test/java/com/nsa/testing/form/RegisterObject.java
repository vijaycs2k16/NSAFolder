package com.nsa.testing.form;

public class RegisterObject {
	
	static String username ;
	static String email ;
	public static String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public static String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public RegisterObject() {
		super();
		// TODO Auto-generated constructor stub
	}
	public RegisterObject(String username, String email) {
		super();
		this.username = username;
		this.email = email;
	}
	

}
