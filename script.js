
document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });


  // Header shadow on scroll
  const header = document.querySelector(".site-header");

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }


  // Reveal sections
  const revealElements = document.querySelectorAll(
    ".intro-grid, .process-card, .requirements-content, .requirements-image, .application-container"
  );

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => {
      element.classList.add("reveal");
      observer.observe(element);
    });

  } else {

    revealElements.forEach(element => {
      element.classList.add("visible");
    });

  }


  // Application form validation
  const form = document.getElementById("scoutForm");
  const message = document.getElementById("formMessage");

  if (form && message) {

    form.addEventListener("submit", event => {

      event.preventDefault();

      message.classList.remove("visible");

      // Check selected social media platforms
      const selectedPlatforms = form.querySelectorAll(
        'input[name="platforms"]:checked'
      );

      if (selectedPlatforms.length === 0) {

        message.textContent =
          "Please select at least one social media platform.";

        message.classList.add("visible");

        form.querySelector('input[name="platforms"]').focus();

        return;
      }

      // Check required fields
      if (!form.checkValidity()) {

        form.reportValidity();

        return;
      }

      // Backend connection will be added next
      message.textContent =
        "Your information is complete. Online application submission will be activated once the secure registration database is connected.";

      message.classList.add("visible");

      message.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

    });

  }

});
