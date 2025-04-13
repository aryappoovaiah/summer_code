document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    } else {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        }
    });
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the corresponding content section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Set current date
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    // Tab functionality
    function setupTabs(tabContainerClass, contentContainerClass) {
        const tabContainers = document.querySelectorAll(`.${tabContainerClass}`);
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll(`.${tabContainerClass}-tab`);
            const contents = container.parentElement.querySelectorAll(`.${contentContainerClass}`);
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs in this container
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Hide all content sections in this container
                    contents.forEach(content => content.classList.remove('active'));
                    
                    // Show the corresponding content section
                    const tabId = this.getAttribute('data-tab');
                    container.parentElement.querySelector(`#${tabId}`).classList.add('active');
                });
            });
        });
    }
    
    // Initialize all tab systems
    setupTabs('section-tab', 'tab-content');
    setupTabs('planner-tab', 'planner-view');
    
    // Mood Tracker
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected state from all options
            moodOptions.forEach(opt => opt.style.transform = 'scale(1)');
            
            // Add selected state to clicked option
            this.style.transform = 'scale(1.2)';
            
            // You could save this to localStorage or send to a server
            const selectedMood = this.getAttribute('data-mood');
            console.log('Selected mood:', selectedMood);
        });
    });
    
    // Pomodoro Timer
    let timerInterval;
    let timerSeconds = 25 * 60; // 25 minutes
    let isTimerRunning = false;
    let isBreakTime = false;
    
    const timerDisplay = document.querySelector('.timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const focusTimeInput = document.getElementById('focus-time');
    const breakTimeInput = document.getElementById('break-time');
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                
                // Play a sound or show notification
                alert(isBreakTime ? 'Focus session over! Time to focus.' : 'Break time! Take a rest.');
                
                // Switch between focus and break time
                isBreakTime = !isBreakTime;
                timerSeconds = (isBreakTime ? parseInt(breakTimeInput.value) : parseInt(focusTimeInput.value)) * 60;
                updateTimerDisplay();
                
                // Update timer mode display
                document.querySelector('.timer-mode').textContent = isBreakTime ? 'Break Time' : 'Focus Session';
            }
        }, 1000);
    }
    
    function pauseTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }
    
    function resetTimer() {
        pauseTimer();
        isBreakTime = false;
        timerSeconds = parseInt(focusTimeInput.value) * 60;
        updateTimerDisplay();
        document.querySelector('.timer-mode').textContent = 'Focus Session';
    }
    
    if (startTimerBtn && pauseTimerBtn && resetTimerBtn) {
        startTimerBtn.addEventListener('click', startTimer);
        pauseTimerBtn.addEventListener('click', pauseTimer);
        resetTimerBtn.addEventListener('click', resetTimer);
        
        // Initialize timer display
        updateTimerDisplay();
    }
    
    // Quick Pomodoro Timer on Dashboard
    const quickTimerDisplay = document.querySelector('.quick-timer .timer-display');
    const quickTimerButtons = document.querySelectorAll('.quick-timer .timer-controls button');
    
    let quickTimerSeconds = 25 * 60;
    let quickTimerInterval;
    let isQuickTimerRunning = false;
    
    function updateQuickTimerDisplay() {
        const minutes = Math.floor(quickTimerSeconds / 60);
        const seconds = quickTimerSeconds % 60;
        quickTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    quickTimerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            
            if (action.includes('fa-play')) {
                // Start timer
                if (!isQuickTimerRunning) {
                    isQuickTimerRunning = true;
                    quickTimerInterval = setInterval(() => {
                        quickTimerSeconds--;
                        updateQuickTimerDisplay();
                        
                        if (quickTimerSeconds <= 0) {
                            clearInterval(quickTimerInterval);
                            isQuickTimerRunning = false;
                            alert('Timer finished!');
                            quickTimerSeconds = 25 * 60;
                            updateQuickTimerDisplay();
                        }
                    }, 1000);
                }
            } else if (action.includes('fa-pause')) {
                // Pause timer
                clearInterval(quickTimerInterval);
                isQuickTimerRunning = false;
            } else if (action.includes('fa-redo')) {
                // Reset timer
                clearInterval(quickTimerInterval);
                isQuickTimerRunning = false;
                quickTimerSeconds = 25 * 60;
                updateQuickTimerDisplay();
            }
        });
    });
    
    // Flashcard functionality
    const flashcard = document.querySelector('.flashcard');
    if (flashcard) {
        const flashcardInner = flashcard.querySelector('.flashcard-inner');
        const flipBtn = document.getElementById('flip-card');
        
        flipBtn.addEventListener('click', function() {
            flashcardInner.classList.toggle('flipped');
        });
        
        // Navigation between flashcards
        const prevBtn = document.getElementById('prev-card');
        const nextBtn = document.getElementById('next-card');
        const cardCount = document.querySelector('.card-count');
        
        let currentCard = 1;
        const totalCards = 5; // This would normally come from your data
        
        function updateCardNavigation() {
            cardCount.textContent = `Card ${currentCard} of ${totalCards}`;
            flashcardInner.classList.remove('flipped');
        }
        
        prevBtn.addEventListener('click', function() {
            if (currentCard > 1) {
                currentCard--;
                updateCardNavigation();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (currentCard < totalCards) {
                currentCard++;
                updateCardNavigation();
            }
        });
        
        updateCardNavigation();
    }
    
    // Wellness Tips Carousel
    const tipCards = document.querySelectorAll('.tip-card');
    const prevTipBtn = document.getElementById('prev-tip');
    const nextTipBtn = document.getElementById('next-tip');
    const dots = document.querySelectorAll('.dot');
    
    let currentTip = 0;
    
    function showTip(index) {
        tipCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentTip = index;
    }
    
    if (prevTipBtn && nextTipBtn) {
        prevTipBtn.addEventListener('click', function() {
            let newIndex = currentTip - 1;
            if (newIndex < 0) newIndex = tipCards.length - 1;
            showTip(newIndex);
        });
        
        nextTipBtn.addEventListener('click', function() {
            let newIndex = currentTip + 1;
            if (newIndex >= tipCards.length) newIndex = 0;
            showTip(newIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showTip(index);
            });
        });
        
        // Initialize
        showTip(0);
    }
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.classList.toggle('active');
        });
    });
    
    // Icebreaker Generator
    const generateQuestionBtn = document.getElementById('generate-question');
    if (generateQuestionBtn) {
        const questions = [
            "If you could have dinner with any historical figure, who would it be and why?",
            "What's your favorite way to spend a weekend?",
            "If you could instantly become an expert in something, what would it be?",
            "What's something you're looking forward to this semester?",
            "What's the most interesting thing you've learned recently?",
            "If you could travel anywhere in the world, where would you go?",
            "What's your favorite book or movie and why?",
            "What's a skill you'd like to learn?",
            "What's your favorite place on campus?",
            "If you could have any superpower, what would it be?"
        ];
        
        generateQuestionBtn.addEventListener('click', function() {
            const randomIndex = Math.floor(Math.random() * questions.length);
            document.querySelector('.question-card p').textContent = questions[randomIndex];
        });
    }
    
    // Task completion
    const taskCheckboxes = document.querySelectorAll('.task-list input[type="checkbox"]');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.7';
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
            }
        });
    });
    
    // Form submission handlers
    const journalForm = document.querySelector('.quick-journal');
    if (journalForm) {
        journalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const entryText = this.querySelector('textarea').value;
            if (entryText.trim()) {
                alert('Journal entry saved!');
                this.querySelector('textarea').value = '';
            }
        });
    }
    
    // Initialize any date pickers
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.valueAsDate = new Date();
        }
    });
    
    // Initialize any datetime-local pickers
    const datetimeInputs = document.querySelectorAll('input[type="datetime-local"]');
    datetimeInputs.forEach(input => {
        if (!input.value) {
            const now = new Date();
            // Format as YYYY-MM-DDTHH:MM
            input.value = now.toISOString().slice(0, 16);
        }
    });
});