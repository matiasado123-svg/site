// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      // Get form data
      const formData = new FormData(form);
      
      try {
        const response = await fetch('./api/submit_interest.php', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show success message
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
          // Show error message
          alert(data.message || 'An error occurred. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;  
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});