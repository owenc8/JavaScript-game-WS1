// Screen elements
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

// Difficulty buttons
const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");
const backButton = document.getElementById("backBtn");

//timer difficulty
// spawn timings by difficulty (lower = faster spawns)
const easyDelay = 1000;
const mediumDelay = 800;
const hardDelay = 600;

// active spawn range used by startInterval()
let spawnMin = 800;
let spawnMax = 1100;

//audio
const audio = document.getElementById('audioElement');
// dark_angel by https://tabletopaudio.com/ ( Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. )
// can be used for free but can't be edited or remixed

// Nazgul Scream 1 by freesound_community on Pixabay 
const deathSound = document.getElementById('tyranidSFX')

//hit rock 02 by u_xjrmmgxfru on pixabay
const smash = document.getElementById('weaponSFX')

// light-switch-turn-on by freesound_community from Pixabay
const btnSound = document.getElementById('btnSFX')

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

// background music


// Handle difficulty selection
function selectDifficulty(level) {
    difficulty = level;
    console.log(difficulty);
    // set spawn range based on selected difficulty
    if (level === 'easy') {
        spawnMin = Math.max(100, easyDelay - 200);
        spawnMax = easyDelay + 200;
    } else if (level === 'medium') {
        spawnMin = Math.max(100, mediumDelay - 200);
        spawnMax = mediumDelay + 200;
    } else if (level === 'hard') {
        spawnMin = Math.max(100, hardDelay - 200);
        spawnMax = hardDelay + 200;
    }
    btnSound.volume = 0.6;
    btnSound.play();
    showScreen("game")
    audio.currentTime = 0;
    audio.play();
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
    // pick a random hole
    let random = holes[Math.floor(Math.random() * holes.length)];
    //add mole to random hole 
    random.classList.add('mole');
    random.addEventListener('click', handleMoleClick);
}

function handleMoleClick() {
    if (!gameOver) {
        score++;
        deathSound.volume = 0.2;
        deathSound.play();
        smash.volume = 0.4;
        smash.play();
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
    btnSound.volume = 0.6;
    btnSound.play();
    audio.pause();
    audio.volume = 0.2;
    audio.currentTime = 75;
    audio.play();
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
            // stop spawning and clear any pending spawn
            clearTimeout(moleInterval);
            // remove any visible mole and its handlers
            holes.forEach(hole => {
                hole.classList.remove('mole');
                hole.removeEventListener('click', handleMoleClick);
            });
            gameOver = true;
            alert(`Game Over!\nYour final score: ${score}`);
            endGame();
            
            startButton.disabled = false;
            endButton.disabled = true;
        }
    }, 1000);

    function startInterval(){
        let delay = getSpawnInterval(spawnMin, spawnMax);

        moleInterval = setTimeout(()=>{
            if (!gameOver) {
                comeout();
                // only schedule the next spawn while the game is running
                startInterval();
            }
        }, delay); //delay
    }
    startInterval();
    console.log("Game started");
}

function endGame() {
    clearInterval(countdown);
    clearTimeout(moleInterval);
    // sounds
    btnSound.volume = 0.6;
    btnSound.play();
    audio.pause();

    audio.currentTime = 0;
    gameOver = true;
    // remove any visible mole and its handlers
    holes.forEach(hole => {
        hole.classList.remove('mole');
        hole.removeEventListener('click', handleMoleClick);
    });

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

const customCursor = document.querySelector('.custom-cursor');


document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX-40 + 'px';
    customCursor.style.top = e.clientY-40 + 'px';
});

startButton.addEventListener("click", startGame);
endButton.addEventListener("click", endGame);
