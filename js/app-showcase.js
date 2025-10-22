// App Showcase Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  
  const track = document.querySelector('.carousel-track');
  const slidesContainer = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  if (!track || slidesContainer.length === 0) return;
  
  const originalSlides = Array.from(slidesContainer);
  const numSlides = originalSlides.length;
  
  // Clear track and rebuild with proper structure
  track.innerHTML = '';
  
  // Create all slides (clones + originals)
  const allSlidesData = [];
  
  // Add clones before
  originalSlides.forEach((slide, index) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('data-index', index);
    clone.setAttribute('data-clone', 'before');
    track.appendChild(clone);
    allSlidesData.push({ element: clone, originalIndex: index });
  });
  
  // Add original slides
  originalSlides.forEach((slide, index) => {
    const newSlide = slide.cloneNode(true);
    newSlide.setAttribute('data-index', index);
    newSlide.setAttribute('data-clone', 'false');
    track.appendChild(newSlide);
    allSlidesData.push({ element: newSlide, originalIndex: index });
  });
  
  // Add clones after
  originalSlides.forEach((slide, index) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute('data-index', index);
    clone.setAttribute('data-clone', 'after');
    track.appendChild(clone);
    allSlidesData.push({ element: clone, originalIndex: index });
  });
  
  const allSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  let currentIndex = numSlides; // Start at first original slide
  const slideWidth = 280; // slide width
  const gap = 32; // 2rem gap
  const slideWidthWithGap = slideWidth + gap;
  let isTransitioning = false;
  
  // Initialize carousel
  function initCarousel() {
    updateCarousel(false);
  }
  
  // Update carousel position
  function updateCarousel(animate = true) {
    if (isTransitioning && animate) return;
    if (animate) isTransitioning = true;
    
    // Get wrapper dimensions
    const wrapper = track.parentElement;
    const wrapperWidth = wrapper.offsetWidth;
    const wrapperStyle = window.getComputedStyle(wrapper);
    const paddingLeft = parseInt(wrapperStyle.paddingLeft) || 0;
    const paddingRight = parseInt(wrapperStyle.paddingRight) || 0;
    
    let translateX;
    
    // Check if mobile (viewport width <= 768px)
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile: Center the active slide in the viewport
      const viewportCenter = wrapperWidth / 2;
      const slideCenter = slideWidth / 2;
      const slidePosition = currentIndex * slideWidthWithGap;
      translateX = viewportCenter - slidePosition - slideCenter;
    } else {
      // Desktop: Use original calculation (which works fine)
      const availableWidth = wrapperWidth - paddingLeft - paddingRight;
      const centerOffset = paddingLeft + (availableWidth / 2) - (slideWidth / 2);
      translateX = centerOffset - (currentIndex * slideWidthWithGap);
    }
    
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(${translateX}px)`;
    
    updateActiveStates();
    
    if (animate) {
      setTimeout(() => {
        isTransitioning = false;
        checkLoop();
      }, 500);
    }
  }
  
  // Check if we need to loop
  function checkLoop() {
    let needsJump = false;
    let newIndex = currentIndex;
    
    if (currentIndex >= numSlides * 2) {
      // At end clones, jump to start originals
      newIndex = numSlides;
      needsJump = true;
    } else if (currentIndex < numSlides) {
      // At start clones, jump to end originals
      newIndex = (numSlides * 2) - 1;
      needsJump = true;
    }
    
    if (needsJump) {
      currentIndex = newIndex;
      updateCarousel(false);
    }
  }
  
  // Update active states
  function updateActiveStates() {
    allSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
    
    // Update indicators
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
  
  // Touch/Swipe support
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
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(false);
    }, 250);
  });
  
  // Initialize
  initCarousel();
  
  // Lightbox functionality
  const screenshots = document.querySelectorAll('.app-screenshot');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  
  if (screenshots.length > 0 && lightboxOverlay) {
    // Delegate click event to track
    track.addEventListener('click', function(e) {
      const screenshot = e.target.closest('.app-screenshot');
      if (screenshot && screenshot.closest('.carousel-slide').classList.contains('active')) {
        const img = screenshot.querySelector('img');
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