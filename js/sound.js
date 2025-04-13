// Sound effects management
let soundsEnabled = true;

// Create audio objects
const keypressSound = new Audio('audio/keypress.mp3');
const errorSound = new Audio('audio/error.mp3');
const countdownSound = new Audio('audio/countdown.mp3');
const gameoverSound = new Audio('audio/gameover.mp3');

// Set volume for all sounds
keypressSound.volume = 0.2;
errorSound.volume = 0.3;
countdownSound.volume = 0.4;
gameoverSound.volume = 0.4;

// Function to play the keypress sound
function playKeypressSound() {
    if (soundsEnabled) {
        // Clone the sound to allow multiple keypresses in quick succession
        const sound = keypressSound.cloneNode();
        sound.volume = 0.2;
        sound.play().catch(e => console.log("Error playing sound:", e));
    }
}

// Function to play the error sound
function playErrorSound() {
    if (soundsEnabled) {
        errorSound.currentTime = 0;
        errorSound.play().catch(e => console.log("Error playing sound:", e));
    }
}

// Function to play the countdown sound (when time is low)
function playCountdownSound() {
    if (soundsEnabled) {
        countdownSound.currentTime = 0;
        countdownSound.play().catch(e => console.log("Error playing sound:", e));
    }
}

// Function to play the game over sound
function playGameoverSound() {
    if (soundsEnabled) {
        gameoverSound.currentTime = 0;
        gameoverSound.play().catch(e => console.log("Error playing sound:", e));
    }
}

// Function to toggle sounds
function toggleSounds() {
    soundsEnabled = !soundsEnabled;
    return soundsEnabled;
}

// Initialize sound toggle button
function initSoundToggle() {
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', function() {
            const enabled = toggleSounds();
            const soundIcon = this.querySelector('i');
            
            if (enabled) {
                soundIcon.classList.remove('fa-volume-mute');
                soundIcon.classList.add('fa-volume-up');
            } else {
                soundIcon.classList.remove('fa-volume-up');
                soundIcon.classList.add('fa-volume-mute');
            }
        });
    }
}