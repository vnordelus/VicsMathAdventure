
let playerName = "";

document.getElementById("startBtn").addEventListener("click", () => {
  const input = document.getElementById("playerNameInput").value.trim();

  if (!input) return alert("Please enter your name");

  playerName = input;
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("mapScreen").style.display = "block";

  showMap();
});


const mapLocations = [
  {
    id: 1,
    name: "Addition Alley",
    description: "Where numbers come together!",
    level: 1,
  },
  {
    id: 2,
    name: "Subtraction Square",
    description: "Take away and conquer!",
    level: 2,
  },
  {
    id: 3,
    name: "Multiplication Mountain",
    description: "Climb to higher numbers!",
    level: 3,
  },
  {
    id: 4,
    name: "Division Desert",
    description: "Split wisely to survive!",
    level: 4,
  },
  {
    id: 5,
    name: "Fraction City",
    description: "Where numbers live in pieces!",
    level: 5,
  },
];


function showMap() {
  const mapScreen = document.getElementById("mapScreen");
  mapScreen.innerHTML = `<h2>🗺️ Math World Map</h2>`;

  mapLocations.forEach((loc) => {
    const btn = document.createElement("button");
    btn.className = "map-location";
    btn.textContent = loc.name;

    btn.onclick = () => enterLocation(loc);

    mapScreen.appendChild(btn);
  });
}


function enterLocation(location) {
  document.getElementById("mapScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  questionEl.textContent = `👋 Hi ${playerName}, welcome to ${location.name}!`;
  feedbackEl.textContent = location.description;

  currentLevel = location.level;
  score = 0;

  setTimeout(() => loadQuestions(currentLevel), 1500);
}




// ======================
// AUDIO
// ======================
const bgMusic = new Audio("/audio/background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

const correctSound = new Audio("/audio/correct.mp3");
correctSound.volume = 0.7;

const wrongSound = new Audio("/audio/wrong.mp3");
wrongSound.volume = 0.7;

let musicStarted = false;

function startMusic() {
  if (!musicStarted) {
    bgMusic.play().catch(() => {});
    musicStarted = true;
  }
}


const API_BASE = "/api";

let questions = [];
let currentIndex = 0;
let score = 0;
let currentLevel = 1;

const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");

/* ======================
   LOAD QUESTIONS
====================== */
async function loadQuestions(levelId = 1) {
  try {
    const res = await fetch(`${API_BASE}/questions?level_id=${levelId}`);
    questions = await res.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      questionEl.textContent = "🏁 You completed all levels!";
      feedbackEl.textContent = "";
      submitBtn.disabled = true;
      return;
    }

    currentIndex = 0;
    showQuestion();
  } catch (err) {
    questionEl.textContent = "Failed to load questions.";
    console.error(err);
  }
}

/* ======================
   SHOW QUESTION
====================== */
function showQuestion() {
  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  answerInput.value = "";
  feedbackEl.textContent = "";
}

/* ======================
   SUBMIT ANSWER
====================== */
submitBtn.addEventListener("click", async () => {

  startMusic();

  const userAnswer = answerInput.value;
  if (userAnswer === "") return;

  const questionId = questions[currentIndex].id;

  try {
    const res = await fetch(`${API_BASE}/questions/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        user_answer: userAnswer,
      }),
    });

    const data = await res.json();

    if (data.correct) {
      score += 10;
      feedbackEl.textContent = "✅ Correct!";
      feedbackEl.style.color = "green";

       correctSound.currentTime = 0; // 👈 IMPORTANT
       correctSound.play().catch(() => {});  

    } else {
      feedbackEl.textContent = "❌ Try again!";
      feedbackEl.style.color = "red";
 
        wrongSound.currentTime = 0; // 👈 IMPORTANT
        wrongSound.play().catch(() => {});
    }

    scoreEl.textContent = `Score: ${score}`;
    setTimeout(nextQuestion, 1000);
  } catch (err) {
    feedbackEl.textContent = "Error submitting answer";
    console.error(err);
  }
});

/* ======================
   NEXT QUESTION
====================== */
function nextQuestion() {
  currentIndex++;

  if (currentIndex >= questions.length) {
    feedbackEl.textContent = "🎉 Level complete!";
    questionEl.textContent = "Loading next level...";
    currentLevel++;
    loadQuestions(currentLevel);
    return;
  }

  showQuestion();
}

/* ======================
   START GAME
====================== */
loadQuestions(currentLevel);
