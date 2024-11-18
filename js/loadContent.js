function loadContent(page) {
    const contentDiv = document.getElementById('content');
    fetch(`md/${page}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error loading content');
            }
            return response.text();
        })
        .then(markdown => {
            contentDiv.innerHTML = marked.parse(markdown); // Convert Markdown to HTML
        })
        .catch(error => {
            contentDiv.innerHTML = `<p class="text-danger">Failed to load content: ${error.message}</p>`;
        });
}
