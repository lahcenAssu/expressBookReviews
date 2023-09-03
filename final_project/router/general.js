const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  res.send(books[ISBN]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let ans = [];
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "author" && book[i][1] == req.params.author) {
        ans.push(books[key]);
      }
    }
  }
  if (ans.length == 0) {
    return res.status(300).json({ message: "Author not found" });
  }
  res.send(ans);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let ans = [];
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "title" && book[i][1] == req.params.title) {
        ans.push(books[key]);
      }
    }
  }
  if (ans.length == 0) {
    return res.status(300).json({ message: "Title not found" });
  }
  res.send(ans);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

// Task 10
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop

function getBookList() {
  return axios
    .get("/books")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Failed to get book list");
    });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getBookList()
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(500).json({ message: error.message }));
});
// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getBookDetailsFromISBN(isbn) {
  return axios
    .get(`/books/isbn/${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Failed to get book details");
    });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getBookDetailsFromISBN(isbn)
    .then((book) => res.send(JSON.stringify(book, null, 4)))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Task 12
// Add the code for getting the book details based on author using Promise callbacks or async-await with Axios.

function getBookDetailsFromAuthor(author) {
  return axios
    .get(`/books/author/${author}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Failed to get book details");
    });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getBookDetailsFromAuthor(author)
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Task 13
// Add the code for getting the book details based on title using Promise callbacks or async-await with Axios.

function getBookDetailsFromTitle(title) {
  return axios
    .get(`/books/title/${title}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error:", error);
      throw new Error("Failed to get book details");
    });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getBookDetailsFromTitle(title)
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports.general = public_users;
