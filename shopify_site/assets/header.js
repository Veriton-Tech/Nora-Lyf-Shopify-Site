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
      
      // Prepare FormData for AJAX cart (match product-form behaviour)
      // Using FormData (multipart/form-data) matches how Shopify's
      // cart endpoints are usually called from forms. Sending JSON can
      // cause the server to return a different response shape which
      // prevents our section HTML from being returned and results in
      // the "There was an error while updating your cart" message.
      // Keep sections defensive: prefer the cart component's getSectionsToRender
      // (it may provide either `section` or `id` fields), otherwise fall back
      // to a minimal `cart-icon-bubble` to avoid requesting non-existent
      // section templates (which triggers Hot Reload 404s).
      let sectionsToRequest = [];
      const cartComponent = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      if (cartComponent && typeof cartComponent.getSectionsToRender === 'function') {
        try {
          sectionsToRequest = cartComponent.getSectionsToRender().map((s) => s.section || s.id || s);
        } catch (e) {
          console.warn('Failed to compute sections from cart component', e);
        }
      }
      if (!sectionsToRequest || !sectionsToRequest.length) sectionsToRequest = ['cart-icon-bubble'];
      try { console.debug && console.debug('Add-to-cart requesting sections:', sectionsToRequest); } catch (e) {}
      formData.append('sections', sectionsToRequest);
      formData.append('sections_url', window.location.pathname);

      // Use shared helper from global.js to perform the AJAX add-to-cart.
      if (typeof window.addToCartAjax === 'function') {
        window.addToCartAjax(window.routes.cart_add_url, formData)
          .then((data) => {
            try { console.debug && console.debug('addToCartAjax resolved', data); } catch (e) {}
            button.querySelector('.getsupp-btn-text').textContent = 'Added!';
            button.style.background = 'linear-gradient(90deg, #28a745, #20c997)';

            // Open drawer only when a cart-notification component is not present.
            setTimeout(() => {
              const cartNotification = document.querySelector('cart-notification');
              const cartDrawer = document.querySelector('cart-drawer');
              if (!cartNotification && cartDrawer) cartDrawer.open();
            }, 50);

            setTimeout(() => {
              button.disabled = false;
              button.querySelector('.getsupp-btn-text').textContent = originalText;
              button.style.background = 'linear-gradient(90deg, #04683F, #035a3a)';
            }, 2000);
          })
          .catch((error) => {
            console.error('addToCartAjax failed', error);
            if (typeof window.showCartNotification === 'function') {
              window.showCartNotification(window.cartStrings.error);
            }
            button.querySelector('.getsupp-btn-text').textContent = 'Error';
            button.style.background = 'linear-gradient(90deg, #dc3545, #c82333)';
            setTimeout(() => {
              button.disabled = false;
              button.querySelector('.getsupp-btn-text').textContent = originalText;
              button.style.background = 'linear-gradient(90deg, #04683F, #035a3a)';
            }, 2000);
          });
      } else {
        console.error('addToCartAjax helper missing');
      }
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
    // defensive: if cartData is a string, try parsing
    if (typeof cartData === 'string') {
      try {
        cartData = JSON.parse(cartData);
      } catch (e) {
        console.warn('updateCartDisplay: could not parse cartData string', e);
      }
    }
    // Update cart icon bubble
    const cartIconBubble = document.getElementById('cart-icon-bubble');
    if (cartIconBubble) {
      if (cartData.sections && cartData.sections['cart-icon-bubble']) {
        try {
          var parsed = new DOMParser().parseFromString(cartData.sections['cart-icon-bubble'], 'text/html');
          var shopifySection = parsed.querySelector('.shopify-section');
          if (shopifySection) {
            cartIconBubble.innerHTML = shopifySection.innerHTML;
          } else {
            // fallback: replace entire HTML if shopify-section missing
            cartIconBubble.innerHTML = parsed.body.innerHTML || cartIconBubble.innerHTML;
          }
        } catch (e) {
          console.warn('Failed to parse cart-icon-bubble section HTML', e);
        }
      } else {
        // Fallback: delegate to shared helper which will create/update the
        // numeric badge reliably even if the anchor was replaced.
        const count = cartData.item_count || (cartData.cart && cartData.cart.item_count) || (cartData.items && cartData.items.length);
        if (typeof window.updateCartBadge === 'function') {
          try { window.updateCartBadge(count); } catch (e) { console.warn('updateCartBadge call failed', e); }
        } else {
          try {
            const countEl = document.getElementById('cart-count-bubble');
            if (typeof count !== 'undefined' && count !== null && countEl) {
              if (count > 0) {
                countEl.textContent = count;
                countEl.style.display = '';
              } else {
                countEl.style.display = 'none';
              }
            }
          } catch (e) {
            console.warn('Failed to update cart icon bubble count', e);
          }
        }
      }
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




