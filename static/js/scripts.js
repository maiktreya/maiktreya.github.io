const content_dir = "contents/";
const config_file = "config.yml";
const section_names = [
  "home",
  "publications",
  "teaching",
  "portfolio",
  "contact",
];

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Yaml
  fetch(content_dir + config_file)
    .then((response) => response.text())
    .then((text) => {
      const yml = jsyaml.load(text);
      Object.keys(yml).forEach((key) => {
        try {
          document.getElementById(key).innerHTML = yml[key];
        } catch {
          console.log(
            "Unknown id and value: " + key + "," + yml[key].toString()
          );
        }
      });
    })
    .catch((error) => console.log(error));

  // Marked
  marked.use({ mangle: false, headerIds: false });
  section_names.forEach((name, idx) => {
    fetch(content_dir + name + ".md")
      .then((response) => response.text())
      .then((markdown) => {
        let html;

        if (name === "portfolio") {
          // Special handling for the portfolio section
          html = marked.parse(markdown);
          const sections = html.split(/<h2>/i).slice(1);
          let portfolioHTML = "";

          sections.forEach((section) => {
            const projects = section.split(/<h3>/i).slice(1);
            projects.forEach((project) => {
              portfolioHTML += `
                <div class="portfolio-card">
                  <h3>${project}</h3>
                </div>
              `;
            });
          });

          document.getElementById(name + "-content").innerHTML = portfolioHTML;
        } else {
          // Normal handling for other sections
          html = marked.parse(markdown);
          document.getElementById(name + "-md").innerHTML = html;
        }
      })
      .then(() => {
        // MathJax
        MathJax.typeset();
      })
      .catch((error) => console.log(error));
  });
});

// to interact (show/hide portfolio iframes)
// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Setting up the show iframe functionality
  var iframeButton = document.getElementById("showIframeBtn");
  if (iframeButton) {
    // Check if the button exists
    iframeButton.addEventListener("click", function () {
      var iframe = document.querySelector(".portfolio-iframe");
      var overlay = document.querySelector(".overlay");
      if (iframe && overlay) {
        // Check if the iframe and overlay exist
        iframe.style.display = "block"; // Show the iframe
        overlay.style.display = "block"; // Show the overlay
      } else {
        console.error("Iframe or overlay not found for showing!");
      }
    });
  } else {
    console.error("Button not found for showing iframe!");
  }

  // Setting up the hide iframe functionality
  var overlay = document.querySelector(".overlay");
  if (overlay) {
    // Check if the overlay exists
    overlay.addEventListener("click", function () {
      var iframe = document.querySelector(".portfolio-iframe");
      if (iframe) {
        // Check if the iframe exists
        iframe.style.display = "none"; // Hide the iframe
        overlay.style.display = "none"; // Hide the overlay
      } else {
        console.error("Iframe or overlay not found for hiding!");
      }
    });
  } else {
    console.error("Overlay not found for hiding iframe!");
  }
});

// Refracted from index.html
MathJax = {
  tex: { inlineMath: [["$", "$"]] },
};
