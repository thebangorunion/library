let books = [];
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 20;

async function loadBooks() {
  const response = await fetch('books.json');
  books = await response.json();
  populateCategories();
  filteredBooks = books;
  displayBooks();
}

function populateCategories() {
  const categorySelect = document.getElementById('category');

  // Flatten all categories from all books and remove duplicates
  const allCats = books.flatMap(b => b.cat || []);
  const uniqueCats = Array.from(new Set(allCats)).sort();

  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  uniqueCats.forEach(cat => {
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

  pageBooks.forEach((book) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.img || 'https://via.placeholder.com/120x160?text=No+Cover'}" alt="${book.title}" class="book-cover">
      <div class="book-details">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.auth || 'Unknown'}</p>
        <p><strong>Year:</strong> ${book.year || '—'}</p>
        <p><strong>Collection:</strong> ${book.cat ? book.cat.join(', ') : '—'}</p>
        <a href="book.html?id=${encodeURIComponent(book.title)}" class="read-btn">View Details</a>
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

    // Check if book categories include the selected category
    const matchesCategory =
      selectedCategory === 'all' || (b.cat && b.cat.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  currentPage = 1;
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
