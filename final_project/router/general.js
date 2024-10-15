const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Respond with the books list in JSON format
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
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
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params; // Retrieve the author name from the request parameters

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
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params; //Retrieve the title name from the request parameters

  // Get all keys of the books object
  const bookKeys = Object.keys(books);
  const matchingBooks = []; // Array to hold matching books

  // Iterate through the keys to find books by the specified title
  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]); // Add matching books to the array
    }
  });

  // Check if any books were found
  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4)); // Send the matching books
  } else {
    return res.status(404).json({ message: "No books found with this title" }); // Return 404 if none found
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
