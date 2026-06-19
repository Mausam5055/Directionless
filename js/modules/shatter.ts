// @ts-nocheck
export class ShatterTrailMulti {
  constructor({
    canvas: t,
    images: e,
    amount: r = 0.5,
    spread: i = 0.1,
    angle: o = 0,
    skew: n = 0,
    pos: s = [0.5, 0.5],
    mixRadius: a = 0.15,
    mixRadiusInvert: l = 0,
    easing: c = 1,
    octaves: u = 2,
    trackMouse: h = 1,
    radiusPx: m = null,
    featherPx: d = 40,
    blobAmpPx: p = 28,
    blobScale: f = 2.2,
    blobDrift: g = 0.03,
    chromAbPx: _ = 2.2,
    trailLength: x = 40,
    trailStrength: v = 0.9,
    trailPower: b = 2,
    follow: S = 18,
    trailStepPx: y = 14,
    maxSubSteps: P = 8,
    speedMaxPxPerSec: A = 1800,
    inertia: w = 0.45,
    fadeDelayMs: T = 250,
    fadeDurationMs: M = 700,
    proxInnerPx: R = 0,
    proxOuterPx: E = 220,
    dprCap: L = 2,
  } = {}) {
    if (!t) throw new Error("ShatterTrailMulti: missing canvas");
    if (!e || !e.length) throw new Error("ShatterTrailMulti: missing images");
    ((this.canvas = t),
      (this.images = Array.from(e)),
      (this.params = {
        amount: r,
        spread: i,
        angle: o,
        skew: n,
        pos: [s[0], s[1]],
        mixRadius: a,
        mixRadiusInvert: l,
        easing: c,
        octaves: u,
        trackMouse: h,
        radiusPx: m,
        featherPx: d,
        blobAmpPx: p,
        blobScale: f,
        blobDrift: g,
        chromAbPx: _,
        trailLength: x,
        trailStrength: v,
        trailPower: b,
        follow: S,
        trailStepPx: y,
        maxSubSteps: P,
        speedMaxPxPerSec: A,
        inertia: w,
        fadeDelayMs: T,
        fadeDurationMs: M,
        proxInnerPx: R,
        proxOuterPx: E,
        dprCap: L,
      }),
      (this.MAX_TRAIL = Math.max(1, Math.min(128, 0 | x || 1))),
      (this._running = !1),
      (this._raf = 0),
      (this._startTime = performance.now()),
      (this._lastTickTime = this._startTime),
      (this._simDtSec = 1 / 60),
      (this._pointer = { x: -9999, y: -9999 }),
      (this._rectsDirty = !0),
      (this._ro = null),
      (this._items = []),
      this._initItems(),
      this._initObservers(),
      (this._mq = window.matchMedia("(min-width: 992px)")),
      (this._enabled = !1),
      (this._onMQChange = (t) => this._applyEnabledState(t.matches)),
      this._mq.addEventListener
        ? this._mq.addEventListener("change", this._onMQChange)
        : this._mq.addListener(this._onMQChange),
      (this.gl = null),
      (this._program = null),
      (this._loc = null),
      (this._vao = null),
      (this._uvBuffer = null),
      (this._posBuffer = null),
      (this._onContextLost = (t) => {
        (t.preventDefault(),
          this._setDomImagesVisible(!0),
          this.stop(),
          (this._glLost = !0));
      }),
      (this._onContextRestored = () => {
        ((this._glLost = !1),
          this._setupGL(),
          this.resize(),
          (this._rectsDirty = !0),
          this.updateRects(),
          this._setDomImagesVisible(!1),
          this.start());
      }),
      this.canvas.addEventListener("webglcontextlost", this._onContextLost, !1),
      this.canvas.addEventListener(
        "webglcontextrestored",
        this._onContextRestored,
        !1,
      ),
      this._bindEvents(),
      this._applyEnabledState(this._mq.matches));
  }
  start() {
    this._enabled &&
      (this._running ||
        ((this._running = !0),
        (this._startTime = performance.now()),
        (this._lastTickTime = this._startTime),
        (this._simDtSec = 1 / 60),
        (this._raf = requestAnimationFrame(this._tick))));
  }
  stop() {
    ((this._running = !1),
      this._raf && cancelAnimationFrame(this._raf),
      (this._raf = 0));
  }
  render() {
    if (!this._enabled) return;
    const t = performance.now(),
      e = Math.min(0.05, Math.max(0.001, (t - this._lastTickTime) / 1e3));
    ((this._lastTickTime = t),
      (this._simDtSec = e),
      this._draw(t, { step: !0, dtSec: e }));
  }
  rerender({ draw: t = !0, resize: e = !1 } = {}) {
    this._enabled &&
      (e && this.resize(),
      this.updateRects(),
      t && this._draw(performance.now(), { step: !1, dtSec: this._simDtSec }));
  }
  invalidateRects() {
    this._rectsDirty = !0;
  }
  set(t = {}) {
    const e = this.params;
    if (
      ("number" == typeof t.amount && (e.amount = t.amount),
      "number" == typeof t.spread && (e.spread = t.spread),
      "number" == typeof t.angle && (e.angle = t.angle),
      "number" == typeof t.skew && (e.skew = t.skew),
      Array.isArray(t.pos) &&
        2 === t.pos.length &&
        (e.pos = [t.pos[0], t.pos[1]]),
      "number" == typeof t.mixRadius && (e.mixRadius = t.mixRadius),
      "number" == typeof t.mixRadiusInvert &&
        (e.mixRadiusInvert = 0 | t.mixRadiusInvert),
      "number" == typeof t.easing && (e.easing = 0 | t.easing),
      "number" == typeof t.octaves && (e.octaves = 0 | t.octaves),
      "number" == typeof t.trackMouse && (e.trackMouse = t.trackMouse),
      ("number" != typeof t.radiusPx && null !== t.radiusPx) ||
        (e.radiusPx = t.radiusPx),
      "number" == typeof t.featherPx && (e.featherPx = t.featherPx),
      "number" == typeof t.blobAmpPx && (e.blobAmpPx = t.blobAmpPx),
      "number" == typeof t.blobScale && (e.blobScale = t.blobScale),
      "number" == typeof t.blobDrift && (e.blobDrift = t.blobDrift),
      "number" == typeof t.chromAbPx && (e.chromAbPx = t.chromAbPx),
      "number" == typeof t.trailStrength && (e.trailStrength = t.trailStrength),
      "number" == typeof t.trailPower && (e.trailPower = t.trailPower),
      "number" == typeof t.follow && (e.follow = t.follow),
      "number" == typeof t.trailStepPx && (e.trailStepPx = t.trailStepPx),
      "number" == typeof t.maxSubSteps && (e.maxSubSteps = 0 | t.maxSubSteps),
      "number" == typeof t.speedMaxPxPerSec &&
        (e.speedMaxPxPerSec = t.speedMaxPxPerSec),
      "number" == typeof t.inertia && (e.inertia = t.inertia),
      "number" == typeof t.fadeDelayMs && (e.fadeDelayMs = t.fadeDelayMs),
      "number" == typeof t.fadeDurationMs &&
        (e.fadeDurationMs = t.fadeDurationMs),
      "number" == typeof t.proxInnerPx && (e.proxInnerPx = t.proxInnerPx),
      "number" == typeof t.proxOuterPx && (e.proxOuterPx = t.proxOuterPx),
      "number" == typeof t.dprCap && (e.dprCap = t.dprCap),
      t.pos)
    )
      for (const t of this._items)
        ((t.basePosPlane.x = e.pos[0]), (t.basePosPlane.y = e.pos[1]));
  }
  destroy() {
    (this.stop(),
      window.removeEventListener("pointermove", this._onPointerMove, {
        passive: !0,
      }),
      window.removeEventListener("pointerleave", this._onPointerLeave, {
        passive: !0,
      }),
      window.removeEventListener("resize", this._onResize, { passive: !0 }),
      window.removeEventListener("scroll", this._onScroll, { passive: !0 }),
      this.canvas.removeEventListener(
        "webglcontextlost",
        this._onContextLost,
        !1,
      ),
      this.canvas.removeEventListener(
        "webglcontextrestored",
        this._onContextRestored,
        !1,
      ),
      this._mq &&
        (this._mq.removeEventListener
          ? this._mq.removeEventListener("change", this._onMQChange)
          : this._mq.removeListener(this._onMQChange)),
      this._ro && this._ro.disconnect(),
      this._destroyGL(),
      this._setDomImagesVisible(!0),
      (this._items = []));
  }
  resize() {
    if (!this._enabled || !this.gl) return;
    const t = this.gl,
      e = Math.min(
        Math.max(1, window.devicePixelRatio || 1),
        this.params.dprCap,
      ),
      r = Math.floor(window.innerWidth * e),
      i = Math.floor(window.innerHeight * e);
    (this.canvas.width === r && this.canvas.height === i) ||
      ((this.canvas.width = r),
      (this.canvas.height = i),
      t.viewport(0, 0, r, i));
  }
  updateRects() {
    for (const t of this._items) t.rect = t.img.getBoundingClientRect();
    this._rectsDirty = !1;
  }
  _applyEnabledState(t) {
    if (t !== this._enabled) {
      if (!t)
        return (
          (this._enabled = !1),
          this.stop(),
          this._setDomImagesVisible(!0),
          void (
            this.gl &&
            (this.gl.clearColor(0, 0, 0, 0),
            this.gl.clear(this.gl.COLOR_BUFFER_BIT))
          )
        );
      ((this._enabled = !0),
        this._setupGL(),
        this.resize(),
        (this._rectsDirty = !0),
        this.updateRects(),
        this.start());
    }
  }
  _setDomImagesVisible(t) {
    for (const e of this._items) e.img.style.opacity = t ? "" : "0";
  }
  _hash01(t) {
    const e = 43758.5453123 * Math.sin(999.123 * (t + 1));
    return e - Math.floor(e);
  }
  _initItems() {
    this._items = this.images.map((t, e) => {
      const r = new Float32Array(2 * this.MAX_TRAIL),
        i = new Float32Array(2 * this.MAX_TRAIL);
      for (let t = 0; t < this.MAX_TRAIL; t++)
        ((r[2 * t + 0] = 0.5), (r[2 * t + 1] = 0.5));
      return {
        img: t,
        safeImg: null,
        safeImgPromise: null,
        safeSrc: "",
        rect: null,
        texture: null,
        texW: 1,
        texH: 1,
        prox: 0,
        targetMouse: { x: 0.5, y: 0.5 },
        currentMouse: { x: 0.5, y: 0.5 },
        uvVel: { x: 0, y: 0 },
        pointerActive: !1,
        fadeOpacity: 0,
        lastMoveTime: performance.now(),
        trail: r,
        trailOrdered: i,
        head: 0,
        basePosPlane: { x: this.params.pos[0], y: this.params.pos[1] },
        basePosCover: { x: 0.5, y: 0.5 },
        seed: this._hash01(e),
        speed01: 0,
      };
    });
  }
  _initObservers() {
    this._ro = new ResizeObserver(() => {
      this._rectsDirty = !0;
    });
    for (const t of this._items) this._ro.observe(t.img);
  }
  _bindEvents() {
    ((this._onPointerMove = (t) => {
      ((this._pointer.x = t.clientX), (this._pointer.y = t.clientY));
    }),
      (this._onPointerLeave = () => {
        ((this._pointer.x = -9999), (this._pointer.y = -9999));
      }),
      (this._onResize = () => {
        this._enabled &&
          (this.resize(),
          (this._rectsDirty = !0),
          this.updateRects(),
          this._draw(performance.now(), { step: !1, dtSec: this._simDtSec }));
      }),
      (this._onScroll = () => {
        this._enabled && (this._rectsDirty = !0);
      }),
      window.addEventListener("pointermove", this._onPointerMove, {
        passive: !0,
      }),
      window.addEventListener("pointerleave", this._onPointerLeave, {
        passive: !0,
      }),
      window.addEventListener("resize", this._onResize, { passive: !0 }),
      window.addEventListener("scroll", this._onScroll, { passive: !0 }),
      (this._tick = (t) => {
        if (!this._running || !this._enabled || !this.gl) return;
        const e = performance.now(),
          r = Math.min(0.05, Math.max(0.001, (e - this._lastTickTime) / 1e3));
        ((this._lastTickTime = e),
          (this._simDtSec = r),
          this._draw(t, { step: !0, dtSec: r }),
          (this._raf = requestAnimationFrame(this._tick)));
      }));
  }
  _setupGL() {
    if (!this.gl || !this._program) {
      if (
        !this.gl &&
        ((this.gl = this.canvas.getContext("webgl2", {
          alpha: !0,
          antialias: !0,
          premultipliedAlpha: !1,
        })),
        !this.gl)
      )
        throw new Error("WebGL2 not supported.");
      this._initGL();
    }
  }
  _destroyGL() {
    if (!this.gl) return;
    const t = this.gl;
    for (const e of this._items)
      (e.texture && t.deleteTexture(e.texture),
        (e.texture = null),
        (e.safeImg = null),
        (e.safeImgPromise = null),
        (e.safeSrc = ""));
    (this._uvBuffer && t.deleteBuffer(this._uvBuffer),
      this._posBuffer && t.deleteBuffer(this._posBuffer),
      this._vao && t.deleteVertexArray(this._vao),
      this._program && t.deleteProgram(this._program),
      (this._uvBuffer = null),
      (this._posBuffer = null),
      (this._vao = null),
      (this._program = null),
      (this._loc = null));
  }
  _initGL() {
    const t = this.gl,
      e =
        "#version 300 es\nprecision highp float;\nin vec2 aPosition;\nin vec2 aUV;\nout vec2 vUv;\nvoid main() {\n  vUv = aUV;\n  gl_Position = vec4(aPosition, 0.0, 1.0);\n}\n",
      r = this._makeFrag(this.MAX_TRAIL);
    ((this._program = this._createProgram(e, r)),
      t.useProgram(this._program),
      t.disable(t.DEPTH_TEST),
      t.enable(t.BLEND),
      t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA),
      (this._loc = {
        aPosition: t.getAttribLocation(this._program, "aPosition"),
        aUV: t.getAttribLocation(this._program, "aUV"),
        uTexture: t.getUniformLocation(this._program, "uTexture"),
        uPlaneSize: t.getUniformLocation(this._program, "uPlaneSize"),
        uTextureSize: t.getUniformLocation(this._program, "uTextureSize"),
        uMousePos: t.getUniformLocation(this._program, "uMousePos"),
        uTrackMouse: t.getUniformLocation(this._program, "uTrackMouse"),
        uAmount: t.getUniformLocation(this._program, "uAmount"),
        uSpread: t.getUniformLocation(this._program, "uSpread"),
        uAngle: t.getUniformLocation(this._program, "uAngle"),
        uTime: t.getUniformLocation(this._program, "uTime"),
        uSkew: t.getUniformLocation(this._program, "uSkew"),
        uPos: t.getUniformLocation(this._program, "uPos"),
        uMixRadiusInvert: t.getUniformLocation(
          this._program,
          "uMixRadiusInvert",
        ),
        uEasing: t.getUniformLocation(this._program, "uEasing"),
        uOctaves: t.getUniformLocation(this._program, "uOctaves"),
        uRadiusPx: t.getUniformLocation(this._program, "uRadiusPx"),
        uFeatherPx: t.getUniformLocation(this._program, "uFeatherPx"),
        uBlobAmpPx: t.getUniformLocation(this._program, "uBlobAmpPx"),
        uBlobScale: t.getUniformLocation(this._program, "uBlobScale"),
        uBlobDrift: t.getUniformLocation(this._program, "uBlobDrift"),
        uSeed: t.getUniformLocation(this._program, "uSeed"),
        uChromAbPx: t.getUniformLocation(this._program, "uChromAbPx"),
        uSpeed: t.getUniformLocation(this._program, "uSpeed"),
        uOpacity: t.getUniformLocation(this._program, "uOpacity"),
        uTrail0: t.getUniformLocation(this._program, "uTrail[0]"),
        uTrailStrength: t.getUniformLocation(this._program, "uTrailStrength"),
        uTrailPower: t.getUniformLocation(this._program, "uTrailPower"),
      }),
      (this._vao = t.createVertexArray()),
      t.bindVertexArray(this._vao),
      (this._uvBuffer = t.createBuffer()),
      t.bindBuffer(t.ARRAY_BUFFER, this._uvBuffer),
      t.bufferData(
        t.ARRAY_BUFFER,
        new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
        t.STATIC_DRAW,
      ),
      t.enableVertexAttribArray(this._loc.aUV),
      t.vertexAttribPointer(this._loc.aUV, 2, t.FLOAT, !1, 0, 0),
      (this._posBuffer = t.createBuffer()),
      t.bindBuffer(t.ARRAY_BUFFER, this._posBuffer),
      t.bufferData(t.ARRAY_BUFFER, 48, t.DYNAMIC_DRAW),
      t.enableVertexAttribArray(this._loc.aPosition),
      t.vertexAttribPointer(this._loc.aPosition, 2, t.FLOAT, !1, 0, 0),
      t.bindVertexArray(null),
      t.bindBuffer(t.ARRAY_BUFFER, null),
      t.uniform1i(this._loc.uTexture, 0));
  }
  _loadCorsImage(t) {
    return new Promise((e, r) => {
      const i = new Image();
      ((i.crossOrigin = "anonymous"),
        (i.decoding = "async"),
        (i.onload = () => e(i)),
        (i.onerror = () => r(new Error("CORS image load failed: " + t))),
        (i.src = t));
    });
  }
  _ensureTexturesReady() {
    if (!this.gl) return;
    const t = this.gl;
    for (const e of this._items) {
      if (e.texture) continue;
      const r = e.img,
        i = r.currentSrc || r.src;
      if (
        i &&
        (e.safeSrc &&
          e.safeSrc !== i &&
          (e.texture && (t.deleteTexture(e.texture), (e.texture = null)),
          (e.safeImg = null),
          (e.safeImgPromise = null),
          (e.safeSrc = "")),
        e.safeImgPromise ||
          ((e.safeSrc = i),
          (e.safeImgPromise = this._loadCorsImage(i)
            .then((t) => {
              ((e.safeImg = t),
                (e.texW = t.naturalWidth || 1),
                (e.texH = t.naturalHeight || 1));
            })
            .catch(() => {
              ((e.safeImgPromise = null), (e.safeImg = null), (e.safeSrc = ""));
            }))),
        e.safeImg && e.safeImg.complete && e.safeImg.naturalWidth > 0)
      )
        try {
          ((e.texture = this._createTextureFromImage(e.safeImg)),
            (r.style.opacity = "0"));
        } catch (t) {
          ((e.safeImg = null), (e.safeImgPromise = null), (e.safeSrc = ""));
        }
    }
  }
  _draw(t, { step: e = !0, dtSec: r = 1 / 60 } = {}) {
    if (!this._enabled || !this.gl || !this._program) return;
    const i = this.gl,
      o = this.params;
    (this.resize(),
      this._ensureTexturesReady(),
      this._rectsDirty && this.updateRects());
    const n = performance.now();
    (this._updatePointerForItems(n),
      i.clearColor(0, 0, 0, 0),
      i.clear(i.COLOR_BUFFER_BIT),
      i.useProgram(this._program),
      i.bindVertexArray(this._vao));
    const s = (t - this._startTime) / 1e3;
    (i.uniform1f(this._loc.uTime, s),
      i.uniform1f(this._loc.uAmount, o.amount),
      i.uniform1f(this._loc.uSpread, o.spread),
      i.uniform1f(this._loc.uAngle, o.angle),
      i.uniform1f(this._loc.uSkew, o.skew),
      i.uniform1i(this._loc.uOctaves, 0 | o.octaves),
      i.uniform1i(this._loc.uEasing, 0 | o.easing),
      i.uniform1i(this._loc.uMixRadiusInvert, 0 | o.mixRadiusInvert),
      i.uniform1f(this._loc.uTrackMouse, o.trackMouse),
      i.uniform1f(this._loc.uTrailStrength, o.trailStrength),
      i.uniform1f(this._loc.uTrailPower, o.trailPower),
      i.uniform1f(this._loc.uBlobAmpPx, o.blobAmpPx),
      i.uniform1f(this._loc.uBlobScale, o.blobScale),
      i.uniform1f(this._loc.uBlobDrift, o.blobDrift),
      i.uniform1f(this._loc.uChromAbPx, o.chromAbPx));
    const a = Math.min(window.innerWidth, window.innerHeight),
      l = "number" == typeof o.radiusPx ? o.radiusPx : o.mixRadius * a;
    (i.uniform1f(this._loc.uRadiusPx, l),
      i.uniform1f(this._loc.uFeatherPx, o.featherPx));
    for (const t of this._items) {
      if (!t.texture || !t.rect) continue;
      if (t.rect.bottom <= 0 || t.rect.top >= window.innerHeight) continue;
      if (t.rect.right <= 0 || t.rect.left >= window.innerWidth) continue;
      e && this._stepHoverPhysics(t, n, r);
      const o = Math.max(1, t.rect.width),
        s = Math.max(1, t.rect.height);
      {
        const [e, r] = this._coverUvCPU(
          this._clamp01(t.basePosPlane.x),
          this._clamp01(t.basePosPlane.y),
          t.texW,
          t.texH,
          o,
          s,
        );
        ((t.basePosCover.x = e), (t.basePosCover.y = r));
      }
      const [a, l] = this._coverUvCPU(
        t.currentMouse.x,
        t.currentMouse.y,
        t.texW,
        t.texH,
        o,
        s,
      );
      (e
        ? (this._pushTrailSegment(t, a, l, o, s, r),
          this._orderTrailNewestToOldest(t))
        : (t.trailOrdered && t.trailOrdered.length === 2 * this.MAX_TRAIL) ||
          ((t.trailOrdered = new Float32Array(2 * this.MAX_TRAIL)),
          this._orderTrailNewestToOldest(t)),
        i.uniform2f(this._loc.uPlaneSize, o, s),
        i.uniform2f(this._loc.uTextureSize, t.texW, t.texH),
        i.uniform2f(this._loc.uPos, t.basePosCover.x, t.basePosCover.y),
        i.uniform2f(this._loc.uMousePos, a, l),
        i.uniform1f(this._loc.uSeed, t.seed),
        i.uniform1f(this._loc.uSpeed, t.speed01));
      const c = this._clamp01(t.fadeOpacity * t.prox);
      (i.uniform1f(this._loc.uOpacity, c),
        i.uniform2fv(this._loc.uTrail0, t.trailOrdered),
        i.activeTexture(i.TEXTURE0),
        i.bindTexture(i.TEXTURE_2D, t.texture),
        i.uniform1i(this._loc.uTexture, 0));
      const u = this._rectToClipSpaceQuad(t.rect);
      (i.bindBuffer(i.ARRAY_BUFFER, this._posBuffer),
        i.bufferData(i.ARRAY_BUFFER, u, i.DYNAMIC_DRAW),
        i.drawArrays(i.TRIANGLES, 0, 6));
    }
    i.bindVertexArray(null);
  }
  _updatePointerForItems(t) {
    const e = this.params,
      r = this._pointer.x,
      i = this._pointer.y;
    for (const o of this._items) {
      const n = o.rect;
      if (!n) continue;
      const s =
        -9999 === r
          ? 0
          : this._proximityToRect(r, i, n, e.proxInnerPx, e.proxOuterPx);
      o.prox = this._clamp01(s);
      const a = (r - n.left) / Math.max(1, n.width),
        l = (i - n.top) / Math.max(1, n.height);
      ((o.targetMouse.x = this._clamp01(a)),
        (o.targetMouse.y = this._clamp01(1 - l)));
      const c = o.pointerActive;
      ((o.pointerActive = o.prox > 0),
        o.pointerActive
          ? ((o.lastMoveTime = t), (o.fadeOpacity = 1))
          : c && (o.lastMoveTime = t));
    }
  }
  _stepHoverPhysics(t, e, r) {
    const i = this.params,
      o = t.currentMouse.x,
      n = t.currentMouse.y,
      s = 1 - Math.exp(-i.follow * r);
    if (t.pointerActive) {
      const e = o + (t.targetMouse.x - o) * s,
        i = n + (t.targetMouse.y - n) * s;
      ((t.uvVel.x = (e - o) / r),
        (t.uvVel.y = (i - n) / r),
        (t.currentMouse.x = e),
        (t.currentMouse.y = i),
        (t.fadeOpacity = 1));
    } else {
      ((t.uvVel.x *= Math.pow(i.inertia, 60 * r)),
        (t.uvVel.y *= Math.pow(i.inertia, 60 * r)),
        (t.currentMouse.x += t.uvVel.x * r),
        (t.currentMouse.y += t.uvVel.y * r));
      const o = e - t.lastMoveTime;
      if (o > i.fadeDelayMs) {
        const e = Math.min(
          1,
          (o - i.fadeDelayMs) / Math.max(1, i.fadeDurationMs),
        );
        t.fadeOpacity = Math.max(0, 1 - e);
      }
    }
    ((t.currentMouse.x = this._clamp01(t.currentMouse.x)),
      (t.currentMouse.y = this._clamp01(t.currentMouse.y)));
  }
  _pushTrailPoint(t, e, r) {
    t.head = (t.head + 1) % this.MAX_TRAIL;
    const i = 2 * t.head;
    ((t.trail[i + 0] = e), (t.trail[i + 1] = r));
  }
  _pushTrailSegment(t, e, r, i, o, n) {
    const s = this.params,
      a = 2 * t.head,
      l = t.trail[a + 0],
      c = t.trail[a + 1],
      u = (e - l) * i,
      h = (r - c) * o,
      m = Math.sqrt(u * u + h * h),
      d = m / Math.max(1e-4, n),
      p = this._clamp01(d / Math.max(1, s.speedMaxPxPerSec));
    t.speed01 = t.speed01 + (p - t.speed01) * (1 - Math.exp(-12 * n));
    const f = Math.max(2, s.trailStepPx),
      g = Math.max(0, 0 | s.maxSubSteps);
    if (m <= f || 0 === g) return void this._pushTrailPoint(t, e, r);
    const _ = Math.min(g, Math.floor(m / f)) + 1;
    for (let i = 1; i <= _; i++) {
      const o = i / _,
        n = l + (e - l) * o,
        s = c + (r - c) * o;
      this._pushTrailPoint(t, n, s);
    }
  }
  _orderTrailNewestToOldest(t) {
    for (let e = 0; e < this.MAX_TRAIL; e++) {
      const r = (t.head - e + this.MAX_TRAIL) % this.MAX_TRAIL;
      ((t.trailOrdered[2 * e + 0] = t.trail[2 * r + 0]),
        (t.trailOrdered[2 * e + 1] = t.trail[2 * r + 1]));
    }
  }
  _compileShader(t, e) {
    const r = this.gl,
      i = r.createShader(t);
    if (
      (r.shaderSource(i, e),
      r.compileShader(i),
      !r.getShaderParameter(i, r.COMPILE_STATUS))
    ) {
      const t = r.getShaderInfoLog(i);
      throw (r.deleteShader(i), new Error(t || "Shader compile failed."));
    }
    return i;
  }
  _createProgram(t, e) {
    const r = this.gl,
      i = this._compileShader(r.VERTEX_SHADER, t),
      o = this._compileShader(r.FRAGMENT_SHADER, e),
      n = r.createProgram();
    if (
      (r.attachShader(n, i),
      r.attachShader(n, o),
      r.linkProgram(n),
      r.deleteShader(i),
      r.deleteShader(o),
      !r.getProgramParameter(n, r.LINK_STATUS))
    ) {
      const t = r.getProgramInfoLog(n);
      throw (r.deleteProgram(n), new Error(t || "Program link failed."));
    }
    return n;
  }
  _createTextureFromImage(t) {
    const e = this.gl,
      r = e.createTexture();
    return (
      e.bindTexture(e.TEXTURE_2D, r),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
      e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR),
      e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0),
      e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t),
      e.bindTexture(e.TEXTURE_2D, null),
      r
    );
  }
  _clamp01(t) {
    return Math.min(1, Math.max(0, t));
  }
  _smoothstep(t, e, r) {
    const i = this._clamp01((r - t) / (e - t));
    return i * i * (3 - 2 * i);
  }
  _proximityToRect(t, e, r, i, o) {
    const n = t < r.left ? r.left - t : t > r.right ? t - r.right : 0,
      s = e < r.top ? r.top - e : e > r.bottom ? e - r.bottom : 0,
      a = Math.sqrt(n * n + s * s);
    return 1 - this._smoothstep(i, o, a);
  }
  _coverUvCPU(t, e, r, i, o, n) {
    const s = r / Math.max(1, i),
      a = o / Math.max(1, n);
    let l = 1,
      c = 1;
    a > s ? ((l = a / s), (c = 1)) : ((l = 1), (c = s / a));
    const u = (t - 0.5) * l + 0.5,
      h = (e - 0.5) * c + 0.5;
    return [this._clamp01(u), this._clamp01(h)];
  }
  _rectToClipSpaceQuad(t) {
    const e = window.innerWidth,
      r = window.innerHeight,
      i = (t.left / e) * 2 - 1,
      o = ((t.left + t.width) / e) * 2 - 1,
      n = 1 - (t.top / r) * 2,
      s = 1 - ((t.top + t.height) / r) * 2;
    return new Float32Array([i, s, o, s, i, n, i, n, o, s, o, n]);
  }
  _makeFrag(t) {
    return `#version 300 es\nprecision highp float;\n\nin vec2 vUv;\nuniform sampler2D uTexture;\n\nuniform vec2  uPlaneSize;\nuniform vec2  uTextureSize;\n\nuniform vec2  uMousePos;\nuniform float uTrackMouse;\n\nuniform float uAmount;\nuniform float uSpread;\nuniform float uAngle;\nuniform float uTime;\nuniform float uSkew;\nuniform vec2  uPos;\n\nuniform int   uMixRadiusInvert;\nuniform int   uEasing;\nuniform int   uOctaves;\n\nuniform float uRadiusPx;\nuniform float uFeatherPx;\nuniform float uBlobAmpPx;\nuniform float uBlobScale;\nuniform float uBlobDrift;\nuniform float uSeed;\n\nuniform float uChromAbPx;\nuniform float uSpeed;\n\nuniform float uOpacity;\nuniform vec2  uTrail[${t}];\nuniform float uTrailStrength;\nuniform float uTrailPower;\n\nout vec4 fragColor;\n\nconst float PI = 3.14159265359;\n\nmat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }\n\nvec2 coverUv(vec2 uv, vec2 srcSize, vec2 dstSize) {\n  float srcAspect = srcSize.x / max(1.0, srcSize.y);\n  float dstAspect = dstSize.x / max(1.0, dstSize.y);\n\n  vec2 scale = (dstAspect > srcAspect)\n    ? vec2(dstAspect / srcAspect, 1.0)\n    : vec2(1.0, srcAspect / dstAspect);\n\n  vec2 outUv = (uv - 0.5) * scale + 0.5;\n  return clamp(outUv, 0.0, 1.0);\n}\n\nfloat ease(int mode, float t) {\n  t = clamp(t, 0.0, 1.0);\n  if (mode == 1) return t * t * (3.0 - 2.0 * t);\n  if (mode == 2) return (t < 0.5) ? (2.0*t*t) : (1.0 - pow(-2.0*t + 2.0, 2.0) / 2.0);\n  return t;\n}\n\n// shard noise\nvec2 random2(vec2 p) {\n  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),\n                        dot(p, vec2(269.5, 183.3)))) * 43758.5453);\n}\n\nvec2 voronoidNoise(vec2 st) {\n  vec2 i_st = floor(st);\n  vec2 f_st = fract(st);\n\n  float m_dist = 15.0;\n  vec2 m_point = vec2(0.0);\n\n  for (int j = -1; j <= 1; j++) {\n    for (int i = -1; i <= 1; i++) {\n      vec2 neighbor = vec2(float(i), float(j));\n      vec2 point = random2(i_st + neighbor);\n      point = 0.5 + 0.5 * sin(5.0 + uTime * 0.2 + 6.2831 * point);\n\n      vec2 diff = neighbor + point - f_st;\n      float dist = length(diff);\n\n      if (dist < m_dist) {\n        m_dist = dist;\n        m_point = point;\n      }\n    }\n  }\n  return m_point;\n}\n\nvec2 voronoiFBM(vec2 st) {\n  vec2 value = vec2(0.0);\n  vec2 shift = vec2(100.0);\n  float xp = sqrt(2.0);\n  mat2 r = rot(0.5);\n\n  for (int i = 0; i < 8; i++) {\n    if (i >= uOctaves) break;\n    value += voronoidNoise(st);\n    st = st * xp + shift;\n    st = r * st;\n  }\n  return value / float(max(uOctaves, 1));\n}\n\n// blob noise (value fbm)\nfloat hash21(vec2 p) {\n  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);\n}\n\nfloat noise2(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f*f*(3.0-2.0*f);\n\n  float a = hash21(i);\n  float b = hash21(i + vec2(1.0, 0.0));\n  float c = hash21(i + vec2(0.0, 1.0));\n  float d = hash21(i + vec2(1.0, 1.0));\n\n  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n}\n\nfloat fbm(vec2 p) {\n  float v = 0.0;\n  float a = 0.5;\n  for (int i = 0; i < 4; i++) {\n    v += a * noise2(p);\n    p = p * 2.0 + 17.0;\n    a *= 0.5;\n  }\n  return v;\n}\n\nfloat maskAtPx(vec2 uv, vec2 center, float radiusPx, float featherPx) {\n  vec2 dp = (uv - center) * uPlaneSize;\n  float d = length(dp);\n\n  vec2 seedv = vec2(uSeed * 10.0, uSeed * 17.0);\n  float drift = uTime * uBlobDrift;\n  float n = fbm(uv * (uBlobScale * 2.0) + seedv + vec2(drift));\n  d += (n - 0.5) * uBlobAmpPx;\n\n  float m = 1.0 - smoothstep(radiusPx, radiusPx + featherPx, d);\n  m = ease(uEasing, m);\n\n  if (uMixRadiusInvert == 1) m = max(0.0, 0.5 - m);\n  return m;\n}\n\nvoid main() {\n  vec2 uv = coverUv(vUv, uTextureSize, uPlaneSize);\n\n  float aspectRatio = uPlaneSize.x / max(1.0, uPlaneSize.y);\n  vec2 skewVec = mix(vec2(1.0), vec2(1.0, 0.0), uSkew);\n\n  vec2 st = (uv - uPos) * vec2(aspectRatio, 1.0) * 50.0 * uAmount;\n  st = (rot(uAngle * 2.0 * PI) * st) * skewVec;\n\n  vec2 m_point = voronoiFBM(st);\n  vec2 offset = (m_point * 0.4 * uSpread) - (uSpread * 0.2);\n\n  vec2 center = mix(uPos, uMousePos, uTrackMouse);\n\n  float distAcc = maskAtPx(uv, center, uRadiusPx, uFeatherPx);\n\n  for (int i = 0; i < ${t}; i++) {\n    float t = 1.0 - float(i) / float(${t});\n    t = pow(t, uTrailPower);\n    if (t > 0.01) {\n      float r = mix(uRadiusPx * 0.65, uRadiusPx, t);\n      float f = mix(uFeatherPx * 0.8, uFeatherPx, t);\n      float m = maskAtPx(uv, uTrail[i], r, f);\n      distAcc += m * t * uTrailStrength;\n    }\n  }\n\n  distAcc = clamp(distAcc, 0.0, 1.0) * uOpacity;\n\n  vec2 baseUv = uv + offset * distAcc;\n\n  float minDim = max(1.0, min(uPlaneSize.x, uPlaneSize.y));\n\n  // stronger CA: boosted by distAcc and speed\n  float sp = clamp(uSpeed, 0.0, 1.0);\n  float ca = (uChromAbPx / minDim) * distAcc * (0.75 + 2.25 * sp) * (1.0 + 1.5 * distAcc);\n\n  vec2 dir = normalize(offset + vec2(1e-6));\n  vec2 ortho = vec2(-dir.y, dir.x);\n\n  // clearer RGB split: add a small orthogonal component\n  vec2 dR = (dir + ortho * 0.55) * ca;\n  vec2 dB = (dir - ortho * 0.55) * ca;\n\n  vec2 uvR = clamp(baseUv + dR, 0.0, 1.0);\n  vec2 uvG = clamp(baseUv, 0.0, 1.0);\n  vec2 uvB = clamp(baseUv - dB, 0.0, 1.0);\n\n  vec4 gS = texture(uTexture, uvG);\n  float rC = texture(uTexture, uvR).r;\n  float bC = texture(uTexture, uvB).b;\n\n  fragColor = vec4(rC, gS.g, bC, gS.a);\n}\n`;
  }
}
const canvas = document.querySelector("[data-shatter-canvas]"),
  imgs = document.querySelectorAll("[data-shatter-image]");
if (!canvas || !imgs.length) throw Error("no shader resources present");
export const fx = new ShatterTrailMulti({
  canvas: canvas,
  images: imgs,
  amount: 0.24,
  spread: 0.32,
  mixRadius: 0.08,
  featherPx: 45,
  blobAmpPx: 26,
  blobScale: 3.1,
  blobDrift: 1,
  chromAbPx: 2,
  trailLength: 25,
  trailStrength: 0.9,
  trailPower: 2,
  follow: 9,
  trailStepPx: 14,
  maxSubSteps: 8,
  speedMaxPxPerSec: 1800,
  inertia: 1,
});
((window.fx = fx),
  "scrollRestoration" in history && (history.scrollRestoration = "manual"),
  gsap.registerPlugin(CustomEase, SplitText));