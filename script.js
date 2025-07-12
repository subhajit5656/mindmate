// Page navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetPage = link.getAttribute('data-page');

    pages.forEach(page => {
      page.classList.toggle('active', page.id === targetPage);
    });

    navLinks.forEach(nav => nav.classList.remove('active'));
    link.classList.add('active');
  });
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = darkModeToggle.querySelector('i');
  if(document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
  }
});

// Mood Tracker
const moodForm = document.getElementById('moodForm');
const moodValueInput = document.getElementById('moodValue');
const moodNoteInput = document.getElementById('moodNote');
const moodFeedback = document.getElementById('moodFeedback');
const moodChartCanvas = document.getElementById('moodChart');

let moodData = JSON.parse(localStorage.getItem('moodData')) || [];

function updateMoodChart() {
  const ctx = moodChartCanvas.getContext('2d');
  if(window.moodChartInstance) {
    window.moodChartInstance.destroy();
  }
  const labels = moodData.map(entry => entry.date);
  const moods = moodData.map(entry => entry.mood);

  window.moodChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Mood Level',
        data: moods,
        backgroundColor: 'rgba(74,144,226,0.3)',
        borderColor: 'rgba(74,144,226,1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgba(74,144,226,1)'
      }]
    },
    options: {
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: { stepSize: 1 },
          title: { display: true, text: 'Mood (1-5)' }
        },
        x: {
          title: { display: true, text: 'Date' }
        }
      },
      plugins: {
        legend: { display: false }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

moodForm.addEventListener('submit', e => {
  e.preventDefault();
  const moodValue = parseInt(moodValueInput.value);
  const note = moodNoteInput.value.trim();

  if(isNaN(moodValue) || moodValue < 1 || moodValue > 5) {
    moodFeedback.textContent = "Please enter a valid mood value between 1 and 5.";
    moodFeedback.style.color = "crimson";
    return;
  }
  moodFeedback.style.color = "#4a90e2";

  const today = new Date().toISOString().split('T')[0];
  const existingIndex = moodData.findIndex(e => e.date === today);

  if(existingIndex > -1) {
    moodData[existingIndex] = {date: today, mood: moodValue, note};
  } else {
    moodData.push({date: today, mood: moodValue, note});
    if(moodData.length > 7) moodData.shift(); // keep last 7 days
  }

  localStorage.setItem('moodData', JSON.stringify(moodData));
  moodFeedback.textContent = "Mood saved successfully!";
  moodForm.reset();
  updateMoodChart();
});

updateMoodChart();

// Self-care suggestions
const suggestions = [
  "Take 5 deep breaths focusing on your breath.",
  "Write down 3 things you're grateful for today.",
  "Go for a 10-minute walk outside.",
  "Listen to your favorite calming music.",
  "Try a short mindfulness meditation.",
  "Reach out to a friend and share how you feel."
];

const getSuggestionBtn = document.getElementById('getSuggestionBtn');
const suggestionText = document.getElementById('suggestionText');

getSuggestionBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  suggestionText.textContent = suggestions[randomIndex];
});

// Peer support messages
const peerForm = document.getElementById('peerForm');
const peerMessageInput = document.getElementById('peerMessage');
const peerMessagesList = document.getElementById('peerMessages');

let peerMessages = JSON.parse(localStorage.getItem('peerMessages')) || [];

function renderPeerMessages() {
  peerMessagesList.innerHTML = '';
  peerMessages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    peerMessagesList.appendChild(li);
  });
}

peerForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = peerMessageInput.value.trim();
  if(!msg) return;

  peerMessages.push(msg);
  if(peerMessages.length > 10) peerMessages.shift();

  localStorage.setItem('peerMessages', JSON.stringify(peerMessages));
  peerMessageInput.value = '';
  renderPeerMessages();
});

renderPeerMessages();
