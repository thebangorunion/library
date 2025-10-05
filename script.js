// Open eBook Library - Optimized Script
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("search");
  const results = document.getElementById("results");
  const status = document.getElementById("status");

  let localBooks = [];
  const cache = {};
  let debounceTimer;

  // ---- Load local book metadata ----
  async function loadLocal() {
    try {
      const res = await fetch("mybooks.json");
      if (!res.ok) throw new Error("Missing mybooks.json");
      localBooks = await res.json();
      console.log(`Loaded ${localBooks.length} local books.`);
    } catch (err) {
      console.warn("No local books found or failed to load:", err);
      localBooks = [];
    }
  }

  // ---- Utility helpers ----
  function setStatus(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? "crimson" : "#555";
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function pickLink(formats) {
    if (!formats) return null;
    const prefs = [
      "text/html",
      "application/epub+zip",
      "application/pdf",
      "text/plain"
    ];
    for (const p of prefs) {
      const found = Object.keys(formats).find(k => k.startsWith(p));
      if (found) return formats[found];
    }
    const keys = Object.keys(formats);
    return keys.length ? formats[keys[0]] : null;
  }

  // ---- Render book list ----
  function renderBooks(list) {
    results.innerHTML = "";
    if (!list || !list.length) {
      results.innerHTML = "<p>No books found.</p>";
      return;
    }

    list.forEach(b => {
      const title = escapeHtml(b.title || "Untitled");
      const author = escapeHtml(
        (b.authors && b.authors.map(a => a.name).join(", ")) || b.author || ""
      );
      const link =
        (b.formats && pickLink(b.formats)) ||
        b.download_url ||
        b.url ||
        "#";
      const source = b.source === "local" ? "Our Library" : "Project Gutenberg";

      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `
        <h3>${title}</h3>
        <p>${author}</p>
        <a href="${link}" target="_blank" rel="noopener">Read / Download</a>
        <small>${source}</small>
      `;
      results.appendChild(div);
    });
  }

  // ---- Main search logic ----
  async function searchBooks(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = "<p>Type a search term above (min 3 letters).</p>";
      setStatus("");
      return;
    }

    // Serve from cache instantly if available
    if (cache[q]) {
      renderBooks(cache[q]);
      setStatus("(cached)");
      return;
    }

    setStatus("Searching… ⏳");
    results.innerHTML = "";

    // Build URL
    const url = `https://gutendex.com/books?search=${encodeURIComponent(q)}`;

    // Parallel fetches
    try {
      const [pgRes, _] = await Promise.all([
        fetch(url, { signal: AbortSignal.timeout(10000) }).then(r => r.json()),
        Promise.resolve() // placeholder for extensibility
      ]);

      // Filter local
      const localMatches = localBooks.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );

      const pgResults = (pgRes.results || []).map(x => ({
        ...x,
        source: "project-gutenberg"
      }));

      const merged = [...localMatches, ...pgResults];
      cache[q] = merged; // store in cache

      renderBooks(merged);
      setStatus("");
    } catch (err) {
      console.error("Search failed:", err);
      setStatus("Search failed or timed out. Try again later.", true);
    }
  }

  // ---- Event handlers ----
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = input.value.trim();
    if (q.length >= 3) searchBooks(q);
    else setStatus("Please type at least 3 letters.");
  });

  // Debounce live typing
  input.addEventListener("input", e => {
    clearTimeout(debounceTimer);
    const q = e.target.value.trim();
    if (q.length < 3) return;
    debounceTimer = setTimeout(() => searchBooks(q), 500);
  });

  // ---- Init ----
  loadLocal().then(() => {
    results.innerHTML =
      "<p>Welcome! Search for public-domain books above.</p>";
  });
});
