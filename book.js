document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get("id"));

  if (!bookId) {
    showError("No book selected.");
    return;
  }

  try {
    const response = await fetch("./book.json");
    const books = await response.json();
    const book = books.find(b => b.id === bookId);

    if (!book) {
      showError("Book not found.");
      return;
    }

    loadBookDetails(book);
    renderActionButtons(book);
    renderExtraContent(book);

  } catch (error) {
    console.error(error);
    showError("Could not load book data.");
  }
});


// --- LOAD BOOK DETAILS ---
function loadBookDetails(book) {
  const cover = document.getElementById("book-cover");
  const title = document.getElementById("book-title");
  const author = document.getElementById("book-author");
  const description = document.getElementById("book-description");

  if (cover) {
    cover.src = book.image;
    cover.alt = book.title;
  }

  if (title) title.textContent = book.title;
  if (author) author.textContent = "by " + book.author;
  if (description) description.textContent = book.description;
}


function renderActionButtons(book) {
  const chapterBox = document.querySelector(".chapters-rectangle");
  if (!chapterBox) return;

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  let isFavorite = false;

  if (user) {
    if (!user.favorites) user.favorites = [];
    isFavorite = user.favorites.includes(book.id);
  }

  let previewLink = "#";
  if (book.file) {
  previewLink = `reader.html?file=${encodeURIComponent(book.file)}&title=${encodeURIComponent(book.title)}`;
  } 

  chapterBox.innerHTML = `
    <div class="book-actions">
      <a href="${previewLink}" class="read-btn">Read Preview</a>
      <button id="favoriteBtn" class="favorite-btn">
        ${isFavorite ? "★ Remove Favorite" : "☆ Add to Favorite"}
      </button>
    </div>
    <p class="favorite-status">
      ${isFavorite ? "This book is in your favorites." : "This book is not in your favorites yet."}
    </p>
  `;

  const favoriteBtn = document.getElementById("favoriteBtn");

  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", () => {

      let user = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!user) {
        alert("Please login first");
        return;
      }

      if (!user.favorites) user.favorites = [];

      if (user.favorites.includes(book.id)) {
        user.favorites = user.favorites.filter(id => id !== book.id);
      } else {
        user.favorites.push(book.id);
      }

      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // refresh UI
      renderActionButtons(book);
    });
  }
}


-
function renderExtraContent(book) {
  const bigBox = document.querySelector(".big-rectangle");
  if (!bigBox) return;

  bigBox.innerHTML = `
    <h3>About this book</h3>
    <p><strong>Title:</strong> ${book.title}</p>
    <p><strong>Author:</strong> ${book.author}</p>
    <p>${book.description}</p>
  `;
}


// --- ERROR HANDLING ---
function showError(message) {
  const title = document.getElementById("book-title");
  const author = document.getElementById("book-author");
  const description = document.getElementById("book-description");

  if (title) title.textContent = "Error";
  if (author) author.textContent = "";
  if (description) description.textContent = message;
}

function renderExtraContent(book) {
  const bigBox = document.querySelector(".big-rectangle");
  if (!bigBox) return;

  bigBox.innerHTML = `
    <h3>About this book</h3>
    <p><strong>Title:</strong> ${book.title}</p>
    <p><strong>Author:</strong> ${book.author}</p>
    <p>${book.description}</p>
  `;
}