/* Rights Chocolate — site logic
   ===== Team constants: paste real links here ===== */
var PAYMENT_LINK_70 = '#';   // Oscuro 70 %
var PAYMENT_LINK_55 = '#';   // Leche 55 %
var PAYMENT_LINK_85 = '#';   // Intenso 85 %
var FORM_ENDPOINT = '';      // wholesale form POST endpoint (Formspree, GHL webhook, etc.)
var WIDGET_SCRIPT = '';      // AI concierge embed script URL (goes into #concierge-widget)

(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 820px)').matches;

  /* ---------- i18n ---------- */
  var T = {
    es: {
      'nav.origin': 'Origen', 'nav.process': 'Proceso', 'nav.shop': 'Chocolates', 'nav.wholesale': 'Mayoristas', 'nav.buy': 'Comprar',
      'hero.eyebrow': 'Chocolate de origen único · Ecuador',
      'hero.slogan': 'Lo correcto sabe extraordinario.',
      'hero.echo': 'What’s done right, tastes extraordinary.',
      'hero.cta1': 'Comprar chocolate', 'hero.cta2': 'Conocer el origen', 'hero.cue': 'Desliza',
      'beat0.label': '01 — Origen', 'beat0.title': 'Nace en la sombra del árbol.',
      'beat0.text': 'Cacao Nacional fino de aroma, cultivado bajo bosque en Ecuador. Cada grano fermenta cinco días antes de tocar nuestras manos.',
      'beat1.label': '02 — Templado', 'beat1.title': 'Treinta y un grados. Ni uno más.',
      'beat1.text': 'Templar es ordenar los cristales del cacao hasta que brillen y chasqueen. Es paciencia convertida en textura.',
      'beat2.label': '03 — Manos', 'beat2.title': 'Hecho por maestros. Sin excepción.',
      'beat2.text': 'Cada barra pasa por manos que dominan su oficio. La inclusión aquí no es un gesto: es maestría.',
      'beat3.label': '04 — Made Right.', 'beat3.title': 'Lo correcto sabe extraordinario.',
      'beat3.text': 'Rómpela. Escucha el chasquido. Así suena hacer las cosas bien.',
      'origin.eyebrow': 'Origen', 'origin.title': 'Ecuador, donde el cacao nació con nombre.',
      'origin.lead': 'Trabajamos con cacao Nacional “Arriba”, la variedad fino de aroma que solo crece bien aquí. Lo compramos directo, lo fermentamos con calma y lo tostamos bajo.',
      'origin.f1': 'Variedad fino de aroma. Menos del 5 % del cacao del mundo.',
      'origin.f2u': 'días', 'origin.f2': 'De fermentación en cajas de madera antes del secado al sol.',
      'origin.f3u': 'origen', 'origin.f3': 'Un solo origen por barra. Nada de mezclas anónimas.',
      'origin.credit': 'Video: Kokopods / Bhat‘n’Bhat, CC BY 3.0',
      'process.eyebrow': 'Proceso',
      'process.b0': 'Tostado lento, a baja temperatura.', 'process.b1': 'Conchado durante setenta y dos horas.', 'process.b2': 'Templado a mano, sobre mármol.',
      'shop.eyebrow': 'Chocolates', 'shop.title': 'Tres barras. Un solo estándar.', 'shop.add': 'Agregar',
      'shop.p1.name': 'Oscuro', 'shop.p1.desc': 'Cacao Nacional y azúcar de caña. Nada más.',
      'shop.p2.name': 'Leche', 'shop.p2.desc': 'Leche entera ecuatoriana. Redondo, sin empalagar.',
      'shop.p3.name': 'Intenso', 'shop.p3.desc': 'Para quien ya sabe lo que busca.',
      'shop.note': 'Envío a todo Ecuador. Barras de 80 g.',
      'masters.eyebrow': 'Taller', 'masters.title': 'Hecho por maestros. Sin excepción.',
      'masters.lead': 'Nuestro taller está en manos de maestros chocolateros con discapacidad. No lo contamos por caridad. Lo contamos porque su trabajo es el estándar de esta casa.',
      'masters.cta': 'Conoce el taller', 'masters.credit': 'Video: Kokopods / Bhat‘n’Bhat, CC BY 3.0',
      'ws.eyebrow': 'Mayoristas y regalos corporativos', 'ws.title': 'Chocolate con tu nombre, hecho bien.',
      'ws.lead': 'Hoteles, cafés, empresas. Cuéntanos de tu negocio y te enviamos el catálogo y precios en menos de 24 horas.',
      'ws.label': 'Correo', 'ws.cta': 'Quiero el catálogo',
      'ws.ok': 'Listo. Te escribimos en menos de 24 horas.', 'ws.err': 'Revisa el correo e inténtalo de nuevo.',
      'footer.tag': 'Chocolate de origen único · Guayaquil, Ecuador', 'footer.credits': 'Créditos de video', 'footer.mock': 'Mockup — no es una tienda activa.',
      'rita.label': 'Habla con Rita',
      'rita.text': 'Soy la concierge de Rights. Pronto podré ayudarte a elegir tu barra, resolver envíos y armar pedidos corporativos.'
    },
    en: {
      'nav.origin': 'Origin', 'nav.process': 'Process', 'nav.shop': 'Chocolates', 'nav.wholesale': 'Wholesale', 'nav.buy': 'Shop',
      'hero.eyebrow': 'Single-origin chocolate · Ecuador',
      'hero.slogan': 'What’s done right, tastes extraordinary.',
      'hero.echo': 'Lo correcto sabe extraordinario.',
      'hero.cta1': 'Shop chocolate', 'hero.cta2': 'Discover the origin', 'hero.cue': 'Scroll',
      'beat0.label': '01 — Origin', 'beat0.title': 'Born in the shade of the tree.',
      'beat0.text': 'Fine-aroma Nacional cacao, grown under forest canopy in Ecuador. Every bean ferments five days before it reaches our hands.',
      'beat1.label': '02 — Tempering', 'beat1.title': 'Thirty-one degrees. Not one more.',
      'beat1.text': 'Tempering is ordering the cacao crystals until they shine and snap. It is patience turned into texture.',
      'beat2.label': '03 — Hands', 'beat2.title': 'Made by masters. No exceptions.',
      'beat2.text': 'Every bar passes through hands that own their craft. Inclusion here is not a gesture: it is mastery.',
      'beat3.label': '04 — Made Right.', 'beat3.title': 'What’s done right, tastes extraordinary.',
      'beat3.text': 'Break it. Listen to the snap. That is what doing things right sounds like.',
      'origin.eyebrow': 'Origin', 'origin.title': 'Ecuador, where cacao was born with a name.',
      'origin.lead': 'We work with Nacional “Arriba” cacao, the fine-aroma variety that only thrives here. We buy it direct, ferment it slowly and roast it low.',
      'origin.f1': 'Fine-aroma variety. Under 5 % of the world’s cacao.',
      'origin.f2u': 'days', 'origin.f2': 'Of fermentation in wooden boxes before sun drying.',
      'origin.f3u': 'origin', 'origin.f3': 'One origin per bar. No anonymous blends.',
      'origin.credit': 'Video: Kokopods / Bhat‘n’Bhat, CC BY 3.0',
      'process.eyebrow': 'Process',
      'process.b0': 'Slow roast, low temperature.', 'process.b1': 'Conched for seventy-two hours.', 'process.b2': 'Hand-tempered on marble.',
      'shop.eyebrow': 'Chocolates', 'shop.title': 'Three bars. One standard.', 'shop.add': 'Add',
      'shop.p1.name': 'Dark', 'shop.p1.desc': 'Nacional cacao and cane sugar. Nothing else.',
      'shop.p2.name': 'Milk', 'shop.p2.desc': 'Whole Ecuadorian milk. Round, never cloying.',
      'shop.p3.name': 'Intense', 'shop.p3.desc': 'For those who already know what they want.',
      'shop.note': 'Shipping across Ecuador. 80 g bars.',
      'masters.eyebrow': 'Workshop', 'masters.title': 'Made by masters. No exceptions.',
      'masters.lead': 'Our workshop is in the hands of master chocolatiers with disabilities. We don’t say it out of charity. We say it because their work is the standard of this house.',
      'masters.cta': 'Meet the workshop', 'masters.credit': 'Video: Kokopods / Bhat‘n’Bhat, CC BY 3.0',
      'ws.eyebrow': 'Wholesale & corporate gifts', 'ws.title': 'Chocolate with your name, done right.',
      'ws.lead': 'Hotels, cafés, companies. Tell us about your business and we’ll send the catalogue and pricing within 24 hours.',
      'ws.label': 'Email', 'ws.cta': 'Send me the catalogue',
      'ws.ok': 'Done. We’ll write within 24 hours.', 'ws.err': 'Check the email and try again.',
      'footer.tag': 'Single-origin chocolate · Guayaquil, Ecuador', 'footer.credits': 'Video credits', 'footer.mock': 'Mockup — not a live store.',
      'rita.label': 'Talk to Rita',
      'rita.text': 'I’m Rights’ concierge. Soon I’ll help you pick your bar, sort shipping and build corporate orders.'
    }
  };
  var lang = 'es';
  function applyLang(l) {
    lang = T[l] ? l : 'es';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (T[lang][k] != null) el.textContent = T[lang][k];
    });
    document.querySelectorAll('.lang [data-lang]').forEach(function (s) { s.classList.toggle('is-on', s.dataset.lang === lang); });
    document.title = lang === 'en'
      ? 'Rights Chocolate — Made Right. Single-origin chocolate, Ecuador'
      : 'Rights Chocolate — Made Right. Chocolate de origen único, Ecuador';
    var url = new URL(window.location.href);
    if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
    history.replaceState(null, '', url.toString());
  }
  var initial = new URLSearchParams(window.location.search).get('lang');
  if (initial === 'en') applyLang('en');
  var toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.addEventListener('click', function () { applyLang(lang === 'es' ? 'en' : 'es'); });

  /* ---------- video sources (desktop / mobile) ---------- */
  function pickSrc(v) {
    var src = (isMobile && v.dataset.srcMobile) ? v.dataset.srcMobile : v.dataset.srcDesktop;
    if (src && v.getAttribute('src') !== src) { v.src = src; v.load(); }
  }
  document.querySelectorAll('video[data-src-desktop]').forEach(function (v) {
    if (v.classList.contains('lazy-video')) return;
    pickSrc(v);
    if (v.autoplay) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
  });
  // lazy videos: load + play when near viewport
  var lazy = document.querySelectorAll('video.lazy-video');
  if (lazy.length) {
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { if (!v.getAttribute('src')) pickSrc(v); var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else if (!v.paused) v.pause();
      });
    }, { rootMargin: '300px 0px' });
    lazy.forEach(function (v) { lio.observe(v); });
  }

  /* ---------- nav state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- reveal on scroll ---------- */
  document.querySelectorAll('.origin__copy, .origin__media, .shop__head, .product, .masters__copy, .wholesale__inner').forEach(function (el) {
    el.classList.add('reveal');
  });
  var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }); }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el) { rio.observe(el); });

  /* ---------- GSAP ScrollTrigger: 3D story + scrub video ---------- */
  var beats = Array.prototype.slice.call(document.querySelectorAll('.beat'));
  var storyBar = document.getElementById('story-bar');
  var centers = [0.05, 0.36, 0.60, 0.88], half = 0.10, feather = 0.06;
  function beatOpacity(i, p) {
    var d = Math.abs(p - centers[i]);
    if (i === 0 && p < centers[0]) d = 0;
    if (i === centers.length - 1 && p > centers[i]) d = 0;
    return 1 - Math.min(1, Math.max(0, (d - half) / feather));
  }
  function renderBeats(p) {
    for (var i = 0; i < beats.length; i++) {
      var o = beatOpacity(i, p);
      beats[i].style.opacity = o;
      var isCenter = beats[i].classList.contains('beat--center');
      var base = isMobile ? '' : (isCenter ? 'translate(-50%,-50%) ' : 'translateY(-50%) ');
      beats[i].style.transform = base + 'translateY(' + ((1 - o) * 18) + 'px)';
    }
    if (storyBar) storyBar.style.width = (p * 100) + '%';
  }

  var scrub = document.getElementById('scrub-video');
  var pbeats = Array.prototype.slice.call(document.querySelectorAll('.process__beat'));
  var scrubTarget = 0, scrubCur = 0, scrubReady = false, scrubActive = false;
  if (scrub) {
    pickSrc(scrub);
    scrub.addEventListener('loadedmetadata', function () { scrubReady = true; });
    // iOS needs a play/pause to allow seeking
    scrub.addEventListener('canplay', function () { var pr = scrub.play(); if (pr && pr.then) pr.then(function () { scrub.pause(); }).catch(function () {}); }, { once: true });
  }
  function renderProcess(p) {
    var n = pbeats.length;
    for (var i = 0; i < n; i++) {
      var c = (i + 0.5) / n, d = Math.abs(p - c);
      if (i === 0 && p < c) d = 0; if (i === n - 1 && p > c) d = 0;
      var o = 1 - Math.min(1, Math.max(0, (d - 0.12) / 0.07));
      pbeats[i].style.opacity = o;
      pbeats[i].style.transform = 'translateY(' + ((1 - o) * 14) + 'px)';
    }
  }
  function scrubLoop() {
    if (!scrubActive) return;
    scrubCur += (scrubTarget - scrubCur) * 0.12;
    if (scrubReady && scrub.duration && Math.abs(scrub.currentTime - scrubCur * scrub.duration) > 0.02) {
      scrub.currentTime = scrubCur * (scrub.duration - 0.05);
    }
    requestAnimationFrame(scrubLoop);
  }

  if (window.gsap && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: function (self) {
        if (window.RightsScene) window.RightsScene.setProgress(self.progress);
        renderBeats(self.progress);
      },
      onToggle: function (self) { if (window.RightsScene) window.RightsScene.setActive(self.isActive); }
    });
    ScrollTrigger.create({
      trigger: '#story', start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { if (window.RightsScene) window.RightsScene.setActive(self.isActive); }
    });
    if (scrub) {
      ScrollTrigger.create({
        trigger: '#proceso', start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: function (self) { scrubTarget = self.progress; renderProcess(self.progress); },
        onToggle: function (self) { scrubActive = self.isActive; if (scrubActive) requestAnimationFrame(scrubLoop); }
      });
    }
    renderBeats(0); renderProcess(0);
  } else {
    // Reduced motion / no GSAP: static states
    renderBeats(0.6);
    beats.forEach(function (b, i) { b.style.opacity = i === 2 ? 1 : 0; });
    renderProcess(0.5);
    if (scrub) { scrub.setAttribute('autoplay', ''); scrub.setAttribute('loop', ''); var pr = scrub.play(); if (pr && pr.catch) pr.catch(function () {}); }
  }

  /* ---------- shop payment links ---------- */
  var links = { '70': PAYMENT_LINK_70, '55': PAYMENT_LINK_55, '85': PAYMENT_LINK_85 };
  document.querySelectorAll('[data-pay]').forEach(function (a) {
    var l = links[a.dataset.pay];
    if (l && l !== '#') { a.href = l; a.target = '_blank'; a.rel = 'noopener'; }
    else a.addEventListener('click', function (e) { e.preventDefault(); a.textContent = lang === 'en' ? 'Coming soon' : 'Muy pronto'; });
  });

  /* ---------- wholesale form ---------- */
  var form = document.getElementById('wholesale-form'), msg = document.getElementById('ws-msg');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = T[lang]['ws.err']; return; }
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, source: 'rights-wholesale', lang: lang }) })
        .then(function () { msg.textContent = T[lang]['ws.ok']; form.reset(); })
        .catch(function () { msg.textContent = T[lang]['ws.err']; });
    } else { msg.textContent = T[lang]['ws.ok']; form.reset(); }
  });

  /* ---------- Rita concierge ---------- */
  var rbtn = document.getElementById('rita-btn'), rpanel = document.getElementById('rita-panel');
  if (rbtn) rbtn.addEventListener('click', function () {
    var open = rpanel.hidden; rpanel.hidden = !open; rbtn.setAttribute('aria-expanded', String(open));
  });
  if (WIDGET_SCRIPT) { var s = document.createElement('script'); s.src = WIDGET_SCRIPT; s.async = true; document.body.appendChild(s); }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
