
// ==========================================
// PROPERTY SCOUT NETWORK
// Main website functionality + Supabase form
// ==========================================

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

// Smooth scrolling
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
const submitButton = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

function getFieldValue(form, id, name) {
  const field =
    document.getElementById(id) ||
    form.elements.namedItem(name);

  return field ? field.value.trim() : "";
}

function showMessage(message, type) {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = "form-message " + type;
}

if (form) {
  form.addEventListener("submit", async event => {
    event.preventDefault();

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

    const consentField =
      document.getElementById("consent") ||
      form.elements.namedItem("consent");

    if (!consentField || !consentField.checked) {
      showMessage(
        "Please confirm your consent before submitting.",
        "error"
      );
      return;
    }

    const application = {
      full_name: getFieldValue(form, "fullName", "fullName"),
      email: getFieldValue(form, "email", "email"),
      phone: getFieldValue(form, "phone", "phone"),
      location: getFieldValue(form, "location", "location"),
      platforms: platforms,
      marketplace: getFieldValue(form, "marketplace", "marketplace"),
      experience: getFieldValue(form, "experience", "experience"),
      social_link: getFieldValue(form, "socialLink", "socialLink"),
      availability: getFieldValue(form, "availability", "availability"),
      hours_per_week: getFieldValue(form, "hours", "hours"),
      introduction: getFieldValue(form, "introduction", "introduction"),
      consent: true
    };

    if (!application.full_name ||
        !application.email ||
        !application.phone ||
        !application.location) {
      showMessage(
        "Please complete all required fields.",
        "error"
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    showMessage("Submitting your application...", "loading");

    try {
      const { error } = await db
        .from("applications")
        .insert([application]);

      if (error) {
        throw error;
      }

      showMessage(
        "Your application has been submitted successfully. Thank you for your interest in Property Scout Network.",
        "success"
      );

      form.reset();

    } catch (error) {
      console.error("Application submission error:", error);

      showMessage(
        "We couldn't submit your application. Please try again shortly.",
        "error"
      );

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Application";
    }
  });
}
