const booksDiv = document.getElementById('books');
const searchInput = document.getElementById('search');

async function fetchBooks(query = '') {
    const response = await fetch(`https://gutendex.com/books?search=${query}`);
    const data = await response.json();
    return data.results;
}

async function searchBooks() {
    const query = searchInput.value;
    booksDiv.innerHTML = 'Loading...';
    const books = await fetchBooks(query);

    booksDiv.innerHTML = '';
    if (books.length === 0) {
        booksDiv.innerHTML = 'No books found.';
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <div class="book-title">${book.title}</div>
            <div>By: ${book.authors.map(a => a.name).join(', ') || 'Unknown'}</div>
            <div><a href="${book.formats['text/html']}" target="_blank">Read Online</a></div>
        `;
        booksDiv.appendChild(bookDiv);
    });
}

// Load initial books
searchBooks();
