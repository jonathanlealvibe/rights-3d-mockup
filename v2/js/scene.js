/* Rights Chocolate — 3D story scene (Three.js)
   Builds a procedural chocolate bar + cacao beans and exposes
   window.RightsScene = { setProgress(p), setActive(bool) } for the scroll driver in main.js.
   Also renders the three small product bars in the shop. */
(function () {
  if (!window.THREE) return;
  var THREE = window.THREE;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function roundedRect(w, h, r) {
    var s = new THREE.Shape();
    var x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  function chocolateMaterial(hex) {
    return new THREE.MeshPhysicalMaterial({
      color: hex, roughness: 0.42, metalness: 0,
      clearcoat: 0.55, clearcoatRoughness: 0.32,
      envMapIntensity: 0.55
    });
  }

  /* Studio environment: a dark room with a warm softbox and a gold strip.
     Gives the clearcoat something to reflect without loading an HDR. */
  function makeEnvironment(renderer) {
    var pmrem = new THREE.PMREMGenerator(renderer);
    var env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
      new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0x2a1408, roughness: 1 })));
    function panel(w, h, hex, k, pos) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.copy(pos); m.lookAt(0, 0, 0); env.add(m);
    }
    panel(12, 7, 0xffd9ad, 2.6, new THREE.Vector3(-6, 12, 10));   // warm softbox, top-left front
    panel(1.4, 16, 0xC9A24A, 3.2, new THREE.Vector3(14, 2, 6));    // gold strip, right
    panel(8, 4, 0xd9b48a, 0.5, new THREE.Vector3(-14, -4, 4));     // faint warm fill, left
    panel(20, 3, 0xe8c9a0, 0.8, new THREE.Vector3(0, -12, 6));     // floor bounce
    var tex = pmrem.fromScene(env, 0.04).texture;
    pmrem.dispose();
    return tex;
  }

  /* Build a bar as two groups (left / right) so it can snap apart. */
  function buildBar(opts) {
    var cols = opts.cols, rows = opts.rows, pitch = opts.pitch, split = opts.split;
    var mat = opts.material;
    var sq = pitch * 0.86;
    var squareGeo = new THREE.ExtrudeGeometry(roundedRect(sq, sq, sq * 0.14), {
      depth: pitch * 0.22, bevelEnabled: true, bevelThickness: pitch * 0.12, bevelSize: pitch * 0.09, bevelSegments: 5, curveSegments: 10
    });
    var capGeo = new THREE.ExtrudeGeometry(roundedRect(sq * 0.5, sq * 0.5, sq * 0.08), {
      depth: pitch * 0.05, bevelEnabled: true, bevelThickness: pitch * 0.04, bevelSize: pitch * 0.04, bevelSegments: 3, curveSegments: 8
    });
    var bar = new THREE.Group();
    var parts = [], squares = [];
    var W = cols * pitch, H = rows * pitch;
    var ranges = [[0, split], [split, cols]];
    ranges.forEach(function (rg) {
      var g = new THREE.Group();
      var c0 = rg[0], c1 = rg[1], n = c1 - c0;
      var slabW = n * pitch, cx = (c0 + n / 2) * pitch - W / 2;
      var slabGeo = new THREE.ExtrudeGeometry(roundedRect(slabW - pitch * 0.06, H - pitch * 0.02, pitch * 0.1), {
        depth: pitch * 0.28, bevelEnabled: true, bevelThickness: pitch * 0.05, bevelSize: pitch * 0.05, bevelSegments: 3, curveSegments: 8
      });
      var slab = new THREE.Mesh(slabGeo, mat);
      slab.position.set(cx, 0, -pitch * 0.33);
      slab.castShadow = false;
      g.add(slab);
      g.userData = { slab: slab, cx: cx, home: new THREE.Vector3(0, 0, 0), sq: [] };
      for (var c = c0; c < c1; c++) for (var r = 0; r < rows; r++) {
        var m = new THREE.Mesh(squareGeo, mat);
        var cap = new THREE.Mesh(capGeo, mat);
        cap.position.z = pitch * 0.22 + pitch * 0.11;
        m.add(cap);
        var home = new THREE.Vector3((c + 0.5) * pitch - W / 2, (r + 0.5) * pitch - H / 2, 0);
        m.position.copy(home);
        var dir = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-0.3, 1)).normalize();
        m.userData = {
          home: home,
          scatter: home.clone().add(dir.multiplyScalar(rand(7, 13))),
          rot: new THREE.Euler(rand(-2.5, 2.5), rand(-2.5, 2.5), rand(-2.5, 2.5)),
          delay: Math.random() * 0.5
        };
        g.add(m); g.userData.sq.push(m); squares.push(m);
      }
      bar.add(g); parts.push(g);
    });
    return { group: bar, parts: parts, squares: squares, width: W, height: H };
  }

  function buildBeans(count, material) {
    var geo = new THREE.SphereGeometry(0.34, 22, 14);
    var g = new THREE.Group();
    for (var i = 0; i < count; i++) {
      var m = new THREE.Mesh(geo, material);
      var s = rand(0.75, 1.25);
      m.scale.set(s, s * 0.66, s * 0.5);
      var r = rand(4.5, 10), th = rand(0, Math.PI * 2), ph = rand(-0.9, 0.9);
      m.userData = { r: r, th: th, ph: ph, spin: rand(0.2, 0.7), off: rand(0, 6.28) };
      m.rotation.set(rand(0, 6.28), rand(0, 6.28), rand(0, 6.28));
      g.add(m);
    }
    return g;
  }

  /* ============ STORY SCENE ============ */
  function initStory() {
    var canvas = document.getElementById('story-canvas');
    if (!canvas) return null;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    var scene = new THREE.Scene();
    scene.environment = makeEnvironment(renderer);
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 17);

    var key = new THREE.DirectionalLight(0xfff0dc, 1.6); key.position.set(-6, 8, 10); scene.add(key);
    var rim = new THREE.DirectionalLight(0xC9A24A, 0.5); rim.position.set(9, -3, 6); scene.add(rim);
    var fill = new THREE.DirectionalLight(0x8fa3c4, 0.25); fill.position.set(-8, -6, 4); scene.add(fill);
    scene.add(new THREE.AmbientLight(0x3a2214, 0.6));

    var choc = chocolateMaterial(0x4a2210);
    var beanMat = new THREE.MeshPhysicalMaterial({ color: 0x5a2e15, roughness: 0.6, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.8 });

    var bar = buildBar({ cols: 5, rows: 3, pitch: 1.55, split: 2, material: choc });
    scene.add(bar.group);
    var beans = buildBeans(reduced ? 0 : 64, beanMat);
    scene.add(beans);

    var portrait = false;
    var mouse = { x: 0, y: 0 }, mouseT = { x: 0, y: 0 };
    window.addEventListener('pointermove', function (e) {
      mouseT.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseT.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
      var w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      portrait = h > w * 1.1;
    }
    window.addEventListener('resize', resize); resize();

    var p = reduced ? 0.55 : 0, target = 0, active = true, t0 = performance.now();

    function update(now) {
      var time = (now - t0) / 1000;
      if (!reduced) p += (target - p) * 0.085;
      mouse.x += (mouseT.x - mouse.x) * 0.05; mouse.y += (mouseT.y - mouse.y) * 0.05;

      /* --- phases --- */
      var assemble = smooth(0.10, 0.44, p);     // squares fly in
      var slabIn = smooth(0.30, 0.46, p);       // slab fades/moves in
      var beanOut = 1 - smooth(0.16, 0.36, p);  // beans dissolve
      var present = smooth(0.44, 0.70, p);      // rotation showcase
      var snap = smooth(0.74, 0.96, p);         // bar breaks
      var glow = Math.sin(Math.PI * smooth(0.40, 0.72, p)); // gold rim peak

      // camera
      var camZ = lerp(19, 13.5, smooth(0, 0.46, p)) - 1.6 * snap + (portrait ? 3.5 : 0);
      camera.position.set(mouse.x * 0.6, -mouse.y * 0.4 + lerp(0.6, -0.3, present), camZ);
      camera.lookAt(0, 0, 0);

      // lights
      rim.intensity = 0.5 + glow * 1.4;
      key.intensity = 1.6 - glow * 0.5;

      // bar orientation
      var g = bar.group;
      g.rotation.z = portrait ? Math.PI / 2 : 0;
      g.rotation.y = lerp(-0.55, 0.35, present) + Math.sin(time * 0.35) * 0.05 + mouse.x * 0.08;
      g.rotation.x = lerp(0.35, -0.12, present) + Math.cos(time * 0.4) * 0.04 - mouse.y * 0.06;
      g.position.y = lerp(-0.4, 0, present) + Math.sin(time * 0.6) * 0.06;
      var xOff = lerp(0, -1.7, smooth(0.14, 0.30, p));
      xOff = lerp(xOff, 1.1, smooth(0.42, 0.56, p));
      xOff = lerp(xOff, 0, smooth(0.72, 0.86, p));
      g.position.x = portrait ? 0 : xOff;

      // squares
      var n = bar.squares.length;
      for (var i = 0; i < n; i++) {
        var m = bar.squares[i], u = m.userData;
        var ta = smooth(0, 1, (assemble - u.delay * 0.35) / 0.65);
        m.position.lerpVectors(u.scatter, u.home, ta);
        m.rotation.set(u.rot.x * (1 - ta), u.rot.y * (1 - ta), u.rot.z * (1 - ta));
        var sc = 0.85 + 0.15 * ta;
        m.scale.setScalar(sc);
      }

      // slabs
      bar.parts.forEach(function (part, idx) {
        var slab = part.userData.slab;
        slab.visible = slabIn > 0.5;
        slab.position.z = -0.51 - (1 - slabIn) * 1.0;
        slab.scale.setScalar(0.9 + 0.1 * slabIn);
        // snap: halves hinge apart
        var dir = idx === 0 ? -1 : 1;
        part.position.x = dir * 1.35 * snap;
        part.position.z = idx === 0 ? -0.6 * snap : 0.5 * snap;
        part.rotation.y = dir * 0.42 * snap;
        part.rotation.z = dir * 0.06 * snap;
      });
      // one square breaks free toward the viewer
      var loose = bar.parts[1].userData.sq[bar.parts[1].userData.sq.length - 1];
      if (snap > 0) {
        loose.position.z += 3.2 * snap;
        loose.position.x += 1.1 * snap;
        loose.position.y += 0.7 * snap;
        loose.rotation.x -= 0.9 * snap; loose.rotation.y += 0.6 * snap;
      }

      // beans
      beans.visible = beanOut > 0.001;
      if (beans.visible) {
        var k = beans.children.length;
        for (var j = 0; j < k; j++) {
          var b = beans.children[j], d = b.userData;
          var rr = d.r * (0.55 + 0.45 * beanOut);
          var th = d.th + time * 0.06 + (1 - beanOut) * 1.4;
          b.position.set(Math.cos(th) * rr, Math.sin(d.ph) * rr * 0.55 + Math.sin(time * 0.5 + d.off) * 0.25, Math.sin(th) * rr * 0.6 - 2);
          b.rotation.x += 0.002 * d.spin; b.rotation.y += 0.003 * d.spin;
          var bs = beanOut * (0.75 + 0.25 * Math.sin(time + d.off));
          b.scale.set(bs, bs * 0.66, bs * 0.5);
        }
      }

      renderer.render(scene, camera);
    }

    var running = false;
    function loop(now) {
      if (!running) return;
      update(now);
      requestAnimationFrame(loop);
    }
    function start() { if (running) return; running = true; requestAnimationFrame(loop); }
    function stop() { running = false; }

    if (reduced) { update(performance.now()); window.addEventListener('resize', function () { update(performance.now()); }); }
    else start();

    return {
      setProgress: function (v) { target = v; },
      setActive: function (v) { active = v; if (reduced) return; if (v) start(); else stop(); },
      getProgress: function () { return p; }
    };
  }

  /* ============ PRODUCT MINI SCENES ============ */
  function initProducts() {
    var canvases = document.querySelectorAll('.product__canvas');
    if (!canvases.length) return;
    var colors = { dark: 0x4a2210, milk: 0x9a5a2c, intense: 0x2a1207 };
    canvases.forEach(function (canvas) {
      var renderer;
      try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); } catch (e) { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      var scene = new THREE.Scene();
      scene.environment = makeEnvironment(renderer);
      var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
      camera.position.set(0, -1.2, 11); camera.lookAt(0, 0, 0);
      var key = new THREE.DirectionalLight(0xfff0dc, 1.4); key.position.set(-5, 8, 8); scene.add(key);
      var rim = new THREE.DirectionalLight(0xC9A24A, 1.2); rim.position.set(7, -2, 5); scene.add(rim);
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      var mat = chocolateMaterial(colors[canvas.dataset.variant] || colors.dark);
      var bar = buildBar({ cols: 3, rows: 4, pitch: 1.2, split: 1, material: mat });
      bar.squares.forEach(function (m) { m.position.copy(m.userData.home); m.rotation.set(0, 0, 0); });
      bar.parts.forEach(function (part) { part.userData.slab.position.z = -0.4; });
      bar.group.rotation.x = -0.35;
      scene.add(bar.group);

      function resize() {
        var w = canvas.clientWidth || 300, h = canvas.clientHeight || 300;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      window.addEventListener('resize', resize); resize();

      var visible = false, hover = false, t0 = performance.now();
      var io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(frame); }, { threshold: 0.05 });
      io.observe(canvas);
      canvas.parentElement.addEventListener('pointerenter', function () { hover = true; });
      canvas.parentElement.addEventListener('pointerleave', function () { hover = false; });

      var ry = 0.5;
      function frame(now) {
        if (!visible) return;
        var t = (now - t0) / 1000;
        var speed = reduced ? 0 : (hover ? 0.9 : 0.25);
        ry += speed * 0.016;
        bar.group.rotation.y = -0.45 + Math.sin(ry) * 0.75;
        bar.group.rotation.x = -0.35 + Math.sin(t * 0.7) * 0.05;
        bar.group.position.y = Math.sin(t * 0.9) * 0.08;
        renderer.render(scene, camera);
        if (!reduced) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  window.RightsScene = initStory();
  initProducts();
})();
