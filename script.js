// Element References
const themeToggleBtn = document.getElementById('themeToggle');
const newsletterForm = document.getElementById('newsletterForm');

/**
 * Evaluates whether current system time falls between 6 PM (18:00) and 9 PM (21:00).
 * @returns {boolean}
 */
function isTimeInSchedule() {
  const currentHour = new Date().getHours();
  return currentHour >= 18 && currentHour < 21;
}

/**
 * Applies or removes the dark theme attribute on <html>.
 * @param {boolean} isDark 
 */
function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    // Setting explicit 'light' attribute in case your CSS targets [data-theme="light"]
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

/**
 * Initializes theme setting based on stored preference or current schedule.
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme === 'dark');
  } else {
    // If no manual preference is saved, use time schedule
    applyTheme(isTimeInSchedule());
  }
}

// Event Listener: Manual Theme Toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(targetTheme === 'dark');
    localStorage.setItem('theme', targetTheme);
  });
}

// Listen for cross-tab theme sync
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    applyTheme(event.newValue === 'dark');
  }
});

// Newsletter Submission
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('شكراً لاشتراكك! سيصلك جديدنا على البريد.');
    this.reset();
  });
}

// Run immediately
initTheme();
