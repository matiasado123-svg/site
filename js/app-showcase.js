// App Showcase Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Carousel Setup
  const track = document.querySelector('.app-gallery-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const screenshots = document.querySelectorAll('.app-screenshot');
  
  if (!track || !prevBtn || !nextBtn || indicators.length === 0) return;
  
  let currentIndex = 0;
  const totalSlides = screenshots.length;
  
  // Touch/Swipe variables
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  
  // Update carousel position
  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    if (currentIndex >= totalSlides) currentIndex = 0;
    updateCarousel();
  }
  
  // Next slide
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }
  
  // Previous slide
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }
  
  // Button click handlers
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Touch/Swipe Support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
  }, { passive: true });
  
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    
    const swipeThreshold = 50; // minimum distance for swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next
        nextSlide();
      } else {
        // Swiped right - go to previous
        prevSlide();
      }
    }
    
    touchStartX = 0;
    touchEndX = 0;
  });
  
  // Mouse drag support for desktop
  let mouseStartX = 0;
  let mouseEndX = 0;
  let isMouseDragging = false;
  
  track.addEventListener('mousedown', (e) => {
    mouseStartX = e.screenX;
    isMouseDragging = true;
    track.style.cursor = 'grabbing';
  });
  
  track.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;
    mouseEndX = e.screenX;
  });
  
  track.addEventListener('mouseup', () => {
    if (!isMouseDragging) return;
    isMouseDragging = false;
    track.style.cursor = 'grab';
    
    const swipeThreshold = 50;
    const diff = mouseStartX - mouseEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    mouseStartX = 0;
    mouseEndX = 0;
  });
  
  track.addEventListener('mouseleave', () => {
    if (isMouseDragging) {
      isMouseDragging = false;
      track.style.cursor = 'grab';
    }
  });
  
  // Auto-play (optional - uncomment to enable)
  /*
  let autoplayInterval = setInterval(nextSlide, 5000);
  
  // Pause autoplay on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  
  track.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(nextSlide, 5000);
  });
  */
  
  // Initialize
  updateCarousel();
  track.style.cursor = 'grab';
  
  // Animate gallery items on scroll
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const gallerySection = document.querySelector('.app-gallery');
  if (gallerySection) {
    galleryObserver.observe(gallerySection);
  }
});