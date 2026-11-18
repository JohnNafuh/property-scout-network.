
const SUPABASE_URL = "https://utoigfnkwglynhjghxen.supabase.co";
const SUPABASE_KEY = "sb_publishable_nrmSSKHwjpPQshxUa16J_w_5CGV9HcI";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ==========================================
// NAVIGATION
// ==========================================

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ==========================================
// REVEAL ANIMATIONS
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

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

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// ==========================================
// APPLICATION FORM
// ==========================================

const form = document.getElementById("scoutForm");

if (form) {
  let isSubmitting = false;

  let formMessage = document.getElementById("formMessage");

  // Create a feedback area if one is missing
  if (!formMessage) {
    formMessage = document.createElement("div");
    formMessage.id = "formMessage";
    form.appendChild(formMessage);
  }

  formMessage.setAttribute("role", "status");
  formMessage.setAttribute("aria-live", "polite");

  const submitButton = document.getElementById("submitBtn");

  const originalButtonText = submitButton
    ? submitButton.textContent
    : "Submit Application";

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = "form-message " + type;
    formMessage.style.display = "block";

    formMessage.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function getValue(id, name) {
    const field =
      document.getElementById(id) ||
      form.elements.namedItem(name);

    return field ? field.value.trim() : "";
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const platforms = Array.from(
      form.querySelectorAll('input[name="platforms"]:checked')
    ).map(input => input.value);

    if (platforms.length === 0) {
      showMessage(
        "Please select at least one social media platform.",
        "error"
      );
      return;
    }

    const consent = document.getElementById("consent");

    if (!consent || !consent.checked) {
      showMessage(
        "Please confirm your consent before submitting.",
        "error"
      );
      return;
    }

    const application = {
      full_name: getValue("fullName", "fullName"),
      email: getValue("email", "email"),
      phone: getValue("phone", "phone"),
      location: getValue("location", "location"),
      platforms,
      marketplace: getValue("marketplace", "marketplace"),
      experience: getValue("experience", "experience"),
      social_link: getValue("socialLink", "socialLink"),
      availability: getValue("availability", "availability"),
      hours_per_week: getValue("hours", "hours"),
      introduction: getValue("introduction", "introduction"),
      consent: true
    };

    if (
      !application.full_name ||
      !application.email ||
      !application.phone ||
      !application.location
    ) {
      showMessage(
        "Please complete all required fields.",
        "error"
      );
      return;
    }

    if (!window.supabase) {
      showMessage(
        "The application service is temporarily unavailable. Please try again later.",
        "error"
      );
      return;
    }

    isSubmitting = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting application...";
    }

    showMessage(
      "Your application is being submitted. Please wait...",
      "loading"
    );

    try {
      const { error } = await db
        .from("applications")
        .insert([application]);

      if (error) throw error;

      form.reset();

      showMessage(
        "APPLICATION RECEIVED\n\nThank you for applying to Property Scout Network. Your application has been submitted successfully. Our team will review your information and contact you regarding the next steps.",
        "success"
      );

    } catch (error) {
      console.error("Application submission error:", error);

      showMessage(
        "WE COULDN'T SUBMIT YOUR APPLICATION\n\nYour application was not confirmed. Please check your connection and try again. If the problem continues, contact our team.",
        "error"
      );

    } finally {
      isSubmitting = false;

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
