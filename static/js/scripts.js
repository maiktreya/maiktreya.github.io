// Content directory and configuration file
const content_dir = "contents/";
const config_file = "config.yml";

// Section names for dynamic content injection
const section_names = [
  "home",
  "publications",
  "teaching",
  "portfolio",
  "contact",
];

// MathJax configuration
MathJax = {
  tex: { inlineMath: [["$", "$"]] },
};

// Event listener for DOMContentLoaded
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOMContentLoaded event fired.");

  // Activate Bootstrap ScrollSpy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    console.log("Initializing ScrollSpy on mainNav...");
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });
  } else {
    console.error("mainNav element not found!");
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

  // Load YAML configuration file
  fetch(content_dir + config_file)
    .then((response) => response.text())
    .then((text) => {
      const yml = jsyaml.load(text);
      Object.keys(yml).forEach((key) => {
        const element = document.getElementById(key);
        if (element) {
          element.innerHTML = yml[key];
        } else {
          console.warn(`Element with id '${key}' not found.`);
        }
      });
    })
    .catch((error) => console.error("Error loading YAML configuration:", error));

  // Load Markdown files for sections
  marked.use({ mangle: false, headerIds: false });
  section_names.forEach((name) => {
    fetch(content_dir + name + ".md")
      .then((response) => response.text())
      .then((markdown) => {
        const html = marked.parse(markdown);
        const sectionContainer =
          name === "portfolio"
            ? document.getElementById(name + "-content")
            : document.getElementById(name + "-md");

        if (sectionContainer) {
          sectionContainer.innerHTML = html;
          console.log(`Injected content into ${name}.`);
        } else {
          console.error(`Container for section '${name}' not found!`);
        }
      })
      .then(() => {
        // Ensure MathJax processes the loaded content
        if (window.MathJax) {
          MathJax.startup.promise
            .then(() => {
              MathJax.typeset();
              console.log("MathJax typeset completed.");
            })
            .catch((err) => console.error("MathJax startup error:", err));
        }
      })
      .catch((error) => console.error(`Error loading Markdown for '${name}':`, error));
  });
});

// Portfolio iframe show/hide functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("Setting up portfolio iframe interactions.");

  // Show iframe
  const iframeButton = document.getElementById("showIframeBtn");
  if (iframeButton) {
    iframeButton.addEventListener("click", function () {
      const iframe = document.querySelector(".portfolio-iframe");
      const overlay = document.querySelector(".overlay");
      if (iframe && overlay) {
        iframe.style.display = "block"; // Show iframe
        overlay.style.display = "block"; // Show overlay
        console.log("Portfolio iframe shown.");
      } else {
        console.error("Iframe or overlay not found for showing!");
      }
    });
  } else {
    console.error("Button for showing iframe not found!");
  }

  // Hide iframe
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.addEventListener("click", function () {
      const iframe = document.querySelector(".portfolio-iframe");
      if (iframe) {
        iframe.style.display = "none"; // Hide iframe
        overlay.style.display = "none"; // Hide overlay
        console.log("Portfolio iframe hidden.");
      } else {
        console.error("Iframe not found for hiding!");
      }
    });
  } else {
    console.error("Overlay for hiding iframe not found!");
  }
});
document.getElementById("showIframeBtn").addEventListener("click", function() {
  document.getElementById("iframeContainer").style.display = "block";
});

document.getElementById("closeIframeBtn").addEventListener("click", function() {
  document.getElementById("iframeContainer").style.display = "none";
});
