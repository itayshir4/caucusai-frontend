async function generatePlan() {
  document.getElementById("output").innerText = "Generating...";

  const country = document.getElementById("country").value;
  const committee = document.getElementById("committee").value;
  const topic = document.getElementById("topic").value;
  const mode = document.getElementById("mode").value;

  try {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, committee, topic, mode })
    });

    const data = await response.json();
    document.getElementById("output").innerText = data.output;
  } catch (error) {
    document.getElementById("output").innerText = "Error connecting to backend.";
  }
}