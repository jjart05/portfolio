/**
 * Animated backdrop: a field of rainbow nodes that react to the pointer.
 *
 * Used on the hero and on Selected work. Alpha is capped so type stays
 * readable. Node count scales with the canvas area but is capped, device
 * pixel ratio is clamped to 2, and the loop stops when the canvas is
 * off-screen or the tab is hidden.
 *
 * Exposes window.HeroBackground.start(canvas).
 */
(function () {
  "use strict";

  var LINK_DISTANCE = 118;
  var MAX_NODES = 52;
  var MIN_NODES = 18;
  var AREA_PER_NODE = 22000;

  function start(canvas) {
    if (!canvas || !canvas.getContext) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var ctx = canvas.getContext("2d", { alpha: true });
    var nodes = [];
    var width = 0;
    var height = 0;
    var dpr = 1;
    var frame = null;
    var onScreen = true;
    var pointer = { x: 0.5, y: 0.5, active: false };
    var palette = ["160, 150, 255"];
    var alphas = { dot: 0.32, floor: 0.16, line: 0.06, glow: 0, size: 1, width: 1 };

    var styles = getComputedStyle(document.documentElement);

    function readVar(name, fallback) {
      var raw = styles.getPropertyValue(name).trim();
      return raw || fallback;
    }

    function hexToRgb(hex) {
      var value = String(hex).trim();
      if (value.charAt(0) !== "#") return null;
      if (value.length === 4) {
        value = "#" + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
      }
      if (value.length !== 7) return null;
      var n = parseInt(value.slice(1), 16);
      if (isNaN(n)) return null;
      return ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
    }

    function readPalette() {
      styles = getComputedStyle(document.documentElement);
      var next = [];
      var i;
      for (i = 1; i <= 6; i++) {
        var rgb = hexToRgb(readVar("--hue-" + i, ""));
        if (rgb) next.push(rgb);
      }
      if (!next.length) {
        var line = readVar("--canvas-line", "");
        if (line && line.indexOf(",") !== -1) next.push(line);
        else next.push(hexToRgb(readVar("--accent", "")) || "160, 150, 255");
      }
      return next;
    }

    function readAlphas() {
      styles = getComputedStyle(document.documentElement);
      var light = document.documentElement.getAttribute("data-theme") === "light";
      return light
        ? { dot: 1, floor: 0.68, line: 0.36, glow: 16, size: 1.45, width: 1.2 }
        : { dot: 0.38, floor: 0.18, line: 0.08, glow: 8, size: 1, width: 1 };
    }

    function refreshTheme() {
      palette = readPalette();
      alphas = readAlphas();
    }

    refreshTheme();

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var target = Math.round(width * height / AREA_PER_NODE);
      target = Math.max(MIN_NODES, Math.min(MAX_NODES, target));

      while (nodes.length > target) nodes.pop();
      while (nodes.length < target) nodes.push(spawn());
    }

    function spawn() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.5 + 0.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0005 + Math.random() * 0.001,
        hue: Math.floor(Math.random() * 6),
      };
    }

    function colorOf(node) {
      return palette[node.hue % palette.length];
    }

    function render(now) {
      var time = now || 0;
      ctx.clearRect(0, 0, width, height);

      var px = pointer.active ? (pointer.x - 0.5) * 18 : 0;
      var py = pointer.active ? (pointer.y - 0.5) * 18 : 0;

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;

        var ax = n.x + px * n.r * 0.5;
        var ay = n.y + py * n.r * 0.5;
        var ink = colorOf(n);

        var wave = 0.5 + 0.5 * Math.sin(time * n.speed + n.phase);
        var alpha = alphas.dot * (alphas.floor + (1 - alphas.floor) * wave);

        if (alphas.glow) {
          ctx.shadowBlur = alphas.glow;
          ctx.shadowColor = "rgba(" + ink + ", 0.55)";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(ax, ay, n.r * alphas.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ink + ", " + alpha.toFixed(3) + ")";
        ctx.fill();
        ctx.shadowBlur = 0;

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x;
          var dy = n.y - m.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > LINK_DISTANCE) continue;

          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(m.x + px * m.r * 0.5, m.y + py * m.r * 0.5);
          ctx.strokeStyle = "rgba(" + ink + ", " +
            (alphas.line * (1 - dist / LINK_DISTANCE)).toFixed(3) + ")";
          ctx.lineWidth = alphas.width;
          ctx.stroke();
        }
      }
    }

    function loop(now) {
      render(now);
      frame = window.requestAnimationFrame(loop);
    }

    function play() {
      if (frame === null && onScreen && !document.hidden && !reduceMotion.matches) {
        frame = window.requestAnimationFrame(loop);
      }
    }

    function pause() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    }

    function drawStill() {
      pause();
      if (nodes.length) render(1200);
    }

    resize();
    if (reduceMotion.matches) drawStill();
    else play();

    var resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        if (reduceMotion.matches) drawStill();
      }, 160);
    }, { passive: true });

    window.addEventListener("pointermove", function (e) {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
      pointer.active = true;
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause(); else play();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) play(); else pause();
      }, { threshold: 0 }).observe(canvas);
    }

    if ("MutationObserver" in window) {
      new MutationObserver(function () {
        refreshTheme();
        if (reduceMotion.matches) drawStill();
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    }

    var onMotionChange = function () {
      if (reduceMotion.matches) drawStill();
      else play();
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", onMotionChange);
    else if (reduceMotion.addListener) reduceMotion.addListener(onMotionChange);
  }

  window.HeroBackground = { start: start };
})();
