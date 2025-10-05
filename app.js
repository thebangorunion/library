const booksDiv = document.getElementById('books');
const searchInput = document.getElementById('search');
let nextUrl = null;
let prevUrl = null;

async function searchBooks(url = null) {
    const query = searchInput.value;
    booksDiv.innerHTML = 'Loading...';
    const apiUrl = url || `https://gutendex.com/books?search=${query}`;
    const books = await fetchBooks(apiUrl);

    booksDiv.innerHTML = '';
    if (!books.length) {
        booksDiv.innerHTML = 'No books found.';
        return;
    }

    books.slice(0, 10).forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.innerHTML = `
            <div class="book-title">${book.title}</div>
            <div>By: ${book.authors.map(a => a.name).join(', ') || 'Unknown'}</div>
            <div><a href="${book.formats['text/html']}" target="_blank">Read Online</a></div>
        `;
        booksDiv.appendChild(bookDiv);
    });

    showPagination();
}


async function fetchBooks(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        nextUrl = data.next;
        prevUrl = data.previous;
        return data.results;
    } catch (err) {
        booksDiv.innerHTML = 'Error loading books: ' + err.message;
        return [];
    }
}



function showPagination() {
    const paginationDiv = document.createElement('div');
    paginationDiv.style.marginTop = '20px';

    if (prevUrl) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.onclick = () => searchBooks(prevUrl);
        paginationDiv.appendChild(prevBtn);
    }

    if (nextUrl) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.style.marginLeft = '10px';
        nextBtn.onclick = () => searchBooks(nextUrl);
        paginationDiv.appendChild(nextBtn);
    }

    booksDiv.appendChild(paginationDiv);
}

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBooks();
});


// Load some books on page load
searchBooks('https://gutendex.com/books');

