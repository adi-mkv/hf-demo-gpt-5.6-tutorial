window.__timelines = window.__timelines || {};
(function () {
  var world = document.getElementById("world");
  var bg = document.getElementById("bg");
  var cam = { cx: 900, cy: 1400, s: 1.0, rot: 0, bx: -430, by: 170, bs: 1.45 };

  function camT(cx, cy, s, rot) {
    return "translate(540px,960px) rotate(" + rot + "deg) scale(" + s + ") translate(" + (-cx) + "px," + (-cy) + "px)";
  }
  function applyCam() {
    world.style.transform = camT(cam.cx, cam.cy, cam.s, cam.rot);
    bg.style.transform = "translate(" + cam.bx + "px," + cam.by + "px) scale(" + cam.bs + ")";
  }

  var cv = document.getElementById("swarm");
  var ctx = cv.getContext("2d");
  var CW = 1180, CH = 1180, CX = 590, CY = 590;
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var rnd = mulberry32(20260528);
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var eOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  var logoTargets = [];
  var logoImg = new Image();
  logoImg.src = "assets/chatgpt-logo-cropped.png";
  function buildLogoTargets() {
    var off = document.createElement("canvas");
    off.width = 520; off.height = 520;
    var octx = off.getContext("2d");
    octx.clearRect(0, 0, 520, 520);
    octx.drawImage(logoImg, 80, 80, 360, 360);
    var data = octx.getImageData(0, 0, 520, 520).data;
    var candidates = [];
    for (var y = 0; y < 520; y += 5) {
      for (var x = 0; x < 520; x += 5) {
        var a = data[(y * 520 + x) * 4 + 3];
        var r = data[(y * 520 + x) * 4];
        if (a > 80 && r < 210) candidates.push({ x: CX - 260 + x, y: CY - 260 + y });
      }
    }
    logoTargets = [];
    for (var i = 0; i < 430; i++) {
      logoTargets.push(candidates.length ? candidates[Math.floor((i / 430) * candidates.length)] : { x: CX, y: CY });
    }
  }
  logoImg.onload = buildLogoTargets;
  var pts = [];
  for (var i = 0; i < 430; i++) {
    var a = rnd() * Math.PI * 2;
    var rad = Math.sqrt(rnd());
    pts.push({ wx: CX + Math.cos(a) * rad * 500 * (0.5 + 0.5 * rnd()), wy: CY + Math.sin(a) * rad * 470 * (0.5 + 0.5 * rnd()), ph: rnd() * 6.28, amp: 8 + rnd() * 10, sz: 2.2 + rnd() * 2.6, ord: rnd(), ord2: 0 });
  }
  pts.map(function (p, i) { return i; }).sort(function (a, b) { return pts[a].ord - pts[b].ord; }).forEach(function (pi, r) { pts[pi].ord2 = r / (pts.length - 1); });
  function drawSwarm(t) {
    ctx.clearRect(0, 0, CW, CH);
    if (t < 13.5 || t > 24.0) return;
    if (!logoTargets.length && logoImg.complete) buildLogoTargets();
    var conv = ease(clamp01((t - 17.2) / 2.0));
    var logoReveal = clamp01((t - 19.1) / 0.9);
    var planFade = 1 - clamp01((t - 14.1) / 0.5);
    if (planFade > 0.01) {
      ctx.fillStyle = "rgba(17,17,17," + (0.75 * planFade) + ")";
      ctx.beginPath(); ctx.arc(CX, CY, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(17,17,17," + (0.35 * planFade) + ")";
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(CX, CY, 22 + 8 * Math.sin(t * 2.2), 0, Math.PI * 2); ctx.stroke();
    }
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var emit = 14.1 + p.ord2 * 1.6;
      var fan = clamp01((t - emit) / 0.7);
      if (fan <= 0) continue;
      var fe = eOut(fan);
      var bx = lerp(CX, p.wx, fe);
      var by = lerp(CY, p.wy, fe);
      var jit = (1 - conv) * (fan >= 1 ? 1 : 0);
      bx += Math.sin(t * 1.7 + p.ph) * p.amp * jit;
      by += Math.cos(t * 1.45 + p.ph) * p.amp * 0.8 * jit;
      var target = logoTargets[i] || { x: CX, y: CY };
      var x = lerp(bx, target.x, conv);
      var y = lerp(by, target.y, conv);
      if (fan < 1 && conv < 0.02) {
        ctx.strokeStyle = "rgba(17,17,17," + (0.11 * (1 - fan)) + ")";
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(x, y); ctx.stroke();
      }
      var pulse = 0.6 + 0.4 * Math.sin(t * 3.0 + p.ph);
      var alpha = (0.55 + 0.32 * pulse) * (1 - 0.62 * conv) * (1 - logoReveal);
      ctx.fillStyle = "rgba(17,17,17," + alpha + ")";
      ctx.beginPath(); ctx.arc(x, y, p.sz * lerp(1, 0.75, conv), 0, Math.PI * 2); ctx.fill();
    }
  }

  function splitSoftText(el) {
    function splitNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var frag = document.createDocumentFragment();
        Array.from(node.textContent).forEach(function (ch) {
          if (ch === " ") {
            frag.appendChild(document.createTextNode(" "));
          } else {
            var span = document.createElement("span");
            span.className = "soft-char";
            span.textContent = ch;
            frag.appendChild(span);
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else {
        Array.from(node.childNodes).forEach(splitNode);
      }
    }
    splitNode(el);
  }

  function prepareSceneText() {
    splitSoftText(document.querySelector("#s1 .label"));
    splitSoftText(document.querySelector("#s1 .sub"));
    splitSoftText(document.querySelector("#s3 .headline"));
    splitSoftText(document.querySelector("#s5 .end-title"));
    splitSoftText(document.querySelector("#s5 .end-url"));
    document.querySelectorAll("#s2 .phrase").forEach(splitSoftText);
  }

  function setInitialStates() {
    gsap.set("#s1", { opacity: 0, scale: 0.9 });
    gsap.set("#s1 .pill-inner", { opacity: 0, scale: 0.96 });
    gsap.set("#s1 .model", { opacity: 0, x: -22, filter: "blur(8px)" });
    gsap.set("#s1 .label .soft-char, #s1 .sub .soft-char, #s2 .phrase .soft-char, #s3 .headline .soft-char, #s5 .end-copy .soft-char", { opacity: 0, y: 16, filter: "blur(12px)" });
    gsap.set("#s1 .verroll", { y: 0 });
    gsap.set("#open-mark-small", { opacity: 0, scale: 0.72, rotate: -12 });
    gsap.set(".phrase", { opacity: 1, y: 0, scale: 1 });
    gsap.set(["#s3", ".metric"], { opacity: 0, y: 36 });
    gsap.set("#s4", { opacity: 0, y: 46, scale: 0.96 });
    gsap.set("#s5", { opacity: 1 });
    gsap.set("#open-mark-large", { opacity: 0, scale: 1, rotate: 0 });
  }

  function animateIntro(tl) {
    tl.to(cam, { cx: 880, cy: 1400, s: 1.0, rot: 0, bx: -430, by: 170, bs: 1.45, duration: 2.8, ease: "power2.out" }, 0);
    tl.to("#s1", { opacity: 1, scale: 1, duration: 0.85, ease: "back.out(1.45)" }, 0.35);
    tl.to("#s1 .pill-inner", { opacity: 1, scale: 1, duration: 0.85, ease: "back.out(1.45)" }, 0.85);
    tl.to("#s1 .model", { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.85, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 0.85);
    tl.to("#s1 .label .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 0.55);
    tl.to("#s1 .sub .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 1.55);
    tl.to("#s1 .verroll", { y: -590, duration: 1.35, ease: "power4.inOut" }, 0.6);
  }

  function animatePrinciples(tl) {
    tl.to(cam, { cx: 2300, cy: 1120, s: 0.94, rot: 3.2, bx: -980, by: -50, bs: 1.58, duration: 1.6, ease: "power3.inOut" }, 3.05);
    tl.to("#open-mark-small", { opacity: 1, scale: 1, rotate: 0, duration: 0.65, ease: "back.out(1.7)" }, 3.7);
    tl.to("#p1 .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 4.25);
    tl.to("#p2 .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 4.5);
    tl.to("#p3 .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 4.75);
    tl.to(".phrase", { y: -16, duration: 2.3, ease: "sine.inOut", yoyo: true, repeat: 1 }, 5.55);
  }

  function animateBaseline(tl) {
    tl.to(cam, { cx: 3600, cy: 1570, s: 0.82, rot: -3, bx: -1510, by: -250, bs: 1.52, duration: 1.5, ease: "power3.inOut" }, 6.65);
    tl.to("#s3", { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 7.25);
    tl.to("#s3 .headline .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 7.45);
    tl.to(".metric", { opacity: 1, y: 0, duration: 0.55, stagger: 0.18, ease: "power2.out" }, 7.85);
    tl.to(".rule", { width: "100%", duration: 0.9, stagger: 0.12, ease: "power2.out" }, 8.22);
  }

  function animateTerminal(tl) {
    tl.to(cam, { cx: 4930, cy: 1260, s: 0.88, rot: 0, bx: -1720, by: -500, bs: 1.85, duration: 1.45, ease: "power3.inOut" }, 10.5);
    tl.to("#s4", { opacity: 1, y: 0, scale: 1, duration: 0.68, ease: "power3.out" }, 11.05);
    document.querySelectorAll("#s4 .ln").forEach(function (el, i) {
      tl.to(el, { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }, 11.5 + i * 0.45);
    });
  }

  function animateLogoSwarm(tl) {
    tl.to(cam, { cx: 5890, cy: 2160, s: 0.72, rot: 5.2, bx: -1850, by: -740, bs: 1.9, duration: 1.7, ease: "power3.inOut" }, 13.5);
    tl.to("#s4", { opacity: 0, duration: 0.65, ease: "power2.in" }, 13.5);
    tl.to(cam, { rot: -3.2, bx: -1760, by: -1000, duration: 1.55, ease: "power2.inOut" }, 15.75);
    tl.to("#open-mark-large", { opacity: 1, duration: 0.9, ease: "power2.out" }, 19.1);
    tl.to(cam, { cx: 5890, cy: 2160, s: 0.92, rot: 0, bx: -1680, by: -1040, bs: 1.9, duration: 0.9, ease: "power2.out" }, 19.1);
    tl.to("#s5 .end-title .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 20.45);
    tl.to("#s5 .end-url .soft-char", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.025, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }, 20.95);
    tl.to(cam, { s: 0.92, rot: 0.45, bx: -1620, by: -1080, duration: 2.1, ease: "sine.inOut" }, 21.55);
    tl.to("#viewport", { opacity: 0, duration: 0.8, ease: "power2.in" }, 24.4);
  }

  prepareSceneText();
  setInitialStates();

  var tl = gsap.timeline({ paused: true, onUpdate: function () { applyCam(); drawSwarm(tl.time()); } });
  animateIntro(tl);
  animatePrinciples(tl);
  animateBaseline(tl);
  animateTerminal(tl);
  animateLogoSwarm(tl);

  applyCam();
  drawSwarm(0);
  window.__timelines.master = tl;
})();
