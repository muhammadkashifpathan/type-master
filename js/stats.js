// Calculate and update typing statistics
function updateStats(mode, typingData) {
    const { correctCount, incorrectCount, totalTyped, totalCharacters, isComplete } = typingData;
    const elapsedMinutes = getElapsedMinutes(mode);
    
    // Avoid division by zero
    if (elapsedMinutes === 0) return;
    
    // Calculate WPM (5 characters = 1 word)
    const wordsTyped = correctCount / 5;
    const wpm = Math.round(wordsTyped / elapsedMinutes);
    
    // Calculate accuracy
    const accuracy = totalTyped > 0 
        ? Math.round((correctCount / totalTyped) * 100) 
        : 100;
    
    // Update stats display
    document.getElementById(`${mode}-wpm`).textContent = wpm;
    document.getElementById(`${mode}-accuracy`).textContent = `${accuracy}%`;
    document.getElementById(`${mode}-errors`).textContent = incorrectCount;
    
    // If typing is complete in practice mode
    if (mode === 'practice' && isComplete) {
        stopTimer('practice');
    }
}

// Reset statistics
function resetStats(mode) {
    document.getElementById(`${mode}-wpm`).textContent = '0';
    document.getElementById(`${mode}-accuracy`).textContent = '100%';
    document.getElementById(`${mode}-errors`).textContent = '0';
    
    if (mode === 'practice') {
        document.getElementById(`${mode}-time`).textContent = '0:00';
    } else if (mode === 'test') {
        document.getElementById(`${mode}-time`).textContent = formatTime(getTestTimeLimit());
    }
}

// Get elapsed minutes for WPM calculation
function getElapsedMinutes(mode) {
    let startTime;
    
    if (mode === 'practice') {
        startTime = practiceStartTime;
    } else if (mode === 'test') {
        startTime = testStartTime;
    }
    
    if (!startTime) return 0;
    
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime - startTime;
    return elapsedMilliseconds / (1000 * 60);
}

// Get test time limit
function getTestTimeLimit() {
    return testTimeLimit;
}

// Update personal bests from history
function updatePersonalBests() {
    const history = getHistory();
    
    let bestWPM = 0;
    let bestAccuracy = 0;
    let bestGameScore = 0;
    
    // Find best scores
    history.forEach(entry => {
        if (entry.type === 'test') {
            if (entry.wpm > bestWPM) {
                bestWPM = entry.wpm;
            }
            
            if (entry.accuracy > bestAccuracy) {
                bestAccuracy = entry.accuracy;
            }
        } else if (entry.type === 'game') {
            if (entry.score > bestGameScore) {
                bestGameScore = entry.score;
            }
        }
    });
    
    // Update display
    document.getElementById('best-wpm').textContent = bestWPM;
    document.getElementById('best-accuracy').textContent = `${bestAccuracy}%`;
    document.getElementById('best-game-score').textContent = bestGameScore;
}
