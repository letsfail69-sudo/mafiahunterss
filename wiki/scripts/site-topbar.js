(function () {
  'use strict';

  function createTopbar() {
    if (document.querySelector('.mh-site-topbar')) return;

    var header = document.createElement('header');
    header.className = 'mh-site-topbar';
    header.innerHTML = [
      '<div class="mh-site-nav">',
        '<a class="mh-site-brand" href="https://mafiahunterss.eu/" aria-label="Mafia Hunterss – domů">',
          '<span class="mh-site-brand-badge" aria-hidden="true">MH</span>',
          '<span>Mafia Hunterss<small>herní město od roku 2015</small></span>',
        '</a>',
        '<button class="mh-site-toggle" type="button" aria-label="Otevřít navigaci" aria-expanded="false">☰</button>',
        '<nav class="mh-site-menu" aria-label="Hlavní navigace">',
          '<a href="https://mafiahunterss.eu/">Domů</a>',
          '<a href="https://mafiahunterss.eu/about.html">O hře</a>',
          '<a href="https://mafiahunterss.eu/download.html">Android</a>',
          '<a href="https://mafiahunterss.eu/iphone.html">iPhone</a>',
          '<a href="https://mafiahunterss.eu/news.html">Novinky</a>',
          '<a href="https://mafiahunterss.eu/game-news.html">Novinky ve hře</a>',
          '<a href="https://mafiahunterss.eu/gallery.html">Galerie</a>',
          '<a href="https://mafiahunterss.eu/wiki/" class="mh-active" aria-current="page">Wiki</a>',
          '<a href="https://mafiahunterss.eu/faq.html">FAQ</a>',
          '<a href="https://mafiahunterss.eu/contact.html">Kontakt</a>',
          '<a href="https://mafiahunterss.com/" target="_blank" rel="noopener" class="mh-play">🎮 Hrát</a>',
        '</nav>',
      '</div>'
    ].join('');

    document.body.insertBefore(header, document.body.firstChild);

    var toggle = header.querySelector('.mh-site-toggle');
    var menu = header.querySelector('.mh-site-menu');

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('mh-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '✕' : '☰';
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a') && window.innerWidth <= 1100) {
        header.classList.remove('mh-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) {
        header.classList.remove('mh-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTopbar);
  } else {
    createTopbar();
  }
})();
