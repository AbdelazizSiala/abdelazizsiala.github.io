/* ==========================================================================
   Client-review lightbox
   ==========================================================================
   Clicking a review image opens this popup: it scales up out of the clicked
   image (FLIP animation), blurs the page behind it, and shows the review
   screenshot + a video/screenshot carousel + "View Original Review".

   It is used by the mentorship page (testimonial marquee) and by every
   project page that has a client review, so it lives in its own file
   instead of being duplicated per page.

   Usage:
     window.ReviewLightbox.open(item, sourceEl)   // item = a REVIEWS entry

   Any element carrying data-review-slug="<slug>" opens the matching review
   automatically — that is how the "Client Review" block on a project page is
   wired up. The element keeps its own href, so if the data is missing (or JS
   is off) the click simply follows the link to the real review instead.
   ========================================================================== */
(function (global) {
  'use strict';

  var root = null, panel = null, body = null, cta = null;
  var sourceEl = null; // thumbnail the popup grows out of / shrinks back into

  function ensureDom() {
    if (root) return;

    root = document.createElement('div');
    root.className = 'rv-lightbox';
    root.hidden = true;

    var backdrop = document.createElement('div');
    backdrop.className = 'rv-lightbox-backdrop';

    panel = document.createElement('figure');
    panel.className = 'rv-lightbox-panel';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'rv-lightbox-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function () { close(); });

    body = document.createElement('div');
    body.className = 'rv-lightbox-scroll';

    cta = document.createElement('a');
    cta.className = 'btn rv-lightbox-cta';
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';

    panel.appendChild(closeBtn);
    panel.appendChild(body);
    panel.appendChild(cta);
    root.appendChild(backdrop);
    root.appendChild(panel);
    document.body.appendChild(root);

    backdrop.addEventListener('pointerdown', function (e) {
      if (e.target === backdrop) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !root.hidden) close();
    });
  }

  // Normalize a review's media into a list of {type, src}.
  // `media` is an explicit array; `video`/`showcase` still work as shortcuts.
  function mediaList(item) {
    var list = (item.media || []).slice();
    if (item.video) list.unshift({ type: 'video', src: item.video });
    if (item.showcase) list.push({ type: 'image', src: item.showcase });
    return list;
  }

  // Fade carousel that mixes videos and images.
  function buildCarousel(entries) {
    var gallery = document.createElement('div');
    gallery.className = 'rv-gallery';
    var slidesWrap = document.createElement('div');
    slidesWrap.className = 'rv-gallery-slides';

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'rv-gallery-btn rv-gallery-prev';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>';

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'rv-gallery-btn rv-gallery-next';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'rv-gallery-dots';
    dotsWrap.setAttribute('role', 'tablist');

    var slides = [], dots = [], idx = 0;

    function show(i) {
      idx = (i + slides.length) % slides.length;
      for (var s = 0; s < slides.length; s++) {
        var active = s === idx;
        slides[s].classList.toggle('is-active', active);
        dots[s].classList.toggle('is-active', active);
        dots[s].setAttribute('aria-selected', active ? 'true' : 'false');
        // don't let hidden slides keep playing audio
        var v = slides[s].querySelector('video');
        if (v && !active) v.pause();
      }
    }

    entries.forEach(function (entry, i) {
      var slide = document.createElement('div');
      slide.className = 'rv-gallery-slide';
      if (entry.type === 'video') {
        var vid = document.createElement('video');
        vid.className = 'rv-lightbox-video';
        vid.src = entry.src;
        vid.controls = true;
        vid.playsInline = true;
        vid.preload = 'metadata';
        slide.appendChild(vid);
      } else {
        var img = document.createElement('img');
        img.className = 'rv-lightbox-media';
        img.src = entry.src;
        img.alt = '';
        img.draggable = false;
        slide.appendChild(img);
      }

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'rv-gallery-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Media ' + (i + 1));
      dot.addEventListener('click', function () { show(i); });

      slidesWrap.appendChild(slide);
      dotsWrap.appendChild(dot);
      slides.push(slide);
      dots.push(dot);
    });

    prevBtn.addEventListener('click', function () { show(idx - 1); });
    nextBtn.addEventListener('click', function () { show(idx + 1); });

    gallery.appendChild(slidesWrap);
    gallery.appendChild(prevBtn);
    gallery.appendChild(nextBtn);
    gallery.appendChild(dotsWrap);
    show(0);
    return gallery;
  }

  function fill(item) {
    body.innerHTML = '';

    // Left column: title (centered) + review screenshot + "View Original Review"
    var left = document.createElement('div');
    left.className = 'rv-lightbox-left';
    if (item.title) {
      var h = document.createElement('h3');
      h.className = 'rv-lightbox-title';
      h.textContent = item.title;
      left.appendChild(h);
    }
    if (item.detail) {
      var img = document.createElement('img');
      img.className = 'rv-lightbox-media';
      img.src = item.detail;
      img.alt = '';
      img.draggable = false;
      left.appendChild(img);
    }
    var hasLink = item.link && item.link !== '#';
    cta.classList.toggle('is-hidden', !hasLink);
    if (hasLink) {
      cta.href = item.link;
      cta.textContent = 'View Original Review';
    }
    left.appendChild(cta);
    body.appendChild(left);

    // Right column: project proof carousel — mixes videos and images.
    var entries = mediaList(item);
    if (entries.length > 1) {
      body.appendChild(buildCarousel(entries));
    } else if (entries.length === 1) {
      // single item — no carousel chrome
      var entry = entries[0];
      if (entry.type === 'video') {
        var vid = document.createElement('video');
        vid.className = 'rv-lightbox-video';
        vid.src = entry.src;
        vid.controls = true;
        vid.playsInline = true;
        vid.preload = 'metadata';
        body.appendChild(vid);
      } else {
        var shot = document.createElement('img');
        shot.className = 'rv-lightbox-media';
        shot.src = entry.src;
        shot.alt = '';
        shot.draggable = false;
        body.appendChild(shot);
      }
    }
  }

  function open(item, srcEl) {
    if (!item) return;
    ensureDom();
    fill(item);
    sourceEl = srcEl || null;

    root.hidden = false;

    // FLIP: measure the popup at its final size, then start it transformed
    // to match the clicked thumbnail and let the transition settle it back.
    panel.style.transform = 'none';
    var pr = panel.getBoundingClientRect();
    var from = sourceEl ? sourceEl.getBoundingClientRect() : null;
    if (from && pr.width > 0) {
      var sx = from.width / pr.width;
      var sy = from.height / pr.height;
      var dx = (from.left + from.width / 2) - (pr.left + pr.width / 2);
      var dy = (from.top + from.height / 2) - (pr.top + pr.height / 2);
      panel.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    } else {
      panel.style.transform = 'scale(.85)';
    }
    void panel.offsetWidth; // flush styles so the transition actually runs

    requestAnimationFrame(function () {
      root.classList.add('is-open');     // fades/blurs the backdrop in
      panel.style.transform = '';        // springs to final position
    });
  }

  function close() {
    if (!root || root.hidden) return;

    var vid = body.querySelector('video');
    if (vid) vid.pause();

    root.classList.remove('is-open');

    // Shrink back toward wherever the thumbnail is now (the marquee kept scrolling)
    var to = sourceEl && document.body.contains(sourceEl) ? sourceEl.getBoundingClientRect() : null;
    if (to) {
      var pr = panel.getBoundingClientRect();
      var sx = Math.max(to.width / pr.width, 0.02);
      var sy = Math.max(to.height / pr.height, 0.02);
      var dx = (to.left + to.width / 2) - (pr.left + pr.width / 2);
      var dy = (to.top + to.height / 2) - (pr.top + pr.height / 2);
      panel.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    } else {
      panel.style.transform = 'scale(.85)';
    }

    var finished = false;
    function done() {
      if (finished) return;
      finished = true;
      root.hidden = true;
      panel.style.transform = '';
      body.innerHTML = '';
      sourceEl = null;
    }
    var timer = setTimeout(done, 480); // fallback if transitionend never fires
    panel.addEventListener('transitionend', function handler(e) {
      if (e.target !== panel) return;
      clearTimeout(timer);
      panel.removeEventListener('transitionend', handler);
      done();
    });
  }

  /* ---- Auto-wiring ------------------------------------------------------- */
  /* Any element tagged with data-review-slug opens the matching review. */
  function initTriggers() {
    var nodes = document.querySelectorAll('[data-review-slug]');
    Array.prototype.forEach.call(nodes, function (el) {
      el.addEventListener('click', function (e) {
        var slug = el.getAttribute('data-review-slug');
        var item = global.REVIEW_BY_SLUG && global.REVIEW_BY_SLUG[slug];
        if (!item) return; // no data for this slug — let the browser follow the link
        e.preventDefault();
        open(item, el.querySelector('img') || el);
      });
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(initTriggers);

  global.ReviewLightbox = { open: open, close: close };
})(window);
