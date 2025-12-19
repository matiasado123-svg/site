// ===================================
// ONATECH MAIN JAVASCRIPT - FIXED
// ===================================

// Remove loading class when page is loaded
window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});

// ===================================
// COOKIE CONSENT MANAGEMENT
// ===================================
(function() {
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    const cookieChoice = localStorage.getItem('cookieConsent');

    if (!cookieChoice) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
            enableAnalytics();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
            disableAnalytics();
        });
    }

    function enableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    function disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }

    if (cookieChoice === 'accepted') {
        enableAnalytics();
    }
})();

// ===================================
// HAMBURGER MENU - FIXED
// ===================================
(function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        } else {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            
            // Focus first menu item when opening
            setTimeout(() => {
                const firstLink = navMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 300);
        }
    }

    // Click handler
    hamburger.addEventListener('click', toggleMenu);

    // Keyboard handler
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when clicking on a link
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });

    console.log('✓ Hamburger menu loaded');
})();

// ===================================
// SMOOTH SCROLLING
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            const originalTabindex = target.getAttribute('tabindex');
            if (!originalTabindex) {
                target.setAttribute('tabindex', '-1');
            }
            
            setTimeout(() => {
                target.focus();
                if (!originalTabindex) {
                    target.removeAttribute('tabindex');
                }
            }, 500);
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .application-card, .expertise-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ===================================
// FAQ ACCORDION - FIXED VERSION
// ===================================
(function() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  if (faqQuestions.length === 0) {
    console.log('⚠ No FAQ questions found');
    return;
  }

  function toggleFAQ(question) {
    const faqItem = question.parentElement;
    const answer = question.nextElementSibling;
    const isExpanded = question.getAttribute('aria-expanded') === 'true';

    // Close all other FAQ items
    faqQuestions.forEach(q => {
      const otherAnswer = q.nextElementSibling;
      q.setAttribute('aria-expanded', 'false');
      q.parentElement.classList.remove('active');
      otherAnswer.classList.remove('open');
      otherAnswer.setAttribute('hidden', '');
    });

    // Toggle current item
    if (!isExpanded) {
      question.setAttribute('aria-expanded', 'true');
      faqItem.classList.add('active');
      answer.classList.add('open');
      answer.removeAttribute('hidden');
    }
  }

  // Initialize all answers as closed
  faqQuestions.forEach(question => {
    const answer = question.nextElementSibling;
    if (answer) {
      answer.setAttribute('hidden', '');
    }

    // Click handler
    question.addEventListener('click', e => {
      e.preventDefault();
      toggleFAQ(question);
    });

    // Keyboard handler
    question.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(question);
      }
    });
  });

  console.log('✓ FAQ accordion loaded - ' + faqQuestions.length + ' questions found');
})();


// ===================================
// CONTACT FORM
// ===================================
(function(){
    const form = document.getElementById('contactForm');
    const msgSuccess = document.getElementById('msg-success');
    const honeypot = document.getElementById('website');

    if (!form) return;

    form.addEventListener('submit', function(evt){
        evt.preventDefault();

        if (honeypot && honeypot.value.trim() !== '') {
            return;
        }

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        let errors = [];

        if (!name) errors.push('Vul uw naam in.');
        if (!email) errors.push('Vul een geldig e-mail adres in.');
        if (!message || message.length < 10) errors.push('Voeg een kort bericht toe (minimaal 10 tekens).');

        if (errors.length) {
            alert('Er ontbreken gegevens:\n– ' + errors.join('\n– '));
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Versturen…';

        setTimeout(() => {
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Verstuur bericht';
            msgSuccess.style.display = 'block';
            msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                msgSuccess.style.display = 'none';
            }, 7000);
        }, 900);
    });

    console.log('✓ Contact form loaded');
})();

// ===================================
// ACCESSIBILITY HELPERS
// ===================================
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);

// ===================================
// LAZY LOADING FALLBACK
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    console.log('✓ Native lazy loading supported');
} else {
    console.log('⚠ Loading lazy loading polyfill');
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

console.log('✓ OnaTech website loaded successfully');