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
