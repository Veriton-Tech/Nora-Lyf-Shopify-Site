class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
    // Also lock scrolling on the root element for browsers that scroll the
    // documentElement (html) instead of body. This ensures the page behind
    // the drawer cannot scroll on all platforms.
    try { document.documentElement.classList.add('overflow-hidden'); } catch (e) { /* noop */ }
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
    try { document.documentElement.classList.remove('overflow-hidden'); } catch (e) { /* noop */ }
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;

      // Defensive: parsedState.sections may be missing or not include the
      // requested section id (for example when the server returns a minimal
      // cart JSON). Avoid calling .innerHTML on null; log a useful warning
      // so developers can inspect the returned payload.
      const sectionHtml = parsedState?.sections && parsedState.sections[section.id];
      if (!sectionHtml) {
        console.warn('cart-drawer: missing section HTML for', section.id, 'skipping update');
        return;
      }

      const parsedInner = this.getSectionInnerHTML(sectionHtml, section.selector);
      if (parsedInner !== null) {
        sectionElement.innerHTML = parsedInner;
      } else {
        console.warn('cart-drawer: could not locate selector', section.selector, 'in returned section HTML for', section.id);
      }
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
    // Update header badge proactively when drawer contents are rendered.
    try {
      // Prefer explicit item_count if available
      const countFromState = parsedState?.item_count || (parsedState?.cart && parsedState.cart.item_count);
      if (typeof countFromState !== 'undefined' && countFromState !== null) {
        if (typeof window.updateCartBadge === 'function') {
          window.updateCartBadge(countFromState);
        } else {
          const el = document.getElementById('cart-count-bubble');
          if (el) {
            if (countFromState > 0) { el.textContent = countFromState; el.style.display = ''; } else { el.style.display = 'none'; }
          }
        }
        return;
      }

      // If the server returned a cart-icon-bubble section, try to extract the count from it
      const iconSectionHtml = parsedState?.sections && parsedState.sections['cart-icon-bubble'];
      if (iconSectionHtml) {
        const parsed = new DOMParser().parseFromString(iconSectionHtml, 'text/html');
        const badge = parsed.querySelector('#cart-count-bubble') || parsed.querySelector('.cart-count-bubble');
        if (badge) {
          const badgeCount = parseInt(badge.textContent.trim()) || 0;
          if (typeof window.updateCartBadge === 'function') window.updateCartBadge(badgeCount);
          else {
            const el = document.getElementById('cart-count-bubble');
            if (el) { if (badgeCount > 0) { el.textContent = badgeCount; el.style.display = ''; } else { el.style.display = 'none'; } }
          }
          return;
        }
      }

      // Last resort: fetch cart JSON and update the badge
      (async () => {
        try {
          const cartJsonUrl = (window.routes && window.routes.cart_url) ? `${window.routes.cart_url}.js` : '/cart.js';
          const resp = await fetch(cartJsonUrl, { headers: { Accept: 'application/json' } });
          if (resp.ok) {
            const cartJson = await resp.json();
            const count = cartJson.item_count || (cartJson.items && cartJson.items.length) || 0;
            if (typeof window.updateCartBadge === 'function') window.updateCartBadge(count);
            else {
              const el = document.getElementById('cart-count-bubble');
              if (el) { if (count > 0) { el.textContent = count; el.style.display = ''; } else { el.style.display = 'none'; } }
            }
          }
        } catch (e) {
          console.warn('cart-drawer: fallback cart JSON fetch failed', e);
        }
      })();
    } catch (e) {
      console.warn('cart-drawer: could not proactively update badge', e);
    }
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    try {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      // Try the requested selector first, then fall back to a shopify-section
      // wrapper, then the document body, and finally return null if nothing
      // useful was found.
      const node = parsed.querySelector(selector) || parsed.querySelector('.shopify-section') || parsed.body.firstElementChild;
      return node ? node.innerHTML : parsed.body.innerHTML || null;
    } catch (e) {
      console.warn('getSectionInnerHTML parse failed', e);
      return null;
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
