// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Mode toggle logic
const modeSelect = document.getElementById("mode");
const resolutionContainer = document.getElementById("resolutionContainer");
const resolutionTextarea = document.getElementById("resolutionText");

// Simple persistence keys
const STORAGE_KEYS = {
  country: "caucusai_country",
  committee: "caucusai_committee",
  topic: "caucusai_topic",
  mode: "caucusai_mode",
  resolutionText: "caucusai_resolutionText"
};

// Restore last session values
document.addEventListener("DOMContentLoaded", () => {
  const countryInput = document.getElementById("country");
  const committeeInput = document.getElementById("committee");
  const topicInput = document.getElementById("topic");

  const savedCountry = localStorage.getItem(STORAGE_KEYS.country);
  const savedCommittee = localStorage.getItem(STORAGE_KEYS.committee);
  const savedTopic = localStorage.getItem(STORAGE_KEYS.topic);
  const savedMode = localStorage.getItem(STORAGE_KEYS.mode);
  const savedResolutionText = localStorage.getItem(STORAGE_KEYS.resolutionText);

  if (savedCountry) countryInput.value = savedCountry;
  if (savedCommittee) committeeInput.value = savedCommittee;
  if (savedTopic) topicInput.value = savedTopic;

  if (savedMode) {
    modeSelect.value = savedMode;
    // Trigger change handler so resolution container / placeholder are correct
    modeSelect.dispatchEvent(new Event("change"));
  }

  if (savedResolutionText) {
    resolutionTextarea.value = savedResolutionText;
  }
});

modeSelect.addEventListener("change", () => {
  const mode = modeSelect.value;

  if (
    mode === "Stress Test" ||
    mode === "Resolution Audit" ||
    mode === "Opposition Simulation" ||
    mode === "Position Paper Grading" ||
    mode === "Resolution Writer" ||
    mode === "Opening Speech Maker"
  ) {
    resolutionContainer.style.display = "block";
    resolutionContainer.style.animation = "fadeIn 0.3s ease-in";
    
    // Update placeholder based on mode
    if (mode === "Position Paper Grading") {
      resolutionTextarea.placeholder = "Paste your position paper here for AI grading and feedback...";
    } else if (mode === "Resolution Writer") {
      resolutionTextarea.placeholder = "Describe your resolution idea, key points, and goals (e.g., 'Create a global fund for climate adaptation with specific funding mechanisms and oversight committee...')";
    } else if (mode === "Opening Speech Maker") {
      resolutionTextarea.placeholder = "Describe your country's position, key arguments, and speech goals (e.g., 'As Brazil, we strongly support climate action but need developed nations to provide funding and technology transfer...')";
    } else {
      resolutionTextarea.placeholder = "Paste resolution or idea here...";
    }
  } else {
    resolutionContainer.style.display = "none";
  }
});


// Main generation function
async function generatePlan() {
  const countryInput = document.getElementById("country");
  const committeeInput = document.getElementById("committee");
  const topicInput = document.getElementById("topic");
  const resolutionTextArea = document.getElementById("resolutionText");

  const country = countryInput.value.trim();
  const committee = committeeInput.value.trim();
  const topic = topicInput.value.trim();
  const mode = document.getElementById("mode").value;
  const resolutionText = resolutionTextArea.value.trim();

  // Basic validation
  if (!country || !committee || !topic) {
    alert("Please fill in all required fields.");
    return;
  }

  const modesRequiringText = new Set([
    "Stress Test",
    "Resolution Audit",
    "Opposition Simulation",
    "Position Paper Grading",
    "Resolution Writer",
    "Opening Speech Maker"
  ]);

  if (modesRequiringText.has(mode) && !resolutionText) {
    alert("Please provide resolution text for this mode.");
    return;
  }

  // Persist latest values so they are restored on next visit
  try {
    localStorage.setItem(STORAGE_KEYS.country, country);
    localStorage.setItem(STORAGE_KEYS.committee, committee);
    localStorage.setItem(STORAGE_KEYS.topic, topic);
    localStorage.setItem(STORAGE_KEYS.mode, mode);
    localStorage.setItem(STORAGE_KEYS.resolutionText, resolutionText);
  } catch (e) {
    console.warn("Unable to access localStorage for persistence.", e);
  }

  const btn = document.getElementById("generateBtn");
  const btnText = document.querySelector(".btn-text");
  const spinner = document.getElementById("spinner");
  const output = document.getElementById("output");

  btn.disabled = true;
  btnText.textContent = "Strategizing...";
  spinner.style.opacity = "1";
  output.innerHTML = "";

  try {
    const response = await fetch(
      "https://caucusai-backend.onrender.com/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          country,
          committee,
          topic,
          mode,
          resolutionText
        })
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (data && (data.error || data.message)) ||
        `Request failed (${response.status})`;
      output.innerHTML = `Error: ${message}`;
      return;
    }

    if (data && data.output) {
      output.innerHTML = data.output.replace(/\n/g, "<br>");
      output.style.animation = "fadeIn 0.5s ease-in";
    } else {
      output.innerHTML = "No strategy generated. Please try again.";
    }

  } catch (err) {
    output.innerHTML = "Error generating strategy. Please check your connection and try again.";
    console.error(err);
  }

  btn.disabled = false;
  btnText.textContent = "Generate Strategy";
  spinner.style.opacity = "0";
}