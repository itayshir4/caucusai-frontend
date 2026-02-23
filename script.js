const modeSelect = document.getElementById("mode");
const resolutionContainer = document.getElementById("resolutionContainer");

// Show/hide resolution textarea based on mode
modeSelect.addEventListener("change", () => {
  const mode = modeSelect.value;

  if (
    mode === "Stress Test" ||
    mode === "Resolution Audit" ||
    mode === "Opposition Simulation"
  ) {
    resolutionContainer.style.display = "block";
  } else {
    resolutionContainer.style.display = "none";
  }
});

async function generatePlan() {
  const country = document.getElementById("country").value;
  const committee = document.getElementById("committee").value;
  const topic = document.getElementById("topic").value;
  const mode = document.getElementById("mode").value;
  const resolutionText = document.getElementById("resolutionText").value;

  const btn = document.getElementById("generateBtn");
  const output = document.getElementById("output");

  btn.disabled = true;
  btn.innerText = "Strategizing...";
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
    } else {
      output.innerHTML = "No strategy generated.";
    }

  } catch (err) {
    output.innerHTML = "Error generating strategy.";
  }

  btn.disabled = false;
  btn.innerText = "Generate Strategy";
}