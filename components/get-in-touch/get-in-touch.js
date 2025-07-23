// Get In Touch Component JS
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusContainer = document.getElementById('contactStatus');
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
    
    // Reset status
    contactStatus = null;
    contactShowStatus = false;
    if (statusContainer) {
      statusContainer.style.display = 'none';
    }
    
    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      interest: formData.get('interest'),
      address: formData.get('address')
    };
    
    // Validation - require at least phone or email
    if (!data.phone && !data.email) {
      showStatus('error', 'Please provide at least a phone number or an email address.');
      return;
    }
    
    // Validation - require name and interest
    if (!data.name || !data.interest) {
      showStatus('error', 'Please fill in all required fields.');
      return;
    }
    
    // Submit form
    fetch('https://formsubmit.co/ajax/pradeepjoshi425@gmail.com', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify({
        ...data,
        _subject: 'New Secure House Contact Form Submission',
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

// Add loading animation to buttons
$(document).on('click', 'button', function() {
  const $btn = $(this);
  $btn.css('transform', 'scale(0.95)');
  setTimeout(function() {
    $btn.css('transform', 'scale(1)');
  }, 150);
}); 