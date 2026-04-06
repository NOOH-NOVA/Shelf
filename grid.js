  fetch("book.json")
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById("book-grid");
    data.slice(0, 9).forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <a href="book.html?id=${book.id}">
          <img src="${book.image}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>by ${book.author}</p>
        </a>
      `;
      grid.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading books:", err));