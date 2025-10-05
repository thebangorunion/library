// Offline eBook Library using Fuse.js (no API calls)
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("search");
  const results = document.getElementById("results");
  const status = document.getElementById("status");

  let books = [];
  let fuse;

  function setStatus(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? "crimson" : "#666";
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  // Load local books JSON
  async function loadBooks() {
    try {
      const res = await fetch("books.json");
      books = await res.json();
      fuse = new Fuse(books, {
        keys: ["title", "author"],
        threshold: 0.3
      });
      setStatus(`Loaded ${books.length} books.`);
    } catch (err) {
      console.error("Failed to load books.json", err);
      setStatus("Error loading books list.", true);
    }
  }

  function render(list) {
    results.innerHTML = "";
    if (!list || list.length === 0) {
      results.innerHTML = "<p>No books found.</p>";
      return;
    }
    for (const b of list) {
      const title = escapeHtml(b.title);
      const author = escapeHtml(b.author);
      const link = b.formats?.pdf || b.formats?.html || b.formats?.epub || "#";
      const src = b.source === "local" ? "Our Library" : "Project Gutenberg";
      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `
        <h3>${title}</h3>
        <p>${author}</p>
        <a href="${link}" target="_blank" rel="noopener">Read / Download</a>
        <small>${src}</small>
      `;
      results.appendChild(div);
    }
  }

  async function doSearch(q) {
    const term = q.trim();
    if (!term) {
      render(books.slice(0, 10));
      setStatus("");
      return;
    }

    const resultsList = fuse.search(term).map(r => r.item);
    render(resultsList);
    setStatus(`Found ${resultsList.length} results.`);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    doSearch(input.value);
  });

  await loadBooks();
  render(books.slice(0, 10));
});
