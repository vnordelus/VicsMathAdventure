let score = 0;
let stars = 0;


const QUESTIONS = {
  addition: [
    { q: "5 + 3", a: "8" },
    { q: "10 + 6", a: "16" },
    { q: "7 + 9", a: "16" }
  ],
  subtraction: [
    { q: "9 - 4", a: "5" },
    { q: "15 - 7", a: "8" }
  ],
  multiplication: [
    { q: "4 × 3", a: "12" },
    { q: "6 × 5", a: "30" }
  ],
  division: [
    { q: "12 ÷ 3", a: "4" },
    { q: "20 ÷ 5", a: "4" }
  ],
  fractions: [
    { q: "What is 1/2 of 10?", a: "5" },
    { q: "What is 1/4 of 8?", a: "2" }
  ]
};

let currentTopic = "";
let currentQuestionIndex = 0;



let playerName = "";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("playerNameInput");
  const button = document.getElementById("enterWorldBtn");

  button.addEventListener("click", () => {
    playerName = input.value.trim();
    if (!playerName) return;

    document.getElementById("welcome-screen").classList.remove("active");
    document.getElementById("topics-screen").classList.add("active");

    document.getElementById(
      "welcomePlayer"
    ).textContent = `Welcome, ${playerName}! Choose a math adventure 🎯`;
  });
});


document.querySelectorAll(".topic-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    loadLesson(btn.dataset.topic);
  });
});

function startGame(topic) {
  currentTopic = topic;
  currentQuestionIndex = 0;
  score = 0;
  stars = 0;

  document.getElementById("topics-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");

  document.getElementById("game-title").textContent =
    `${topic.replace("-", " ").toUpperCase()} Challenge`;

  updateScoreUI();
  showQuestion();
}

function updateScoreUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("stars").textContent = stars;
}


function showQuestion() {
  const questionObj = QUESTIONS[currentTopic][currentQuestionIndex];

  document.getElementById("question-text").textContent =
    questionObj.q;

  document.getElementById("answer-input").value = "";
  document.getElementById("feedback").textContent = "";
}


document.getElementById("submit-answer").addEventListener("click", () => {
  const userAnswer =
    document.getElementById("answer-input").value.trim();

  const correctAnswer =
    QUESTIONS[currentTopic][currentQuestionIndex].a;

  const feedback = document.getElementById("feedback");

  if (userAnswer === correctAnswer) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";

    score += 10;
    stars += 1;
    updateScoreUI();

    currentQuestionIndex++;

    if (currentQuestionIndex >= QUESTIONS[currentTopic].length) {
      feedback.innerHTML = `
        🎉 Topic Complete! <br>
        ⭐ Stars Earned: ${stars} <br>
        🧮 Final Score: ${score}
      `;
      return;
    }

    setTimeout(showQuestion, 800);
  } else {
    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
  }
});

let currentLesson = null;

async function loadLesson(topic) {
  const res = await fetch(`curriculum/${topic}.json`);
  const data = await res.json();

  currentLesson = data.levels[0]; // first subtopic for now

  document.getElementById("topics-screen").classList.remove("active");
  document.getElementById("lesson-screen").classList.add("active");

  document.getElementById("lesson-title").textContent =
    `${data.icon} ${currentLesson.title}`;

  document.getElementById("lesson-intro").textContent =
    currentLesson.lesson.intro;

  const contentDiv = document.getElementById("lesson-content");
  contentDiv.innerHTML = "";

  currentLesson.lesson.content.forEach(step => {
    const p = document.createElement("p");
    p.textContent = step;
    contentDiv.appendChild(p);
  });

  const examplesDiv = document.getElementById("lesson-examples");
  examplesDiv.innerHTML = "";

  currentLesson.lesson.examples.forEach(ex => {
    const div = document.createElement("div");
    div.className = "example-card";
    div.textContent = ex;
    examplesDiv.appendChild(div);
  });
}

