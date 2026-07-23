// Element References
const themeToggleBtn = document.getElementById('themeToggle');
const newsletterForm = document.getElementById('newsletterForm');
const toastPopup = document.getElementById('toastPopup');


const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3UoKLgnSJcZ_Z4OMuRSLAG0bpjDcmTm2MIAN5AMYx9SOKiCBx_gQezfb4nt3CM9o/exec';

/**
 * Applies or removes the dark theme attribute.
 * @param {boolean} isDark 
 */
function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/**
 * Evaluates whether current system time falls between 6 PM (18:00) and 9 AM (09:00).
 * @returns {boolean}
 */
function isTimeInSchedule() {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour < 9;
}

/**
 * Initializes theme setting based on stored preference or current schedule.
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme !== null) {
    applyTheme(savedTheme === 'dark');
  } else {
    applyTheme(isTimeInSchedule());
  }
}

/**
 * Displays the toast popup message and automatically hides it.
 */
function showToast() {
  if (!toastPopup) return;
  
  toastPopup.classList.add('show');
  
  // Hide toast after 3 seconds (matches CSS animation)
  setTimeout(() => {
    toastPopup.classList.remove('show');
  }, 3000);
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

// Event Listener: Listen for theme updates across open browser tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    applyTheme(event.newValue === 'dark');
  }
});

// Event Listener: Newsletter Submission to Google Sheets
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = 'جاري إرسال...';

    const formData = new FormData(this);

    try {
      // Send data to Google Apps Script
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Prevents CORS preflight blocking
      });

      // Show toast notification & clear form
      showToast();
      this.reset();
    } catch (error) {
      console.error('Submission Error:', error);
      alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = originalText;
    }
  });
}

// Initialize theme on execution
initTheme();
