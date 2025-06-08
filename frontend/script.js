// Global variable
const selectedSymptoms = [];

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initializeButtons();
  initializeAnimations();
  initializeStats();
  initializeStatusIndicator();

  // Create cherry blossoms periodically
  setInterval(createCherryBlossom, 300);
});

function initializeButtons() {
  const buttons = document.querySelectorAll('.service-btn, .learn-more');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });

    button.addEventListener('click', (e) => {
      createRippleEffect(e);
      handleButtonClick(button);
    });
  });
}

function createRippleEffect(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.className = 'ripple';
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);
}

function handleButtonClick(button) {
  if (button.classList.contains('chatbot-btn')) {
    window.location.href = '/chatbot';
  } else if (button.classList.contains('medicine-btn')) {
    window.location.href = '/medicine-recognition';
  } else if (button.classList.contains('eq-btn')) {
    window.location.href = '/eqtest.html';
  } else if (button.classList.contains('learn-more')) {
    const feature = button.closest('.feature');
    const featureTitle = feature.querySelector('h4').textContent;
    showFeatureModal(featureTitle);
  }
}

function initializeAnimations() {
  const features = document.querySelectorAll('.feature');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  features.forEach(feature => observer.observe(feature));
}

function initializeStats() {
  const stats = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element) {
  const final = parseInt(element.textContent);
  let current = 0;
  const increment = final / 50;
  const duration = 1500;
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= final) {
      element.textContent = element.textContent.includes('+') ? final + '+' : final;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }
  }, stepTime);
}

function initializeStatusIndicator() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');

  setInterval(() => {
    const online = Math.random() > 0.1;
    statusDot.className = 'status-dot ' + (online ? 'online' : 'offline');
    statusText.textContent = online ? 'System Online' : 'System Checking...';
  }, 5000);
}

function createCherryBlossom() {
  const blossom = document.createElement('div');
  blossom.className = 'cherry-blossom';
  blossom.style.left = Math.random() * 100 + 'vw';
  blossom.style.animationDuration = (Math.random() * 3 + 2) + 's';
  document.body.appendChild(blossom);
  setTimeout(() => blossom.remove(), 5000);
}

function showFeatureModal(title) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${title}</h3>
      <p>More information about ${title} coming soon...</p>
      <button class="close-modal">Close</button>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  });
}

// --- SYMPTOM CHECKER FUNCTIONS ---
function addSymptom() {
  const input = document.getElementById("symptomInput");
  const value = input.value.trim();
  if (value && !selectedSymptoms.includes(value)) {
    selectedSymptoms.push(value);
    input.value = "";
    updateSymptoms();
  }
}

function addPredefinedSymptom(symptom) {
  if (!selectedSymptoms.includes(symptom)) {
    selectedSymptoms.push(symptom);
    updateSymptoms();
  }
}

function removeSymptom(symptom) {
  const index = selectedSymptoms.indexOf(symptom);
  if (index > -1) {
    selectedSymptoms.splice(index, 1);
    updateSymptoms();
  }
}

function clearSymptoms() {
  selectedSymptoms.length = 0;
  updateSymptoms();
}

function updateSymptoms() {
  const container = document.getElementById("selectedSymptoms");
  const placeholder = document.getElementById("noSymptomsText");

  container.innerHTML = "";

  if (selectedSymptoms.length === 0) {
    placeholder.classList.remove("hidden");
  } else {
    placeholder.classList.add("hidden");

    selectedSymptoms.forEach(symptom => {
      const badge = document.createElement("span");
      badge.className = "bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2";
      badge.innerHTML = `
        ${symptom}
        <button onclick="removeSymptom('${symptom}')" class="text-red-600 font-bold">&times;</button>
      `;
      container.appendChild(badge);
    });
  }
}

function getDiagnosis() {
  if (selectedSymptoms.length === 0) {
    alert("Please add at least one symptom.");
    return;
  }

  // Show the loading spinner
  document.getElementById("loadingSpinner").classList.remove("hidden");
  document.getElementById("diagnosisResult").classList.add("hidden");

  fetch("/get_diagnosis", {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: "symptoms=" + encodeURIComponent(selectedSymptoms.join(", "))
  })
    .then(res => res.json())
    .then(data => {
      // Hide the spinner
      document.getElementById("loadingSpinner").classList.add("hidden");

      const resultBox = document.getElementById("diagnosisResult");

      if (data.response) {
        const cleanResponse = data.response
          .replace(/```html\s*/g, '')
          .replace(/```/g, '');

        // Set the response content
        resultBox.innerHTML = cleanResponse;
        resultBox.classList.remove("hidden");

        // ✅ Auto-scroll to result after a short delay
        setTimeout(() => {
          resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Slight delay ensures element is visible before scroll
      } else {
        resultBox.innerHTML = "<div class='info-card'><h3>Error</h3><p>Sorry, no diagnosis could be generated.</p></div>";
        resultBox.classList.remove("hidden");
      }
    })
    .catch(err => {
      alert("Error getting diagnosis: " + err);
      document.getElementById("loadingSpinner").classList.add("hidden");
    });
}


// ✅ Expose functions globally
window.addSymptom = addSymptom;
window.addPredefinedSymptom = addPredefinedSymptom;
window.removeSymptom = removeSymptom;
window.clearSymptoms = clearSymptoms;
window.getDiagnosis = getDiagnosis;
