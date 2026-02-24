export const runAuthTransition = (text: string, action: () => void) => {
  const overlay = document.createElement('div');
  overlay.className = 'auth-transition-overlay';
  overlay.innerHTML = `<div class="auth-transition-text">${text}</div>`;
  document.body.appendChild(overlay);

  // Trigger enter animation
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  // Execute the state change halfway through the 1.2s animation
  setTimeout(() => {
    action();
  }, 600);

  // Trigger exit animation after 1.2s
  setTimeout(() => {
    overlay.classList.remove('active');
    
    // Remove from DOM after fade out completes
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 600);
  }, 1200);
};
