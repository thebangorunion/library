async function loadBooks() {
    const res = await fetch("/data/books.json");
    return res.json();
}

function getBookIdFromUrl() {
    return new URLSearchParams(window.location.search).get("id");
}

async function displayBook() {
    const books = await loadBooks();
    const bookId = getBookIdFromUrl();
    const book = books.find(b => b.id == bookId);

    if (!book) {
        document.getElementById("book-details").innerHTML = "<p>Book not found!</p>";
        return;
    }

    document.getElementById("title").textContent = book.title;
    document.getElementById("author").textContent = `by ${book.author}`;
    document.getElementById("language").textContent = `Language: ${book.language}`;
    document.getElementById("subjects").textContent = `Subjects: ${book.subjects.join(", ")}`;
    document.getElementById("read-link").href = book.html_url;
}

displayBook();
