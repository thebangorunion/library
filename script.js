let books = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 20; // adjust number of books per page

async function loadBooks() {
  const response = await fetch('books.json');
  books = await response.json();
  populateCategories();
  filteredBooks = books;
  displayBooks();
  updatePagination();
}

function populateCategories() {
  const categorySelect = document.getElementById('category');
  const cats = Array.from(new Set(books.map(b => b.cat)));
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

  // Calculate slice for current page
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const pageBooks = filteredBooks.slice(startIndex, endIndex);

  // Display each book card
  pageBooks.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>In:</strong> ${book.cat}</p>
      <a href="${book.link}" target="_blank">Read Book</a>
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
      b.author.toLowerCase().includes(searchTerm);
    const matchesCategory =
      selectedCategory === 'all' || b.cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  currentPage = 1; // reset to first page after filtering
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
  pageInfo.style.margin = '0 10px';
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
