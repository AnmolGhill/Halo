// Add animated diagnosis result display
function showDiagnosis(content) {
  const resultDiv = document.getElementById("diagnosisResult");
  resultDiv.innerHTML = content;

  // Remove hidden and trigger animation
  resultDiv.classList.remove("hidden");
  resultDiv.classList.add("show"); // This triggers the CSS animation
}

// Example trigger (you can call this inside getDiagnosis() in script.js)
/*
showDiagnosis(`
  <h4 class="text-xl font-semibold text-green-700">Diagnosis Result</h4>
  <p><strong>Summary:</strong> Your symptoms may indicate a mild flu.</p>
  <p><strong>Medicines:</strong> Paracetamol, Ibuprofen</p>
  <p><strong>Things to avoid:</strong> Cold drinks, exposure to rain</p>
`);
*/
