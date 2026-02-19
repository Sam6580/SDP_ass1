// Set current year in footer
document.addEventListener('DOMContentLoaded', function(){
  var y = new Date().getFullYear();
  var el = document.getElementById('year');
  if(el) el.textContent = y;

  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      function isValidEmail(e){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
      }

      if(!name || !email || !message){
        alert('Please fill in all required fields.');
        return;
      }
      if(!isValidEmail(email)){
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate successful submit
      alert('Thank you, ' + name + '. Your message has been received.');
      form.reset();
    });
  }
});
