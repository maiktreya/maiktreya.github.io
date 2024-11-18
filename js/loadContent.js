// Function to load configuration from config.yml
function loadConfig() {
    fetch('config.yml')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load configuration file.');
            }
            return response.text();
        })
        .then(yamlText => {
            const config = jsyaml.load(yamlText); // Parse YAML
            document.title = config.title; // Update page title
            document.querySelector('.navbar-brand').textContent = config.pageTopTitle;
            document.querySelector('#top-section-bg-text').textContent = config.topSectionBgText;
            document.querySelector('#home-subtitle').innerHTML = config.homeSubtitle;
            document.querySelector('#footer-copyright').innerHTML = config.copyrightText;
        })
        .catch(error => console.error('Error loading config:', error));
}

// Function to load Markdown content
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
            contentDiv.innerHTML = marked.parse(markdown);
        })
        .catch(error => {
            contentDiv.innerHTML = `<p class="text-danger">Failed to load content: ${error.message}</p>`;
        });
}

// Load configuration on page load
document.addEventListener('DOMContentLoaded', loadConfig);
