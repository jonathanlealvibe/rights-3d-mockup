/* Rights v4 — js/shop.js — motor de la tienda (carrito · checkout · confirmación).
   Se carga SOLO en carrito.html, checkout.html y pedido-confirmado.html, y SIEMPRE
   antes de js/app.js (ver build.py). No toca app.js ni pdp.js.

   CONTRATO DE DATOS (no romper):
   - Carrito: localStorage 'rights-cart-v3' = {"<id>":{"q":2,"note":"texto opcional"}}
   - Ids y precios: los mismos de la tabla PRODUCTS de app.js y de CONTENT.md §2.
   - Pedido cerrado: localStorage 'rights-order-last' (lo lee pedido-confirmado.html).

   POR QUÉ shop.js SE ADUEÑA DEL CARRITO EN ESTAS TRES PÁGINAS:
   app.js mantiene su propia copia del carrito en memoria y la vuelca entera a
   localStorage cuando el usuario toca el cajón lateral. Si las dos copias se
   editan a la vez, la última en guardar pisa a la otra. Para evitarlo, en estas
   tres páginas shop.js intercepta en fase de captura los clics de [data-add] y
   [data-cart-open], y el cajón lateral queda oculto por CSS (.page-cart/.page-checkout/
   .page-thanks .drawer{display:none}). En el resto del sitio manda app.js, intacto. */

/* ===== Constantes para el equipo ===== */
var SHOP_WHATSAPP = '593995178745';   // +593 99 517 8745 (real)
var SHOP_FREE_SHIPPING = 30;          // USD — envío gratis desde $30 (política confirmada)
/* Webhook de pedidos (GHL/CONCIERGE). Vacío = el pedido solo se guarda en el navegador.
   Equivale a FORM_ENDPOINT de app.js: si app.js ya trae FORM_ENDPOINT con valor, se usa
   ese y no hace falta tocar esta línea. No se puede llamar FORM_ENDPOINT aquí porque
   app.js se carga después y volvería a declararla vacía. */
var SHOP_FORM_ENDPOINT = '';
/* Dígito verificador de cédula/RUC. false (por defecto) = validamos la ESTRUCTURA
   (10 o 13 dígitos, provincia 01–24 o 30, tipo de contribuyente) y dejamos el
   dígito verificador para el SRI al facturar. true = además exigimos el módulo
   10/11. Va apagado porque el ejemplo del propio formulario (1712345678) no
   cuadra el módulo 10, y un demo que rechaza su propio ejemplo frena la venta. */
var SHOP_STRICT_DOC = false;
var SHOP_CART_KEY = 'rights-cart-v3';
var SHOP_ORDER_KEY = 'rights-order-last';

/* Catálogo REAL — copia exacta de PRODUCTS (app.js) + foto y ficha.
   Precios de rightschocolate.com (sep-2026). NO inventar precios ni pesos. */
var SHOP_PRODUCTS = {
  'aji':      { name: 'Ají 70 %', en: 'Chili 70 %', price: 3.62, meta: 'Barra 50 g · ají ecuatoriano', metaEn: '50 g bar · Ecuadorian chili', img: 'img/bar-aji.jpg' },
  'limon':    { name: 'Limón 70 %', en: 'Lime 70 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar', img: 'img/bar-limon.jpg' },
  'panela':   { name: 'Panela 70 %', en: 'Panela 70 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar', img: 'img/bar-panela.jpg' },
  'coco':     { name: 'Azúcar de Coco 80 %', en: 'Coconut Sugar 80 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar', img: 'img/bar-coco.jpg' },
  'sinazucar':{ name: 'Sin Azúcar 60 %', en: 'Sugar-free 60 %', price: 3.62, meta: 'Barra 50 g', metaEn: '50 g bar', img: 'img/board-3.jpg' },
  'pasion':   { name: 'Pasión de la Selva 70 %', en: 'Pasión de la Selva 70 %', price: 3.82, meta: 'Barra 50 g · maracuyá', metaEn: '50 g bar · passion fruit', img: 'img/bar-pasion.jpg' },
  'mar':      { name: 'Mar Exótico 70 %', en: 'Mar Exótico 70 %', price: 3.82, meta: 'Barra 50 g · mango + sal marina', metaEn: '50 g bar · mango + sea salt', img: 'img/bar-mar.jpg' },
  'milagro':  { name: 'Milagro Tropical 70 %', en: 'Milagro Tropical 70 %', price: 3.82, meta: 'Barra 50 g · guanábana + amaranto · Barra de oro 2024', metaEn: '50 g bar · soursop + amaranth · Gold bar 2024', img: 'img/bar-milagro.jpg' },
  'crunch':   { name: 'Cacao Crunch 70 %', en: 'Cacao Crunch 70 %', price: 3.82, meta: 'Barra 50 g · nibs + sal marina', metaEn: '50 g bar · nibs + sea salt', img: 'img/bar-crunch.jpg' },
  'mucilago': { name: '100 % con Mucílago', en: '100 % with Mucilage', price: 3.82, meta: 'Barra 50 g · solo cacao', metaEn: '50 g bar · only cacao', img: 'img/bar-mucilago.jpg' },
  'andina':   { name: 'Proteína Andina 55 %', en: 'Andean Protein 55 %', price: 3.82, meta: 'Barra 50 g · chocho + coco', metaEn: '50 g bar · lupin + coconut', img: 'img/bar-andina.jpg' },
  'gotas80':  { name: 'Cobertura en gotas 80 %', en: 'Couverture drops 80 %', price: 6.20, meta: '200 g', metaEn: '200 g', img: 'img/gotas-80.jpg' },
  'gotas100': { name: 'Cobertura en gotas 100 %', en: 'Couverture drops 100 %', price: 6.20, meta: '200 g', metaEn: '200 g', img: 'img/gotas-100.jpg' },
  'gotas60sa':{ name: 'Cobertura en gotas 60 % sin azúcar', en: 'Couverture drops 60 % sugar-free', price: 6.50, meta: '200 g · maltitol + stevia', metaEn: '200 g · maltitol + stevia', img: 'img/gotas-sinazucar.jpg' },
  'almcacao': { name: 'Almendra de cacao recubierta', en: 'Chocolate-coated cacao almonds', price: 6.49, meta: 'Snack de cacao', metaEn: 'Cacao snack', img: 'img/bites-cacao.jpg' },
  'almcafe':  { name: 'Almendra de café recubierta', en: 'Chocolate-coated coffee almonds', price: 6.49, meta: 'Snack de cacao', metaEn: 'Cacao snack', img: 'img/bites-cafe.jpg' },
  'nibs':     { name: 'Nibs de cacao cubiertos', en: 'Chocolate-coated cacao nibs', price: 6.49, meta: 'Snack de cacao', metaEn: 'Cacao snack', img: 'img/bites-nibs.jpg' },
  'mini12':   { name: 'Pack 12 minibarras 10 g', en: '12 mini bars 10 g', price: 9.84, meta: '6 sabores', metaEn: '6 flavours', img: 'img/bars-grid.jpg' },
  'kitvino':  { name: 'Kit de maridaje con vino', en: 'Wine pairing kit', price: 49.00, meta: 'Regalo', metaEn: 'Gift', img: 'img/kit-vino.jpg' },
  'kitcafe':  { name: 'Kit de maridaje con café', en: 'Coffee pairing kit', price: 49.00, meta: 'Regalo', metaEn: 'Gift', img: 'img/kit-cafe.jpg' },
  'caja10':   { name: 'Colección completa · 10 barras', en: 'Full collection · 10 bars', price: 37.40, meta: 'Los diez sabores', metaEn: 'All ten flavours', img: 'img/bars-all.jpg' },
  /* flag: true = el precio aún no está confirmado por Rights (CONTENT.md §2: «suma aprox»).
     Se pinta con <em class="note-real">[DATO RIGHTS]</em> al lado de la línea. */
  'caja5':    { name: 'Caja 5 barras a elección', en: 'Box of 5 bars, your choice', price: 18.50, meta: 'Con tarjeta', metaEn: 'With card', img: 'img/gift-set-2.jpg', flag: true }
};

(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); };
  var P = SHOP_PRODUCTS;

  /* Mostrar/ocultar de verdad. El atributo hidden solo gana si nada le pone
     display: .ok__grid es display:grid y pisa la regla [hidden] del navegador,
     así que #ok-body seguía a la vista junto al panel de «sin pedido». Fijamos
     también el display en línea y conservamos hidden (es el contrato del DOM). */
  function showEl(el, on) {
    if (!el) return;
    el.hidden = !on;
    el.style.display = on ? '' : 'none';
  }

  /* Une los trozos que existan con un separador, sin dejar « — » huérfanos. */
  function join(parts, sep) {
    return parts.filter(function (x) { return x; }).join(sep);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- Idioma (misma fuente que app.js: ?lang= y localStorage) ---------- */
  function readLang() {
    var q = null;
    try { q = new URLSearchParams(window.location.search).get('lang'); } catch (e) {}
    if (q === 'en') return 'en';
    if (q === 'es') return 'es';
    var s = null; try { s = localStorage.getItem('rights-lang'); } catch (e) {}
    return s === 'en' ? 'en' : 'es';
  }
  var lang = readLang();
  var t = function (es, en) { return lang === 'en' ? en : es; };
  /* bt() cierra la etiqueta de apertura: guarda ES e EN en data-* (para que el
     conmutador del nav siga funcionando) y escribe el idioma actual. Uso:
     '<p class="x" ' + bt('Hola', 'Hi') + '</p>'  */
  function bt(es, en) { return 'data-es="' + esc(es) + '" data-en="' + esc(en) + '">' + t(es, en); }
  /* Igual, pero sobre un nodo ya existente. */
  function setTx(el, es, en) { if (!el) return; el.setAttribute('data-es', es); el.setAttribute('data-en', en); el.innerHTML = t(es, en); }
  function link(url) { return url + (lang === 'en' ? (url.indexOf('?') >= 0 ? '&lang=en' : '?lang=en') : ''); }
  function wa(msg) { return 'https://wa.me/' + SHOP_WHATSAPP + '?text=' + encodeURIComponent(msg); }

  /* ---------- Carrito: lectura/escritura del contrato compartido ---------- */
  function readCart() {
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(SHOP_CART_KEY) || '{}') || {}; } catch (e) { raw = {}; }
    var out = {}, dropped = false;
    Object.keys(raw).forEach(function (k) {
      var it = raw[k];
      var q = it ? Math.floor(Number(it.q)) : 0;
      if (!P[k] || !(q > 0)) { dropped = true; return; }   // id desconocido o cantidad inválida
      out[k] = { q: Math.min(q, 99), note: typeof it.note === 'string' ? it.note : '' };
    });
    /* Si venía basura (id viejo, cantidad rota), la limpiamos en disco: app.js
       lee la misma clave y no tolera ids fuera de su tabla PRODUCTS. */
    if (dropped) writeCart(out);
    return out;
  }
  function writeCart(c) {
    var o = {};
    Object.keys(c).forEach(function (k) { o[k] = { q: c[k].q }; if (c[k].note) o[k].note = c[k].note; });
    try { localStorage.setItem(SHOP_CART_KEY, JSON.stringify(o)); } catch (e) {}
  }
  var cart = readCart();
  function count() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k].q; }, 0); }
  function subtotal() { return Object.keys(cart).reduce(function (n, k) { return n + cart[k].q * P[k].price; }, 0); }
  function syncNav() {
    var n = count();
    $$('[data-cart-count]').forEach(function (c) { c.textContent = n; c.classList.toggle('is-zero', n === 0); });
  }

  /* ---------- Toast (reutiliza el nodo del shell) ---------- */
  var toastT;
  function toast(msg) {
    var el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('is-on'); }, 2200);
  }

  /* ---------- Envío honesto ----------
     gratis desde $30 · retiro en planta $0 · por debajo de $30 NO hay tarifa
     confirmada: se muestra «por confirmar» y NO se suma al total. */
  function shipping(sub, method) {
    if (method === 'retiro') return { cost: 0, status: 'retiro' };
    if (sub >= SHOP_FREE_SHIPPING) return { cost: 0, status: 'gratis' };
    return { cost: 0, status: 'por-confirmar' };
  }
  function shipLabel(st) {
    if (st === 'retiro') return { es: 'Retiro en la planta (Quito) · $0.00', en: 'Pick-up at the plant (Quito) · $0.00' };
    if (st === 'gratis') return { es: 'Gratis', en: 'Free' };
    return {
      es: 'Costo de envío por confirmar según tu ciudad <em class="note-real">[DATO RIGHTS]</em>',
      en: 'Shipping cost to be confirmed for your city <em class="note-real">[DATO RIGHTS]</em>'
    };
  }
  function totalNote(st) {
    if (st === 'por-confirmar') return { es: 'El total muestra el subtotal. El envío se confirma cuando aceptamos tu pedido.', en: 'The total shows the subtotal. Shipping is confirmed when we accept your order.' };
    if (st === 'retiro') return { es: 'Retiras en la planta de Quito. Te avisamos cuando esté listo.', en: 'You pick it up at the Quito plant. We let you know when it is ready.' };
    return { es: 'Envío gratis incluido en Ecuador.', en: 'Free shipping included within Ecuador.' };
  }

  /* =======================================================================
     PÁGINA: carrito.html
     ======================================================================= */
  function renderCart() {
    var box = $('#cart-lines'); if (!box) return;
    var keys = Object.keys(cart), sub = subtotal();
    box.innerHTML = '';

    if (!keys.length) {
      var empty = document.createElement('div');
      empty.className = 'cart__empty';
      empty.innerHTML =
        '<p class="cart__empty-title" ' + bt('Tu carrito está vacío.', 'Your cart is empty.') + '</p>' +
        '<p class="cart__empty-text" ' + bt('Empieza por una barra, una cobertura o una caja para regalar. Cada barra apoya la inclusión laboral de personas con discapacidad.', 'Start with a bar, a couverture or a gift box. Every bar supports the labour inclusion of people with disabilities.') + '</p>' +
        '<a class="btn btn--dark" href="' + link('chocolates.html') + '" ' + bt('Ver toda la tienda', 'See the whole shop') + '</a>';
      box.appendChild(empty);
    }

    keys.forEach(function (k) {
      var p = P[k], it = cart[k];
      var row = document.createElement('article');
      row.className = 'cart__line';
      row.setAttribute('data-line', k);
      row.innerHTML =
        '<a class="cart__thumb" href="' + link('producto.html?id=' + k) + '">' +
          '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">' +
        '</a>' +
        '<div class="cart__info">' +
          '<h3 class="cart__name"><a href="' + link('producto.html?id=' + k) + '">' + esc(t(p.name, p.en)) + '</a></h3>' +
          '<p class="cart__meta" ' + bt(p.meta, p.metaEn) + (p.flag ? ' <em class="note-real">[DATO RIGHTS]</em>' : '') + '</p>' +
          '<p class="cart__unit"><span ' + bt('Precio unitario', 'Unit price') + '</span> ' + money(p.price) + '</p>' +
          '<details class="cart__note"' + (it.note ? ' open' : '') + '>' +
            '<summary ' + bt('Nota de regalo', 'Gift note') + '</summary>' +
            '<textarea data-note="' + k + '" rows="2" maxlength="120" data-es="Ej.: Para Ana, gracias por todo." data-en="E.g.: For Ana, thank you for everything." placeholder="' + esc(t('Ej.: Para Ana, gracias por todo.', 'E.g.: For Ana, thank you for everything.')) + '">' + esc(it.note) + '</textarea>' +
          '</details>' +
        '</div>' +
        '<div class="cart__qty" role="group" aria-label="' + esc(t('Cantidad', 'Quantity')) + '">' +
          '<button type="button" data-cart-dec="' + k + '" aria-label="' + esc(t('Quitar uno', 'Remove one')) + '">−</button>' +
          '<span class="cart__q">' + it.q + '</span>' +
          '<button type="button" data-cart-inc="' + k + '" aria-label="' + esc(t('Añadir uno', 'Add one')) + '">+</button>' +
        '</div>' +
        '<p class="cart__linetotal">' + money(p.price * it.q) + '</p>' +
        '<button class="cart__remove" type="button" data-cart-del="' + k + '" ' + bt('Eliminar', 'Remove') + '</button>';
      box.appendChild(row);
    });

    /* Barra de envío gratis */
    var missing = Math.max(0, SHOP_FREE_SHIPPING - sub);
    var bar = $('#cart-ship-bar');
    if (bar) bar.style.width = Math.min(100, sub / SHOP_FREE_SHIPPING * 100) + '%';
    var msg = $('#cart-ship-msg');
    if (msg) {
      if (!keys.length) setTx(msg, 'El envío es gratis desde $' + SHOP_FREE_SHIPPING + ' en Ecuador.', 'Shipping is free from $' + SHOP_FREE_SHIPPING + ' within Ecuador.');
      else if (missing > 0) setTx(msg, 'Te faltan ' + money(missing) + ' para envío gratis.', 'You are ' + money(missing) + ' away from free shipping.');
      else setTx(msg, 'Envío gratis desbloqueado ✓', 'Free shipping unlocked ✓');
    }

    /* Resumen */
    var st = shipping(sub, 'envio'), sl = shipLabel(st.status), tn = totalNote(st.status);
    var subEl = $('#cart-subtotal'); if (subEl) subEl.textContent = money(sub);
    var shipEl = $('#cart-shipline');
    if (shipEl) { if (keys.length) setTx(shipEl, sl.es, sl.en); else setTx(shipEl, '—', '—'); }
    var totEl = $('#cart-total-amount'); if (totEl) totEl.textContent = money(sub);
    var noteEl = $('#cart-total-note');
    if (noteEl) {
      if (keys.length) setTx(noteEl, tn.es, tn.en);
      else setTx(noteEl, 'Envío gratis desde $' + SHOP_FREE_SHIPPING + ' en Ecuador. Retiro en la planta de Quito, sin costo.', 'Free shipping from $' + SHOP_FREE_SHIPPING + ' within Ecuador. Pick-up at the Quito plant, at no cost.');
    }
    var cnt = $('#cart-count-label');
    if (cnt) setTx(cnt, count() === 1 ? '1 producto' : count() + ' productos', count() === 1 ? '1 item' : count() + ' items');

    /* Botones */
    var go = $('#cart-go');
    if (go) {
      go.href = link('checkout.html');
      go.classList.toggle('is-off', !keys.length);
      if (!keys.length) go.setAttribute('aria-disabled', 'true'); else go.removeAttribute('aria-disabled');
    }
    var waBtn = $('#cart-wa');
    if (waBtn) waBtn.href = wa(waCartText(sub));

    /* Título de la fila de sugeridos */
    var sug = $('#cart-sugg-title');
    if (sug) {
      if (!keys.length) setTx(sug, 'Empieza por aquí', 'Start here');
      else setTx(sug, 'Añade algo más', 'Add something else');
    }
    syncNav();
  }

  function waCartText(sub) {
    var lines = Object.keys(cart).map(function (k) {
      return '• ' + cart[k].q + ' × ' + P[k].name + (cart[k].note ? ' (nota: “' + cart[k].note + '”)' : '') + ' — ' + money(P[k].price * cart[k].q);
    });
    if (!lines.length) return 'Hola Rights 👋 Quiero hacer un pedido. ¿Me ayudan a elegir?';
    var ship = sub >= SHOP_FREE_SHIPPING ? 'Envío: gratis (pedido sobre $' + SHOP_FREE_SHIPPING + ')' : 'Envío: por confirmar según mi ciudad';
    return 'Hola Rights 👋 Quiero pedir:\n' + lines.join('\n') + '\nSubtotal: ' + money(sub) + '\n' + ship + '\n¿Me confirman envío y pago?';
  }

  /* =======================================================================
     PÁGINA: checkout.html
     ======================================================================= */
  var CITIES = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta', 'Otra'];
  var PAY_LABELS = {
    transferencia: { es: 'Transferencia bancaria', en: 'Bank transfer' },
    tarjeta: { es: 'Tarjeta o PayPhone', en: 'Card or PayPhone' },
    contraentrega: { es: 'Contra entrega (solo Quito)', en: 'Cash on delivery (Quito only)' },
    whatsapp: { es: 'Cerrar por WhatsApp', en: 'Close it on WhatsApp' }
  };

  function ckMethod() { var r = $('input[name="entrega"]:checked'); return r ? r.value : 'envio'; }
  function ckPay() { var r = $('input[name="pago"]:checked'); return r ? r.value : 'transferencia'; }
  function ckCity() { var s = $('#ck-city'); return s ? s.value : ''; }

  function renderCheckout() {
    var box = $('#ck-items'); if (!box) return;
    var sub = subtotal(), method = ckMethod();
    box.innerHTML = '';
    Object.keys(cart).forEach(function (k) {
      var p = P[k], it = cart[k];
      var li = document.createElement('li');
      li.className = 'ck__item';
      li.innerHTML =
        '<img src="' + p.img + '" alt="" loading="lazy">' +
        '<span class="ck__item-name">' + esc(t(p.name, p.en)) + '<small>× ' + it.q + (it.note ? ' · ' + esc(t('con nota', 'with note')) : '') + (p.flag ? ' <em class="note-real">[DATO RIGHTS]</em>' : '') + '</small></span>' +
        '<span class="ck__item-price">' + money(p.price * it.q) + '</span>';
      box.appendChild(li);
    });

    var st = shipping(sub, method), sl = shipLabel(st.status), tn = totalNote(st.status);
    var s1 = $('#ck-subtotal'); if (s1) s1.textContent = money(sub);
    setTx($('#ck-ship'), sl.es, sl.en);
    var tt = $('#ck-total'); if (tt) tt.textContent = money(sub + st.cost);
    setTx($('#ck-total-note'), tn.es, tn.en);

    /* Campos de dirección solo si hay envío a domicilio */
    showEl($('#ck-shipfields'), method !== 'retiro');

    /* «Otra» no trae nombre de ciudad: pedimos que la escriba en la dirección. */
    showEl($('#ck-city-other'), method === 'envio' && ckCity() === 'Otra');

    /* Contra entrega: solo Quito (o retiro en la planta de Quito) */
    var cod = $('#pay-contraentrega');
    if (cod) {
      var okCod = (method === 'retiro') || (ckCity() === 'Quito');
      cod.disabled = !okCod;
      var wrap = cod.closest('.ck__radio');
      if (wrap) wrap.classList.toggle('is-off', !okCod);
      if (!okCod && cod.checked) { var alt = $('#pay-transferencia'); if (alt) alt.checked = true; }
    }
    syncNav();
  }

  /* ---------- Validación real ---------- */
  function digits(v) { return String(v || '').replace(/[^\d]/g, ''); }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(v || '').trim()); }
  function validPhoneEC(v) {
    var d = digits(v);
    if (/^09\d{8}$/.test(d)) return true;          // 09XXXXXXXX
    if (/^9\d{8}$/.test(d)) return true;           // 9XXXXXXXX
    if (/^5939\d{8}$/.test(d)) return true;        // +593 9XXXXXXXX
    if (/^59309\d{8}$/.test(d)) return true;       // +593 09XXXXXXXX (con el 0 pegado)
    if (/^0[2-7]\d{7}$/.test(d)) return true;      // fijo 0X XXXXXXX
    if (/^593[2-7]\d{7}$/.test(d)) return true;    // +593 fijo
    return false;
  }
  /* Cédula ecuatoriana: provincia 01–24 o 30, tercer dígito < 6, módulo 10. */
  function validCedula(d) {
    if (!/^\d{10}$/.test(d)) return false;
    var prov = parseInt(d.slice(0, 2), 10);
    if (!((prov >= 1 && prov <= 24) || prov === 30)) return false;
    if (Number(d.charAt(2)) > 5) return false;
    var sum = 0;
    for (var i = 0; i < 9; i++) {
      var x = Number(d.charAt(i)) * (i % 2 === 0 ? 2 : 1);
      if (x > 9) x -= 9;
      sum += x;
    }
    return ((10 - (sum % 10)) % 10) === Number(d.charAt(9));
  }
  /* RUC: 13 dígitos. Natural (3.º < 6) = cédula + establecimiento.
     Público (3.º = 6) y sociedad privada (3.º = 9) = módulo 11. */
  function validRuc(d) {
    if (!/^\d{13}$/.test(d)) return false;
    var prov = parseInt(d.slice(0, 2), 10);
    if (!((prov >= 1 && prov <= 24) || prov === 30)) return false;
    var third = Number(d.charAt(2));
    if (third < 6) return validCedula(d.slice(0, 10)) && d.slice(10) !== '000';
    var coef, len, pos, est;
    if (third === 6) { coef = [3, 2, 7, 6, 5, 4, 3, 2]; len = 8; pos = 8; est = d.slice(9); }
    else if (third === 9) { coef = [4, 3, 2, 7, 6, 5, 4, 3, 2]; len = 9; pos = 9; est = d.slice(10); }
    else return false;
    var sum = 0;
    for (var i = 0; i < len; i++) sum += Number(d.charAt(i)) * coef[i];
    var r = sum % 11, dv = r === 0 ? 0 : 11 - r;
    if (dv > 9) return false;
    if (dv !== Number(d.charAt(pos))) return false;
    return /[1-9]/.test(est);
  }

  /* Estructura del documento, sin dígito verificador: provincia 01–24 o 30 y
     tercer dígito coherente con el tipo de contribuyente. Es lo que exigimos
     en el demo (ver SHOP_STRICT_DOC arriba). */
  function docShapeOk(d) {
    if (!/^\d{10}$/.test(d) && !/^\d{13}$/.test(d)) return false;
    var prov = parseInt(d.slice(0, 2), 10);
    if (!((prov >= 1 && prov <= 24) || prov === 30)) return false;
    var third = Number(d.charAt(2));
    if (d.length === 10) return third < 6;                                  // cédula de persona natural
    if (third < 6) return d.slice(10) !== '000';                            // RUC de persona natural
    if (third === 6) return /[1-9]/.test(d.slice(9));                       // sector público
    if (third === 9) return /[1-9]/.test(d.slice(10));                      // sociedad privada
    return false;
  }
  function docValid(d) {
    if (!docShapeOk(d)) return false;
    if (!SHOP_STRICT_DOC) return true;
    return d.length === 10 ? validCedula(d) : validRuc(d);
  }

  function fieldError(name, es, en) {
    var el = $('#err-' + name), input = $('[name="' + name + '"]');
    if (el) { if (es) setTx(el, es, en); else { el.removeAttribute('data-es'); el.removeAttribute('data-en'); el.textContent = ''; } }
    if (input && input.type !== 'radio' && input.type !== 'checkbox') input.classList.toggle('is-bad', !!es);
    return !es;
  }

  function validateCheckout(silent) {
    var bad = [];
    function chk(name, ok, es, en) {
      if (!silent) fieldError(name, ok ? '' : es, ok ? '' : en);
      if (!ok) bad.push(name);
      return ok;
    }
    var v = function (n) { var el = $('[name="' + n + '"]'); return el ? el.value.trim() : ''; };

    chk('nombre', v('nombre').length >= 3, 'Escribe tu nombre completo.', 'Enter your full name.');
    chk('email', validEmail(v('email')), 'Revisa el correo: falta el @ o el dominio.', 'Check the email: the @ or the domain is missing.');
    chk('telefono', validPhoneEC(v('telefono')), 'Número ecuatoriano: 09XXXXXXXX o +593 9XXXXXXXX.', 'Ecuadorian number: 09XXXXXXXX or +593 9XXXXXXXX.');

    if (ckMethod() === 'envio') {
      chk('ciudad', CITIES.indexOf(ckCity()) >= 0, 'Elige la ciudad de entrega.', 'Choose the delivery city.');
      chk('direccion', v('direccion').length >= 8, 'Escribe la dirección completa (calle y número).', 'Enter the full address (street and number).');
    } else {
      if (!silent) { fieldError('ciudad', ''); fieldError('direccion', ''); }
    }

    var doc = digits(v('documento'));
    chk('documento', docValid(doc),
      SHOP_STRICT_DOC ? 'Cédula de 10 dígitos o RUC de 13 dígitos válidos.' : 'Escribe 10 dígitos (cédula) o 13 (RUC).',
      SHOP_STRICT_DOC ? 'A valid 10-digit cédula or 13-digit RUC.' : 'Enter 10 digits (cédula) or 13 (RUC).');
    chk('razon', v('razon').length >= 3, 'Escribe el nombre o la razón social de la factura.', 'Enter the name or company name for the invoice.');
    chk('fiscal', v('fiscal').length >= 5, 'Escribe la dirección fiscal.', 'Enter the tax address.');

    var pay = ckPay();
    if (pay === 'contraentrega' && ckMethod() === 'envio' && ckCity() !== 'Quito') {
      bad.push('pago');
      if (!silent) fieldError('pago', 'Contra entrega solo está disponible en Quito.', 'Cash on delivery is only available in Quito.');
    } else if (!silent) fieldError('pago', '');

    if (!silent) {
      var msg = $('#ck-msg');
      if (bad.length) setTx(msg, 'Revisa los campos marcados: faltan ' + bad.length + '.', 'Check the highlighted fields: ' + bad.length + ' missing.');
      else if (msg) { msg.removeAttribute('data-es'); msg.removeAttribute('data-en'); msg.textContent = ''; }
      if (bad.length) {
        var first = $('[name="' + bad[0] + '"]');
        if (first && first.focus) { try { first.focus({ preventScroll: false }); } catch (e) { first.focus(); } }
      }
    }
    return bad.length === 0;
  }

  /* ---------- Número de pedido determinista: RG-AAAAMMDD-NNNN ---------- */
  function orderNumber(seedObj) {
    var d = new Date();
    var day = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    var seed = JSON.stringify(seedObj) + '|' + day;
    var h = 2166136261;                                   // FNV-1a de 32 bits
    for (var i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = (Math.imul(h, 16777619) >>> 0);
    }
    return 'RG-' + day + '-' + ('000' + (h % 10000)).slice(-4);
  }

  function buildOrder() {
    var v = function (n) { var el = $('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
    var sub = subtotal(), method = ckMethod(), st = shipping(sub, method), pay = ckPay();
    var items = Object.keys(cart).map(function (k) {
      return { id: k, name: P[k].name, nameEn: P[k].en, q: cart[k].q, price: P[k].price, line: Math.round(P[k].price * cart[k].q * 100) / 100, note: cart[k].note || '' };
    });
    var doc = digits(v('documento'));
    var order = {
      source: 'checkout-v4',
      lang: lang,
      ts: new Date().toISOString(),
      items: items,
      subtotal: Math.round(sub * 100) / 100,
      shipping: {
        method: method,                                  // 'envio' | 'retiro'
        city: method === 'envio' ? ckCity() : 'Quito',
        address: method === 'envio' ? v('direccion') : '',
        reference: method === 'envio' ? v('referencia') : '',
        cost: st.cost,
        status: st.status                                // 'gratis' | 'por-confirmar' | 'retiro'
      },
      payment: { method: pay, label: PAY_LABELS[pay] ? PAY_LABELS[pay].es : pay },
      contact: { name: v('nombre'), email: v('email'), phone: v('telefono') },
      invoice: { doc: doc, docType: doc.length === 13 ? 'ruc' : 'cedula', name: v('razon'), address: v('fiscal') },
      note: v('nota'),
      total: Math.round((sub + st.cost) * 100) / 100
    };
    order.id = orderNumber({ i: items, e: order.contact.email, p: pay, m: method, c: order.shipping.city });
    return order;
  }

  function orderWaText(o) {
    var L = [];
    L.push('Hola Rights 👋 Este es mi pedido ' + o.id + '.');
    L.push('');
    o.items.forEach(function (it) {
      L.push('• ' + it.q + ' × ' + it.name + (it.note ? ' (nota: “' + it.note + '”)' : '') + ' — ' + money(it.line));
    });
    L.push('');
    L.push('Subtotal: ' + money(o.subtotal));
    L.push('Envío: ' + (o.shipping.status === 'gratis' ? 'gratis' : o.shipping.status === 'retiro' ? 'retiro en la planta (Quito)' : 'por confirmar según mi ciudad'));
    L.push('Total: ' + money(o.total) + (o.shipping.status === 'por-confirmar' ? ' (sin envío)' : ''));
    L.push('');
    if (o.shipping.method === 'retiro') L.push('Entrega: retiro en la planta de Quito');
    else {
      var dest = join([o.shipping.city, o.shipping.address], ' — ') + (o.shipping.reference ? ' (ref.: ' + o.shipping.reference + ')' : '');
      L.push('Entrega: ' + (dest || 'dirección por confirmar'));
    }
    L.push('Pago: ' + (o.payment.label || 'por confirmar'));
    var inv = join([(o.invoice.doc ? (o.invoice.docType === 'ruc' ? 'RUC ' : 'Cédula ') + o.invoice.doc : ''), o.invoice.name, o.invoice.address], ' · ');
    if (inv) L.push('Factura: ' + inv);
    if (o.note) L.push('Nota del pedido: ' + o.note);
    L.push('');
    var who = join([o.contact.name, o.contact.phone, o.contact.email], ' · ');
    if (who) L.push('Contacto: ' + who);
    while (L.length && !L[L.length - 1]) L.pop();   // sin líneas en blanco al final
    return L.join('\n');
  }

  function submitCheckout(e) {
    e.preventDefault();
    if (!Object.keys(cart).length) { window.location.href = link('carrito.html'); return; }
    if (!validateCheckout(false)) return;
    var btn = $('#ck-submit');
    if (btn) { btn.disabled = true; setTx(btn, 'Enviando…', 'Sending…'); }
    var order = buildOrder();
    try { localStorage.setItem(SHOP_ORDER_KEY, JSON.stringify(order)); } catch (err) {}

    var endpoint = (typeof FORM_ENDPOINT === 'string' && FORM_ENDPOINT) ? FORM_ENDPOINT : SHOP_FORM_ENDPOINT;
    if (endpoint) {
      try {
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order), keepalive: true })['catch'](function () {});
      } catch (err) {}
    }
    cart = {};
    writeCart(cart);
    syncNav();
    window.location.href = link('pedido-confirmado.html');
  }

  /* =======================================================================
     PÁGINA: pedido-confirmado.html
     ======================================================================= */
  /* Un pedido guardado por una versión anterior del sitio (o a medio escribir) puede
     llegar sin shipping/payment/invoice/contact. Antes eso rompía la página con un
     TypeError y dejaba el botón de WhatsApp en href="#". Lo completamos con valores
     neutros y, si no hay nada rescatable, devolvemos null para mostrar #ok-empty. */
  function normalizeOrder(o) {
    if (!o || typeof o !== 'object' || !o.id) return null;
    var raw = Array.isArray(o.items) ? o.items : [];
    var items = [];
    raw.forEach(function (it) {
      if (!it || !it.id) return;
      var p = P[it.id] || {};
      var q = Math.max(1, Math.floor(Number(it.q)) || 1);
      var price = Number(it.price); if (!isFinite(price)) price = Number(p.price) || 0;
      var line = Number(it.line); if (!isFinite(line)) line = Math.round(price * q * 100) / 100;
      items.push({
        id: it.id, q: q, price: price, line: line,
        name: it.name || p.name || it.id,
        nameEn: it.nameEn || p.en || it.name || it.id,
        note: typeof it.note === 'string' ? it.note : ''
      });
    });
    if (!items.length) return null;
    var sub = Number(o.subtotal);
    if (!isFinite(sub)) sub = Math.round(items.reduce(function (n, it) { return n + it.line; }, 0) * 100) / 100;
    var sh = (o.shipping && typeof o.shipping === 'object') ? o.shipping : {};
    var method = sh.method === 'retiro' ? 'retiro' : 'envio';
    var status = (sh.status === 'gratis' || sh.status === 'retiro' || sh.status === 'por-confirmar')
      ? sh.status
      : (method === 'retiro' ? 'retiro' : (sub >= SHOP_FREE_SHIPPING ? 'gratis' : 'por-confirmar'));
    var pay = (o.payment && typeof o.payment === 'object') ? o.payment : {};
    var inv = (o.invoice && typeof o.invoice === 'object') ? o.invoice : {};
    var ct = (o.contact && typeof o.contact === 'object') ? o.contact : {};
    var tot = Number(o.total); if (!isFinite(tot)) tot = sub;
    return {
      id: String(o.id), lang: o.lang === 'en' ? 'en' : 'es', ts: o.ts || '',
      items: items, subtotal: sub, total: tot,
      shipping: {
        method: method,
        city: sh.city || (method === 'retiro' ? 'Quito' : ''),
        address: sh.address || '', reference: sh.reference || '',
        cost: Number(sh.cost) || 0, status: status
      },
      payment: { method: PAY_LABELS[pay.method] ? pay.method : '', label: pay.label || (PAY_LABELS[pay.method] ? PAY_LABELS[pay.method].es : '') },
      invoice: { doc: inv.doc || '', docType: inv.docType === 'ruc' ? 'ruc' : 'cedula', name: inv.name || '', address: inv.address || '' },
      contact: { name: ct.name || '', email: ct.email || '', phone: ct.phone || '' },
      note: typeof o.note === 'string' ? o.note : ''
    };
  }
  function renderThanks() {
    var wrapEl = $('#ok-body'); if (!wrapEl) return;
    var emptyEl = $('#ok-empty');
    var o = null;
    try { o = normalizeOrder(JSON.parse(localStorage.getItem(SHOP_ORDER_KEY) || 'null')); } catch (e) { o = null; }
    if (!o) {
      showEl(wrapEl, false); showEl(emptyEl, true);
      return;
    }
    try { paintThanks(o); }
    catch (e) { showEl(wrapEl, false); showEl(emptyEl, true); }
  }

  function paintThanks(o) {
    showEl($('#ok-body'), true);
    showEl($('#ok-empty'), false);

    var num = $('#ok-number'); if (num) num.textContent = o.id;
    var items = $('#ok-items');
    if (items) {
      items.innerHTML = '';
      o.items.forEach(function (it) {
        var p = P[it.id];
        var li = document.createElement('li');
        li.className = 'ok__item';
        li.innerHTML =
          (p ? '<img src="' + p.img + '" alt="" loading="lazy">' : '') +
          '<span class="ok__item-name">' + esc(lang === 'en' ? (it.nameEn || it.name) : it.name) +
            '<small>× ' + it.q + (it.note ? ' · “' + esc(it.note) + '”' : '') + (p && p.flag ? ' <em class="note-real">[DATO RIGHTS]</em>' : '') + '</small></span>' +
          '<span class="ok__item-price">' + money(it.line) + '</span>';
        items.appendChild(li);
      });
    }
    var sl = shipLabel(o.shipping.status), tn = totalNote(o.shipping.status);
    var sEl = $('#ok-subtotal'); if (sEl) sEl.textContent = money(o.subtotal);
    setTx($('#ok-shipline'), sl.es, sl.en);
    var tEl = $('#ok-total'); if (tEl) tEl.textContent = money(o.total);
    setTx($('#ok-total-note'), tn.es, tn.en);

    var dest = join([esc(o.shipping.city), esc(o.shipping.address)], ' — ') +
      (o.shipping.reference ? ' (ref.: ' + esc(o.shipping.reference) + ')' : '');
    if (o.shipping.method === 'retiro') setTx($('#ok-ship'), 'Retiro en la planta de Rights, Quito.', 'Pick-up at the Rights plant, Quito.');
    else if (dest) setTx($('#ok-ship'), 'Envío a ' + dest, 'Delivery to ' + dest);
    else setTx($('#ok-ship'), 'Dirección por confirmar por WhatsApp.', 'Address to be confirmed on WhatsApp.');

    var pl = PAY_LABELS[o.payment.method] ||
      (o.payment.label ? { es: esc(o.payment.label), en: esc(o.payment.label) }
                       : { es: 'Por confirmar por WhatsApp.', en: 'To be confirmed on WhatsApp.' });
    setTx($('#ok-pay'), pl.es, pl.en);
    var invEs = join([(o.invoice.doc ? (o.invoice.docType === 'ruc' ? 'RUC ' : 'Cédula ') + esc(o.invoice.doc) : ''), esc(o.invoice.name)], ' · ');
    var invEn = join([(o.invoice.doc ? (o.invoice.docType === 'ruc' ? 'RUC ' : 'ID ') + esc(o.invoice.doc) : ''), esc(o.invoice.name)], ' · ');
    setTx($('#ok-invoice'), invEs || '—', invEn || '—');
    var who = join([esc(o.contact.name), esc(o.contact.phone), esc(o.contact.email)], ' · ');
    setTx($('#ok-contact'), who || '—', who || '—');

    var noteRow = $('#ok-note-row');
    if (noteRow) {
      if (o.note) { showEl(noteRow, true); setTx($('#ok-note'), esc(o.note), esc(o.note)); }
      else showEl(noteRow, false);
    }
    var waBtn = $('#ok-wa');
    if (waBtn) { waBtn.href = wa(orderWaText(o)); waBtn.setAttribute('target', '_blank'); waBtn.setAttribute('rel', 'noopener'); }
  }

  /* =======================================================================
     Acciones y arranque
     ======================================================================= */
  function addItem(id, note) {
    if (!P[id]) return;
    if (!cart[id]) cart[id] = { q: 0, note: '' };
    cart[id].q = Math.min(99, cart[id].q + 1);
    if (note) cart[id].note = note;
    writeCart(cart);
    toast(t(P[id].name + ' agregado', P[id].en + ' added'));
    renderAll();
  }

  /* Captura: en estas tres páginas el carrito lo maneja shop.js, no app.js. */
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || typeof el.closest !== 'function') return;
    var add = el.closest('[data-add]');
    if (add) { e.preventDefault(); e.stopPropagation(); addItem(add.getAttribute('data-add'), ''); return; }
    var open = el.closest('[data-cart-open]');
    if (open) {
      e.preventDefault(); e.stopPropagation();
      var target = $('#cart-top') || $('#ck-summary');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.href = link('carrito.html');
      return;
    }
  }, true);

  /* Burbuja: los controles propios del carrito. */
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || typeof el.closest !== 'function') return;
    var inc = el.closest('[data-cart-inc]');
    if (inc) { var ki = inc.getAttribute('data-cart-inc'); if (cart[ki]) { cart[ki].q = Math.min(99, cart[ki].q + 1); writeCart(cart); renderAll(); } return; }
    var dec = el.closest('[data-cart-dec]');
    if (dec) { var kd = dec.getAttribute('data-cart-dec'); if (cart[kd]) { cart[kd].q--; if (cart[kd].q <= 0) delete cart[kd]; writeCart(cart); renderAll(); } return; }
    var del = el.closest('[data-cart-del]');
    if (del) {
      var kx = del.getAttribute('data-cart-del');
      if (cart[kx]) { var gone = P[kx]; delete cart[kx]; writeCart(cart); toast(t(gone.name + ' eliminado', gone.en + ' removed')); renderAll(); }
      return;
    }
  });

  /* Nota de regalo: se guarda sin repintar, para no perder el foco. */
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (!el || !el.getAttribute) return;
    var k = el.getAttribute('data-note');
    if (!k || !cart[k]) return;
    cart[k].note = el.value.trim();
    writeCart(cart);
    /* Repintar entero robaría el foco del textarea. El único nodo que depende de
       la nota es el enlace de WhatsApp del resumen: lo refrescamos a mano. */
    var waBtn = $('#cart-wa');
    if (waBtn) waBtn.href = wa(waCartText(subtotal()));
  });

  /* Checkout: recalcular al cambiar entrega, ciudad o pago. */
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || !el.name) return;
    if (el.name === 'entrega' || el.name === 'ciudad' || el.name === 'pago') { renderCheckout(); validateCheckout(true); }
  });

  function renderAll() {
    renderCart();
    renderCheckout();
    renderThanks();
    syncNav();
  }

  /* Repinta cuando el carrito cambia en otra pestaña. */
  window.addEventListener('storage', function (e) {
    if (e.key && e.key !== SHOP_CART_KEY) return;
    cart = readCart();
    if (guardCheckout()) return;   // otra pestaña vació el carrito: no dejes un checkout fantasma
    renderAll();
  });

  /* El conmutador de idioma del nav vive en app.js: después de su clic,
     releemos el idioma y repintamos lo que genera shop.js. */
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || typeof el.closest !== 'function') return;
    if (!el.closest('#lang-toggle')) return;
    setTimeout(function () { lang = readLang(); renderAll(); }, 0);
  }, true);

  /* Checkout con carrito vacío → al carrito. */
  function guardCheckout() {
    if (!document.body.classList.contains('page-checkout')) return false;
    if (Object.keys(cart).length) return false;
    window.location.replace(link('carrito.html'));
    return true;
  }

  function boot() {
    if (guardCheckout()) return;
    cart = readCart();
    renderAll();
    var form = $('#ck-form');
    if (form && !form.dataset.bound) { form.dataset.bound = '1'; form.addEventListener('submit', submitCheckout); }
    var same = $('#ck-same');
    if (same && !same.dataset.bound) {
      same.dataset.bound = '1';
      var sync = function () {
        var razon = $('[name="razon"]'), fiscal = $('[name="fiscal"]'), nombre = $('[name="nombre"]'), dir = $('[name="direccion"]');
        if (!same.checked) return;
        if (razon && nombre) razon.value = nombre.value;
        if (fiscal && dir) fiscal.value = ckMethod() === 'retiro' ? 'Quito' : dir.value;
      };
      same.addEventListener('change', sync);
      document.addEventListener('input', function () { if (same.checked) sync(); });
      document.addEventListener('change', function () { if (same.checked) sync(); });
    }
  }

  boot();
  /* app.js se carga después: repintamos una vez más para recuperar los enlaces
     de WhatsApp y el idioma que app.js aplica al final. */
  document.addEventListener('DOMContentLoaded', function () { lang = readLang(); renderAll(); });
  /* Con el botón atrás el navegador puede restaurar la página tal cual la dejamos:
     carrito ya vacío y el botón congelado en «Enviando…». Rehacemos el arranque. */
  window.addEventListener('pageshow', function (ev) {
    if (!ev.persisted) return;
    cart = readCart();
    var btn = $('#ck-submit');
    if (btn) { btn.disabled = false; setTx(btn, 'Confirmar pedido', 'Confirm order'); }
    if (guardCheckout()) return;
    lang = readLang();
    renderAll();
  });
})();
