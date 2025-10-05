async function loadBooks() {
    const res = await fetch("data/books.json");
    return res.json();
}

async function handleSearch() {
    const query = document.getElementById("search").value.toLowerCase();
    const books = await loadBooks();
    const results = books.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
    );

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = results.length ? '' : 'No books found.';

    results.forEach(b => {
        resultsDiv.innerHTML += `<div>
            <a href="/book.html?id=${b.id}">${b.title}</a> by ${b.author}
        </div>`;
    });
}
