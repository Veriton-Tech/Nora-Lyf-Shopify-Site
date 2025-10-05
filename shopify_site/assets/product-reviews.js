document.addEventListener('DOMContentLoaded', () => {
  function getStorageKey(productId) {
    return `product_reviews_${productId}`;
  }

  function loadReviews(productId) {
    try {
      const raw = localStorage.getItem(getStorageKey(productId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveReviews(productId, reviews) {
    try {
      localStorage.setItem(getStorageKey(productId), JSON.stringify(reviews));
    } catch (e) {
      console.warn('Cannot save reviews', e);
    }
  }

  function renderReviewList(productId, container) {
    const reviews = loadReviews(productId);
    container.innerHTML = '';
    if (reviews.length === 0) {
      container.innerHTML = '<div class="pr-empty">No reviews yet — be the first to write one.</div>';
      return;
    }
    reviews.slice().reverse().forEach(r => {
      const el = document.createElement('div');
      el.className = 'pr-item';
      el.innerHTML = `
        <div class="pr-item-title">${escapeHtml(r.title || 'Review')}</div>
        <div class="pr-item-meta">${renderStars(r.rating)} • by ${escapeHtml(r.name)} • ${new Date(r.date).toLocaleDateString()}</div>
        <div class="pr-item-body">${escapeHtml(r.body)}</div>
      `;
      container.appendChild(el);
    });
  }

  function renderStars(count) {
    let out = '';
    for (let i = 1; i <= 5; i++) {
      out += i <= count ? '<span class="product-reviews__star product-reviews__star--filled">★</span>' : '<span class="product-reviews__star">☆</span>';
    }
    return out;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.querySelectorAll('[data-pr-toggle-form]').forEach(btn => {
    const container = btn.closest('.product-reviews');
    if (!container) return;
    const productId = container.dataset.productId;
    const form = container.querySelector('[data-pr-form]');
    const list = document.getElementById(`pr-list-${productId}`);

    btn.addEventListener('click', () => {
      if (!form) return;
      form.style.display = form.style.display === 'none' || form.style.display === '' ? 'block' : 'none';
    });

    const cancel = container.querySelector('[data-pr-cancel]');
    if (cancel) cancel.addEventListener('click', () => { form.style.display = 'none'; });

    if (form) {
      form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const name = form.querySelector('[name="pr-name"]').value.trim();
        const title = form.querySelector('[name="pr-title"]').value.trim();
        const body = form.querySelector('[name="pr-body"]').value.trim();
        const ratingInput = form.querySelector('input[name="pr-rating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value, 10) : 5;
        if (!name || !body) {
          alert('Please provide your name and review body.');
          return;
        }

        const review = { name, title, body, rating, date: new Date().toISOString() };
        const reviews = loadReviews(productId);
        reviews.push(review);
        saveReviews(productId, reviews);

        // update summary (naive average)
        const avgEl = container.querySelector('.product-reviews__score');
        const countEl = container.querySelector('.product-reviews__count');
        const scoreContainer = container.querySelector('.product-reviews__rating');
        const total = reviews.reduce((s, r) => s + r.rating, 0);
        const avg = total / reviews.length;
        if (avgEl) avgEl.textContent = avg.toFixed(1);
        if (countEl) countEl.textContent = `(${reviews.length} reviews)`;
        if (scoreContainer) scoreContainer.innerHTML = renderStars(Math.round(avg));

        renderReviewList(productId, list);
        form.reset();
        form.style.display = 'none';
      });
    }

    // initial render
    renderReviewList(container.dataset.productId, list);
  });
  
  // New behavior: star submission flow
  document.querySelectorAll('.product-reviews').forEach(container => {
    const productId = container.dataset.productId;
    const endpoint = container.dataset.reviewEndpoint;
    const scoreEl = container.querySelector('.product-reviews__score');
    const countEl = container.querySelector('.product-reviews__count');
    const ratingEl = container.querySelector('.product-reviews__rating');

    function updateSummary(avg, count) {
      if (scoreEl) scoreEl.textContent = (avg || 0).toFixed(1);
      if (countEl) countEl.textContent = `(${count || 0} reviews)`;
      if (ratingEl) ratingEl.innerHTML = renderStars(Math.round(avg || 0));
    }

    container.querySelectorAll('.pr-star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const value = parseInt(btn.dataset.prStarValue, 10) || 5;
        // optimistic UI: update local view
        const existingCount = parseInt((countEl && countEl.textContent.match(/(\d+)/) || [0,0])[1], 10) || 0;
        const existingAvg = parseFloat(scoreEl ? scoreEl.textContent : '0') || 0;
        const newCount = existingCount + 1;
        const newAvg = ((existingAvg * existingCount) + value) / newCount;
        updateSummary(newAvg, newCount);

        // send to endpoint if present
        if (endpoint) {
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, rating: value })
          })
            .then(r => r.json())
            .then(json => {
              if (json && (json.avg || json.count)) {
                updateSummary(json.avg, json.count);
              }
            })
            .catch(err => {
              console.warn('Rating submit failed; falling back to local save', err);
              // fallback: save locally
              const reviews = loadReviews(productId);
              reviews.push({ rating: value, date: new Date().toISOString() });
              saveReviews(productId, reviews);
            });
        } else {
          // local fallback
          const reviews = loadReviews(productId);
          reviews.push({ rating: value, date: new Date().toISOString() });
          saveReviews(productId, reviews);
        }
      });
    });
  });
});

// Expose for testing
if (typeof window !== 'undefined') window.__productReviews = { renderStars: function(n){ return n; } };
