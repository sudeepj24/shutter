// Get In Touch Component JS
$(document).ready(function() {
  // Form submission
  $(document).on('submit', '.contact-form form', function(e) {
    e.preventDefault();
    alert('Thank you for your inquiry! We will contact you soon.');
  });

  // Add loading animation to buttons
  $(document).on('click', 'button', function() {
    const $btn = $(this);
    $btn.css('transform', 'scale(0.95)');
    setTimeout(function() {
      $btn.css('transform', 'scale(1)');
    }, 150);
  });
}); 