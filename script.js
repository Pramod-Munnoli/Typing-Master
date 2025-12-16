const typingText = document.querySelector(".typing-text p");
const input = document.querySelector(".input-field");
const timeTag = document.querySelector(".time span b");
const mistakesTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const btn = document.querySelector("button");

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

// 🔹 Load text using DummyJSON (secure & stable)
async function loadParagraph() {
  typingText.innerHTML = "Loading...";

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      "https://dummyjson.com/quotes/random",
      { signal: controller.signal }
    );

    const data = await res.json();
    const text = data.quote;

    renderText(text);

  } catch (error) {
    console.warn("API failed, using fallback");

    const fallbackText =
      "Consistency and practice are the keys to improving typing speed and accuracy.";

    renderText(fallbackText);
  }
}

// 🔹 Render characters
function renderText(text) {
  typingText.innerHTML = "";
  text.split("").forEach(char => {
    typingText.innerHTML += `<span>${char}</span>`;
  });
  typingText.querySelector("span").classList.add("active");
}

// 🔹 Typing logic
function initTyping() {
  const characters = typingText.querySelectorAll("span");
  const typedChar = input.value.charAt(charIndex);

  // ✅ BACKSPACE
  if (input.value.length < charIndex) {
    charIndex--;

    if (characters[charIndex].classList.contains("incorrect")) {
      mistakes--;
      mistakesTag.innerText = mistakes;
    }

    characters[charIndex].classList.remove("correct", "incorrect");
    characters.forEach(span => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    input.value = input.value.slice(0, charIndex);
    cpmTag.innerText = Math.max(0, charIndex - mistakes);
    return;
  }

  // ✅ NORMAL TYPING
  if (charIndex < characters.length && timeLeft > 0) {
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar === characters[charIndex].innerText) {
      characters[charIndex].classList.add("correct");
    } else {
      characters[charIndex].classList.add("incorrect");
      mistakes++;
      mistakesTag.innerText = mistakes;
    }

    characters[charIndex].classList.remove("active");
    charIndex++;

    if (charIndex < characters.length) {
      characters[charIndex].classList.add("active");
    }

    input.value = input.value.slice(0, charIndex);
    cpmTag.innerText = Math.max(0, charIndex - mistakes);
  }
}

  

// 🔹 Timer
function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;

    let wpm = Math.round(
      ((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60
    );
    wpmTag.innerText = wpm > 0 ? wpm : 0;
  } else {
    clearInterval(timer);
  }
}

// 🔹 Reset
function resetGame() {
  loadParagraph();
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = 0;
  isTyping = false;
  input.value = "";
  timeTag.innerText = timeLeft;
  mistakesTag.innerText = 0;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
}

// Events
input.addEventListener("input", initTyping);
btn.addEventListener("click", resetGame);
document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace" && document.activeElement !== input) {
    e.preventDefault();
  }

  if (e.key === "Backspace" || e.key.length === 1) {
    input.focus();
  }
});


// Init
loadParagraph();
