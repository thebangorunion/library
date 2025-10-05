async function searchBooks(query) {
  const gutendexURL = `https://gutendex.com/books?search=${encodeURIComponent(query)}`;
  const [pgData, localData] = await Promise.all([
    fetch(gutendexURL).then(r => r.json()),
    fetch('mybooks.json').then(r => r.json())
  ]);

  // Filter local matches manually
  const localMatches = localData.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  );

  // Merge results
  const allBooks = [...localMatches, ...(pgData.results || [])];
  displayBooks(allBooks);
}

function displayBooks(books) {
  const results = document.getElementById('results');
  results.innerHTML = '';
  if (books.length === 0) {
    results.innerHTML = '<p>No books found.</p>';
    return;
  }

  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book';
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.authors?.map(a => a.name).join(', ') || book.author}</p>
      <a href="${book.formats['text/html'] || book.formats['application/pdf'] || book.formats['application/epub+zip']}" target="_blank">
        Read / Download
      </a>
      <small>${book.source === 'local' ? 'Our Library' : 'Project Gutenberg'}</small>
    `;
    results.appendChild(div);
  });
}

// --- Search input handling ---
const searchInput = document.getElementById('search');

// Trigger live search as you type (after 2 chars)
searchInput.addEventListener('input', e => {
  const q = e.target.value.trim();
  if (q.length > 2) searchBooks(q);
});

// Also trigger search when you press Enter
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const q = e.target.value.trim();
    if (q) searchBooks(q);
  }
});
