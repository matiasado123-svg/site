// App Showcase Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Carousel Setup
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  
  // Initialize carousel
  function updateCarousel() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      
      if (index === currentIndex) {
        slide.classList.add('active');
      } else if (index === getPrevIndex()) {
        slide.classList.add('prev');
      } else if (index === getNextIndex()) {
        slide.classList.add('next');
      }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Get previous index with looping
  function getPrevIndex() {
    return currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
  }
  
  // Get next index with looping
  function getNextIndex() {
    return currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
  }
  
  // Navigate to previous slide
  function goToPrev() {
    currentIndex = getPrevIndex();
    updateCarousel();
  }
  
  // Navigate to next slide
  function goToNext() {
    currentIndex = getNextIndex();
    updateCarousel();
  }
  
  // Navigate to specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  // Event Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', goToPrev);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', goToNext);
  }
  
  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const carouselSection = document.querySelector('.app-gallery');
    if (!carouselSection) return;
    
    const rect = carouselSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    }
  });
  
  // Touch/Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left, go to next
        goToNext();
      } else {
        // Swiped right, go to previous
        goToPrev();
      }
    }
  }
  
  // Auto-play (optional - uncomment to enable)
  // let autoplayInterval;
  // function startAutoplay() {
  //   autoplayInterval = setInterval(goToNext, 5000);
  // }
  // function stopAutoplay() {
  //   clearInterval(autoplayInterval);
  // }
  // startAutoplay();
  // track.addEventListener('mouseenter', stopAutoplay);
  // track.addEventListener('mouseleave', startAutoplay);
  
  // Initialize
  updateCarousel();
  
  // Lightbox functionality for screenshots
  const screenshots = document.querySelectorAll('.app-screenshot');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  
  if (screenshots.length > 0 && lightboxOverlay) {
    screenshots.forEach(screenshot => {
      screenshot.addEventListener('click', function(e) {
        // Only open lightbox if clicking on active slide
        if (this.closest('.carousel-slide').classList.contains('active')) {
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
          videoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    videoObserver.observe(videoContainer);
  }
});