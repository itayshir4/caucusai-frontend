async function generatePlan() {
  document.getElementById("output").innerText = "Generating...";

  const country = document.getElementById("country").value;
  const committee = document.getElementById("committee").value;
  const topic = document.getElementById("topic").value;
  const mode = document.getElementById("mode").value;
  const resolutionText = document.getElementById("resolutionText").value;

  try {
  const response = await fetch("https://caucusai-backend.onrender.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  country,
  committee,
  topic,
  mode,
  resolutionText
})
    });

    const data = await response.json();
    document.getElementById("output").innerText = data.output;
  } catch (error) {
    document.getElementById("output").innerText = "Error connecting to backend.";
  }
}