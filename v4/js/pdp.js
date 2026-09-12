/* Rights v4 — página de producto (producto.html?id=…)
   Llena el esqueleto con datos REALES del catálogo (CONTENT.md §2). Fotos reales, sin renders.
   Idioma: escribe ES en innerHTML y EN en data-en; app.js (que corre después) aplica el toggle. */
(function () {
  'use strict';

  var SUPER_ES = 'Un superalimento – la cantidad ideal de cacao para quienes disfrutan de la dulzura de un buen chocolate.';
  var SUPER_EN = 'A superfood – the ideal amount of cacao for those who enjoy the sweetness of good chocolate.';
  var ORIGIN_ES = 'Cacao Nacional fino de aroma · noroccidente de Ecuador';
  var ORIGIN_EN = 'Fine-aroma Nacional cacao · north-western Ecuador';

  /* Categorías: eyebrow, ancla en chocolates.html y nombre para la miga */
  var CAT = {
    barra:     { es: 'Barra',            en: 'Bar',            crumbEs: 'Barras',      crumbEn: 'Bars',        hash: '#barras' },
    cobertura: { es: 'Cobertura',        en: 'Couverture',     crumbEs: 'Coberturas',  crumbEn: 'Couvertures', hash: '#coberturas' },
    snack:     { es: 'Snack de cacao',   en: 'Cacao snack',    crumbEs: 'Snacks',      crumbEn: 'Snacks',      hash: '#snacks' },
    mini:      { es: 'Minibarras',       en: 'Mini bars',      crumbEs: 'Minibarras',  crumbEn: 'Mini bars',   hash: '#mini' },
    regalo:    { es: 'Regalo',           en: 'Gift',           crumbEs: 'Regalos',     crumbEn: 'Gifts',       hash: '#regalos' }
  };

  /* Marcador de dato que Rights debe confirmar */
  var PEND = '<em class="note-real">[DATO RIGHTS]</em>';

  /* Aplicaciones profesionales de las coberturas (texto del sitio actual) */
  var APPS = [
    { es: 'pastelería y repostería', en: 'pastry and baking' },
    { es: 'chocolatería', en: 'chocolate work' },
    { es: 'alta cocina y cocina salada', en: 'haute cuisine and savoury cooking' }
  ];

  /* Maridajes genéricos y honestos */
  var P = {
    cafe:   { es: 'café',           en: 'coffee' },
    vino:   { es: 'vino tinto',     en: 'red wine' },
    queso:  { es: 'queso fresco',   en: 'fresh cheese' },
    fruta:  { es: 'fruta',          en: 'fruit' },
    agua:   { es: 'agua mineral',   en: 'mineral water' },
    te:     { es: 'té negro',       en: 'black tea' },
    pan:    { es: 'pan de masa madre', en: 'sourdough bread' }
  };

  var DATA = {
    /* ---------- Barras (gramaje pendiente: el empaque fotografiado dice 2,11 oz. / 60 gr.) ---------- */
    aji: { cat: 'barra', name: 'Ají', nameEn: 'Chili Pepper', pct: '70 %', ing: 'ají ecuatoriano', ingEn: 'Ecuadorian chili', price: 3.62, weight: '',
      photos: ['bar-aji.jpg', 'art-aji.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'], desc: SUPER_ES, descEn: SUPER_EN, sugarFree: false,
      pairs: ['cafe', 'vino', 'queso'], related: ['limon', 'panela', 'mar', 'crunch'] },
    limon: { cat: 'barra', name: 'Limón', nameEn: 'Lime', pct: '70 %', ing: 'limón', ingEn: 'lime', price: 3.62, weight: '',
      photos: ['bar-limon.jpg', 'art-limon.jpg', 'art-closeup.jpg', 'bars-all.jpg'], desc: SUPER_ES, descEn: SUPER_EN, sugarFree: false,
      pairs: ['te', 'fruta', 'queso'], related: ['aji', 'panela', 'pasion', 'mar'] },
    panela: { cat: 'barra', name: 'Panela', nameEn: 'Panela', pct: '70 %', ing: 'panela', ingEn: 'panela (unrefined cane sugar)', price: 3.62, weight: '',
      photos: ['bar-panela.jpg', 'art-panela.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'], desc: SUPER_ES, descEn: SUPER_EN, sugarFree: false,
      pairs: ['cafe', 'queso', 'pan'], related: ['aji', 'limon', 'coco', 'milagro'] },
    coco: { cat: 'barra', name: 'Azúcar de Coco', nameEn: 'Azúcar de Coco', pct: '80 %', ing: 'azúcar de coco', ingEn: 'coconut sugar', price: 3.62, weight: '',
      photos: ['bar-coco.jpg', 'art-coco.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'],
      desc: 'El porcentaje perfecto que resalta los aromas y sabores del cacao fino de aroma y mantiene la dulzura suficiente.',
      descEn: 'The perfect percentage: it brings out the aromas and flavours of fine-aroma cacao while keeping just enough sweetness.', sugarFree: false,
      pairs: ['cafe', 'vino', 'fruta'], related: ['mucilago', 'panela', 'andina', 'crunch'] },
    sinazucar: { cat: 'barra', name: 'Sin Azúcar', nameEn: 'Sin Azúcar', pct: '60 %', ing: 'sin azúcar añadida', ingEn: 'no added sugar', price: 3.62, weight: '',
      photos: ['board-3.jpg', 'bars-grid.jpg', 'hands-mold-1.jpg'], desc: SUPER_ES, descEn: SUPER_EN, sugarFree: true,
      pairs: ['cafe', 'te', 'fruta'], related: ['pasion', 'crunch', 'gotas60sa', 'andina'] },
    pasion: { cat: 'barra', name: 'Pasión de la Selva', nameEn: 'Jungle Passion', pct: '70 %', ing: 'maracuyá', ingEn: 'passion fruit', price: 3.82, weight: '',
      photos: ['bar-pasion.jpg', 'art-maracuya.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'],
      desc: 'Equilibrio perfecto de un chocolate 70 % cacao fino de aroma y el toque vibrante de notas ácidas y dulces del maracuyá. Aroma fragante y floral.',
      descEn: 'Perfect balance between a 70 % fine-aroma cacao chocolate and the vibrant touch of passion fruit’s sour and sweet notes. Fragrant, floral aroma.', sugarFree: false,
      pairs: ['te', 'fruta', 'queso'], related: ['mar', 'milagro', 'limon', 'crunch'] },
    mar: { cat: 'barra', name: 'Mar Exótico', nameEn: 'Mar Exótico', pct: '70 %', ing: 'mango + sal marina', ingEn: 'mango + sea salt', price: 3.82, weight: '',
      photos: ['bar-mar.jpg', 'art-mango.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'],
      desc: 'El toque de mango, fresco y vibrante, aporta una dulzura tropical que se fusiona con la sutileza del mar. Notas frutales ácidas y equilibradas con mango liofilizado.',
      descEn: 'Fresh, vibrant mango brings a tropical sweetness that melds with the subtlety of the sea. Sour, balanced fruit notes with freeze-dried mango.', sugarFree: false,
      pairs: ['vino', 'queso', 'fruta'], related: ['pasion', 'milagro', 'crunch', 'aji'] },
    milagro: { cat: 'barra', name: 'Milagro Tropical', nameEn: 'Tropical Miracle', pct: '70 %', ing: 'guanábana + amaranto', ingEn: 'soursop + amaranth', price: 3.82, weight: '',
      badge: 'Barra de oro 2024', badgeEn: 'Gold bar 2024',
      photos: ['bar-milagro.jpg', 'art-guanabana.jpg', 'milagro-fruta.jpg', 'bars-all.jpg'],
      desc: 'Guanábana y amaranto extruido: notas afrutadas y florales, frescura tropical, suave y ligeramente ácida, con crujiente nutrición de proteínas y fibra. Barra de oro 2024.',
      descEn: 'Soursop and extruded amaranth: fruity, floral notes, tropical freshness, smooth and slightly sour, with the crunchy nutrition of protein and fibre. Gold bar 2024.', sugarFree: false,
      pairs: ['cafe', 'vino', 'fruta'], related: ['pasion', 'mar', 'crunch', 'andina'] },
    crunch: { cat: 'barra', name: 'Cacao Crunch', nameEn: 'Cocoa Crunch', pct: '70 %', ing: 'nibs + sal marina', ingEn: 'nibs + sea salt', price: 3.82, weight: '',
      photos: ['bar-crunch.jpg', 'art-sal.jpg', 'life-desk.jpg', 'bars-all.jpg'],
      desc: 'Crujientes nibs y un toque de sal marina que intensifica la complejidad del cacao equilibrando su dulzura. Un momento sofisticado y saludable.',
      descEn: 'Crunchy nibs and a touch of sea salt that intensifies the cacao’s complexity while balancing its sweetness. A sophisticated, healthy moment.', sugarFree: false,
      pairs: ['cafe', 'vino', 'queso'], related: ['mar', 'milagro', 'andina', 'nibs'] },
    mucilago: { cat: 'barra', name: '100 % con Mucílago', nameEn: '100 % con Mucílago', pct: '100 %', ing: 'endulzado con mucílago de cacao', ingEn: 'sweetened with cacao mucilage', price: 3.82, weight: '',
      badge: '100 % solo cacao', badgeEn: '100 % cacao only',
      photos: ['bar-mucilago.jpg', 'board-1.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'],
      desc: 'Un tributo a la esencia pura del cacao fino de aroma. El dulzor natural del mucílago revela notas de frutas tropicales que evolucionan hacia toques florales. Final profundo y prolongado. 100 % solo cacao.',
      descEn: 'A tribute to the pure essence of fine-aroma cacao. The natural sweetness of the mucilage reveals tropical fruit notes that evolve into floral touches. Deep, long finish. 100 % cacao, nothing else.', sugarFree: true,
      pairs: ['agua', 'cafe', 'fruta'], related: ['coco', 'gotas100', 'crunch', 'sinazucar'] },
    andina: { cat: 'barra', name: 'Proteína Andina', nameEn: 'Proteína Andina', pct: '55 %', ing: 'chocho + coco', ingEn: 'chocho (Andean lupin) + coconut', price: 3.82, weight: '',
      badge: 'Proteína', badgeEn: 'Protein',
      photos: ['bar-andina.jpg', 'life-gym.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'],
      desc: 'El chocho – joya de proteína andina – aporta textura suave y un ligero toque de nuez; con la dulzura delicada del coco crea un balance perfecto. Un placer saludable y sin culpa.',
      descEn: 'Chocho – the jewel of Andean protein – brings a smooth texture and a light nutty touch; with the delicate sweetness of coconut it creates perfect balance. A healthy, guilt-free pleasure.', sugarFree: false,
      pairs: ['cafe', 'fruta', 'queso'], related: ['crunch', 'coco', 'milagro', 'mini12'] },

    /* ---------- Coberturas en gotas · 200 g ---------- */
    gotas80: { cat: 'cobertura', name: 'Cobertura en gotas 80 %', nameEn: 'Couverture drops 80 %', pct: '80 %', ing: 'cacao fino de aroma', ingEn: 'fine-aroma cacao', price: 6.20, weight: '200 g',
      photos: ['gotas-80.jpg', 'cob-beans-2.jpg', 'cob-kitchen.jpg'],
      desc: 'Crea obras maestras con chocolate que también transforma vidas y construye dignidad. Perfil profundo, bajo dulzor y alta persistencia aromática, para ganaches, mousses y tabletas técnicas.',
      descEn: 'Create masterpieces with chocolate that also transforms lives and builds dignity. Deep profile, low sweetness and long aromatic persistence, for ganaches, mousses and technical tablets.', sugarFree: false,
      pairs: ['cafe', 'vino', 'fruta'], related: ['gotas100', 'gotas60sa', 'coco', 'mucilago'] },
    gotas100: { cat: 'cobertura', name: 'Cobertura en gotas 100 %', nameEn: 'Couverture drops 100 %', pct: '100 %', ing: 'solo cacao', ingEn: 'cacao only', price: 6.20, weight: '200 g',
      photos: ['gotas-100.jpg', 'cob-beans-3.jpg', 'cob-kitchen.jpg'],
      desc: 'Cacao en estado puro aplicado a la alta cocina: salsas calientes, emulsiones, reducciones y recetas sin azúcar. Chocolate diseñado para quienes convierten técnica en emoción.',
      descEn: 'Cacao in its pure state applied to haute cuisine: hot sauces, emulsions, reductions and sugar-free recipes. Chocolate designed for those who turn technique into emotion.', sugarFree: true,
      pairs: ['agua', 'cafe', 'pan'], related: ['gotas80', 'gotas60sa', 'mucilago', 'nibs'] },
    gotas60sa: { cat: 'cobertura', name: 'Cobertura en gotas 60 % sin azúcar', nameEn: 'Couverture drops 60 % sugar-free', pct: '60 %', ing: 'maltitol + stevia', ingEn: 'maltitol + stevia', price: 6.50, weight: '200 g',
      photos: ['gotas-sinazucar.jpg', 'cob-beans-1.jpg', 'cob-kitchen.jpg'],
      desc: 'El mismo cacao fino de aroma, sin azúcar añadida: endulzada con maltitol y stevia. Para cartas sin azúcar sin renunciar al origen.',
      descEn: 'The same fine-aroma cacao, with no added sugar: sweetened with maltitol and stevia. For sugar-free menus without giving up the origin.', sugarFree: true,
      pairs: ['cafe', 'te', 'fruta'], related: ['sinazucar', 'gotas80', 'gotas100', 'pasion'] },

    /* ---------- Snacks de cacao · 200 g (impreso en la bolsa: EMPAQUE-BITES-*-200G) ---------- */
    almcacao: { cat: 'snack', name: 'Almendra de cacao recubierta de chocolate negro', nameEn: 'Chocolate-coated cacao almonds', pct: '', ing: 'almendra de cacao + chocolate negro', ingEn: 'cacao almond + dark chocolate', price: 6.49, weight: '200 g',
      photos: ['bites-cacao.jpg', 'beans-tray.jpg', 'bars-all.jpg'], desc: '', descEn: '', sugarFree: false,
      pairs: ['cafe', 'vino', 'fruta'], related: ['almcafe', 'nibs', 'crunch', 'mini12'] },
    almcafe: { cat: 'snack', name: 'Almendra de café recubierta de chocolate negro', nameEn: 'Chocolate-coated coffee almonds', pct: '', ing: 'almendra de café + chocolate negro', ingEn: 'coffee almond + dark chocolate', price: 6.49, weight: '200 g',
      photos: ['bites-cafe.jpg', 'beans-tray.jpg', 'bars-all.jpg'], desc: '', descEn: '', sugarFree: false,
      pairs: ['cafe', 'queso', 'fruta'], related: ['almcacao', 'nibs', 'kitcafe', 'mini12'] },
    nibs: { cat: 'snack', name: 'Nibs de cacao cubiertos de chocolate', nameEn: 'Chocolate-coated cacao nibs', pct: '', ing: 'nibs de cacao + chocolate', ingEn: 'cacao nibs + chocolate', price: 6.49, weight: '200 g',
      photos: ['bites-nibs.jpg', 'origen-01.jpg', 'bars-all.jpg'], desc: '', descEn: '', sugarFree: false,
      pairs: ['cafe', 'vino', 'fruta'], related: ['almcacao', 'almcafe', 'crunch', 'mucilago'] },

    /* ---------- Minibarras ---------- */
    mini12: { cat: 'mini', name: 'Pack de 12 minibarras', nameEn: 'Pack of 12 mini bars', pct: '6 sabores', pctEn: '6 flavours', ing: '6 sabores distintos', ingEn: '6 different flavours', price: 9.84, weight: '12 × 10 g',
      photos: ['bars-grid.jpg', 'bars-all.jpg', 'gift-set-1.jpg'],
      desc: 'Pack de 12 minibarras de 10 g – 6 sabores distintos. Para la oficina, el cumpleaños, la cata entre amigos. También en versión corporativa personalizada.',
      descEn: 'Pack of 12 mini bars of 10 g – 6 different flavours. For the office, the birthday, the tasting between friends. Also in a customised corporate version.', sugarFree: false,
      pairs: ['cafe', 'te', 'fruta'], related: ['caja10', 'caja5', 'kitcafe', 'milagro'] },

    /* ---------- Combos / regalos ---------- */
    kitvino: { cat: 'regalo', name: 'Kit de maridaje con vino', nameEn: 'Wine pairing kit', pct: '', ing: '3 barras + guía de maridaje', ingEn: '3 bars + pairing guide', price: 49.00, weight: '',
      photos: ['kit-vino.jpg', 'life-wine-1.jpg', 'bars-all.jpg'],
      desc: 'Para el que toma vino: tres barras elegidas para acompañar una copa. Regala lo correcto: con este regalo apoyas la inclusión laboral de personas con discapacidad.',
      descEn: 'For the one who drinks wine: three bars chosen to pair with a glass. Gift what is right: with this gift you support the labour inclusion of people with disabilities.', sugarFree: false,
      pairs: ['vino', 'queso'], related: ['kitcafe', 'caja10', 'mar', 'milagro'] },
    kitcafe: { cat: 'regalo', name: 'Kit de maridaje con café', nameEn: 'Coffee pairing kit', pct: '', ing: '3 barras + guía de maridaje', ingEn: '3 bars + pairing guide', price: 49.00, weight: '',
      photos: ['kit-cafe.jpg', 'bars-all.jpg', 'hands-mold-1.jpg'],
      desc: 'Para el cafetero: tres barras elegidas para acompañar una taza. Regala lo correcto: con este regalo apoyas la inclusión laboral de personas con discapacidad.',
      descEn: 'For the coffee lover: three bars chosen to pair with a cup. Gift what is right: with this gift you support the labour inclusion of people with disabilities.', sugarFree: false,
      pairs: ['cafe'], related: ['kitvino', 'caja10', 'almcafe', 'panela'] },
    caja10: { cat: 'regalo', name: 'Colección completa · 10 barras', nameEn: 'Complete collection · 10 bars', pct: '55–100 %', ing: 'los diez sabores', ingEn: 'all ten flavours', price: 37.40, weight: '',
      badge: 'Diez sabores', badgeEn: 'Ten flavours',
      photos: ['bars-all.jpg', 'bars-grid.jpg', 'gift-set-1.jpg', 'art-lineup-1.jpg'],
      desc: 'Los diez sabores. Un país en diez barras: Ají, Limón, Panela, Azúcar de Coco, Pasión de la Selva, Mar Exótico, Milagro Tropical, Cacao Crunch, 100 % con Mucílago y Proteína Andina.',
      descEn: 'The ten flavours. A country in ten bars: Ají, Limón, Panela, Coconut Sugar, Pasión de la Selva, Mar Exótico, Milagro Tropical, Cacao Crunch, 100 % with Mucilage and Andean Protein.', sugarFree: false,
      pairs: ['cafe', 'vino', 'queso', 'fruta'], related: ['caja5', 'kitvino', 'kitcafe', 'mini12'] },
    caja5: { cat: 'regalo', name: 'Caja 5 barras a elección', nameEn: 'Box of 5 bars, your choice', pct: '', ing: '5 barras a elección + tarjeta', ingEn: '5 bars of your choice + card', price: 18.50, weight: '', priceNote: true,
      photos: ['gift-set-2.jpg', 'gift-set-1.jpg', 'bars-all.jpg'],
      desc: 'Cinco barras a elección con tarjeta. Escríbenos los sabores por WhatsApp al confirmar el pedido.',
      descEn: 'Five bars of your choice, with a card. Send us the flavours on WhatsApp when confirming the order.', sugarFree: false,
      pairs: ['cafe', 'vino', 'fruta'], related: ['caja10', 'mini12', 'kitvino', 'kitcafe'] }
  };

  /* ---------- Utilidades ---------- */
  var ALT = {
    'bar-': 'Barra Rights ', 'art-': 'Barra Rights con su ingrediente · ', 'bars-all': 'Las diez barras Rights alineadas', 'bars-grid': 'Diez barras Rights en abanico con granos de cacao',
    'hands-mold': 'Manos llenando moldes en la planta Rights', 'board-': 'Barra Rights sobre tabla de madera con granos de cacao', 'life-': 'Barra Rights en la vida diaria',
    'gotas-': 'Bolsa de cobertura Rights en gotas · ', 'cob-': 'Bolsa de cobertura Rights con granos de cacao', 'bites-': 'Snack de cacao Rights · ', 'kit-': 'Kit de maridaje Rights · ',
    'gift-set': 'Caja de regalo Rights con barras y granos de cacao', 'milagro-fruta': 'Barra Milagro Tropical con guanábana', 'beans-tray': 'Granos de cacao tostados', 'origen-': 'Granos de cacao secando'
  };
  function altFor(file, name) { for (var k in ALT) if (file.indexOf(k) === 0) return ALT[k].slice(-2) === '· ' || ALT[k].slice(-1) === ' ' ? ALT[k] + name : ALT[k]; return name; }
  function money(n) { return '$' + n.toFixed(2); }
  function $(s) { return document.getElementById(s); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  /* Escribe ES + data-en; app.js aplica el idioma después */
  function bi(el, es, en) { if (!el) return; el.innerHTML = es; if (en != null && en !== es) el.setAttribute('data-en', en); else el.removeAttribute('data-en'); }
  function chip(es, en, href) { var tag = href ? 'a' : 'span'; return '<' + tag + ' class="chip"' + (href ? ' href="' + href + '"' : '') + (en && en !== es ? ' data-en="' + esc(en) + '"' : '') + '>' + es + '</' + tag + '>'; }

  /* ---------- Idioma inicial (misma regla que app.js) ---------- */
  var q = new URLSearchParams(location.search), stored = null;
  try { stored = localStorage.getItem('rights-lang'); } catch (e) {}
  var lang = q.get('lang') === 'en' ? 'en' : (q.get('lang') === 'es' ? 'es' : (stored === 'en' ? 'en' : 'es'));
  var qs = lang === 'en' ? '?lang=en' : '';

  /* ---------- Producto ---------- */
  var id = q.get('id') || window.PDP_ID; if (!DATA[id]) id = 'milagro';
  var p = DATA[id], cat = CAT[p.cat];
  var t = function (es, en) { return lang === 'en' ? en : es; };

  /* Título del documento (app.js también lee title[data-en]) */
  var titleEl = document.querySelector('title');
  var tEs = p.name + ' — Rights Chocolate', tEn = p.nameEn + ' — Rights Chocolate';
  if (titleEl) { titleEl.textContent = tEs; titleEl.setAttribute('data-en', tEn); titleEl.removeAttribute('data-es'); }
  var md = document.querySelector('meta[name="description"]'); if (md && p.desc) md.setAttribute('content', t(p.desc, p.descEn));
  var ogT = document.querySelector('meta[property="og:title"]'); if (ogT) ogT.setAttribute('content', t(tEs, tEn));
  var ogD = document.querySelector('meta[property="og:description"]'); if (ogD && p.desc) ogD.setAttribute('content', t(p.desc, p.descEn));
  var og = document.querySelector('meta[property="og:image"]'); if (og) og.setAttribute('content', new URL('img/' + p.photos[0], location.href).href);

  /* Migas */
  var crumbCat = $('pdp-crumb-cat'); if (crumbCat) { bi(crumbCat, cat.crumbEs, cat.crumbEn); crumbCat.setAttribute('href', 'chocolates.html' + cat.hash); }
  bi($('pdp-crumb'), p.name, p.nameEn);

  /* ¿El ingrediente ya está dicho en el nombre, en el % o en el chip «sin azúcar añadida»? */
  function ingRedundant(pr) {
    if (!pr.ing) return true;
    var ing = pr.ing.toLowerCase(), nm = pr.name.toLowerCase();
    if (pr.sugarFree && /sin az[úu]car/.test(ing)) return true;
    if (pr.pct && ing.indexOf(pr.pct.toLowerCase()) === 0) return true;
    return ing.split('+').every(function (part) { return nm.indexOf(part.trim()) >= 0; });
  }

  /* Cabecera */
  var dupIng = ingRedundant(p);
  var eyeEs = [cat.es, p.pct, dupIng ? '' : p.ing].filter(Boolean).join(' · '), eyeEn = [cat.en, p.pctEn || p.pct, dupIng ? '' : p.ingEn].filter(Boolean).join(' · ');
  bi($('pdp-eyebrow'), eyeEs, eyeEn);
  bi($('pdp-title'), p.name, p.nameEn);
  var echo = $('pdp-echo');
  if (p.cat === 'barra') bi(echo, 'Hecho bien. Una obra maestra.', 'Done right. A masterpiece.');
  else if (p.cat === 'cobertura') bi(echo, 'El arte en movimiento.', 'Art in motion.');
  else if (p.cat === 'regalo') bi(echo, 'Regala lo correcto.', 'Gift what is right.');
  else bi(echo, 'Hecho bien. Lo correcto sabe extraordinario.', 'Done right. What’s done right, tastes extraordinary.');

  $('pdp-price').textContent = money(p.price);
  var w = $('pdp-weight');
  if (w) {
    if (p.weight) { bi(w, p.weight, p.weight); w.hidden = false; }
    /* El empaque fotografiado dice 2,11 oz. / 60 gr. y el catálogo 50 g: no se publica hasta que Rights confirme */
    else if (p.cat === 'barra') { bi(w, 'Peso ' + PEND, 'Weight ' + PEND); w.hidden = false; }
    else { w.innerHTML = ''; w.removeAttribute('data-en'); w.hidden = true; }
  }
  var note = $('pdp-note');
  if (note && p.priceNote) { bi(note, 'Precio aproximado (suma de 5 barras) ' + PEND, 'Approximate price (sum of 5 bars) ' + PEND); note.hidden = false; }

  /* Chips */
  var chips = [];
  if (p.pct) chips.push(chip(p.pct, p.pctEn || p.pct));
  if (p.ing && !dupIng) chips.push(chip(p.ing, p.ingEn));
  if (p.sugarFree) chips.push(chip('sin azúcar añadida', 'no added sugar'));
  if (p.cat === 'barra') { chips.push(chip('vegano', 'vegan')); chips.push(chip('cacao Nacional', 'Nacional cacao')); }
  $('pdp-chips').innerHTML = chips.join('');

  /* Compra */
  var add = $('pdp-add'); if (add) add.setAttribute('data-add', id);

  /* Descripción (los snacks esperan su texto: no se les presta el de las barras 70 %) */
  bi($('pdp-desc'), p.desc || ('Descripción ' + PEND), p.descEn || ('Description ' + PEND));

  /* Ficha */
  var spec = [];
  function row(kEs, kEn, vEs, vEn) { spec.push('<div><b data-en="' + esc(kEn) + '">' + kEs + '</b><span' + (vEn && vEn !== vEs ? ' data-en="' + esc(vEn) + '"' : '') + '>' + vEs + '</span></div>'); }
  if (p.pct && p.cat !== 'mini') row('Cacao', 'Cacao', p.pct, p.pctEn || p.pct);
  row('Ingrediente', 'Ingredient', p.ing, p.ingEn);
  if (p.weight) row('Peso', 'Weight', p.weight, p.weight);
  row('Origen', 'Origin', ORIGIN_ES, ORIGIN_EN);
  row('Línea', 'Line', cat.crumbEs, cat.crumbEn);
  if (p.sugarFree) row('Sin azúcar añadida', 'No added sugar', 'Sí', 'Yes');
  $('pdp-spec').innerHTML = spec.join('');

  /* Maridajes (en coberturas: aplicaciones profesionales, no copy de barra de consumo) */
  if (p.cat === 'cobertura') {
    bi($('pdp-pairs-title'), 'Aplicaciones', 'Applications');
    $('pdp-pairs').innerHTML = APPS.map(function (a) { return chip(a.es, a.en); }).join('');
    bi($('pdp-pairs-note'), 'Un solo chocolate. Infinitas interpretaciones culinarias.', 'One chocolate. Infinite culinary interpretations.');
  } else {
    $('pdp-pairs').innerHTML = p.pairs.map(function (k) { return chip(P[k].es, P[k].en); }).join('');
  }

  /* Enlace a la página de la línea */
  var more = $('pdp-more');
  if (more) {
    /* El eco ya dice «El arte en movimiento.» / «Regala lo correcto.»: el enlace usa el CTA del sitio actual */
    if (p.cat === 'cobertura') { more.innerHTML = '<a class="link-arrow" href="coberturas.html" data-en="See the couverture catalogue">Ver catálogo de coberturas</a>'; more.hidden = false; }
    else if (p.cat === 'regalo') { more.innerHTML = '<a class="link-arrow" href="regalos.html" data-en="See all the gifts">Ver todos los regalos</a>'; more.hidden = false; }
  }

  /* Badge */
  var badge = $('pdp-badge');
  if (badge) { if (p.badge) { bi(badge, p.badge, p.badgeEn); badge.hidden = false; badge.className = 'badge ' + (id === 'milagro' || id === 'caja10' ? 'badge--gold' : ''); } else badge.hidden = true; }

  /* Galería: foto principal + miniaturas reales */
  var img = $('pdp-img'), thumbs = $('pdp-thumbs');
  function show(i) {
    var f = p.photos[i]; if (!f) return;
    img.style.opacity = '0';
    setTimeout(function () { img.src = 'img/' + f; img.alt = altFor(f, p.name); img.style.opacity = '1'; }, 160);
    Array.prototype.forEach.call(thumbs.children, function (b, j) { b.classList.toggle('is-on', i === j); b.setAttribute('aria-pressed', String(i === j)); });
  }
  img.src = 'img/' + p.photos[0]; img.alt = altFor(p.photos[0], p.name);
  thumbs.innerHTML = p.photos.map(function (f, i) {
    return '<button type="button"' + (i === 0 ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') + ' data-i="' + i + '" aria-label="' + t('Foto ', 'Photo ') + (i + 1) + '"><img src="img/' + f + '" alt="" loading="lazy"></button>';
  }).join('');
  thumbs.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (b) show(parseInt(b.dataset.i, 10)); });

  /* Relacionados: 4 tarjetas .product con fotos reales */
  var rel = p.related.filter(function (k) { return DATA[k] && k !== id; }).slice(0, 4);
  $('pdp-related').innerHTML = rel.map(function (k) {
    /* URL propia por SKU (build.py genera producto-<id>.html): sobrevive al reescrito de enlaces de app.js */
    var r = DATA[k], c = CAT[r.cat], href = 'producto-' + k + '.html' + qs;
    var eEs = [c.es, r.pct, r.ing].filter(Boolean).join(' · '), eEn = [c.en, r.pctEn || r.pct, r.ingEn].filter(Boolean).join(' · ');
    var alt = r.photos[1] ? '<img class="product__alt" src="img/' + r.photos[1] + '" alt="" loading="lazy">' : '';
    var dEs = r.desc || ('Descripción ' + PEND), dEn = r.descEn || ('Description ' + PEND);
    var bd = r.badge ? '<span class="badge' + (k === 'milagro' || k === 'caja10' ? ' badge--gold' : '') + '" data-en="' + esc(r.badgeEn) + '">' + r.badge + '</span>' : '';
    return '<article class="product" data-tags="' + r.cat + (r.sugarFree ? ' sinazucar' : '') + '">' +
      '<a class="product__stage product__stage--photo" href="' + href + '"><img src="img/' + r.photos[0] + '" alt="' + esc(altFor(r.photos[0], r.name)) + '" loading="lazy">' + alt + bd + '</a>' +
      '<div class="product__body"><p class="product__pct" data-en="' + esc(eEn) + '">' + eEs + '</p>' +
      '<h3 class="product__name"><a href="' + href + '"' + (r.nameEn !== r.name ? ' data-en="' + esc(r.nameEn) + '"' : '') + '>' + r.name + '</a></h3>' +
      '<p class="product__desc"' + (dEn !== dEs ? ' data-en="' + esc(dEn) + '"' : '') + '>' + dEs + '</p>' +
      '<div class="product__row"><span class="product__price">' + money(r.price) + (r.weight ? ' <small>' + r.weight + '</small>' : '') + '</span>' +
      '<button class="btn btn--dark btn--sm" type="button" data-add="' + k + '" data-en="Add">Añadir</button></div></div></article>';
  }).join('');

  /* Enlaces internos respetan el idioma inicial (app.js los reescribe también) */
  if (qs) Array.prototype.forEach.call(document.querySelectorAll('a[href^="chocolates.html"],a[href^="inclusion.html"],a[href^="index.html"],a[href^="coberturas.html"],a[href^="regalos.html"]'), function (a) {
    var h = a.getAttribute('href'), hash = h.indexOf('#') >= 0 ? h.slice(h.indexOf('#')) : ''; a.setAttribute('href', h.split('#')[0] + qs + hash);
  });

  /* Schema.org Product */
  var ld = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.name + (p.pct && p.cat === 'barra' ? ' ' + p.pct : ''),
    image: p.photos.map(function (f) { return 'img/' + f; }),
    brand: { '@type': 'Brand', name: 'Rights Chocolate' },
    sku: id,
    offers: { '@type': 'Offer', priceCurrency: 'USD', price: p.price.toFixed(2), availability: 'https://schema.org/InStock', url: 'producto-' + id + '.html' }
  };
  if (p.desc) ld.description = p.desc;
  var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
})();
