// Enhanced form validation
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  
  if (form) {
    // Real-time validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const countrySelect = document.getElementById('country');

    // Name validation
    if (nameInput) {
      nameInput.addEventListener('blur', function() {
        validateName(this);
      });
      nameInput.addEventListener('input', function() {
        removeError(this);
      });
    }

    // Email validation
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        validateEmail(this);
      });
      emailInput.addEventListener('input', function() {
        removeError(this);
      });
    }

    // Country validation
    if (countrySelect) {
      countrySelect.addEventListener('change', function() {
        validateCountry(this);
      });
    }

    // Form submission with enhanced validation
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate all fields
      const isNameValid = validateName(nameInput);
      const isEmailValid = validateEmail(emailInput);
      const isCountryValid = validateCountry(countrySelect);

      if (!isNameValid || !isEmailValid || !isCountryValid) {
        // Scroll to first error
        const firstError = form.querySelector('.input-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      submitBtn.style.opacity = '0.7';
      
      const formData = new FormData(form);
      
      try {
        const response = await fetch('./api/submit_interest.php', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show success message with animation
          form.innerHTML = `
            <div class="success-message scale-in visible" style="text-align: center; padding: 3rem 1rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem; color: #22d3ee;">✓</div>
              <h3 style="color: #22d3ee; margin-bottom: 1rem; font-size: 1.5rem;">Thank You!</h3>
              <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">
                ${data.message}
              </p>
            </div>
          `;
        } else {
          showFormError(data.message || 'An error occurred. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          submitBtn.style.opacity = '1';
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showFormError('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        submitBtn.style.opacity = '1';
      }
    });
  }
});

// Validation functions
function validateName(input) {
  const value = input.value.trim();
  
  if (value === '') {
    showError(input, 'Name is required');
    return false;
  }
  
  if (value.length < 2) {
    showError(input, 'Name must be at least 2 characters');
    return false;
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(value)) {
    showError(input, 'Name can only contain letters, spaces, hyphens, and apostrophes');
    return false;
  }
  
  removeError(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();
  
  if (value === '') {
    showError(input, 'Email is required');
    return false;
  }
  
  // More comprehensive email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    showError(input, 'Please enter a valid email address');
    return false;
  }
  
  removeError(input);
  return true;
}

function validateCountry(select) {
  const value = select.value;
  
  if (value === '') {
    showError(select, 'Please select a country');
    return false;
  }
  
  removeError(select);
  return true;
}

// Error display functions
function showError(input, message) {
  const formGroup = input.closest('.form-group');
  
  // Remove existing error
  removeError(input);
  
  // Add error class
  input.classList.add('input-error');
  
  // Create and add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  formGroup.appendChild(errorDiv);
}

function removeError(input) {
  const formGroup = input.closest('.form-group');
  input.classList.remove('input-error');
  
  const existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

function showFormError(message) {
  const form = document.getElementById('registerForm');
  
  // Remove existing form error
  const existingError = form.querySelector('.form-error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid #ef4444;
    color: #ef4444;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 600;
  `;
  
  form.insertBefore(errorDiv, form.firstChild);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.style.opacity = '0';
    setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}