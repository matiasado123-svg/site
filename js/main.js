// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  const loadingOverlay = document.getElementById('loadingOverlay'); // Add this
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Show loading overlay
      loadingOverlay.classList.add('active'); // Add this
      
      // Disable button
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      const formData = new FormData(form);
      
      try {
        const response = await fetch('./api/submit_interest.php', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        // Hide loading overlay
        loadingOverlay.classList.remove('active'); // Add this
        
        if (data.success) {
          form.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">✓</div>
              <h3 style="color: #00d9ff; margin-bottom: 1rem; font-size: 1.5rem;">Thank You!</h3>
              <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">
                We'll notify you when OnaTrack launches.
              </p>
            </div>
          `;
        } else {
          alert(data.message || 'An error occurred. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;  
        }
      } catch (error) {
        console.error('Form submission error:', error);
        loadingOverlay.classList.remove('active'); // Add this
        alert('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
});
