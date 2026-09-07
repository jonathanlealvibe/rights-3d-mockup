/* Rights v2 — lógica del sitio (tienda, urgencia honesta, formularios)
   ===== Constantes para el equipo ===== */
var WHATSAPP_NUMBER = '593900000000';   // número de pedidos, formato internacional sin +
var WHATSAPP_B2B = '593900000000';      // número HORECA
var PAYMENT_LINK = '#';                 // checkout con tarjeta (Stripe / PayPhone / Kushki)
var FORM_ENDPOINT = '';                 // POST de formularios (webhook GHL)
var CUTOFF_HOUR = 14;                   // hora límite de despacho mismo día (Guayaquil, UTC-5)
var FREE_SHIPPING = 25;                 // USD
var LOTE = { num: 9, name: 'Oscuro 70 %', total: 300, left: 140, next: 'octubre' };
var SEASON_DEADLINE = '2026-11-30';     // reserva regalos corporativos

var PRODUCTS = {
  '70':   { name: 'Oscuro 70 %',  price: 6.50,  meta: 'Barra 80 g · Arriba Nacional' },
  '55':   { name: 'Leche 55 %',   price: 6.50,  meta: 'Barra 80 g · Leche entera' },
  '85':   { name: 'Intenso 85 %', price: 7.00,  meta: 'Barra 80 g · Intenso' },
  'box':  { name: 'Caja Descubrimiento', price: 17.50, meta: '3 barras · caja de regalo' },
  'club': { name: 'Club Rights',  price: 5.85,  meta: 'Suscripción mensual · barra del lote nuevo' }
};

(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };

  /* ---------- WhatsApp links ---------- */
  var waBase = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=';
  ['wa-link', 'wa-foot'].forEach(function (id) { var a = $('#' + id); if (a) a.href = waBase + encodeURIComponent('Hola Rights, quiero hacer un pedido.'); });
  var b2b = $('#wa-b2b'); if (b2b) b2b.href = 'https://wa.me/' + WHATSAPP_B2B + '?text=' + encodeURIComponent('Hola Rights, quiero información para mi negocio (HORECA).');

  /* ---------- Hora de corte (Guayaquil, UTC-5): urgencia real ---------- */
  function cutoffText() {
    var now = new Date(); var utc = now.getTime() + now.getTimezoneOffset() * 60000; var gye = new Date(utc - 5 * 3600000);
    var cut = new Date(gye); cut.setHours(CUTOFF_HOUR, 0, 0, 0);
    var diff = cut - gye, day = gye.getDay();
    if (day === 0 || day === 6) return 'Pedidos del fin de semana salen el lunes';
    if (diff <= 0) return 'Pide ahora y sale mañana a primera hora';
    var h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
    return 'Pide en ' + (h ? h + ' h ' : '') + m + ' min y sale hoy en Guayaquil';
  }
  function tickCutoff() { var el = $('#promo-cutoff'); if (el) el.textContent = cutoffText(); var c = $('#cart-cutoff'); if (c) c.textContent = cutoffText(); }
  tickCutoff(); setInterval(tickCutoff, 30000);

  /* ---------- Lote ---------- */
  var lp = $('#promo-lote'); if (lp) lp.textContent = 'Lote ' + (LOTE.num < 10 ? '0' : '') + LOTE.num + ' · quedan ' + LOTE.left + ' barras';
  var lb = $('#lote-bar'); if (lb) { $('#lote-left').textContent = LOTE.left; $('#lote-total').textContent = LOTE.total; setTimeout(function () { lb.style.width = (LOTE.left / LOTE.total * 100) + '%'; }, 600); }

  /* ---------- Cuenta regresiva estacional ---------- */
  var dl = $('#days-left'); if (dl) { var days = Math.max(0, Math.ceil((new Date(SEASON_DEADLINE + 'T23:59:59-05:00') - new Date()) / 86400000)); dl.textContent = days; }

  /* ---------- Carrito ---------- */
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('rights-cart') || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem('rights-cart', JSON.stringify(cart)); } catch (e) {} }
  function count() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k] * PRODUCTS[k].price; }, 0); }
  var drawer = $('#drawer');
  function render() {
    var c = $('#cart-count'); if (c) c.textContent = count();
    if (!drawer) return;
    var items = $('#cart-items'); items.innerHTML = '';
    var keys = Object.keys(cart);
    if (!keys.length) items.innerHTML = '<p class="drawer__empty">Tu carrito está vacío. Empieza por el lote en curso.</p>';
    keys.forEach(function (k) {
      var p = PRODUCTS[k], q = cart[k];
      var el = document.createElement('div'); el.className = 'citem';
      el.innerHTML = '<div><div class="citem__name">' + p.name + '</div><div class="citem__meta">' + p.meta + '</div></div>' +
        '<div class="citem__price">' + money(p.price * q) + '</div>' +
        '<div class="citem__qty"><button type="button" data-dec="' + k + '" aria-label="Menos">−</button><span>' + q + '</span><button type="button" data-inc="' + k + '" aria-label="Más">+</button></div>' +
        '<div class="citem__meta">' + money(p.price) + ' c/u</div>';
      items.appendChild(el);
    });
    var t = total(); $('#cart-total').textContent = money(t);
    var missing = Math.max(0, FREE_SHIPPING - t);
    $('#ship-msg').textContent = missing > 0 ? 'Te faltan ' + money(missing) + ' para envío gratis' : 'Envío gratis desbloqueado ✓';
    $('#ship-bar').style.width = Math.min(100, t / FREE_SHIPPING * 100) + '%';
    var msg = 'Hola Rights, quiero pedir:\n' + keys.map(function (k) { return '• ' + cart[k] + ' × ' + PRODUCTS[k].name + ' (' + money(PRODUCTS[k].price * cart[k]) + ')'; }).join('\n') + '\nSubtotal: ' + money(t);
    $('#checkout-wa').href = waBase + encodeURIComponent(msg);
    $('#checkout-card').href = PAYMENT_LINK;
  }
  function add(k) { if (!PRODUCTS[k]) return; cart[k] = (cart[k] || 0) + 1; save(); render(); toast(PRODUCTS[k].name + ' agregado'); openDrawer(); }
  function openDrawer() { if (!drawer) return; drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeDrawer() { if (!drawer) return; drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add]'); if (t) { add(t.getAttribute('data-add')); return; }
    var inc = e.target.closest('[data-inc]'); if (inc) { var k = inc.getAttribute('data-inc'); cart[k]++; save(); render(); return; }
    var dec = e.target.closest('[data-dec]'); if (dec) { var k2 = dec.getAttribute('data-dec'); cart[k2]--; if (cart[k2] <= 0) delete cart[k2]; save(); render(); return; }
  });
  var cb = $('#cart-btn'); if (cb) cb.addEventListener('click', openDrawer);
  var dc = $('#drawer-close'); if (dc) dc.addEventListener('click', closeDrawer);
  var dbg = $('#drawer-bg'); if (dbg) dbg.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  render();

  /* ---------- Toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2200); }

  /* ---------- Videos perezosos ---------- */
  var lazy = $$('video.lazy-video');
  if (lazy.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); } var p = v.play(); if (p && p.catch) p.catch(function () {}); } else if (!v.paused) v.pause(); }); }, { rootMargin: '300px 0px' });
    lazy.forEach(function (v) { io.observe(v); });
  }
  $$('video[autoplay]').forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });

  /* ---------- Reveal ---------- */
  $$('.section__head, .product, .pillar, .chapter, .proof__grid, .review, .horeca__grid, .season__inner, .club__inner, .steps__grid li, .form__grid, .faq details').forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { rio.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- Formularios ---------- */
  function wire(formId, msgId, okText) {
    var f = $('#' + formId), m = $('#' + msgId); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (f.email || f.querySelector('input[type=email]')).value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { m.textContent = 'Revisa el correo e inténtalo de nuevo.'; return; }
      var data = {}; $$('input,select,textarea', f).forEach(function (i) { if (i.name) data[i.name] = i.value; }); data.source = formId;
      if (FORM_ENDPOINT) fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(function () { m.textContent = okText; f.reset(); }).catch(function () { m.textContent = 'No pudimos enviar. Escríbenos por WhatsApp.'; });
      else { m.textContent = okText; f.reset(); }
    });
  }
  wire('news-form', 'news-msg', 'Listo. Te avisamos cuando salga el próximo lote.');
  wire('b2b-form', 'b2b-msg', 'Recibido. Te escribimos en menos de 24 h con el kit de muestras.');

  /* ---------- Rita ---------- */
  var rb = $('#rita-btn'), rp = $('#rita-panel');
  if (rb) rb.addEventListener('click', function () { var open = rp.hidden; rp.hidden = !open; rb.setAttribute('aria-expanded', String(open)); });

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
