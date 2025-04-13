// Theme toggling functionality
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = themeToggleBtn.querySelector('.fa-sun');
    const moonIcon = themeToggleBtn.querySelector('.fa-moon');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('dark-mode');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Toggle icons
        moonIcon.classList.toggle('hidden');
        sunIcon.classList.toggle('hidden');
        
        // Save theme preference
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
}
