/* Extracted from sections/header.liquid to reduce section size */
(function() {
  try {
    var nav = document.querySelector('.getsupp-navigation');
    function updateNavBottom() {
      var rect = nav ? nav.getBoundingClientRect() : null;
      var bottom = rect ? Math.max(0, Math.floor(rect.bottom)) : 100;
      document.documentElement.style.setProperty('--getsupp-nav-bottom', bottom + 'px');
    }
    updateNavBottom();
    window.addEventListener('resize', updateNavBottom);
    window.addEventListener('scroll', updateNavBottom, { passive: true });

    var mobileBtn = document.querySelector('.getsupp-mobile-menu');
    var navRoot = document.querySelector('.getsupp-navigation');
    if (mobileBtn && navRoot) {
      function toggleNav() {
        navRoot.classList.toggle('is-open');
        document.body.style.overflow = navRoot.classList.contains('is-open') ? 'hidden' : '';
      }
      mobileBtn.addEventListener('click', toggleNav);
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navRoot.classList.contains('is-open')) toggleNav();
      });
      document.addEventListener('click', function(e) {
        if (!navRoot.classList.contains('is-open')) return;
        var drawer = navRoot.querySelector('.getsupp-nav-container');
        if (drawer && !drawer.contains(e.target) && !mobileBtn.contains(e.target)) toggleNav();
      });
    }

    var accountDropdown = document.querySelector('.getsupp-account-dropdown');
    var accountTrigger = document.querySelector('.getsupp-account-trigger');
    if (accountDropdown && accountTrigger) {
      function toggleAccountDropdown() {
        accountDropdown.classList.toggle('is-open');
        var isOpen = accountDropdown.classList.contains('is-open');
        accountTrigger.setAttribute('aria-expanded', isOpen);
      }
      function closeAccountDropdown() {
        accountDropdown.classList.remove('is-open');
        accountTrigger.setAttribute('aria-expanded', 'false');
      }
      accountTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleAccountDropdown();
      });
      document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target)) closeAccountDropdown();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && accountDropdown.classList.contains('is-open')) closeAccountDropdown();
      });
    }

    function initBannerSlider() {
      const slider = document.querySelector('.banner-slider');
      if (!slider) return;
      const slidesWrap = slider.querySelector('.slides');
      const slides = slider.querySelectorAll('.slide');
      const prevBtn = slider.querySelector('.prev');
      const nextBtn = slider.querySelector('.next');
      if (!slidesWrap || slides.length === 0) return;
      let current = 0;
      let autoId = null;
      const AUTO_MS = 4000;
      function update() { slidesWrap.style.transform = 'translateX(-' + (current * 100) + '%)'; }
      function prev() { current = (current - 1 + slides.length) % slides.length; update(); }
      function next() { current = (current + 1) % slides.length; update(); }
      function startAuto() { stopAuto(); autoId = setInterval(() => { next(); }, AUTO_MS); }
      function stopAuto() { if (autoId) clearInterval(autoId); }
      if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
      slider.addEventListener('mouseenter', stopAuto);
      slider.addEventListener('mouseleave', startAuto);
      update();
      startAuto();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBannerSlider);
    } else {
      initBannerSlider();
    }

  } catch (e) {
    console.error('Header script error:', e);
  }
})();


