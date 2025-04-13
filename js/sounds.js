// Sound effects functionality
let soundEnabled = true;

// Create audio objects
const typingSound = new Audio('assets/keyboard-typing-one-short.mp3');
const wrongSound = new Audio('assets/wrong.mp3');

// Set volume levels
typingSound.volume = 0.5;
wrongSound.volume = 0.3;

// Function to play typing sound
function playTypingSound() {
    if (soundEnabled) {
        // Clone the sound to allow multiple rapid plays
        const sound = typingSound.cloneNode();
        sound.volume = typingSound.volume;
        sound.play().catch(e => console.log("Error playing sound:", e));
    }
}

// Function to play wrong key sound
function playWrongSound() {
    if (soundEnabled) {
        // Clone the sound to allow multiple rapid plays
        const sound = wrongSound.cloneNode();
        sound.volume = wrongSound.volume;
        sound.play().catch(e => console.log("Error playing sound:", e));
    }
}

// Toggle sound on/off
function toggleSound() {
    soundEnabled = !soundEnabled;
    return soundEnabled;
}

// Initialize sound toggle button
function initSoundToggle() {
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (!soundToggleBtn) return;
    
    // Set initial button state
    updateSoundButtonState(soundToggleBtn);
    
    // Add event listener
    soundToggleBtn.addEventListener('click', function() {
        const isEnabled = toggleSound();
        updateSoundButtonState(this, isEnabled);
    });
}

// Update the sound button icon
function updateSoundButtonState(button, isEnabled = soundEnabled) {
    if (!button) return;
    
    const soundOnIcon = button.querySelector('.fa-volume-up');
    const soundOffIcon = button.querySelector('.fa-volume-mute');
    
    if (isEnabled) {
        soundOnIcon.classList.remove('hidden');
        soundOffIcon.classList.add('hidden');
    } else {
        soundOnIcon.classList.add('hidden');
        soundOffIcon.classList.remove('hidden');
    }
}