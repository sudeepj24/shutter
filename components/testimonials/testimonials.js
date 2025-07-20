// $("#testimonials").load("components/testimonials/testimonials.html", function () {
//   const $container = $("#testimonials .testimonial-cards");
//   const $cards = $container.children();
//   let active = Math.min(1, $cards.length - 1);

//   function refresh() {
//     $cards.removeClass("active prev next");
//     $cards.each(function (i) {
//       if (i === active) $(this).addClass("active");
//       else if (i === active - 1) $(this).addClass("prev");
//       else if (i === active + 1) $(this).addClass("next");
//     });

//     const mid = $container.width() / 2;
//     const $card = $cards.eq(active);
//     const left = $card.position().left + $card.outerWidth() / 2;
//     $container.css("transform", `translateX(${mid - left}px)`);
//   }

//   refresh();

//   $cards.each(function (i) {
//     $(this).on("click", function () {
//       active = i;
//       refresh();
//     });
//   });

//   let startX = 0;
//   let dragging = false;

//   $container.on("pointerdown", function (e) {
//     dragging = true;
//     startX = e.pageX;
//     $container.css("cursor", "grabbing");
//   });

//   $container.on("pointermove", function (e) {
//     if (!dragging) return;
//     const dx = e.pageX - startX;
//     if (dx > 50 && active > 0) {
//       active--;
//       refresh();
//       dragging = false;
//     } else if (dx < -50 && active < $cards.length - 1) {
//       active++;
//       refresh();
//       dragging = false;
//     }
//   });

//   $container.on("pointerup pointerleave", function () {
//     dragging = false;
//     $container.css("cursor", "grab");
//   });
// });

function initTestimonialsSlider() {
  const isMobile = () => window.innerWidth <= 1100;
  const container = document.querySelector('.testimonial-cards');
  if (!container) return;
  const cards = Array.from(document.querySelectorAll('.testimonial-card'));
  let active = 0;
  let autoSlideInterval = null;
  let pagination = null;

  function updateVisibility() {
    if (!isMobile()) {
      // Reset all for desktop
      cards.forEach(card => {
        card.style.display = '';
      });
      removeNavButtons();
      removePagination();
      stopAutoSlide();
      return;
    }
    cards.forEach((card, i) => {
      card.style.display = i === active ? 'flex' : 'none';
    });
    addNavButtons();
    addPagination();
    updatePagination();
    startAutoSlide();
  }

  function nextCard() {
    active = (active + 1) % cards.length;
    updateVisibility();
  }

  function prevCard() {
    active = (active - 1 + cards.length) % cards.length;
    updateVisibility();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextCard, 2000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Navigation buttons
  function addNavButtons() {
    removeNavButtons();
    if (!isMobile()) return;
    const testimonialsSection = document.querySelector('.testimonials');
    if (!testimonialsSection) return;
    const card = cards[active];
    if (!card) return;
    
    // Position buttons to just touch the card edges
    const leftBtn = document.createElement('button');
    leftBtn.className = 'testimonial-nav-left';
    leftBtn.innerHTML = '&#8592;';
    leftBtn.style.position = 'absolute';
    leftBtn.style.left = '-1px';
    leftBtn.style.top = '50%';
    leftBtn.style.transform = 'translateY(-50%)';
    leftBtn.style.zIndex = '10';
    leftBtn.style.background = '#fff';
    leftBtn.style.border = '1px solid #ececec';
    leftBtn.style.borderRadius = '50%';
    leftBtn.style.width = '28px';
    leftBtn.style.height = '28px';
    leftBtn.style.fontSize = '14px';
    leftBtn.style.cursor = 'pointer';
    leftBtn.style.boxShadow = '0 2px 8px rgba(44,44,44,0.10)';
    leftBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      prevCard();
      startAutoSlide();
    });
    const rightBtn = document.createElement('button');
    rightBtn.className = 'testimonial-nav-right';
    rightBtn.innerHTML = '&#8594;';
    rightBtn.style.position = 'absolute';
    rightBtn.style.right = '-1px';
    rightBtn.style.top = '50%';
    rightBtn.style.transform = 'translateY(-50%)';
    rightBtn.style.zIndex = '10';
    rightBtn.style.background = '#fff';
    rightBtn.style.border = '1px solid #ececec';
    rightBtn.style.borderRadius = '50%';
    rightBtn.style.width = '28px';
    rightBtn.style.height = '28px';
    rightBtn.style.fontSize = '14px';
    rightBtn.style.cursor = 'pointer';
    rightBtn.style.boxShadow = '0 2px 8px rgba(44,44,44,0.10)';
    rightBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      nextCard();
      startAutoSlide();
    });
    
    // Position buttons relative to the card container
    const cardContainer = document.querySelector('.testimonial-cards');
    cardContainer.style.position = 'relative';
    cardContainer.appendChild(leftBtn);
    cardContainer.appendChild(rightBtn);
  }

  function removeNavButtons() {
    const leftBtn = document.querySelector('.testimonial-nav-left');
    const rightBtn = document.querySelector('.testimonial-nav-right');
    if (leftBtn) leftBtn.remove();
    if (rightBtn) rightBtn.remove();
  }

  // Pagination dots
  function addPagination() {
    removePagination();
    if (!isMobile()) return;
    const wrapper = document.querySelector('.testimonial-swiper-wrapper');
    if (!wrapper) return;
    pagination = document.createElement('div');
    pagination.className = 'testimonial-pagination';
    pagination.style.display = 'flex';
    pagination.style.justifyContent = 'center';
    pagination.style.gap = '8px';
    pagination.style.marginTop = '20px';
    pagination.style.marginBottom = '8px';
    pagination.style.width = '100%';
    for (let i = 0; i < cards.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'testimonial-dot';
      dot.style.display = 'inline-block';
      dot.style.width = '10px';
      dot.style.height = '10px';
      dot.style.borderRadius = '50%';
      dot.style.background = i === active ? '#7c7edc' : '#ececec';
      dot.style.transition = 'background 0.2s';
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', function() {
        active = i;
        updateVisibility();
        startAutoSlide();
      });
      pagination.appendChild(dot);
    }
    wrapper.appendChild(pagination);
  }

  function updatePagination() {
    if (!pagination) return;
    const dots = pagination.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, i) => {
      dot.style.background = i === active ? '#7c7edc' : '#ececec';
    });
  }

  function removePagination() {
    if (pagination && pagination.parentNode) {
      pagination.parentNode.removeChild(pagination);
    }
    pagination = null;
  }

  // Touch swipe for mobile
  let startX = null;
  container.addEventListener('touchstart', function(e) {
    if (!isMobile()) return;
    startX = e.touches[0].clientX;
    stopAutoSlide();
  });
  container.addEventListener('touchend', function(e) {
    if (!isMobile() || startX === null) return;
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 40) {
      prevCard();
    } else if (startX - endX > 40) {
      nextCard();
    }
    startX = null;
    startAutoSlide();
  });

  window.addEventListener('resize', updateVisibility);
  updateVisibility();
}
