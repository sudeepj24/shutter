// Header Component JS
// No hamburger toggle needed for this design as per Figma screenshot.
// Smooth scrolling for anchor links remains.
$(document).ready(function() {
  $(document).on('click', 'a[href^="#"]', function(e) {
    const target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top }, 600);
    }
  });
}); 