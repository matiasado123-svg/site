// App Showcase functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Optional: Add click-to-enlarge functionality for screenshots
  const screenshots = document.querySelectorAll('.app-screenshot');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  
  if (screenshots.length > 0 && lightboxOverlay) {
    screenshots.forEach(screenshot => {
      screenshot.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
          // Create fullscreen version
          const fullscreenImg = img.cloneNode(true);
          fullscreenImg.style.maxWidth = '90vw';
          fullscreenImg.style.maxHeight = '90vh';
          fullscreenImg.style.objectFit = 'contain';
          
          // Show overlay
          lightboxOverlay.classList.add('active');
          lightboxOverlay.innerHTML = '';
          lightboxOverlay.appendChild(fullscreenImg);
          
          // Prevent body scroll
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close lightbox on click
    lightboxOverlay.addEventListener('click', function() {
      this.classList.remove('active');
      this.innerHTML = '';
      document.body.style.overflow = '';
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        lightboxOverlay.classList.remove('active');
        lightboxOverlay.innerHTML = '';
        document.body.style.overflow = '';
      }
    });
  }
  
  // Lazy load video when it comes into view
  const videoContainer = document.querySelector('.app-video-container video');
  if (videoContainer) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Video is in view, you could auto-load or enable controls
          videoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    videoObserver.observe(videoContainer);
  }
  
  // Add smooth scroll animation class to gallery items
  const galleryItems = document.querySelectorAll('.app-gallery-grid .app-screenshot');
  if (galleryItems.length > 0) {
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => galleryObserver.observe(item));
  }
});