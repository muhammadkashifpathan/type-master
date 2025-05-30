// Variables for typing functionality
let practiceTimer = null;
let testTimer = null;
let practiceStartTime = null;
let testStartTime = null;
let testTimeLimit = 0;
let testEndCallback = null;

// Display text for typing with character spans
function displayTextForTyping(displayElement, text) {
    displayElement.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.textContent = text[i];
        charSpan.className = 'character';
        displayElement.appendChild(charSpan);
    }
    
    // Set initial current character
    if (displayElement.childNodes.length > 0) {
        displayElement.childNodes[0].classList.add('current');
    }
}

// Process typing input and update display
function processTypingInput(displayElement, inputText) {
    const characters = displayElement.querySelectorAll('.character');
    let correctCount = 0;
    let incorrectCount = 0;
    let isNewCharacterIncorrect = false;
    
    // Reset all characters
    characters.forEach(char => {
        char.classList.remove('correct', 'incorrect', 'current');
    });
    
    // Process each character
    for (let i = 0; i < inputText.length && i < characters.length; i++) {
        // Check if this is the newest character typed (last character in input)
        const isNewestChar = (i === inputText.length - 1);
        
        if (inputText[i] === characters[i].textContent) {
            characters[i].classList.add('correct');
            correctCount++;
            
            // Play keypress sound for the newest correct character typed
            if (isNewestChar) {
                playKeypressSound();
            }
        } else {
            characters[i].classList.add('incorrect');
            incorrectCount++;
            
            // Flag if the newest character is incorrect
            if (isNewestChar) {
                isNewCharacterIncorrect = true;
            }
        }
    }
    
    // Play error sound if the newest character is incorrect
    if (isNewCharacterIncorrect) {
        playErrorSound();
    }
    
    // Mark current character
    if (inputText.length < characters.length) {
        characters[inputText.length].classList.add('current');
    }
    
    // Check if typing is complete
    const isComplete = inputText.length === characters.length;
    
    return {
        correctCount,
        incorrectCount,
        totalTyped: correctCount + incorrectCount,
        totalCharacters: characters.length,
        isComplete
    };
}

// Start practice timer
function startPracticeTimer() {
    // Clear existing timer if any
    if (practiceTimer) {
        clearInterval(practiceTimer);
    }
    
    practiceStartTime = new Date();
    
    practiceTimer = setInterval(function() {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - practiceStartTime) / 1000);
        
        document.getElementById('practice-time').textContent = formatTime(elapsedSeconds);
    }, 1000);
}

// Start test timer with countdown
function startTestTimer(timeLimit, callback) {
    // Clear existing timer if any
    if (testTimer) {
        clearInterval(testTimer);
    }
    
    testTimeLimit = timeLimit;
    testStartTime = new Date();
    testEndCallback = callback;
    
    testTimer = setInterval(function() {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - testStartTime) / 1000);
        const remainingSeconds = testTimeLimit - elapsedSeconds;
        
        if (remainingSeconds <= 0) {
            clearInterval(testTimer);
            document.getElementById('test-time').textContent = '0:00';
            
            // Play game over sound when time's up
            playGameoverSound();
            
            if (testEndCallback) {
                testEndCallback();
            }
        } else {
            document.getElementById('test-time').textContent = formatTime(remainingSeconds);
            
            // Play countdown sound when timer reaches exactly 3 seconds
            if (remainingSeconds === 3) {
                playCountdownSound();
            }
        }
    }, 1000);
}

// Stop timer
function stopTimer(timerType) {
    if (timerType === 'practice' && practiceTimer) {
        clearInterval(practiceTimer);
        practiceTimer = null;
    } else if (timerType === 'test' && testTimer) {
        clearInterval(testTimer);
        testTimer = null;
    }
}
