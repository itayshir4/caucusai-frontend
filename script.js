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

modeSelect.addEventListener("change", () => {
  const mode = modeSelect.value;

  if (
    mode === "Stress Test" ||
    mode === "Resolution Audit" ||
    mode === "Opposition Simulation" ||
    mode === "Position Paper Grading"
  ) {
    resolutionContainer.style.display = "block";
    resolutionContainer.style.animation = "fadeIn 0.3s ease-in";
    
    // Update placeholder based on mode
    if (mode === "Position Paper Grading") {
      resolutionTextarea.placeholder = "Paste your position paper here for AI grading and feedback...";
    } else {
      resolutionTextarea.placeholder = "Paste resolution or idea here...";
    }
  } else {
    resolutionContainer.style.display = "none";
  }
});


// Main generation function
async function generatePlan() {
  const country = document.getElementById("country").value.trim();
  const committee = document.getElementById("committee").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const mode = document.getElementById("mode").value;
  const resolutionText = document.getElementById("resolutionText").value.trim();

  // Basic validation
  if (!country || !committee || !topic) {
    alert("Please fill in all required fields.");
    return;
  }

  if ((mode === "Stress Test" || mode === "Resolution Audit" || mode === "Opposition Simulation") && !resolutionText) {
    alert("Please provide resolution text for this mode.");
    return;
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

    const data = await response.json();

    if (data.output) {
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