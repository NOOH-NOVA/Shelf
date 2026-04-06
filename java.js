// --- 1. SETTINGS & DATA ---
const allBooks = [
  { id: 1, title: "Stockholm", author: "Shahad Qurban", image: "images/book1.jpg" },
  { id: 2, title: "Azer: Son of the Valley Wolf", author: "Ahmed Al Hamdan", image: "images/book2.jpg" },
  { id: 3, title: "The Balance and the Man", author: "Bandar Al Kabir", image: "images/book3.jpg" },
  { id: 4, title: "A Journey of Certainty", author: "Dr. Ibrahim Mohammed", image: "images/book4.jpg" },
  { id: 5, title: "You Will See the Light", author: "Ibrahim Mohammed", image: "images/book5.jpg" },
  { id: 6, title: "Understanding the Beautiful Names of Allah", author: "Abdur Razzaq", image: "images/book6.jpg" },
  { id: 7, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", image: "images/book7.jpg" },
  { id: 8, title: "Warren Buffett", author: "Todd Finkle", image: "images/book8.jpg" },
  { id: 9, title: "Firefight", author: "Brandon Sanderson", image: "images/book9.jpg" }
];

let currentPage = 1;
const booksPerPage = 6;
let currentPos = 0;

// --- 2. GRID ---
function renderGrid() {
  const grid = document.getElementById('book-grid');
  if (!grid) return;

  grid.innerHTML = "";

  const start = (currentPage - 1) * booksPerPage;
  const currentBooks = allBooks.slice(start, start + booksPerPage);

  currentBooks.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book-item';

    div.innerHTML = `
      <a href="book.html?id=${book.id}">
        <img src="${book.image}">
        <h3 style="color:white">${book.title}</h3>
      </a>
    `;

    grid.appendChild(div);
  });

  renderPagination();
}

function renderPagination() {
  const container = document.getElementById('page-numbers');
  if (!container) return;

  const totalPages = Math.ceil(allBooks.length / booksPerPage);
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.className = i === currentPage ? "page-btn active" : "page-btn";

    btn.onclick = () => {
      currentPage = i;
      renderGrid();
    };

    container.appendChild(btn);
  }
}

window.changePage = function(dir) {
  const totalPages = Math.ceil(allBooks.length / booksPerPage);
  const next = currentPage + dir;

  if (next >= 1 && next <= totalPages) {
    currentPage = next;
    renderGrid();
  }
};

// --- 3. SLIDER ---
window.moveSlide = function(direction) {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  const maxIndex = allBooks.length - 5;
  currentPos += direction;

  if (currentPos > maxIndex) currentPos = 0;
  if (currentPos < 0) currentPos = maxIndex;

  track.style.transform = `translateX(-${currentPos * 20}%)`;
};

// --- 4. AUTH ---
function setupAuth() {
  const btn = document.getElementById("loginBtn");
  const modal = document.getElementById("loginModal");

  if (btn && modal) {
    btn.onclick = (e) => {
      e.preventDefault();
      modal.classList.add("show-modal");
    };

    window.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove("show-modal");
      }
    };
  }
}

// --- LOGIN ---
async function loginUser() {
  const email = document.getElementById("email-log-in").value;
  const password = document.getElementById("pwd-log-in").value;

  try {
    const res = await fetch("user.json");
    const users = await res.json();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      document.getElementById("loginModal").classList.remove("show-modal");
      updateUI(user);
    } else {
      alert("Wrong email or password ❌");
    }

  } catch (err) {
    alert("Error loading users");
  }
}

// --- UI AFTER LOGIN ---
function updateUI(user) {
  const area = document.getElementById("user-area");
  if (!area) return;

  area.innerHTML = `
    <div class="profile-container">
      <img src="images/profile.jpg" class="profile-pic" id="profilePic">

      <div class="profile-menu" id="profileMenu">
        <p>${user.username}</p>
        <hr>
        <button id="goProfile">Profile</button>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  const pic = document.getElementById("profilePic");
  const menu = document.getElementById("profileMenu");

  pic.onclick = () => menu.classList.toggle("show");

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedInUser");
    location.reload();
  };

  document.getElementById("goProfile").onclick = () => {
    window.location.href = "profile.html";
  };

  window.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-container")) {
      menu.classList.remove("show");
    }
  });
}

// --- PROFILE PAGE ---
function loadProfilePage() {
  if (!document.getElementById("username")) return;

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("username").textContent = user.username;
  document.getElementById("email").textContent = user.email;
  document.getElementById("userid").textContent = user.id;

  fetch("book.json")
    .then(res => res.json())
    .then(books => {
      const fav = document.getElementById("favorites");
      if (!fav) return;

      const favBooks = books.filter(b => user.favorites.includes(b.id));

      if (favBooks.length === 0) {
        fav.innerHTML = "<p style='color:gray'>No favorites yet</p>";
        return;
      }

      favBooks.forEach(book => {
        const div = document.createElement("div");
        div.className = "book-item";

        div.innerHTML = `
          <img src="${book.image}">
          <h3 style="color:white">${book.title}</h3>
        `;

        fav.appendChild(div);
      });
    });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {

  setupAuth();

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) updateUI(user);

  if (document.getElementById("book-grid")) {
    renderGrid();
  }

  if (document.getElementById("sliderTrack")) {
    setInterval(() => moveSlide(1), 5000);
  }

  loadProfilePage();

});