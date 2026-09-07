/* Rights v3 — página de producto: llena la plantilla según ?id= */
(function () {
  var D = {
    n60: { title: 'Nacional 60 %', eyebrow: 'Nacional · Noroccidente · 50 g', price: '$3.90', badge: 'Premiada', award: 'Premiada — concurso y año [DATO RIGHTS]', variant: 'milk', conch: '36 h', ingr: 'Cacao Nacional, azúcar de caña, leche entera en polvo, manteca de cacao. Sin gluten.',
      axes: [3.5, 2, 1], chips: ['Banano maduro', 'Miel', 'Floral (jazmín)'], npf: 'floral · banano y miel · dulce, largo', pairs: ['Café con leche', 'Frutas tropicales', 'Vino espumante'], legacy: true },
    n70: { title: 'Nacional 70 %', eyebrow: 'Nacional · Noroccidente · 50 g', price: '$3.90', badge: 'Premiada · lote 09', award: 'Premiada — Ecuador Cacao & Chocolate Awards · año [DATO RIGHTS]', variant: 'dark', conch: '48 h', ingr: 'Cacao Nacional, azúcar de caña, manteca de cacao. Vegano, sin gluten.',
      axes: [3, 3, 2], chips: ['Frutos rojos', 'Caramelo', 'Nuez'], npf: 'floral y frutos rojos · caramelo y nuez · equilibrado, largo', pairs: ['Café de Loja', 'Ron añejo', 'Queso fresco'], legacy: true },
    n80: { title: 'Nacional 80 %', eyebrow: 'Nacional · Noroccidente · 50 g', price: '$3.90', badge: 'Premiada', award: 'Premiada — Ecuador Cacao & Chocolate Awards · año [DATO RIGHTS]', variant: 'intense', conch: '60 h', ingr: 'Cacao Nacional, azúcar de caña, manteca de cacao. Vegano, sin gluten.',
      axes: [2, 4, 3], chips: ['Cítrico', 'Café', 'Madera'], npf: 'cítrico · café y madera · seco, limpio', pairs: ['Espresso', 'Whisky de malta', 'Nueces tostadas'], legacy: true },
    n100: { title: 'Nacional 100 %', eyebrow: 'Nacional · Noroccidente · 50 g · sin azúcar', price: '$4.20', badge: '', award: '', variant: 'intense', conch: '72 h', ingr: 'Cacao Nacional, manteca de cacao. Sin azúcar, vegano, sin gluten.',
      axes: [1, 5, 4], chips: ['Tierra húmeda', 'Tabaco', 'Especias'], npf: 'tierra húmeda · tabaco y especias · intenso, sin amargor áspero', pairs: ['Agua mineral', 'Ron blanco', 'Higos'], legacy: false },
    sal: { title: 'Sal de Salinas 70 %', eyebrow: 'Sabor andino · Noroccidente + Bolívar · 50 g', price: '$4.50', badge: 'Premiada', award: 'Premiada — concurso y año [DATO RIGHTS]', variant: 'dark', conch: '48 h', ingr: 'Cacao Nacional, azúcar de caña, manteca de cacao, sal de Salinas de Guaranda. Vegano, sin gluten.',
      axes: [3, 3, 2], chips: ['Caramelo', 'Sal', 'Nuez'], npf: 'caramelo · sal y nuez · salado, limpio', pairs: ['Cerveza negra', 'Queso maduro', 'Café filtrado'], legacy: false },
    cafe: { title: 'Café de Loja 65 %', eyebrow: 'Sabor andino · Noroccidente + Loja · 50 g', price: '$4.50', badge: '', award: '', variant: 'milk', conch: '40 h', ingr: 'Cacao Nacional, azúcar de caña, café de Loja, manteca de cacao. Vegano, sin gluten.',
      axes: [2, 3, 4], chips: ['Café', 'Caramelo', 'Especias'], npf: 'café · caramelo y especias · tostado, medio', pairs: ['Espresso', 'Brandy', 'Cardamomo'], legacy: false },
    vuelo: { title: 'Vuelo de cata', eyebrow: 'Degustación · 4 × 25 g · guía impresa', price: '$19.00', badge: 'Empieza aquí', award: '', variant: 'dark', conch: '36–72 h', ingr: 'Cuatro barras de 25 g: Nacional 60, 70, 80 y 100 %. Guía de cata de 8 páginas.',
      axes: [3, 3, 3], chips: ['Los cuatro porcentajes', 'Guía incluida', 'Regalo listo'], npf: 'de dulce y floral a tierra y tabaco, en cuatro pasos', pairs: ['Una noche', 'Cuatro personas', 'Café de Loja'], legacy: false, weight: '4 × 25 g · IVA incluido' },
    lote: { title: 'Lote 09 · Nacional 70 %', eyebrow: 'Lote numerado · 100 g · 300 unidades', price: '$30.00', badge: '300 unidades · firmada', award: 'Del mismo lote premiado [DATO RIGHTS]', variant: 'dark', conch: '48 h', ingr: 'Cacao Nacional, azúcar de caña, manteca de cacao. Faja numerada y firmada por el maestro que la templó.',
      axes: [3, 3, 2], chips: ['Frutos rojos', 'Caramelo', 'Nuez'], npf: 'floral y frutos rojos · caramelo y nuez · equilibrado, largo', pairs: ['Ron añejo', 'Una ocasión', 'Nadie más'], legacy: false, weight: '100 g · IVA incluido' }
  };
  var EN = { 'Banano maduro': 'Ripe banana', 'Miel': 'Honey', 'Floral (jazmín)': 'Floral (jasmine)', 'Frutos rojos': 'Red berries', 'Caramelo': 'Caramel', 'Nuez': 'Nutty', 'Cítrico': 'Citrus', 'Café': 'Coffee', 'Madera': 'Woody', 'Tierra húmeda': 'Wet earth', 'Tabaco': 'Tobacco', 'Especias': 'Spice', 'Sal': 'Salt', 'Frutal': 'Fruity', 'Tostado': 'Roast' };
  var id = new URLSearchParams(location.search).get('id'); if (!D[id]) id = 'n70';
  var p = D[id];
  function set(f, v) { document.querySelectorAll('[data-f="' + f + '"]').forEach(function (el) { el.innerHTML = v; }); }
  set('crumb', p.title); set('title', p.title); set('eyebrow', p.eyebrow); set('price', p.price); set('conch', p.conch); set('ingr', p.ingr); set('npf', p.npf);
  set('weight', p.weight || '50 g · IVA incluido');
  set('badge', p.badge); if (!p.badge) document.querySelector('[data-f="badge"]').style.display = 'none';
  set('award', p.award); if (!p.award) document.querySelector('[data-f="award"]').style.display = 'none';
  if (!p.legacy) document.querySelector('[data-f="legacy"]').style.display = 'none';
  document.title = p.title + ' — Rights Chocolate';
  var add = document.getElementById('pdp-add'); add.setAttribute('data-add', id);
  var canvas = document.getElementById('pdp-canvas'); canvas.dataset.variant = p.variant;
  // notas
  var axes = ['Frutal', 'Cacao', 'Tostado'], tn = document.getElementById('pdp-tnotes');
  tn.innerHTML = axes.map(function (a, i) { return '<div class="tnote"><span data-en="' + (EN[a] || a) + '">' + a + '</span><i><b style="--w:' + (p.axes[i] / 5 * 100) + '%"></b></i><span>' + p.axes[i] + '/5</span></div>'; }).join('');
  setTimeout(function () { tn.classList.add('is-in'); }, 300);
  document.getElementById('pdp-chips').innerHTML = p.chips.map(function (c) { return '<span class="chip" data-en="' + (EN[c] || c) + '">' + c + '</span>'; }).join('');
  document.getElementById('pdp-pairs').innerHTML = p.pairs.map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');
  // rueda de sabor (SVG, sin librería)
  var svg = document.getElementById('pdp-wheel'), C = 2 * Math.PI, r = [80, 62, 44], cols = ['#C9A24A', '#4A2616', '#8a6c2a'], labels = axes;
  var out = '';
  p.axes.forEach(function (v, i) {
    var circ = C * r[i], pct = v / 5;
    out += '<circle cx="100" cy="100" r="' + r[i] + '" fill="none" stroke="rgba(36,24,18,.1)" stroke-width="10"/>';
    out += '<circle cx="100" cy="100" r="' + r[i] + '" fill="none" stroke="' + cols[i] + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + (circ * pct) + ' ' + circ + '" transform="rotate(-90 100 100)"><animate attributeName="stroke-dasharray" from="0 ' + circ + '" to="' + (circ * pct) + ' ' + circ + '" dur="1.2s" fill="freeze"/></circle>';
  });
  var pct = (p.title.match(/(\d+)\s*%/) || [])[1];
  out += '<text x="100" y="107" text-anchor="middle" font-family="Fraunces,serif" font-size="22" fill="#241812">' + (pct ? pct + '%' : 'Rights') + '</text>';
  svg.innerHTML = out;
  // relacionados
  var order = ['n60', 'n70', 'n80', 'n100', 'sal', 'cafe', 'vuelo', 'lote'].filter(function (k) { return k !== id; }).slice(0, 4);
  document.getElementById('pdp-related').innerHTML = order.map(function (k) {
    var q = D[k], stage = (k === 'vuelo') ? '<div class="boxart"><i></i><i></i><i></i></div>' : '<canvas class="product__canvas" data-variant="' + q.variant + '" aria-hidden="true"></canvas>';
    return '<article class="product"><a class="product__stage" href="producto.html?id=' + k + '">' + stage + (q.badge ? '<span class="badge badge--gold">' + q.badge + '</span>' : '') + '</a><div class="product__body"><p class="product__pct">' + q.eyebrow + '</p><h3 class="product__name"><a href="producto.html?id=' + k + '">' + q.title + '</a></h3><div class="product__notes">' + q.chips.slice(0, 3).map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('') + '</div><div class="product__row"><span class="product__price">' + q.price + '</span><button class="btn btn--dark btn--sm" type="button" data-add="' + k + '">Añadir</button></div></div></article>';
  }).join('');
})();
