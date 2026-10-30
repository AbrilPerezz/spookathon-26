
const words = [
    "ghost",
    "witch",
    "skull",
    "haunted",
    "zombie",
    "vampire",
    "cemetery",
    "nightmare",
    "possessed",
    "poltergeist"
];

// Get HTML elements
const ghost = document.getElementById("ghost");
const wordDisplay = document.getElementById("word");
const typingInput = document.getElementById("typing-input");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const jumpscare = document.getElementById("jumpscare");
const message = document.getElementById("message");

let score = 0;
let timeLeft = 5;
let maxTime = 5;
let currentWord = "";
let timerInterval = null;
let gameRunning = false;

// Start a new game
function startGame() {
    clearInterval(timerInterval);
    prepareAudio();
    jumpscare.classList.remove("finished");

    score = 0;
    maxTime = 5;
    gameRunning = true;

    scoreDisplay.textContent = score;
    jumpscare.classList.add("hidden");
    startButton.style.display = "none";

    typingInput.disabled = false;
    typingInput.placeholder = "TYPE FAST!";
    message.textContent = "HURRY! THE GHOST IS COMING!";

    nextWord();

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;

        if (timeLeft <= 0) {
            timeLeft = 0;
            updateDisplay();
            gameOver();
            return;
        }

        updateDisplay();
    }, 100);
}

// Generate the next word
function nextWord() {
    currentWord = words[
        Math.floor(Math.random() * words.length)
    ];

    wordDisplay.textContent = currentWord.toUpperCase();

    typingInput.value = "";
    typingInput.focus();

    timeLeft = maxTime;
    updateDisplay();
}

// Update timer and ghost position
function updateDisplay() {
    timerDisplay.textContent = timeLeft.toFixed(1);

    const progress = 1 - timeLeft / maxTime;

    // Ghost gets bigger as time runs out
    const ghostSize = 1 + progress * 3;

    ghost.style.transform = `scale(${ghostSize})`;

    if (timeLeft <= 3) {
        timerDisplay.style.color = "red";
        ghost.style.filter = "drop-shadow(0 0 25px red)";
    } else {
        timerDisplay.style.color = "white";
        ghost.style.filter = "drop-shadow(0 0 20px white)";
    }
}

// Check what the player types
typingInput.addEventListener("input", () => {
    if (!gameRunning) return;

    const typedWord = typingInput.value.trim().toLowerCase();

    if (typedWord === currentWord) {
        score++;
        scoreDisplay.textContent = score;

        // Increase difficulty every 3 words
        if (score % 3 === 0) {
            maxTime = Math.max(3, maxTime - 1);
        }

        nextWord();
    }
});

// Jumpscare when the player loses

function gameOver() {
    clearInterval(timerInterval);
    gameRunning = false;
    typingInput.disabled = true;

    message.textContent = "THE GHOST CAUGHT YOU!";

    jumpscare.classList.remove("hidden", "finished");

    const scaryImage = document.getElementById("scary-image");

    // Restart the attack animation
    scaryImage.style.animation = "none";
    void scaryImage.offsetWidth;
    scaryImage.style.animation = "";

    // Sudden horror screech
    playScream();

    // Show the death screen after the jumpscare
    setTimeout(() => {
        jumpscare.classList.add("finished");
    }, 1100);
}



let audioContext;

function prepareAudio() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function playScream() {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const duration = 0.65;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(950, now);
    oscillator.frequency.exponentialRampToValueAtTime(
        110, now + duration
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(
        0.0001, now + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + duration);
}


// Button events
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
