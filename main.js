// {
//   id: string | number,
//   title: string,
//   author: string,
//   year: number,
//   isComplete: boolean,
// }

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  document.addEventListener("bookshelfUpdated", function () {
    clearBookshelf();
    loadBooks();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBooks();
  });

  if (localStorage.getItem("BOOKSHELF")) {
    loadBooks();
  }
});

function clearBookshelf() {
  document.getElementById("incompleteBookshelfList").innerHTML = "";
  document.getElementById("completeBookshelfList").innerHTML = "";
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value.trim();
  const bookAuthor = document.getElementById("inputBookAuthor").value.trim();
  const bookYear = document.getElementById("inputBookYear").value.trim();
  const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const books = localStorage.getItem("BOOKSHELF") ? JSON.parse(localStorage.getItem("BOOKSHELF")) : [];
  if (books.some((book) => book.title === bookTitle && book.author === bookAuthor && book.year === bookYear)) {
    alert("Buku sudah ada di rak.");
    return;
  }

  const book = {
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: bookIsComplete,
  };

  books.push(book);
  localStorage.setItem("BOOKSHELF", JSON.stringify(books));
  document.dispatchEvent(new Event("bookshelfUpdated"));
}

function loadBooks() {
  const books = JSON.parse(localStorage.getItem("BOOKSHELF")) || [];
  books.forEach((book) => {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      document.getElementById("completeBookshelfList").appendChild(bookElement);
    } else {
      document.getElementById("incompleteBookshelfList").appendChild(bookElement);
    }
  });
}

function makeBookElement(book) {
  const titleElement = document.createElement("h3");
  titleElement.innerText = book.title;

  const authorElement = document.createElement("p");
  authorElement.innerText = "Penulis: " + book.author;

  const yearElement = document.createElement("p");
  yearElement.innerText = "Tahun: " + book.year;

  const completeButton = document.createElement("button");
  completeButton.classList.add("green");
  completeButton.innerText = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
  completeButton.onclick = function () {
    toggleComplete(book.id);
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.onclick = function () {
    deleteBook(book.id);
  };

  const actionDiv = document.createElement("div");
  actionDiv.classList.add("action");
  actionDiv.appendChild(completeButton);
  actionDiv.appendChild(deleteButton);

  const bookElement = document.createElement("article");
  bookElement.classList.add("book_item");
  bookElement.append(titleElement, authorElement, yearElement, actionDiv);

  return bookElement;
}

function toggleComplete(bookId) {
  const books = JSON.parse(localStorage.getItem("BOOKSHELF"));
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index].isComplete = !books[index].isComplete;
    localStorage.setItem("BOOKSHELF", JSON.stringify(books));
    document.dispatchEvent(new Event("bookshelfUpdated"));
  }
}

function deleteBook(bookId) {
  let books = JSON.parse(localStorage.getItem("BOOKSHELF"));
  books = books.filter((book) => book.id !== bookId);
  localStorage.setItem("BOOKSHELF", JSON.stringify(books));
  document.dispatchEvent(new Event("bookshelfUpdated"));
}

function searchBooks() {
  const searchTitle = document.getElementById("searchBookTitle").value.trim().toLowerCase();
  const books = JSON.parse(localStorage.getItem("BOOKSHELF")) || [];
  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));

  clearBookshelf();

  if (filteredBooks.length === 0) {
    displayNotification("Buku tidak ditemukan.", "warning");
  } else {
    filteredBooks.forEach((book) => {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        document.getElementById("completeBookshelfList").appendChild(bookElement);
      } else {
        document.getElementById("incompleteBookshelfList").appendChild(bookElement);
      }
    });
    displayNotification("Buku ditemukan.", "success");
  }
}

function displayNotification(message, type) {
  alert(message);
}

// Add more functionality for handling 'bookshelfUpdated' event, search, etc.
document.addEventListener("bookshelfUpdated", loadBooks);
