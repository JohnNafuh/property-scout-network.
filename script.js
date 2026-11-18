
document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling for internal navigation links
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

  // Header appearance on scroll
  const header = document.querySelector(".site-header");

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  // Reveal sections as they enter the viewport
  const revealElements = document.querySelectorAll(
    ".intro-grid, .process-card, .requirements-content, .requirements-image, .application-placeholder"
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
  }

});
