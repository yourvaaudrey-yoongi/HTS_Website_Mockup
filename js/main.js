// Hospitality Textile Supply — navigation and inquiry forms
(function () {
  var SALES_EMAIL = 'sales@hospitalitytextilesupply.com';

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Products dropdown (click/tap; hover also works on desktop via CSS)
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var btn = item.querySelector('button.nav-link');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close the mobile menu after following an in-page link
  if (nav) {
    nav.querySelectorAll('a[href*="#"]').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // "Enquire About This Item" — prefill the form and jump to it
  document.querySelectorAll('[data-enquire]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var form = document.getElementById('inquiry-form');
      if (!form) return;
      e.preventDefault();
      var product = btn.getAttribute('data-enquire');
      var input = form.querySelector('[name="product"]');
      if (input) {
        if (input.tagName === 'SELECT') {
          var match = Array.prototype.find.call(input.options, function (o) { return o.value === product; });
          if (!match) {
            match = new Option(product, product);
            input.add(match, 1);
          }
          input.value = product;
        } else {
          input.value = product;
        }
      }
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var first = form.querySelector('input[name="name"]');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 400);
    });
  });

  // Inquiry forms — compose an email to HTS sales.
  // (Static site: swap this for a form service or server endpoint when hosting.)
  document.querySelectorAll('form.js-inquiry').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var lines = [];
      [['name', 'Name'], ['company', 'Company'], ['email', 'Email'], ['product', 'Product of interest'], ['quantity', 'Quantity']]
        .forEach(function (pair) {
          var v = (data.get(pair[0]) || '').toString().trim();
          if (v) lines.push(pair[1] + ': ' + v);
        });
      var msg = (data.get('message') || '').toString().trim();
      if (msg) lines.push('', msg);
      var product = (data.get('product') || '').toString().trim();
      var subject = 'Website inquiry' + (product ? ' – ' + product : '');
      window.location.href = 'mailto:' + SALES_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      var status = form.querySelector('.form-status');
      if (status) {
        status.hidden = false;
        status.textContent = 'Your email app should open with your inquiry ready to send. If it doesn’t, email us at ' +
          SALES_EMAIL + ' or call 866-568-0746.';
      }
    });
  });

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
