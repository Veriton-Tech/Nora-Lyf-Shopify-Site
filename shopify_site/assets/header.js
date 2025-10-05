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
      
      // Disable button and show loading state
      button.disabled = true;
      button.querySelector('.getsupp-btn-text').textContent = 'Adding...';
      
      // Prepare fetch config for AJAX cart
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          id: formData.get('id'),
          quantity: formData.get('quantity') || 1,
          sections: getCartSections(),
          sections_url: window.location.pathname
        })
      };

      fetch(`${window.routes.cart_add_url}`, config)
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            throw new Error(data.description || 'Failed to add to cart');
          }
          
          // Show success state
          button.querySelector('.getsupp-btn-text').textContent = 'Added!';
          button.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
          
          // Update cart drawer/notification
          updateCartDisplay(data);
          
          // Open cart drawer if available
          const cartDrawer = document.querySelector('cart-drawer');
          if (cartDrawer) {
            cartDrawer.open();
          }
          
          // Reset button after 2 seconds
          setTimeout(() => {
            button.disabled = false;
            button.querySelector('.getsupp-btn-text').textContent = originalText;
            button.style.background = 'linear-gradient(90deg, #04683F, #035a3a)';
          }, 2000);
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
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

  // Helper function to get cart sections for updating
  function getCartSections() {
    const cartDrawer = document.querySelector('cart-drawer');
    if (cartDrawer) {
      return ['cart-drawer', 'cart-icon-bubble'];
    }
    return ['cart-icon-bubble'];
  }

  // Helper function to update cart display
  function updateCartDisplay(cartData) {
    // Update cart icon bubble
    const cartIconBubble = document.getElementById('cart-icon-bubble');
    if (cartIconBubble && cartData.sections && cartData.sections['cart-icon-bubble']) {
      cartIconBubble.innerHTML = new DOMParser()
        .parseFromString(cartData.sections['cart-icon-bubble'], 'text/html')
        .querySelector('.shopify-section').innerHTML;
    }

    // Update cart drawer if available
    const cartDrawer = document.querySelector('cart-drawer');
    if (cartDrawer && cartData.sections && cartData.sections['cart-drawer']) {
      const cartDrawerContent = cartDrawer.querySelector('#CartDrawer');
      if (cartDrawerContent) {
        cartDrawerContent.innerHTML = new DOMParser()
          .parseFromString(cartData.sections['cart-drawer'], 'text/html')
          .querySelector('#CartDrawer').innerHTML;
      }
    }

    // Publish cart update event for other components
    if (typeof publish !== 'undefined' && typeof PUB_SUB_EVENTS !== 'undefined') {
      publish(PUB_SUB_EVENTS.cartUpdate, {
        source: 'header-add-to-cart',
        cartData: cartData
      });
    }
  }
});




