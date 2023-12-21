

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', "teaching", "portfolio", "contact"]

// Path to your portfolio markdown file
const markdownFile = 'github/iliciuv.github.io/contents/portfolio.md';

fetch(markdownFile)
  .then(response => response.text())
  .then(md => {
    // Converting Markdown to HTML
    const htmlContent = marked(md);

    // Splitting the content into separate projects (assuming they are divided by headers)
    const projects = htmlContent.split(/<h2>/i).slice(1);  // Assuming each project starts with an H2 tag

    const portfolioContent = document.getElementById('portfolio-content');
    projects.forEach(project => {
      portfolioContent.innerHTML += `
        <div class="portfolio-card">
          <h2>${project}</h2>
        </div>
      `;
    });
  })
  .catch(error => console.log('Error loading Markdown file:', error));

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

});
