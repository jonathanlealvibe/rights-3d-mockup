/* Rights v3 — shell compartido: idioma, carrito, WhatsApp, videos, reveal, formularios, concierge.
   ===== Constantes para el equipo ===== */
var WHATSAPP_NUMBER = '593995178745';   // pedidos: +593 99 517 8745 (real, ficha Google y sitio actual)
var WHATSAPP_B2B = '593995178745';      // empresas / HORECA: mismo número hasta que Rights asigne uno
var PAYMENT_LINK = '#';                 // checkout PayPhone / Kushki / PayPal
var FORM_ENDPOINT = '';                 // webhook CONCIERGE (GHL)
var WIDGET_SCRIPT = '';                 // concierge IA
var CUTOFF_HOUR = 14;                   // corte despacho mismo día, Quito (UTC-5)
var FREE_SHIPPING = 30;                 // USD
var LOTE = { num: 0, name: '', total: 1, left: 1, roast: '', next: '' };
var SEASON_DEADLINE = '2026-11-30';

/* Catálogo REAL — precios de rightschocolate.com (sep-2026) */
var PRODUCTS = {
  'aji':      { name: 'Ají 70 %', en: 'Chili 70 %', price: 3.62, meta: 'Barra 50 g · ají ecuatoriano', metaEn: '50 g bar · Ecuadorian chili' },
  'limon':    { name: 'Limón 70 %', en: 'Lime 70 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar' },
  'panela':   { name: 'Panela 70 %', en: 'Panela 70 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar' },
  'coco':     { name: 'Azúcar de Coco 80 %', en: 'Coconut Sugar 80 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar' },
  'sinazucar':{ name: 'Sin Azúcar 60 %', en: 'Sugar-free 60 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar' },
  'pasion':   { name: 'Pasión de la Selva 70 %', en: 'Pasión de la Selva 70 %', price: 3.82, meta: 'Barra 50 g · maracuyá', metaEn: '50 g bar · passion fruit' },
  'mar':      { name: 'Mar Exótico 70 %', en: 'Mar Exótico 70 %', price: 3.82, meta: 'Barra 50 g · mango + sal marina', metaEn: '50 g bar · mango + sea salt' },
  'milagro':  { name: 'Milagro Tropical 70 %', en: 'Milagro Tropical 70 %', price: 3.82, meta: 'Barra 50 g · guanábana + amaranto · Barra de oro 2024', metaEn: '50 g bar · soursop + amaranth · Gold bar 2024' },
  'crunch':   { name: 'Cacao Crunch 70 %', en: 'Cacao Crunch 70 %', price: 3.82, meta: 'Barra 50 g · nibs + sal marina', metaEn: '50 g bar · nibs + sea salt' },
  'mucilago': { name: '100 % con Mucílago', en: '100 % with Mucilage', price: 3.82, meta: 'Barra 50 g · solo cacao', metaEn: '50 g bar · only cacao' },
  'andina':   { name: 'Proteína Andina 55 %', en: 'Andean Protein 55 %', price: 3.82, meta: 'Barra 50 g · chocho + coco', metaEn: '50 g bar · lupin + coconut' },
  'gotas80':  { name: 'Cobertura en gotas 80 %', en: 'Couverture drops 80 %', price: 6.20, meta: '200 g', metaEn: '200 g' },
  'gotas100': { name: 'Cobertura en gotas 100 %', en: 'Couverture drops 100 %', price: 6.20, meta: '200 g', metaEn: '200 g' },
  'gotas60sa':{ name: 'Cobertura en gotas 60 % sin azúcar', en: 'Couverture drops 60 % sugar-free', price: 6.50, meta: '200 g · maltitol + stevia', metaEn: '200 g · maltitol + stevia' },
  'almcacao': { name: 'Almendra de cacao recubierta', en: 'Chocolate-coated cacao almonds', price: 6.49, meta: 'Snack de cacao', metaEn: 'Cacao snack' },
  'almcafe':  { name: 'Almendra de café recubierta', en: 'Chocolate-coated coffee almonds', price: 6.49, meta: 'Snack de cacao', metaEn: 'Cacao snack' },
  'nibs':     { name: 'Nibs de cacao cubiertos', en: 'Chocolate-coated cacao nibs', price: 6.49, meta: 'Snack de cacao', metaEn: 'Cacao snack' },
  'mini12':   { name: 'Pack 12 minibarras 10 g', en: '12 mini bars 10 g', price: 9.84, meta: '6 sabores', metaEn: '6 flavours' },
  'kitvino':  { name: 'Kit de maridaje con vino', en: 'Wine pairing kit', price: 49.00, meta: 'Regalo', metaEn: 'Gift' },
  'kitcafe':  { name: 'Kit de maridaje con café', en: 'Coffee pairing kit', price: 49.00, meta: 'Regalo', metaEn: 'Gift' },
  'caja10':   { name: 'Colección completa · 10 barras', en: 'Full collection · 10 bars', price: 37.40, meta: 'Los diez sabores', metaEn: 'All ten flavours' },
  'caja5':    { name: 'Caja 5 barras a elección', en: 'Box of 5 bars, your choice', price: 18.50, meta: 'Con tarjeta', metaEn: 'With card' }
};

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };

  /* ---------- Idioma: cada elemento con data-en guarda su ES original ---------- */
  var lang = 'es';
  function applyLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    document.documentElement.lang = lang;
    $$('[data-en]').forEach(function (el) {
      if (!el.dataset.es) el.dataset.es = el.getAttribute('placeholder') != null && el.tagName === 'INPUT' ? el.placeholder : el.innerHTML;
      var v = lang === 'en' ? el.dataset.en : el.dataset.es;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = v; else el.innerHTML = v;
    });
    $$('.lang [data-lang]').forEach(function (s) { s.classList.toggle('is-on', s.dataset.lang === lang); });
    var t = document.querySelector('title'); if (t && t.dataset.en) { if (!t.dataset.es) t.dataset.es = t.textContent; t.textContent = lang === 'en' ? t.dataset.en : t.dataset.es; }
    $$('a[href]').forEach(function (a) {
      var h = a.getAttribute('href'); if (!h || /^(https?:|mailto:|tel:|#)/.test(h) || h.indexOf('.html') < 0) return;
      var u = h.split('?')[0], hash = h.indexOf('#') >= 0 ? h.slice(h.indexOf('#')) : ''; u = u.split('#')[0];
      a.setAttribute('href', u + (lang === 'en' ? '?lang=en' : '') + hash);
    });
    try { localStorage.setItem('rights-lang', lang); } catch (e) {}
    var url = new URL(window.location.href); if (lang === 'en') url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang'); history.replaceState(null, '', url.toString());
    render();
  }
  var q = new URLSearchParams(window.location.search).get('lang'); var stored = null; try { stored = localStorage.getItem('rights-lang'); } catch (e) {}
  var toggle = $('#lang-toggle'); if (toggle) toggle.addEventListener('click', function () { applyLang(lang === 'es' ? 'en' : 'es'); });

  /* ---------- WhatsApp ---------- */
  function wa(num, msg) { return 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg); }
  $$('[data-wa]').forEach(function (a) {
    var kind = a.dataset.wa;
    var msgs = {
      pedido: 'Hola Rights 👋 Quiero hacer un pedido. ¿Me ayudan?',
      regalo: 'Hola Rights 👋 Quiero regalar chocolate. ¿Me ayudan a elegir?',
      empresa: 'Hola Rights 👋 Escribo de parte de una empresa. Quiero información de regalos corporativos / HORECA.',
      cata: 'Hola Rights 👋 ¿Me recomiendan una barra? Me gusta el chocolate…',
      chef: 'Hola Rights 👋 Soy chef / pastelero. Quiero la ficha técnica y una muestra de sus coberturas.',
      maquila: 'Hola Rights 👋 Quiero información del Creation Lab (marca blanca / maquila).'
    };
    a.href = wa((kind === 'empresa' || kind === 'chef' || kind === 'maquila') ? WHATSAPP_B2B : WHATSAPP_NUMBER, msgs[kind] || msgs.pedido);
  });

  /* ---------- Hora de corte real (Guayaquil) ---------- */
  function cutoffText() {
    var now = new Date(); var gye = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 5 * 3600000);
    var cut = new Date(gye); cut.setHours(CUTOFF_HOUR, 0, 0, 0); var diff = cut - gye, day = gye.getDay();
    if (day === 0 || day === 6) return lang === 'en' ? 'Weekend orders ship Monday' : 'Pedidos del fin de semana salen el lunes';
    if (diff <= 0) return lang === 'en' ? 'Order now, ships tomorrow first thing' : 'Pide ahora y sale mañana a primera hora';
    var h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
    return lang === 'en' ? 'Order in ' + (h ? h + ' h ' : '') + m + ' min and it ships today in Quito' : 'Pide en ' + (h ? h + ' h ' : '') + m + ' min y sale hoy en Quito';
  }
  function tick() { $$('[data-cutoff]').forEach(function (el) { el.textContent = cutoffText(); }); }
  setInterval(tick, 30000);

  /* ---------- Lote + temporada ---------- */
  $$('[data-lote-left]').forEach(function (el) { el.textContent = LOTE.left; });
  $$('[data-lote-total]').forEach(function (el) { el.textContent = LOTE.total; });
  $$('[data-lote-bar]').forEach(function (el) { setTimeout(function () { el.style.width = (LOTE.left / LOTE.total * 100) + '%'; }, 500); });
  var days = Math.max(0, Math.ceil((new Date(SEASON_DEADLINE + 'T23:59:59-05:00') - new Date()) / 86400000));
  $$('[data-days-left]').forEach(function (el) { el.textContent = days; });

  /* ---------- Carrito ---------- */
  var cart = {}; try { cart = JSON.parse(localStorage.getItem('rights-cart-v3') || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem('rights-cart-v3', JSON.stringify(cart)); } catch (e) {} }
  function count() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k].q; }, 0); }
  function total() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k].q * PRODUCTS[k].price; }, 0); }
  var drawer = $('#drawer');
  function render() {
    $$('[data-cart-count]').forEach(function (c) { c.textContent = count(); c.classList.toggle('is-zero', count() === 0); });
    if (!drawer) return;
    var items = $('#cart-items'); items.innerHTML = ''; var keys = Object.keys(cart);
    if (!keys.length) items.innerHTML = '<p class="drawer__empty">' + (lang === 'en' ? 'Your cart is empty.' : 'Tu carrito está vacío.') + '</p>';
    keys.forEach(function (k) {
      var p = PRODUCTS[k], it = cart[k];
      var el = document.createElement('div'); el.className = 'citem';
      el.innerHTML = '<div><div class="citem__name">' + (lang === 'en' ? p.en : p.name) + '</div><div class="citem__meta">' + (lang === 'en' ? p.metaEn : p.meta) + (it.note ? '<br><em>“' + it.note + '”</em>' : '') + '</div></div>' +
        '<div class="citem__price">' + money(p.price * it.q) + '</div>' +
        '<div class="citem__qty"><button type="button" data-dec="' + k + '" aria-label="−">−</button><span>' + it.q + '</span><button type="button" data-inc="' + k + '" aria-label="+">+</button></div>' +
        '<div class="citem__meta">' + money(p.price) + ' c/u</div>';
      items.appendChild(el);
    });
    var t = total(), missing = Math.max(0, FREE_SHIPPING - t);
    $('#cart-total').textContent = money(t);
    $('#ship-msg').textContent = missing > 0 ? (lang === 'en' ? 'Add ' + money(missing) + ' for free shipping' : 'Te faltan ' + money(missing) + ' para envío gratis') : (lang === 'en' ? 'Free shipping unlocked ✓' : 'Envío gratis desbloqueado ✓');
    $('#ship-bar').style.width = Math.min(100, t / FREE_SHIPPING * 100) + '%';
    var lines = keys.map(function (k) { return '• ' + cart[k].q + ' × ' + PRODUCTS[k].name + (cart[k].note ? ' (tarjeta: “' + cart[k].note + '”)' : '') + ' — ' + money(PRODUCTS[k].price * cart[k].q); });
    $('#checkout-wa').href = wa(WHATSAPP_NUMBER, 'Hola Rights 👋 Quiero pedir:\n' + lines.join('\n') + '\nSubtotal: ' + money(t) + '\n¿Me confirman envío y pago?');
    $('#checkout-card').href = PAYMENT_LINK;
    tick();
  }
  function add(k, note) { if (!PRODUCTS[k]) return; if (!cart[k]) cart[k] = { q: 0 }; cart[k].q++; if (note) cart[k].note = note; save(); render(); toast((lang === 'en' ? PRODUCTS[k].en : PRODUCTS[k].name) + (lang === 'en' ? ' added' : ' agregado')); openDrawer(); }
  function openDrawer() { if (!drawer) return; drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeDrawer() { if (!drawer) return; drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add]'); if (t) { e.preventDefault(); var noteEl = t.dataset.note ? $(t.dataset.note) : null; add(t.dataset.add, noteEl ? noteEl.value.trim() : ''); return; }
    var inc = e.target.closest('[data-inc]'); if (inc) { cart[inc.dataset.inc].q++; save(); render(); return; }
    var dec = e.target.closest('[data-dec]'); if (dec) { var k = dec.dataset.dec; cart[k].q--; if (cart[k].q <= 0) delete cart[k]; save(); render(); return; }
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); openDrawer(); return; }
    if (e.target.closest('[data-cart-close]')) { closeDrawer(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200); }

  /* ---------- Videos ---------- */
  var lazy = $$('video.lazy-video');
  if (lazy.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); } var p = v.play(); if (p && p.catch) p.catch(function () {}); } else if (!v.paused) v.pause(); }); }, { rootMargin: '300px 0px' });
    lazy.forEach(function (v) { io.observe(v); });
  }
  $$('video[autoplay]').forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });

  /* ---------- Reveal ---------- */
  $$('[data-reveal], .product, .pillar, .chapter, .award, .review, .metric, .gift, .step, .faq details, .section__head').forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }); }, { threshold: 0.1 });
    $$('.reveal').forEach(function (el) { rio.observe(el); });
  } else $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });

  /* ---------- Contadores ---------- */
  $$('[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, suf = el.dataset.suffix || '';
    var run = function () { var t0 = performance.now(), d = 1400; (function f(now) { var p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = (target * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(f); })(t0); };
    if ('IntersectionObserver' in window) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { run(); o.disconnect(); } }, { threshold: 0.4 }); o.observe(el); } else run();
  });

  /* ---------- Formularios ---------- */
  $$('form[data-form]').forEach(function (f) {
    var m = f.querySelector('.form__msg');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = f.querySelector('input[type=email]'), email = emailEl ? emailEl.value.trim() : 'x@x.xx';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { m.textContent = lang === 'en' ? 'Check the email and try again.' : 'Revisa el correo e inténtalo de nuevo.'; return; }
      var data = { source: f.dataset.form, lang: lang }; $$('input,select,textarea', f).forEach(function (i) { if (i.name) data[i.name] = i.value; });
      var ok = lang === 'en' ? (f.dataset.okEn || 'Received. We reply within 24 h.') : (f.dataset.ok || 'Recibido. Respondemos en menos de 24 h.');
      if (FORM_ENDPOINT) fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(function () { m.textContent = ok; f.reset(); }).catch(function () { m.textContent = lang === 'en' ? 'Could not send. Write us on WhatsApp.' : 'No pudimos enviar. Escríbenos por WhatsApp.'; });
      else { m.textContent = ok; f.reset(); }
    });
  });

  /* ---------- Tarjeta de regalo: vista previa ---------- */
  var note = $('#gift-note'), prev = $('#gift-preview'), cnt = $('#gift-count');
  if (note && prev) { var upd = function () { prev.textContent = note.value.trim() || prev.dataset.empty; if (cnt) cnt.textContent = note.value.length + ' / ' + note.maxLength; }; note.addEventListener('input', upd); upd(); }

  /* ---------- Concierge ---------- */
  var rb = $('#rita-btn'), rp = $('#rita-panel');
  if (rb) rb.addEventListener('click', function () { var open = rp.hidden; rp.hidden = !open; rb.setAttribute('aria-expanded', String(open)); });
  if (WIDGET_SCRIPT) { var s = document.createElement('script'); s.src = WIDGET_SCRIPT; s.async = true; document.body.appendChild(s); }

  /* ---------- Nav móvil ---------- */
  var burger = $('#burger'), mnav = $('#mnav');
  if (burger) burger.addEventListener('click', function () { var open = mnav.hidden; mnav.hidden = !open; burger.setAttribute('aria-expanded', String(open)); });

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  applyLang(q === 'en' ? 'en' : (q === 'es' ? 'es' : (stored || 'es')));
})();
