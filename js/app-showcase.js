// App Showcase Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  
  const track = document.querySelector('.carousel-track');
  const slidesContainer = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  if (!track || slidesContainer.length === 0) return;
  
  // Clone slides for infinite loop
  const originalSlides = Array.from(slidesContainer);
  const numSlides = originalSlides.length;
  
  // Clone slides before and after for seamless loop
  originalSlides.forEach(slide => {
    const cloneBefore = slide.cloneNode(true);
    const cloneAfter = slide.cloneNode(true);
    track.insertBefore(cloneBefore, track.firstChild);
    track.appendChild(cloneAfter);
  });
  
  const allSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  let currentIndex = numSlides; // Start at first original slide
  const slideWidth = 280 + 32; // slide width + gap (2rem = 32px)
  let isTransitioning = false;
  
  // Initialize: position track to show first original slide centered
  function initCarousel() {
    const offset = (track.parentElement.offsetWidth / 2) - (slideWidth / 2);
    const translateX = offset - (currentIndex * slideWidth);
    track.style.transition = 'none';
    track.style.transform = `translateX(${translateX}px)`;
    setTimeout(() => {
      track.style.transition = 'transform 0.5s ease';
      updateActiveStates();
    }, 50);
  }
  
  // Update carousel position
  function updateCarousel(animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const offset = (track.parentElement.offsetWidth / 2) - (slideWidth / 2);
    const translateX = offset - (currentIndex * slideWidth);
    
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s ease';
    }
    
    track.style.transform = `translateX(${translateX}px)`;
    updateActiveStates();
    
    setTimeout(() => {
      isTransitioning = false;
      checkLoop();
    }, animate ? 500 : 50);
  }
  
  // Check if we need to loop
  function checkLoop() {
    if (currentIndex >= numSlides * 2) {
      // We're at the end clones, jump to start originals
      currentIndex = numSlides;
      updateCarousel(false);
    } else if (currentIndex < numSlides) {
      // We're at the start clones, jump to end originals
      currentIndex = numSlides * 2 - 1;
      updateCarousel(false);
    }
  }
  
  // Update active states
  function updateActiveStates() {
    allSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
    
    // Update indicators based on real position
    const realIndex = ((currentIndex - numSlides) % numSlides + numSlides) % numSlides;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === realIndex);
    });
  }
  
  // Navigate to previous slide
  function goToPrev() {
    if (isTransitioning) return;
    currentIndex--;
    updateCarousel(true);
  }
  
  // Navigate to next slide
  function goToNext() {
    if (isTransitioning) return;
    currentIndex++;
    updateCarousel(true);
  }
  
  // Navigate to specific slide
  function goToSlide(index) {
    if (isTransitioning) return;
    currentIndex = numSlides + index;
    updateCarousel(true);
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
        goToNext();
      } else {
        goToPrev();
      }
    }
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    updateCarousel(false);
  });
  
  // Initialize
  initCarousel();
  
  // Lightbox functionality
  const screenshots = document.querySelectorAll('.app-screenshot');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  
  if (screenshots.length > 0 && lightboxOverlay) {
    screenshots.forEach(screenshot => {
      screenshot.addEventListener('click', function(e) {
        if (this.closest('.carousel-slide').classList.contains('active')) {
          const img = this.querySelector('img');
          if (img) {
            const fullscreenImg = img.cloneNode(true);
            fullscreenImg.style.maxWidth = '90vw';
            fullscreenImg.style.maxHeight = '90vh';
            fullscreenImg.style.objectFit = 'contain';
            
            lightboxOverlay.classList.add('active');
            lightboxOverlay.innerHTML = '';
            lightboxOverlay.appendChild(fullscreenImg);
            document.body.style.overflow = 'hidden';
          }
        }
      });
    });
    
    lightboxOverlay.addEventListener('click', function() {
      this.classList.remove('active');
      this.innerHTML = '';
      document.body.style.overflow = '';
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        lightboxOverlay.classList.remove('active');
        lightboxOverlay.innerHTML = '';
        document.body.style.overflow = '';
      }
    });
  }
});