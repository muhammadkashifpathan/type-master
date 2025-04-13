// Save test history to local storage
function saveTestHistory(testData) {
    const history = getHistory();
    history.push(testData);
    
    // Limit history to 50 entries
    if (history.length > 50) {
        history.shift(); // Remove oldest entry
    }
    
    localStorage.setItem('typingHistory', JSON.stringify(history));
    
    // Update history list display
    updateHistoryLists();
}

// Save game history to local storage
function saveGameHistory(gameData) {
    const history = getHistory();
    history.push(gameData);
    
    // Limit history to 50 entries
    if (history.length > 50) {
        history.shift(); // Remove oldest entry
    }
    
    localStorage.setItem('typingHistory', JSON.stringify(history));
    
    // Update history list display
    updateHistoryLists();
}

// Get history from local storage
function getHistory() {
    const historyString = localStorage.getItem('typingHistory');
    return historyString ? JSON.parse(historyString) : [];
}

// Clear all history
function clearHistory() {
    localStorage.removeItem('typingHistory');
}

// Load history and update display
function loadHistory() {
    updateHistoryLists();
}

// Update history lists display
function updateHistoryLists() {
    const history = getHistory();
    const testHistoryList = document.getElementById('test-history-list');
    const gameHistoryList = document.getElementById('game-history-list');
    
    // Clear current lists
    testHistoryList.innerHTML = '';
    gameHistoryList.innerHTML = '';
    
    // Filter histories by type
    const testHistory = history.filter(entry => entry.type === 'test');
    const gameHistory = history.filter(entry => entry.type === 'game');
    
    // Add empty message if no history
    if (testHistory.length === 0) {
        testHistoryList.innerHTML = '<div class="empty-history">No test history available</div>';
    }
    
    if (gameHistory.length === 0) {
        gameHistoryList.innerHTML = '<div class="empty-history">No game history available</div>';
    }
    
    // Sort histories by date (newest first)
    testHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    gameHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate test history items
    testHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-detail">
                <span class="history-label">Date</span>
                <span class="history-value">${formatDate(entry.date)}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">WPM</span>
                <span class="history-value">${entry.wpm}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Accuracy</span>
                <span class="history-value">${entry.accuracy}%</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Errors</span>
                <span class="history-value">${entry.errors}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Chars</span>
                <span class="history-value">${entry.chars}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Time</span>
                <span class="history-value">${formatTime(entry.time)}</span>
            </div>
        `;
        
        testHistoryList.appendChild(historyItem);
    });
    
    // Generate game history items
    gameHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-detail">
                <span class="history-label">Date</span>
                <span class="history-value">${formatDate(entry.date)}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Score</span>
                <span class="history-value">${entry.score}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Words</span>
                <span class="history-value">${entry.words}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Speed</span>
                <span class="history-value">${entry.speed}</span>
            </div>
            <div class="history-detail">
                <span class="history-label">Time</span>
                <span class="history-value">${formatTime(entry.time)}</span>
            </div>
        `;
        
        gameHistoryList.appendChild(historyItem);
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
