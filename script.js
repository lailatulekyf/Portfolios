/* Portfolio interactions: vanilla JS, no dependencies */
(function () {
  'use strict';
  document.documentElement.classList.add('js'); // CSS hides .reveal only when JS runs

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var toggle = document.querySelector('.nav__toggle');
  var navWrap = document.querySelector('.nav nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a'));

  // Mobile menu
  function setMenu(open) {
    navWrap.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navWrap.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  links.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  // Tap outside the menu to close it; reset when the viewport grows to the desktop layout
  document.addEventListener('click', function (e) {
    if (navWrap.classList.contains('open') && !e.target.closest('.nav')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1100 && navWrap.classList.contains('open')) setMenu(false);
  });

  if ('IntersectionObserver' in window) {
    // Active section highlighting
    var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + (entry.target.getAttribute('data-nav') || entry.target.id);
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
    document.querySelectorAll('[data-nav]').forEach(function (s) { spy.observe(s); });

    // Scroll reveal on selected blocks only
    var targets = document.querySelectorAll('.section__head, .project, .job, .skills > div, .about > *, .contact .container');
    targets.forEach(function (el) { el.classList.add('reveal'); });
    if (reduceMotion) {
      targets.forEach(function (el) { el.classList.add('in'); });
    } else {
      var reveal = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
      targets.forEach(function (el) { reveal.observe(el); });
    }
  }

  // Project filters: show cards whose data-cat includes the chosen key
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project'));
  var grid = document.getElementById('project-grid');
  var empty = document.getElementById('projects-empty');
  function inCat(card, key) { return key === 'all' || card.getAttribute('data-cat').split(' ').indexOf(key) > -1; }
  chips.forEach(function (chip) {
    var key = chip.getAttribute('data-filter');
    var count = chip.querySelector('.chip__n');
    if (count) count.textContent = cards.filter(function (c) { return inCat(c, key); }).length;
    chip.addEventListener('click', function () {
      var shown = 0;
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      cards.forEach(function (card) {
        var match = inCat(card, key);
        card.hidden = !match;
        if (match) { shown++; card.classList.add('in'); }
      });
      grid.classList.add('is-filtered');
      empty.hidden = shown > 0;
    });
  });

  // Links still holding a YOUR-... placeholder stay disabled until replaced with real URLs
  function guard(a) {
    if (a.getAttribute('href').indexOf('YOUR-') === -1) return;
    a.classList.add('is-pending');
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('title', 'Link coming soon');
    a.addEventListener('click', function (e) { e.preventDefault(); });
  }
  document.querySelectorAll('.project__links a').forEach(guard);

  // Popups use the native <dialog>: focus is trapped, Esc closes, focus returns to the opener
  var projectModal = document.getElementById('project-modal');
  var imgModal = document.getElementById('img-modal');
  function openDialog(dlg) {
    document.body.style.overflow = 'hidden';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  [projectModal, imgModal].forEach(function (dlg) {
    dlg.addEventListener('close', function () { document.body.style.overflow = ''; });
    dlg.addEventListener('click', function (e) {
      // Backdrop click (target is the dialog itself) or the close button
      if (e.target === dlg || e.target.closest('[data-close]')) {
        if (typeof dlg.close === 'function') dlg.close(); else { dlg.removeAttribute('open'); document.body.style.overflow = ''; }
      }
    });
  });

  // Project details popup, filled from the clicked card
  document.querySelectorAll('.project__open').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.project');
      var shot = card.querySelector('.project__img img');
      var pmImg = projectModal.querySelector('.pm__img img');
      pmImg.style.visibility = 'visible';
      pmImg.alt = shot.alt;
      pmImg.src = shot.getAttribute('src');
      projectModal.querySelector('.pm__file').textContent = shot.getAttribute('src').split('/').pop();
      projectModal.querySelector('.pm__cat').textContent = card.querySelector('.project__cat').textContent;
      projectModal.querySelector('.pm__title').textContent = btn.textContent;
      projectModal.querySelector('.pm__desc').textContent = card.querySelector('.project__body > p:not(.project__cat)').textContent;
      projectModal.querySelector('.pm__tags').innerHTML = card.querySelector('.tags').innerHTML;
      var box = projectModal.querySelector('.pm__links');
      box.innerHTML = '';
      card.querySelectorAll('.project__links a').forEach(function (a) {
        var copy = a.cloneNode(true);
        guard(copy);
        box.appendChild(copy);
      });
      projectModal.querySelector('.modal__scroll').scrollTop = 0;
      openDialog(projectModal);
    });
  });

  // Certificate popup: the image is requested only when a Certificate button is clicked
  var certImg = imgModal.querySelector('.im__img');
  var certEmpty = imgModal.querySelector('.im__empty');
  certImg.addEventListener('error', function () { certImg.hidden = true; certEmpty.hidden = false; });
  document.querySelectorAll('[data-cert]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-cert');
      imgModal.querySelector('.im__title').textContent = btn.getAttribute('data-title');
      imgModal.querySelector('.im__path').textContent = src;
      certEmpty.hidden = true;
      certImg.hidden = false;
      certImg.style.visibility = 'visible';
      certImg.alt = 'Certificate: ' + btn.getAttribute('data-title');
      certImg.src = src;
      openDialog(imgModal);
    });
  });

  // Back-to-top
  var topBtn = document.querySelector('.totop');
  function onScroll() { topBtn.hidden = window.scrollY < 500; }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hide broken images so placeholders show instead of broken icons
  document.querySelectorAll('img').forEach(function (img) {
    function hide() { img.style.visibility = 'hidden'; }
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener('error', hide);
  });
})();