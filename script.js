let books = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 10; // adjust this if you want more/less per page

async function loadBooks() {
  const response = await fetch('books.json');
  books = await response.json();
  populateCategories();
  filteredBooks = books;
  displayBooks();
}

function populateCategories() {
  const categorySelect = document.getElementById('category');
  const cats = Array.from(new Set(books.map(b => b.cat))).sort();
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  cats.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function displayBooks() {
  const list = document.getElementById('book-list');
  list.innerHTML = '';

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const pageBooks = filteredBooks.slice(startIndex, endIndex);

  pageBooks.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.img || 'https://via.placeholder.com/120x160?text=No+Cover'}" alt="${book.title}" class="book-cover">
      <div class="book-details">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.auth || 'Unknown'}</p>
        <p><strong>Year:</strong> ${book.year || '—'}</p>
        <p><strong>Collection:</strong> ${book.cat || '—'}</p>
        ${book.desc ? `<p class="desc">${book.desc}</p>` : ''}
        <a href="${book.link}" target="_blank" class="read-btn">📖 Read Book</a>
      </div>
    `;
    list.appendChild(card);
  });

  updatePagination();
}

function filterBooks() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('category').value;

  filteredBooks = books.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm) ||
      (b.auth && b.auth.toLowerCase().includes(searchTerm));
    const matchesCategory =
      selectedCategory === 'all' || b.cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  currentPage = 1; // reset to first page
  displayBooks();
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  if (totalPages <= 1) return;

  const prev = document.createElement('button');
  prev.textContent = '⟨ Prev';
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    displayBooks();
  };
  pagination.appendChild(prev);

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  pagination.appendChild(pageInfo);

  const next = document.createElement('button');
  next.textContent = 'Next ⟩';
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    displayBooks();
  };
  pagination.appendChild(next);
}

// Event listeners
document.getElementById('search').addEventListener('input', filterBooks);
document.getElementById('category').addEventListener('change', filterBooks);

loadBooks();
