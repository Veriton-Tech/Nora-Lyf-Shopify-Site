(function () {
  function toggle(detailsEl) {
    if (!detailsEl) return;
    detailsEl.open = !detailsEl.open;
  }

  document.addEventListener('click', function (e) {
    // Custom header button (left of search): .getsupp-mobile-menu
    var customBtn = e.target.closest('button.getsupp-mobile-menu');
    if (customBtn) {
      var isMobileView = window.matchMedia('(max-width: 749px)').matches;
      var menuUrl = '/pages/menu';
      e.preventDefault();
      if (isMobileView) {
        window.location.assign(menuUrl);
      } else {
        // Desktop fallback: if Dawn drawer exists, toggle it; otherwise also navigate
        var summaryAlt = document.querySelector('header-drawer summary.header__icon--menu');
        if (summaryAlt) {
          var detailsAlt = summaryAlt.closest('details');
          if (detailsAlt) {
            detailsAlt.open = !detailsAlt.open;
            return;
          }
        }
        window.location.assign(menuUrl);
      }
      return;
    }

    var summary = e.target.closest('header-drawer summary');
    if (summary && summary.classList.contains('header__icon--menu')) {
      var isMobile = window.matchMedia('(max-width: 749px)').matches;
      if (isMobile) {
        e.preventDefault();
        var menuPage = '/pages/menu';
        try {
          window.location.assign(menuPage);
        } catch (err) {
          // fallback: toggle details
          var details = summary.closest('details');
          if (details) toggle(details);
        }
        return;
      }
      // desktop: keep default drawer behavior
      var details = summary.closest('details');
      if (!details) return;
      e.preventDefault();
      toggle(details);
      return;
    }

    var closeBtn = e.target.closest('.menu-drawer__close-button, .menu-drawer__inner-container [data-close-menu]');
    if (closeBtn) {
      var container = closeBtn.closest('details');
      if (container) container.open = false;
      return;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openDetails = document.querySelector('header-drawer details[open]');
      if (openDetails) openDetails.open = false;
    }
  });
})();


// Brands A–Z search: filter links and support Enter-to-go
(function () {
  function filterBrandList(inputEl) {
    if (!inputEl) return;
    var menu = inputEl.closest('.getsupp-brands-menu');
    if (!menu) return;
    var query = inputEl.value.trim().toLowerCase();
    var items = menu.querySelectorAll('.getsupp-mega-links li');
    items.forEach(function (li) {
      var text = (li.textContent || '').toLowerCase();
      var match = !query || text.indexOf(query) !== -1;
      li.style.display = match ? '' : 'none';
    });
  }

  // Delegate input filtering
  document.addEventListener('input', function (e) {
    var input = e.target.closest('.getsupp-brands-input');
    if (!input) return;
    filterBrandList(input);
  });

  // On focus, reset filter so user sees all brands
  document.addEventListener('focusin', function (e) {
    var input = e.target.closest('.getsupp-brands-input');
    if (!input) return;
    if (!input.dataset._brandsInitialized) {
      input.dataset._brandsInitialized = 'true';
      filterBrandList(input);
    }
  });

  // Enter key navigates to first visible match
  document.addEventListener('keydown', function (e) {
    var input = e.target.closest('.getsupp-brands-input');
    if (!input || e.key !== 'Enter') return;
    var menu = input.closest('.getsupp-brands-menu');
    if (!menu) return;
    var visible = Array.from(menu.querySelectorAll('.getsupp-mega-links li a'))
      .filter(function (a) { return a.offsetParent !== null; });
    if (visible.length > 0) {
      e.preventDefault();
      window.location.assign(visible[0].getAttribute('href'));
    }
  });
})();

