document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.getsupp-product-banner-slider');
  if (!slider) return;

  const items = slider.querySelectorAll('.getsupp-product-banner-item');
  const dots = slider.querySelectorAll('.getsupp-product-banner-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    if (items[index]) items[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % items.length;
    showSlide(nextIndex);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 2000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });

  slider.addEventListener('mouseenter', stopSlider);
  slider.addEventListener('mouseleave', startSlider);

  if (items.length > 1) {
    startSlider();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const addToCartForms = document.querySelectorAll('.getsupp-add-to-cart-form');
  addToCartForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const button = form.querySelector('.getsupp-add-to-cart-btn');
      const originalText = button.querySelector('.getsupp-btn-text').textContent;
      button.disabled = true;
      button.querySelector('.getsupp-btn-text').textContent = 'Adding...';
      fetch('/cart/add.js', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(() => { window.location.href = '/cart'; })
        .catch(() => {
          button.querySelector('.getsupp-btn-text').textContent = 'Error';
          button.style.background = 'linear-gradient(90deg, #dc3545, #c82333)';
          setTimeout(() => {
            button.disabled = false;
            button.querySelector('.getsupp-btn-text').textContent = originalText;
            button.style.background = 'linear-gradient(90deg, #04683F, #035a3a)';
          }, 2000);
        });
    });
  });
});




