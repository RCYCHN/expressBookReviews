const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to get books by author using async-await
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params; // Retrieve the author name from the request parameters

  try {
      // Get all keys of the books object
      const bookKeys = Object.keys(books);
      const matchingBooks = []; // Array to hold matching books

      // Iterate through the keys to find books by the specified author
      bookKeys.forEach(key => {
          if (books[key].author.toLowerCase() === author.toLowerCase()) {
              matchingBooks.push(books[key]); // Add matching books to the array
          }
      });

      // Check if any books were found
      if (matchingBooks.length > 0) {
          return res.status(200).send(JSON.stringify(matchingBooks, null, 4)); // Send the matching books
      } else {
          return res.status(404).json({ message: "No books found for this author" }); // Return 404 if none found
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author", error: error.message }); // Handle errors
  }
});

// Function to get book details by ISBN
const fetchBookByISBN = async (isbn) => {
  try {
    // Use Axios to get the book details based on ISBN
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Adjust the URL as needed
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch book details: ' + error.message);
  }
};

// Route to get book details based on ISBN
public_users.get('/book/:isbn', async (req, res) => {
  const { isbn } = req.params; // Get ISBN from the request parameters
  try {
    const bookDetails = await fetchBookByISBN(isbn); // Call the fetchBookByISBN function
    return res.status(200).json(bookDetails); // Send the book details as a response
  } catch (error) {
    return res.status(404).json({ message: error.message }); // Handle errors
  }
});

// Function to get books from the database
const fetchBooks = async () => {
  try {
    // Use Axios to get the books
    const response = await axios.get('http://localhost:5000/'); // Adjust the URL as needed
    return response.data;
  } catch (error) {
    throw new Error('Could not fetch books: ' + error.message);
  }
};

// Route to get the list of books
public_users.get('/books', async (req, res) => {
  try {
    const booksList = await fetchBooks(); // Call the fetchBooks function
    return res.status(200).json(booksList); // Send the books list as a response
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Handle errors
  }
});

// Route to register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." }); // Return error if missing
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." }); // Return error if username exists
  }

  // Register the new user
  users[username] = { password }; // Store the username and password (consider hashing the password in production)
  return res.status(201).json({ message: "User registered successfully." }); // Success response
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Respond with the books list in JSON format
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params; // Retrieve the ISBN from the request parameters

  // Check if the book with the given ISBN exists in the books object
  const book = books[isbn]; // Access the book using the key (ISBN)

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4)); // Send the book details
  } else {
    return res.status(404).json({ message: "Book not found" }); // Return 404 if not found
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params; // Retrieve the author name from the request parameters

  try {
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    // Iterate through the keys to find books by the specified author
    bookKeys.forEach(key => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params; // Retrieve the title name from the request parameters

  try {
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    // Iterate through the keys to find books by the specified title
    bookKeys.forEach(key => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    });

    // Check if any books were found
    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params; // Retrieve the ISBN from the request parameters

  // Check if the book with the given ISBN exists in the books object
  if (books[isbn]) {
    const reviews = books[isbn].reviews; // Get the reviews of the book
    return res.status(200).send(JSON.stringify(reviews, null, 4)); // Send reviews in JSON format
  } else {
    return res.status(404).json({ message: "No book found with this ISBN" }); // Return 404 if no book is found
  }
});

module.exports.general = public_users;