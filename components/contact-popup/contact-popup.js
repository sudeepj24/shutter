// Contact Popup Component JS
(function() {
  let popupShown = false;
  let popupClosed = localStorage.getItem('contactPopupClosed') === 'true';
  let popupOverlay, popupModal, closeBtn, firstFocusable, lastFocusable;

  function showPopup() {
    if (popupShown || popupClosed) return;
    popupOverlay = document.getElementById('contact-popup-overlay');
    if (!popupOverlay) return;
    popupOverlay.style.display = 'flex';
    document.body.classList.add('contact-popup-open');
    popupModal = popupOverlay.querySelector('.contact-popup-modal');
    closeBtn = popupOverlay.querySelector('.contact-popup-close');
    // Focus trap
    const focusable = popupModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    firstFocusable = focusable[0];
    lastFocusable = focusable[focusable.length - 1];
    setTimeout(() => { firstFocusable && firstFocusable.focus(); }, 100);
    document.addEventListener('keydown', handleKeydown);
  }

  function hidePopup() {
    if (!popupOverlay) return;
    popupOverlay.style.display = 'none';
    document.body.classList.remove('contact-popup-open');
    popupShown = true;
    localStorage.setItem('contactPopupClosed', 'true');
    document.removeEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      hidePopup();
    } else if (e.key === 'Tab' && popupModal) {
      // Focus trap
      const focusable = popupModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  function onScroll() {
    if (popupShown || popupClosed) return;
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const winHeight = window.innerHeight;
    if (scrollY + winHeight >= docHeight / 2) {
      showPopup();
      window.removeEventListener('scroll', onScroll);
    }
  }

  function initPopupEvents() {
    popupOverlay = document.getElementById('contact-popup-overlay');
    if (!popupOverlay) return;
    closeBtn = popupOverlay.querySelector('.contact-popup-close');
    if (closeBtn) closeBtn.addEventListener('click', hidePopup);
    popupOverlay.addEventListener('mousedown', function(e) {
      if (e.target === popupOverlay) hidePopup();
    });
  }

  // Contact form logic (copied/adapted from get-in-touch)
  function initContactPopupForm() {
    const form = document.getElementById('contactPopupForm');
    const statusContainer = document.getElementById('contactPopupStatus');
    const statusTitle = statusContainer?.querySelector('.status-title');
    const statusMessage = statusContainer?.querySelector('.status-message');
    const statusProgressBar = statusContainer?.querySelector('.status-progress-bar');
    let contactStatus = null;
    let contactStatusMsg = '';
    let contactShowStatus = false;
    let contactProgress = 100;
    let contactTimerRef = null;
    function contactStatusUpdate() {
      let start = Date.now();
      const duration = 10000;
      function update() {
        const elapsed = Date.now() - start;
        contactProgress = Math.max(0, 100 - (elapsed / duration) * 100);
        if (statusProgressBar) {
          statusProgressBar.style.width = contactProgress + '%';
        }
        if (elapsed < duration) {
          contactTimerRef = window.setTimeout(update, 50);
        } else {
          contactShowStatus = false;
          if (statusContainer) {
            statusContainer.style.display = 'none';
          }
        }
      }
      update();
    }
    function showStatus(status, message) {
      contactStatus = status;
      contactStatusMsg = message;
      contactShowStatus = true;
      if (statusContainer && statusTitle && statusMessage) {
        statusContainer.style.display = 'block';
        statusContainer.className = `contact-status ${status === 'success' ? 'success' : 'error'}`;
        statusTitle.textContent = status === 'success' ? 'Success' : 'Error';
        statusMessage.textContent = message;
      }
      contactStatusUpdate();
    }
    function handleContactFormSubmit(e) {
      e.preventDefault();
      contactStatus = null;
      contactShowStatus = false;
      if (statusContainer) {
        statusContainer.style.display = 'none';
      }
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        interest: formData.get('interest'),
        address: formData.get('address')
      };
      if (!data.phone && !data.email) {
        showStatus('error', 'Please provide at least a phone number or an email address.');
        return;
      }
      if (!data.name || !data.interest) {
        showStatus('error', 'Please fill in all required fields.');
        return;
      }
      fetch('https://formsubmit.co/ajax/pradeepjoshi425@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          ...data,
          _subject: 'New Secure House Contact Popup Submission',
        })
      })
      .then(res => res.json())
      .then(result => {
        if (result.success === 'true' || result.success === true) {
          // Redirect to thank you page on success
          window.location.href = 'https://secure-house.co.uk/thank-you/';
          // form.reset(); // No need to reset since redirecting
        } else {
          showStatus('error', result.message || 'Failed to send message. Please try again.');
        }
      })
      .catch(err => {
        showStatus('error', err?.message || 'Failed to send message. Please try again.');
      });
    }
    if (form) {
      form.addEventListener('submit', handleContactFormSubmit);
    }
  }

  // Initialize
  window.addEventListener('DOMContentLoaded', function() {
    initPopupEvents();
    initContactPopupForm();
    if (!popupClosed) {
      window.addEventListener('scroll', onScroll);
    }
  });
  // Expose for dynamic loading
  window.initPopupEvents = initPopupEvents;
  window.initContactPopupForm = initContactPopupForm;
  window.onScroll = onScroll;
})(); 