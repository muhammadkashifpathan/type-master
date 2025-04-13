// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initNavigation();
    initThemeToggle();
    initSoundToggle();
    initPracticeMode();
    initTestMode();
    initResultsSection();
    initHistorySection();
    initGameSection();
    
    // Load user history
    loadHistory();
    updatePersonalBests();
});

// Initialize navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Hide results section when navigating
            document.getElementById('results').classList.add('hidden');
            document.getElementById('game-over').classList.add('hidden');
        });
    });
}

// Initialize practice mode
function initPracticeMode() {
    const textDisplay = document.getElementById('practice-text-display');
    const inputField = document.getElementById('practice-input');
    const startBtn = document.getElementById('practice-start');
    const stopBtn = document.getElementById('practice-stop');
    const restartBtn = document.getElementById('practice-restart');
    const newTextBtn = document.getElementById('practice-new-text');
    
    let practiceActive = false;
    
    // Load initial text
    loadPracticeText();
    
    // Event listeners
    inputField.addEventListener('input', function() {
        if (practiceActive) {
            updatePracticeTyping(this.value);
        }
    });
    
    startBtn.addEventListener('click', function() {
        startPractice();
    });
    
    stopBtn.addEventListener('click', function() {
        stopPractice();
    });
    
    restartBtn.addEventListener('click', function() {
        restartPractice();
    });
    
    newTextBtn.addEventListener('click', function() {
        loadPracticeText();
    });
    
    // Load random text for practice
    function loadPracticeText() {
        const randomQuote = getRandomQuote();
        displayTextForTyping(textDisplay, randomQuote);
        resetPractice();
    }
    
    // Start practice session
    function startPractice() {
        practiceActive = true;
        inputField.disabled = false;
        inputField.placeholder = "Start typing here...";
        inputField.focus();
        startPracticeTimer();
        
        // Update button states
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
    
    // Stop practice session
    function stopPractice() {
        practiceActive = false;
        stopTimer('practice');
        inputField.disabled = true;
        
        // Update button states
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
    
    // Reset practice session without starting
    function resetPractice() {
        // Stop any active session
        stopPractice();
        
        // Reset UI
        inputField.value = '';
        resetStats('practice');
        document.getElementById('practice-time').textContent = '0:00';
        updatePracticeTyping('');
    }
    
    // Restart practice session (reset and start)
    function restartPractice() {
        resetPractice();
        startPractice();
    }
    
    // Update typing in practice mode
    function updatePracticeTyping(inputText) {
        const typingData = processTypingInput(textDisplay, inputText);
        updateStats('practice', typingData);
        
        // If typing is complete, play game over sound
        if (typingData.isComplete) {
            playGameoverSound();
            stopPractice();
        }
    }
}

// Initialize test mode
function initTestMode() {
    const textDisplay = document.getElementById('test-text-display');
    const inputField = document.getElementById('test-input');
    const restartBtn = document.getElementById('test-restart');
    const testModeBtns = document.querySelectorAll('.test-mode-btn');
    const countdownContainer = document.getElementById('countdown-container');
    
    let selectedTestTime = 0;
    let testActive = false;
    
    // Event listeners
    testModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Set all buttons inactive
            testModeBtns.forEach(b => b.classList.remove('active'));
            // Set clicked button active
            this.classList.add('active');
            
            // Get test time in seconds
            selectedTestTime = parseInt(this.getAttribute('data-time'));
            
            // Start countdown
            startCountdown(function() {
                startTest();
            });
        });
    });
    
    inputField.addEventListener('input', function() {
        if (testActive) {
            updateTestTyping(this.value);
        }
    });
    
    restartBtn.addEventListener('click', function() {
        if (selectedTestTime > 0) {
            startCountdown(function() {
                startTest();
            });
        }
    });
    
    // Start countdown
    function startCountdown(callback) {
        const countdown = document.getElementById('countdown');
        countdownContainer.classList.remove('hidden');
        let count = 3;
        
        // Play countdown sound at the start
        playCountdownSound();
        countdown.textContent = count;
        
        const countdownInterval = setInterval(function() {
            count--;
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                countdownContainer.classList.add('hidden');
                callback();
            } else {
                countdown.textContent = count;
                playCountdownSound(); // Play sound for each countdown number
            }
        }, 1000);
    }
    
    // Start test
    function startTest() {
        // Load new text
        const randomText = getRandomQuote(3); // Get 3 quotes for longer tests
        displayTextForTyping(textDisplay, randomText);
        
        // Reset input and stats
        inputField.value = '';
        resetStats('test');
        
        // Enable input
        inputField.disabled = false;
        inputField.placeholder = 'Start typing...';
        inputField.focus();
        
        // Start timer
        startTestTimer(selectedTestTime, function() {
            // Test completed
            testActive = false;
            inputField.disabled = true;
            showResults();
        });
        
        testActive = true;
    }
    
    // Update typing in test mode
    function updateTestTyping(inputText) {
        const typingData = processTypingInput(textDisplay, inputText);
        updateStats('test', typingData);
    }
    
    // Show results after test
    function showResults() {
        // Get final stats
        const wpm = document.getElementById('test-wpm').textContent;
        const accuracy = document.getElementById('test-accuracy').textContent;
        const errors = document.getElementById('test-errors').textContent;
        const chars = getTypedCharacters();
        const time = formatTime(selectedTestTime);
        
        // Update results display
        document.getElementById('result-wpm').textContent = wpm;
        document.getElementById('result-accuracy').textContent = accuracy;
        document.getElementById('result-errors').textContent = errors;
        document.getElementById('result-chars').textContent = chars;
        document.getElementById('result-time').textContent = time;
        
        // Save test to history
        saveTestHistory({
            type: 'test',
            wpm: parseInt(wpm),
            accuracy: parseFloat(accuracy),
            errors: parseInt(errors),
            chars: chars,
            time: selectedTestTime,
            date: new Date().toISOString()
        });
        
        // Show results section
        document.getElementById('test').classList.remove('active');
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('results').classList.add('active');
        
        // Update personal bests
        updatePersonalBests();
    }
}

// Initialize results section
function initResultsSection() {
    const retryBtn = document.getElementById('results-retry');
    const newTestBtn = document.getElementById('results-new-test');
    
    retryBtn.addEventListener('click', function() {
        // Hide results and show test section
        document.getElementById('results').classList.remove('active');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('test').classList.add('active');
        
        // Trigger restart button
        document.getElementById('test-restart').click();
    });
    
    newTestBtn.addEventListener('click', function() {
        // Hide results and show test section
        document.getElementById('results').classList.remove('active');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('test').classList.add('active');
        
        // Reset button selection
        document.querySelectorAll('.test-mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset input field
        document.getElementById('test-input').disabled = true;
        document.getElementById('test-input').placeholder = 'Select a test mode to start...';
    });
}

// Initialize history section
function initHistorySection() {
    const historyTabs = document.querySelectorAll('.history-tab');
    const historyLists = document.querySelectorAll('.history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    historyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Set all tabs inactive
            historyTabs.forEach(t => t.classList.remove('active'));
            // Set all lists inactive
            historyLists.forEach(l => l.classList.remove('active'));
            
            // Set clicked tab active
            this.classList.add('active');
            
            // Show corresponding list
            const historyType = this.getAttribute('data-history');
            document.getElementById(`${historyType}-history-list`).classList.add('active');
        });
    });
    
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
            clearHistory();
            updateHistoryLists();
            updatePersonalBests();
        }
    });
}

// Initialize game section
function initGameSection() {
    const gameStartBtn = document.getElementById('game-start');
    const gamePauseBtn = document.getElementById('game-pause');
    const gameInput = document.getElementById('game-input');
    
    gameStartBtn.addEventListener('click', function() {
        startGame();
        this.classList.add('hidden');
        gamePauseBtn.classList.remove('hidden');
        gameInput.focus();
    });
    
    gamePauseBtn.addEventListener('click', function() {
        if (this.textContent === 'Pause') {
            pauseGame();
            this.textContent = 'Resume';
        } else {
            resumeGame();
            this.textContent = 'Pause';
            gameInput.focus();
        }
    });
    
    // Game over retry button
    document.getElementById('game-over-retry').addEventListener('click', function() {
        document.getElementById('game-over').classList.remove('active');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('game').classList.add('active');
        gameStartBtn.classList.remove('hidden');
        gamePauseBtn.classList.add('hidden');
    });
    
    // Game over menu button
    document.getElementById('game-over-menu').addEventListener('click', function() {
        document.getElementById('game-over').classList.remove('active');
        document.getElementById('game-over').classList.add('hidden');
        
        // Show practice section
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById('practice').classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[data-section="practice"]').classList.add('active');
        
        gameStartBtn.classList.remove('hidden');
        gamePauseBtn.classList.add('hidden');
    });
}

// Helper: Get random quote(s)
function getRandomQuote(count = 1) {
    let text = '';
    
    // Get random quotes
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        text += quotes[randomIndex] + ' ';
    }
    
    return text.trim();
}

// Helper: Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Helper: Get typed characters count
function getTypedCharacters() {
    const characters = document.querySelectorAll('.character');
    let typedCount = 0;
    
    characters.forEach(char => {
        if (char.classList.contains('correct') || char.classList.contains('incorrect')) {
            typedCount++;
        }
    });
    
    return typedCount;
}
