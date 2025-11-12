// Screen elements
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

// Difficulty buttons
const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const backButton = document.getElementById("backBtn");
//code for switching difficulty not finished yet 

//timer difficulty
const easyTime = 1000;
const mediumTime = 800;
const hardTime = 600;

const holes = 
    document.querySelectorAll(".hole");
const startButton = 
    document.getElementById("startButton");
const endButton = 
    document.getElementById("endButton");
const scoreDisplay = 
    document.getElementById("score");
const timerDisplay = 
    document.getElementById("timer");

// Game state
let currentScreen = "home";
let difficulty = "easy"; 

let timer;
let score = 0;
let countdown;
let moleInterval;

// Function to switch screens
function showScreen(screen) {
    if (screen === "home") {
        homeScreen.style.display = "block";
        gameScreen.style.display = "none";
        currentScreen = "home";
    } else if (screen === "game") {
        homeScreen.style.display = "none";
        gameScreen.style.display = "block";
        currentScreen = "game";
    }
}

// Handle difficulty selection
function selectDifficulty(level) {
    difficulty = level;
    showScreen("game")
}

// Event listeners for difficulty buttons
easyBtn.addEventListener("click", () => selectDifficulty("easy"));
mediumBtn.addEventListener("click", () => selectDifficulty("medium"));
hardBtn.addEventListener("click", () => selectDifficulty("hard"));

// Back button
backButton.addEventListener("click", () => {
    if (!gameOver) {
        endGame();
    }
    showScreen("home");
});

// Set the initial state to game over
let gameOver = true; 

function comeout() {
    holes.forEach(hole => {
        hole.classList.remove('mole');
        hole.removeEventListener(
            'click', handleMoleClick);
    });
    //random number between 1 and 9 since there are nine holes 
    let random = holes[Math.floor(Math.random() * 9)];
    //add mole to random hole 
    random.classList.add('mole');
    random.addEventListener('click', handleMoleClick);
}

function handleMoleClick() {
    if (!gameOver) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }
    this.classList.remove('mole');
}

function startGame() {
    if (!gameOver) {
    
        // Prevent starting the game 
        // again if it's already in progress
        return;
    }

    gameOver = false;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timer = 15;
    timerDisplay.textContent = `Time: ${timer}s`;

    startButton.disabled = true;
    endButton.disabled = false;

    countdown = setInterval(() => {
        timer--;
        timerDisplay.textContent = `Time: ${timer}s`;
        //once time runs out display an alert message with score
        if (timer <= 0) {
            clearInterval(countdown);
            gameOver = true;
            alert(`Game Over!\nYour final score: ${score}`);
            startButton.disabled = false;
            endButton.disabled = true;
        }
    }, 1000);

    function startInterval(){

        const delay = getSpawnInterval(800, 1100);

        moleInterval = setTimeout(()=>{
            if (!gameOver) comeout();
            startInterval();
        },delay)
    }
    startInterval();
    console.log("Game started");
}

function endGame() {
    clearInterval(countdown);
    clearInterval(moleInterval);
    gameOver = true;
    alert(`Game Ended!\nYour final score: ${score}`);
    score = 0;
    timer = 15;
    //reset to 15sec timer
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timer}s`;
    startButton.disabled = false;
    endButton.disabled = true;
}

function getSpawnInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

startButton.addEventListener("click", startGame);
endButton.addEventListener("click", endGame);
