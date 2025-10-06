let books = [];

async function loadBooks() {
  const response = await fetch('books.json');
  books = await response.json();
  populateCategories();
  displayBooks(books);
}

function populateCategories() {
  const categorySelect = document.getElementById('category');
  const cats = Array.from(new Set(books.map(b => b.cat)));
  cats.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function displayBooks(bookArray) {
  const list = document.getElementById('book-list');
  list.innerHTML = '';
  bookArray.forEach(book => {
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
}

function filterBooks() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('category').value;

  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm) || b.author.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || b.cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  displayBooks(filtered);
}

document.getElementById('search').addEventListener('input', filterBooks);
document.getElementById('category').addEventListener('change', filterBooks);

loadBooks();
