// 🔗 LIVE GOOGLE SHEET LINK (your permanent auto-sync source)
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQddSSnTRotOV7kciJNeqYRqmCMp_FVUEV8fyYH3FMeH2TPAoPWK9CIhsmWtvrWwi1lZL-6FjX_BqJs/pub?output=csv";

// 📘 Fetch and convert Google Sheet CSV → JSON safely
async function fetchBooks() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Failed to fetch data from Google Sheet");

    const csvText = await response.text();

    // Safer CSV parser (handles commas inside quotes)
    const rows = csvText.match(/(".*?"|[^"\n]+)(?=\n|$)/g)
      ? csvText
          .split("\n")
          .filter((r) => r.trim() !== "")
          .map((line) =>
            line
              .match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
              ?.map((v) => v.replace(/^"|"$/g, "").trim())
          )
      : [];

    const headers = rows[0];
    const books = rows.slice(1).map((r) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = r[i] || ""));
      return obj;
    });

    console.log("✅ Books fetched from Google Sheet:", books);
    return books;
  } catch (error) {
    console.error("⚠️ Failed to load books:", error);
    return [];
  }
}

// 🧱 Render Book Cards
function renderBooks(books, containerId = "books-container") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  if (!books || books.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-center col-span-full">No books available right now.</p>`;
    return;
  }

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className =
      "book-card bg-gray-800 rounded-xl p-4 shadow-lg animate-fade-in";

    const img = book.image
      ? `<img src="${book.image}" alt="${book.title}" class="w-full h-48 object-cover rounded-lg mb-3">`
      : `<div class="w-full h-48 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-gray-400">No Image</div>`;

    const pdfUrl = (book.pdfLink || "").trim();
    const finalPdfLink = pdfUrl.startsWith("http")
      ? pdfUrl
      : pdfUrl
      ? `https://drive.google.com/uc?export=download&id=${pdfUrl}`
      : "#";

    card.innerHTML = `
      ${img}
      <h3 class="text-xl font-semibold text-primary mb-1">${
        book.title || "Untitled"
      }</h3>
      <p class="text-gray-300 text-sm mb-2">${book.author || "Unknown Author"}</p>
      <p class="text-gray-400 text-sm mb-3 line-clamp-3">${
        book.description || "No description available."
      }</p>
      <a href="${finalPdfLink}" target="_blank" rel="noopener noreferrer"
         class="inline-block bg-primary text-white px-4 py-2 rounded-lg mt-2 hover:opacity-90 transition">
         Read
      </a>
    `;
    container.appendChild(card);
  });
}

// 🔎 Setup Search + Category Filter (user.html)
async function setupUserPage() {
  const books = await fetchBooks();
  renderBooks(books, "books-container");

  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  // Populate categories dynamically
  const categories = [...new Set(books.map((b) => b.category).filter(Boolean))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Handle search + filter
  function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = books.filter((b) => {
      const matchTitle = b.title.toLowerCase().includes(searchTerm);
      const matchAuthor = b.author.toLowerCase().includes(searchTerm);
      const matchCategory =
        selectedCategory === "all" || b.category === selectedCategory;
      return (matchTitle || matchAuthor) && matchCategory;
    });

    renderBooks(filtered, "books-container");
  }

  searchInput.addEventListener("input", filterBooks);
  categoryFilter.addEventListener("change", filterBooks);
}

// 📖 Discover Page
async function setupDiscoverPage() {
  const books = await fetchBooks();
  const featured = books.slice(0, 8);
  renderBooks(featured, "featured-books");
}

// 🧾 Collections Page
async function setupCollectionsPage() {
  const books = await fetchBooks();
  renderBooks(books, "collections-container");
}

// 🧠 Admin Page
async function setupAdminPage() {
  const books = await fetchBooks();
  document.getElementById("total-books").textContent = books.length;
  const categories = new Set(books.map((b) => b.category));
  document.getElementById("total-categories").textContent = categories.size;
}

// ⚡ Page Detection
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("user.html")) setupUserPage();
  else if (path.includes("collections.html")) setupCollectionsPage();
  else if (path.includes("admin.html")) setupAdminPage();
  else setupDiscoverPage();
});
