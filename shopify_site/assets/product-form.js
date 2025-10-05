if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            const startMarker = CartPerformance.createStartingMarker('add:wait-for-subscribers');
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              }).then(() => {
                CartPerformance.measureFromMarker('add:wait-for-subscribers', startMarker);
              });
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            const isProductPage = !!this.closest('.product-page');
            try {
              console.debug && console.debug('product-form:onSubmit success', {
                isProductPage,
                cartAssignedTag: this.cart && this.cart.tagName,
                hasCartDrawer: !!document.querySelector('cart-drawer'),
                hasCartNotification: !!document.querySelector('cart-notification'),
              });
            } catch (e) {}
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    CartPerformance.measure("add:paint-updated-sections", () => {
                      this.cart.renderContents(response);
                    });
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              // Check if this form should show notification instead of opening cart drawer
              const showNotification = this.dataset.showNotification === 'true';
              
              if (isProductPage) {
                // On full product pages, prefer opening the cart drawer so
                // customers remain in the product context and see cart details.
                const cartDrawer = document.querySelector('cart-drawer');
                if (cartDrawer && typeof cartDrawer.renderContents === 'function') {
                  try {
                    console.debug && console.debug('product-form: rendering cartDrawer and opening');
                    cartDrawer.renderContents(response);
                    if (typeof cartDrawer.open === 'function') cartDrawer.open();
                  } catch (e) {
                    console.warn('cartDrawer.renderContents/open failed', e);
                  }
                } else if (this.cart && typeof this.cart.renderContents === 'function') {
                  // Fallback to this.cart if it's already pointing to drawer-like component
                  try {
                    console.debug && console.debug('product-form: rendering this.cart as fallback');
                    this.cart.renderContents(response);
                    if (this.cart && typeof this.cart.open === 'function') this.cart.open();
                  } catch (e) { console.warn('this.cart.renderContents failed', e); }
                } else {
                  console.debug && console.debug('product-form: no drawer component found to render');
                }
                // Ensure badge updated immediately
                try {
                  const count = response.item_count || (response.cart && response.cart.item_count) || (response.items && response.items.length);
                  if (typeof window.updateCartBadge === 'function') window.updateCartBadge(count);
                } catch (e) {}
              } else if (showNotification) {
                // Update cart sections without opening the drawer
                CartPerformance.measure("add:paint-updated-sections", () => {
                  if (this.cart && this.cart.getSectionsToRender) {
                    this.cart.getSectionsToRender().forEach((section) => {
                      const sectionElement = section.selector
                        ? document.querySelector(section.selector)
                        : document.getElementById(section.id);

                      if (sectionElement && response.sections && response.sections[section.id]) {
                        sectionElement.innerHTML = this.cart.getSectionInnerHTML(response.sections[section.id], section.selector);
                      }
                    });
                  }
                });

                // Show notification if the function is available and drawer isn't present
                if (typeof window.showCartNotification === 'function' && response.product_title) {
                  if (!document.querySelector('cart-drawer')) {
                    window.showCartNotification(`${response.product_title} added to cart!`);
                  }
                }
                // Fallback: ensure the header cart count bubble updates even if section replacement didn't target it
                try {
                  const count = response.item_count || (response.cart && response.cart.item_count) || (response.items && response.items.length);
                  if (typeof window.updateCartBadge === 'function') {
                    window.updateCartBadge(count);
                  } else {
                    const cartCountBubble = document.getElementById('cart-count-bubble');
                    if (cartCountBubble && typeof count !== 'undefined' && count !== null) {
                      if (count > 0) {
                        cartCountBubble.textContent = count;
                        cartCountBubble.style.display = '';
                      } else {
                        cartCountBubble.style.display = 'none';
                      }
                    }
                  }
                } catch (e) {
                  // silent fallback; do not break the add-to-cart flow
                  console.warn('Could not update cart count bubble', e);
                }
              } else {
                // Standard behavior: render cart drawer/notification.
                // Re-check whether a cart-notification component exists at
                // runtime — `this.cart` may have been set to the drawer on
                // construction but a notification component might be present
                // (or added) and should take precedence.
                const runtimeNotification = document.querySelector('cart-notification');
                if (runtimeNotification && typeof runtimeNotification.renderContents === 'function') {
                  try {
                    runtimeNotification.renderContents(response);
                  } catch (e) {
                    console.warn('runtimeNotification.renderContents failed', e);
                  }
                } else {
                  CartPerformance.measure("add:paint-updated-sections", () => {
                    if (this.cart && typeof this.cart.renderContents === 'function') {
                      this.cart.renderContents(response);
                    }
                  });
                }
              }
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');

            CartPerformance.measureFromEvent("add:user-action", evt);
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}
