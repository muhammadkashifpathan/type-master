// Game variables
let gameActive = false;
let gamePaused = false;
let gameScore = 0;
let gameTimer = null;
let gameStartTime = null;
let gameWordCount = 0;
let gameSpeed = 'Normal';
let wordSpeed = 3000; // Initial falling time in ms
let wordInterval = null;
let activeWords = [];

// Word pool for the game
const gameWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

// Start the typing game
function startGame() {
    const gameArea = document.getElementById('falling-words');
    const gameInput = document.getElementById('game-input');
    
    // Reset game state
    gameArea.innerHTML = '';
    gameInput.value = '';
    gameInput.focus();
    gameScore = 0;
    gameWordCount = 0;
    gameSpeed = 'Normal';
    wordSpeed = 3000;
    activeWords = [];
    
    // Update display
    document.getElementById('game-score').textContent = gameScore;
    document.getElementById('game-speed').textContent = gameSpeed;
    
    // Start game timer
    gameStartTime = new Date();
    
    gameTimer = setInterval(function() {
        if (!gamePaused) {
            const currentTime = new Date();
            const elapsedSeconds = Math.floor((currentTime - gameStartTime) / 1000);
            document.getElementById('game-time').textContent = formatTime(elapsedSeconds);
            
            // Increase speed every 30 seconds
            if (elapsedSeconds > 0 && elapsedSeconds % 30 === 0 && wordSpeed > 1000) {
                increaseGameSpeed();
            }
        }
    }, 1000);
    
    // Start dropping words
    wordInterval = setInterval(function() {
        if (!gamePaused && activeWords.length < 5) {
            dropWord();
        }
    }, 2000);
    
    // Handle input
    gameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const word = this.value.trim().toLowerCase();
            this.value = '';
            
            if (word) {
                checkWord(word);
            }
        }
    });
    
    gameActive = true;
    gamePaused = false;
}

// Drop a new word from the top
function dropWord() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('falling-words');
    const areaWidth = gameArea.offsetWidth;
    
    // Get random word
    const randomIndex = Math.floor(Math.random() * gameWords.length);
    const word = gameWords[randomIndex];
    
    // Create word element
    const wordElement = document.createElement('div');
    wordElement.className = 'falling-word';
    wordElement.textContent = word;
    wordElement.style.left = `${Math.random() * (areaWidth - 100)}px`;
    wordElement.dataset.word = word;
    
    // Set animation duration based on current game speed
    wordElement.style.animationDuration = `${wordSpeed}ms`;
    
    // Add to active words array
    activeWords.push({
        element: wordElement,
        word: word
    });
    
    // Add to DOM
    gameArea.appendChild(wordElement);
    
    // Handle animation end (word reached bottom)
    wordElement.addEventListener('animationend', function() {
        // Game over if word reaches bottom
        endGame();
    });
}

// Check if typed word matches any falling word
function checkWord(typedWord) {
    let wordFound = false;
    
    for (let i = 0; i < activeWords.length; i++) {
        if (activeWords[i].word === typedWord) {
            // Remove the word
            activeWords[i].element.remove();
            activeWords.splice(i, 1);
            
            // Play correct sound effect
            playTypingSound();
            
            // Update score
            gameScore += typedWord.length * 10;
            gameWordCount++;
            document.getElementById('game-score').textContent = gameScore;
            
            wordFound = true;
            break;
        }
    }
    
    // Play wrong sound if no word matched
    if (!wordFound && typedWord.length > 1) {
        playWrongSound();
    }
    
    return wordFound;
}

// Increase game speed
function increaseGameSpeed() {
    wordSpeed = Math.max(1000, wordSpeed - 500);
    
    // Update speed display
    if (wordSpeed >= 2500) {
        gameSpeed = 'Normal';
    } else if (wordSpeed >= 2000) {
        gameSpeed = 'Fast';
    } else if (wordSpeed >= 1500) {
        gameSpeed = 'Faster';
    } else {
        gameSpeed = 'Extreme';
    }
    
    document.getElementById('game-speed').textContent = gameSpeed;
}

// Pause the game
function pauseGame() {
    if (!gameActive) return;
    
    gamePaused = true;
    
    // Pause all animations
    activeWords.forEach(wordObj => {
        wordObj.element.style.animationPlayState = 'paused';
    });
}

// Resume the game
function resumeGame() {
    if (!gameActive) return;
    
    gamePaused = false;
    
    // Resume all animations
    activeWords.forEach(wordObj => {
        wordObj.element.style.animationPlayState = 'running';
    });
}

// End the game
function endGame() {
    if (!gameActive) return;
    
    // Play wrong sound for game over
    playWrongSound();
    
    // Stop timers
    clearInterval(gameTimer);
    clearInterval(wordInterval);
    
    // Clear active words
    activeWords.forEach(wordObj => {
        wordObj.element.remove();
    });
    activeWords = [];
    
    // Calculate game time
    const gameEndTime = new Date();
    const gameTimeElapsed = Math.floor((gameEndTime - gameStartTime) / 1000);
    
    // Update game over display
    document.getElementById('game-over-score').textContent = gameScore;
    document.getElementById('game-over-words').textContent = gameWordCount;
    document.getElementById('game-over-speed').textContent = gameSpeed;
    document.getElementById('game-over-time').textContent = formatTime(gameTimeElapsed);
    
    // Save game history
    saveGameHistory({
        type: 'game',
        score: gameScore,
        words: gameWordCount,
        speed: gameSpeed,
        time: gameTimeElapsed,
        date: new Date().toISOString()
    });
    
    // Show game over screen
    document.getElementById('game').classList.remove('active');
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('game-over').classList.add('active');
    
    // Update personal bests
    updatePersonalBests();
    
    // Reset game state
    gameActive = false;
    gamePaused = false;
}
