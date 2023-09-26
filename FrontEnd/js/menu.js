let menuBtn = document.querySelector('.menu');
let navLinks = document.querySelector('.nav-links');
let closeBtn = document.querySelector('.closeBtn');

menuBtn.addEventListener('click', () => {
  navLinks.style.right = '0';
  navLinks.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  navLinks.style.right = '-100%';
  navLinks.style.display = "flex";
});