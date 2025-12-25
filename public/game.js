/*********************************
 * VOICE SETUP
 *********************************/
let narrationEnabled = true;
let availableVoices = [];

speechSynthesis.onvoiceschanged = () => {
  availableVoices = speechSynthesis.getVoices();
};

function speak(text) {
  if (!narrationEnabled) return;

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  const kidVoice =
    availableVoices.find(v => v.name.includes("Google")) ||
    availableVoices[0];

  if (kidVoice) utterance.voice = kidVoice;
  speechSynthesis.speak(utterance);
}

/*********************************
 * SOUNDS
 *********************************/
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");
const countSound = new Audio("sounds/pop.mp3");

[correctSound, wrongSound, countSound].forEach(s => {
  s.preload = "auto";
});

/*********************************
 * GAME STATE
 *********************************/
let playerName = "";
let score = 0;
let stars = 0;
let currentTopic = "";
let currentQuestionIndex = 0;
let lessonStep = 0;

/*********************************
 * QUESTIONS
 *********************************/
const QUESTIONS = {
  addition: [
    { q: "3 + 2", a: "5" },
    { q: "4 + 3", a: "7" },
    { q: "5 + 4", a: "9" }
  ]
};

/*********************************
 * DOM READY
 *********************************/
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("enterWorldBtn").addEventListener("click", () => {
    const input = document.getElementById("playerNameInput");
    playerName = input.value.trim();
    if (!playerName) return;

    document.getElementById("welcome-screen").classList.remove("active");
    document.getElementById("topics-screen").classList.add("active");

    document.getElementById("welcomePlayer").textContent =
      `Welcome ${playerName}! Choose a math adventure 🌟`;

    speak(`Welcome ${playerName}! Let’s learn math together!`);
  });

  document.getElementById("submit-answer").addEventListener("click", submitQuizAnswer);
});

/*********************************
 * LESSON DATA
 *********************************/
const lessonSteps = [
  {
    visuals: () => showItems("🍎", 3),
    text: "Let’s count apples together!",
    voice: "Let’s count together. One apple. Two apples. Three apples."
  },
  {
    visuals: () => showItems("🍊", 2),
    text: "Now let’s count oranges!",
    voice: "Now count with me. One orange. Two oranges."
  },
  {
    visuals: () => showAddition("🍎", 3, "🍊", 2),
    text: "When we put groups together, we are adding!",
    voice: "When we put apples and oranges together, we are adding."
  },
  {
    visuals: () => showAddition("🍎", 3, "🍊", 2),
    text: "Let’s count everything together!",
    voice: "Let’s count all together. One, two, three, four, five!"
  },
  {
    visuals: () => showAnswer(5),
    text: "Three plus two equals five!",
    voice: "Three plus two equals five. Great counting!"
  },
  {
    visuals: () => showAddition("🍎", 4, "🍊", 3),
    text: "Let’s try another example!",
    voice: "Now let’s try four apples and three oranges."
  },
  {
    visuals: () => showAnswer(7),
    text: "Four plus three equals seven!",
    voice: "Four plus three equals seven. You’re doing amazing!"
  },
  {
    visuals: () => {},
    text: "Now it’s your turn to practice!",
    voice: "Now it’s your turn. Let’s play the game!",
    end: true
  }
];

/*********************************
 * LESSON FUNCTIONS
 *********************************/
function startAdditionLesson() {
  lessonStep = 0;
  document.getElementById("topics-screen").classList.remove("active");
  document.getElementById("lesson-screen").classList.add("active");
  document.getElementById("lesson-title").textContent =
    `Learning Addition, ${playerName}! 🍎➕🍊`;

  document.getElementById("lesson-next-btn").textContent = "Next ➡️";
  runLessonStep();
}

function runLessonStep() {
  const step = lessonSteps[lessonStep];
  if (!step) return;

  document.getElementById("lesson-text").textContent = step.text;
  step.visuals();
  speak(step.voice);

  if (step.end) {
    document.getElementById("lesson-next-btn").textContent = "🎯 Start Practice";
  }

  lessonStep++;
}

document.getElementById("lesson-next-btn").addEventListener("click", () => {
  if (lessonStep >= lessonSteps.length) {
    document.getElementById("lesson-screen").classList.remove("active");
    startGame("addition");
  } else {
    runLessonStep();
  }
});

/*********************************
 * VISUAL HELPERS
 *********************************/
function showItems(emoji, count) {
  const visuals = document.getElementById("lesson-visuals");
  visuals.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const item = document.createElement("div");
    item.className = "item";
    item.textContent = emoji;
    visuals.appendChild(item);

    countSound.currentTime = 0;
    countSound.play();
  }
}

function showAddition(e1, c1, e2, c2) {
  const visuals = document.getElementById("lesson-visuals");
  visuals.innerHTML = "";

  for (let i = 0; i < c1; i++) visuals.appendChild(createItem(e1));

  const plus = document.createElement("div");
  plus.className = "operator";
  plus.textContent = "+";
  visuals.appendChild(plus);

  for (let i = 0; i < c2; i++) visuals.appendChild(createItem(e2));
}

function showAnswer(answer) {
  const visuals = document.getElementById("lesson-visuals");
  visuals.innerHTML = `<div class="item">🎉 ${answer} 🎉</div>`;
}

function createItem(emoji) {
  const div = document.createElement("div");
  div.className = "item";
  div.textContent = emoji;
  countSound.currentTime = 0;
  countSound.play();
  return div;
}

/*********************************
 * GAME FUNCTIONS
 *********************************/
function startGame(topic) {
  currentTopic = topic;
  currentQuestionIndex = 0;
  score = 0;
  stars = 0;

  document.getElementById("game-screen").classList.add("active");
  document.getElementById("game-title").textContent =
    `${topic.toUpperCase()} Practice`;

  updateScoreUI();
  showQuestion();
}

function showQuestion() {
  const q = QUESTIONS[currentTopic][currentQuestionIndex];
  document.getElementById("question-text").textContent = q.q;
  document.getElementById("answer-input").value = "";
  document.getElementById("feedback").textContent = "";
}

function submitQuizAnswer() {
  const userAnswer = document.getElementById("answer-input").value.trim();
  const correct = QUESTIONS[currentTopic][currentQuestionIndex].a;
  const feedback = document.getElementById("feedback");

  if (userAnswer === correct) {
    correctSound.currentTime = 0;
    correctSound.play();
    speak(`Great job ${playerName}! That is correct!`);

    score += 10;
    stars += 1;
    updateScoreUI();

    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";

    currentQuestionIndex++;
    if (currentQuestionIndex < QUESTIONS[currentTopic].length) {
      setTimeout(showQuestion, 900);
    } else {
      speak(`Fantastic work ${playerName}! You finished the lesson!`);
    }
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
    speak(`Let’s count together and try again!`);

    feedback.textContent = "❌ Try again!";
    feedback.style.color = "red";
  }
}

function updateScoreUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("stars").textContent = stars;
}
