// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
  // Add loading="lazy" to all images that don't have it
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(
    '.scroll-animate, .fade-in-left, .fade-in-right, .scale-in'
  );
  animatedElements.forEach(el => observer.observe(el));

  // Animate stat numbers on scroll
  const statValues = document.querySelectorAll('.stat-value');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStatValue(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(stat => statsObserver.observe(stat));
});

// Animate number counting for stats
function animateStatValue(element) {
  const text = element.textContent;
  const number = parseFloat(text.replace(/[^0-9.]/g, ''));
  
  if (!isNaN(number)) {
    let current = 0;
    const increment = number / 30; // 30 frames
    const suffix = text.replace(/[0-9.]/g, '');
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        element.textContent = text;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 30);
  }
}

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    'assets/images/onatrack_background.png',
    'assets/images/onatrack_logo_cyan.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Call preload on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadCriticalImages);
} else {
  preloadCriticalImages();
}

// Loading state indicator
window.addEventListener('load', function() {
  document.body.classList.add('page-loaded');
});