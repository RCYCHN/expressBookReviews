const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid
const isValid = (username) => {
  // Check if the username already exists in the users array
  return users.some(user => user.username === username);
};

// Function to check if the username and password match the one we have in records
const authenticatedUser = (username, password) => {
  // Check if the username and password match
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the user exists and the password matches
  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });

  // Respond with success and the token
  return res.status(200).json({ message: "Login successful!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
