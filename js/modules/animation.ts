// @ts-nocheck
import { fx } from './shatter.js';
import { initClockSVG } from './clock.js';
export class AnimationController {
  constructor() {
    ((this._raf = 0),
      (this.locomotive = null),
      this._bindEvents(),
      (this.fx = fx),
      (this.rerenderShader = () => fx.rerender({ draw: !1 })));
  }
  init() {
    this.runCheckThemeSection();
    const t = new Lenis({ touchMultiplier: 0 });
    (t.on("scroll", ScrollTrigger.update),
      gsap.ticker.add((e) => {
        t.raf(1e3 * e);
      }),
      gsap.ticker.lagSmoothing(0),
      ScrollTrigger.defaults({
        invalidateOnRefresh: !0,
        immediateRender: !1,
        anticipatePin: 1,
      }),
      this.fx.start(),
      this.runLoaderAnimation(),
      this.runScrollAnimations(),
      this.runConstantAnimations());
  }
  runLoaderAnimation() {
    const t = document.querySelector("[data-load-bg]"),
      e = document.querySelector("[data-load-container]"),
      r = document.querySelector("[data-load-logo]");
    (CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99"),
      gsap
        .timeline({ defaults: { ease: "loader" } })
        .to(r, { clipPath: "inset(0% 0% 0% 0%)", duration: 3 })
        .to(e, { autoAlpha: 0, duration: 0.5 })
        .add("hideContent")
        .to(t, { yPercent: -101, duration: 1 }, "hideContent")
        .add(this.runHeroAnimation(), ">-0.5"));
  }
  runHeroAnimation() {
    function t(t) {
      if (!t) return null;
      const e = t.trim().replace(/'/g, '"');
      try {
        return JSON.parse(e);
      } catch (t) {
        return null;
      }
    }
    function e(t, e, r) {
      const i = t.clientWidth,
        o = t.clientHeight,
        n = i - e.offsetWidth,
        s = o - e.offsetHeight;
      switch (r) {
        case 1:
        default:
          return { x: 0, y: 0 };
        case 2:
          return { x: n, y: 0 };
        case 3:
          return { x: 0, y: s };
        case 4:
          return { x: n, y: s };
      }
    }
    function r(r) {
      const i = Array.from(r.querySelectorAll(".hero-top_text-wrap"));
      if (!i.length) return null;
      const o = t(r.dataset.anim);
      if (!o || !Array.isArray(o) || !o.length) return null;
      const n = gsap.timeline(),
        s = o[0];
      i.forEach((t, i) => {
        const o = s?.[i];
        null != o && gsap.set(t, e(r, t, o));
      });
      for (let t = 1; t < o.length; t++) {
        const s = o[t];
        i.forEach((t, i) => {
          const o = s?.[i];
          null != o && n.to(t, e(r, t, o), 0 === i ? ">" : "<");
        });
      }
      return n;
    }
    function i() {
      const t = document.querySelector(".hero-top_text-wrapper"),
        e = document.querySelector(".hero-top_text-wrapper-end"),
        r = gsap.utils.toArray(t.querySelectorAll("[data-hero-text-item]")),
        i = gsap.utils.toArray(e.querySelectorAll(".hero-top_text-endwrap"));
      (gsap.killTweensOf(r), gsap.set(r, { autoAlpha: 1 }));
      const n = Flip.getState(r);
      return (
        r.forEach((t, e) => i[e].appendChild(t)),
        Flip.from(n, {
          duration: o,
          ease: "expo.inOut",
          absolute: !0,
          nested: !0,
          stagger: 0.03,
        })
      );
    }
    const o = 0.5,
      n = gsap.utils.toArray("[data-hero-text-block]"),
      s = gsap.timeline({ delay: 0.1 });
    (n.forEach((t, e) => {
      const i = r(t);
      if (!i) return;
      const o = parseFloat(t.dataset.stagger) || 0.08;
      s.add(i, e * o);
    }),
      s.add(() => i(), ">-0.2"),
      s.to(
        ".hero-top_text-block",
        { height: 1, duration: o, ease: "expo.inOut" },
        "<",
      ));
    const a = document.querySelector(".hero-layout_inner"),
      l = gsap.utils.toArray(a.querySelectorAll("[data-illustration-overlay]"));
    return (
      s.to(
        l,
        {
          yPercent: 100,
          duration: () => gsap.utils.random(0.5, 1),
          ease: "expo.inOut",
          delay: 0,
          stagger: 0,
        },
        "<",
      ),
      s
    );
  }
  runScrollAnimations() {
    (this.runDeliriousFaceAnimation(),
      this.runInitPixelTransition(),
      this.runShiftSection(),
      this.runPathScroll(),
      this.runPeaceSection(),
      this.runTryingSection(),
      this.runSpiralScroll(),
      this.runStickyTitleScroll());
  }
  runConstantAnimations() {
    (Array.from(document.querySelectorAll("[data-animation-bop]")).forEach(
      (t) => {
        const e = t.dataset.animationBop || 4;
        gsap.to(t, {
          y: -Math.max(8 * e, 24),
          duration: e,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: !0,
          delay: 0.5 * Math.random(),
          onUpdate: this.rerenderShader,
        });
      },
    ),
      document.querySelectorAll('[data-split="heading"]').forEach((t) => {
        gsap.set(t, { autoAlpha: 1 });
        const e = t.getAttribute("data-split-style") || "words",
          r = gsap.timeline({
            markers: !0,
            scrollTrigger: {
              trigger: t,
              start: "top 85%",
              end: "bottom 45%",
              scrub: 1,
              once: !0,
            },
          });
        SplitText.create(t, {
          type: "lines" === e ? "lines" : `lines, ${e}`,
          autoSplit: !0,
          reduceWhiteSpace: !1,
          mask: "lines",
          onSplit: (t) => (
            gsap.set(t[e], { yPercent: 110, autoAlpha: 0 }),
            r.to(
              t[e],
              {
                duration: 0.8,
                yPercent: 0,
                autoAlpha: 1,
                stagger: 0.1,
                ease: "expo.out",
              },
              "<",
            ),
            {}
          ),
        });
      }));
  }
  resize() {
    (this.runCheckThemeSection(), ScrollTrigger.refresh(!0));
  }
  runCheckThemeSection() {
    const t = document.body,
      e = Array.from(document.querySelectorAll("[data-theme-section]")),
      r = 0.95 * window.innerHeight;
    let i = null;
    for (const t of e) {
      const e = t.getBoundingClientRect();
      if (e.top <= r && e.bottom >= r) {
        i = t.getAttribute("data-theme-section");
        break;
      }
    }
    i && t.getAttribute("data-theme") !== i && t.setAttribute("data-theme", i);
  }
  runDeliriousFaceAnimation() {
    const t = document.querySelector("[data-delirious-face]"),
      e = document.querySelector("[data-delirious-wrapper]"),
      r = Array.from(document.querySelectorAll("[data-delirious-texts] img"));
    if (!r.length || !t || !e) return gsap.timeline();
    const i = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        pin: !0,
        trigger: e,
        start: "top top",
        end: () =>
          `+${window.innerHeight * (window.innerWidth > 1024 ? 4 : 5)}px`,
        scrub: 1,
      },
    });
    return (
      i.to(t, { opacity: 1, duration: 0.3 }),
      r.forEach((t) => {
        (i.to(t, { opacity: 1, ease: "expo.inOut", duration: 1 }),
          i.to(t, { opacity: 0.1, ease: "expo.inOut", duration: 1 }));
      }),
      i.add(this.runDripBars(), ">+1"),
      i
    );
  }
  runDripBars() {
    const t = document.querySelector("[data-drip-bars]"),
      e = document.querySelector(".dark-text_wrapper");
    let r = [],
      i = 0;
    const o = gsap.timeline({ defaults: { ease: "none" } }),
      n = [1.5, 1.2, 2.5, 2, 0.2, 1.6, 1.4, 1.9, 1.1, 1.2, 2.4, 2.1],
      s = ["drip-cap--rounded", "drip-cap--flat", "drip-cap--pointy"],
      a = [1, 0, 1, 1, 2, 1, 0, 1, 2, 1, 0, 2],
      l = 2,
      c = window.innerWidth >= 1024 ? 12 : window.innerWidth >= 768 ? 6 : 3;
    if (c !== i) {
      (r.forEach((t) => gsap.killTweensOf(t)), (t.innerHTML = ""), o.clear());
      for (let e = 0; e < c; e++) {
        const i = document.createElement("div");
        ((i.className = `drip-bar ${s[a[e]]}`), t.appendChild(i), r.push(i));
        const c = n[e] ?? 0,
          u = c > 1 && c < 2 ? 1.2 * c : c >= 2 ? 1 : l;
        (o.set(i, { height: 0 }, 0),
          o.to(i, { height: "120vh", duration: u, delay: c }, 0));
      }
      return (
        (i = c),
        requestAnimationFrame(() => ScrollTrigger.refresh()),
        gsap.to(t, {
          opacity: 0,
          ease: "none",
          duration: 1,
          scrollTrigger: {
            trigger: e,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }),
        o
      );
    }
  }
  runInitPixelTransition() {
    const t = document.querySelector(".pixel-transition-padding"),
      e = document.querySelector("[data-pixel-transition]"),
      r = document.querySelector("[data-pixel-transition-wrapper]"),
      i = getComputedStyle(e)
        .getPropertyValue("grid-template-columns")
        .trim()
        .split(/\s+/).length,
      o = Math.ceil(window.innerWidth / i),
      n = Math.ceil(window.innerHeight / o) + 2,
      s = i * n;
    ((e.style.gridTemplateRows = `repeat(${n}, ${o}px)`), (e.innerHTML = ""));
    for (let t = 0; t < s; t++) {
      const t = document.createElement("div");
      ((t.className = "pixel-transition-block"), e.appendChild(t));
    }
    const a = Array.from(e.querySelectorAll(".pixel-transition-block"));
    gsap.set(a, { autoAlpha: 0 });
    const l = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: r,
        start: "bottom bottom",
        end: () => "+=" + 1.2 * window.innerHeight,
        scrub: 1,
        pin: !0,
      },
    });
    return (
      l.to(a, { autoAlpha: 1, stagger: { amount: 1, from: "random" } }, 0),
      gsap.to(e, {
        scrollTrigger: { trigger: t, start: "top top", scrub: 1 },
        opacity: 0,
        duration: 0.1,
      }),
      l
    );
  }
  runShiftSection() {
    initClockSVG();
    const t = document.querySelectorAll("[data-shift-text-block]"),
      e = document.querySelector("[data-shift-section]"),
      r = gsap.timeline({
        scrollTrigger: {
          trigger: e,
          start: "top top",
          end: () => "+=" + 2 * window.innerHeight,
          scrub: 1,
          pin: !0,
        },
      });
    return (
      t.forEach((t) => {
        r.to(
          t,
          {
            backgroundColor: "transparent",
            duration: 1.2,
            ease: "power4.inOut",
          },
          "<+0.2",
        );
      }),
      r
    );
  }
  runPathScroll(t = 0, e = "100%") {
    const r = document.querySelector("[data-svg-wrapper]"),
      i = document.querySelector("[data-svg-path]"),
      o = document.querySelector(".light-layout"),
      n = document.querySelector(".care-section");
    (gsap.set(i, { drawSVG: t }), this._updateSvgMetrics(r, i, o));
    const s = () => this._updateSvgMetrics(r, i, o);
    ScrollTrigger.addEventListener("refreshInit", s);
    const a = gsap.timeline({
      defaults: { ease: "linear" },
      scrollTrigger: {
        trigger: n,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onRefresh: s,
      },
    });
    return (a.fromTo(i, { drawSVG: t }, { drawSVG: e }), a);
  }
  runPeaceSection() {
    const t = document.querySelector(".peace-layout"),
      e = document.querySelectorAll("[data-peace-inner]"),
      r = 0.12,
      i = 0.5;
    gsap.set(e, { scale: 1 });
    const o = gsap.timeline({
      ease: "none",
      scrollTrigger: {
        trigger: t,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: this.rerenderShader,
      },
    });
    return (
      e.forEach((t, e) => {
        const n = 1 - e * r,
          s = Math.max(i, n);
        o.to(t, { scale: s }, "<");
      }),
      o
    );
  }
  runTryingSection() {
    const t = document.querySelector(".trying-section"),
      e = document.querySelectorAll(".trying-word");
    gsap.set(e, { visibility: "hidden" });
    const r = gsap.timeline({
      ease: "none",
      scrollTrigger: {
        trigger: t,
        start: "top top",
        end: () => "+=" + 2 * window.innerHeight,
        scrub: !0,
        pin: !0,
        pinSpacing: !0,
      },
    });
    return (
      e.forEach((t) => {
        r.to(t, { visibility: "visible" });
      }),
      r
    );
  }
  runSpiralScroll() {
    const t = document.querySelector(".time-clock_layout"),
      e = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: t,
          start: "top 100%",
          end: () => "+=" + 3 * window.innerHeight,
          scrub: 1,
        },
      });
    return (
      e.to(".trying-section", { opacity: 0, ease: "expo.inOut" }),
      e.to(
        "#spiral-group",
        { rotation: 45, ease: "expo.inOut", transformOrigin: "center center" },
        "<",
      ),
      e.to(
        ".clock-segment",
        { opacity: 1, scale: 1, y: 100, stagger: { amount: 2, from: "start" } },
        "<",
      ),
      e.to(
        ".clock-segment",
        {
          opacity: 0,
          scale: 0.5,
          y: 150,
          stagger: { amount: 2, from: "start" },
        },
        "<+=1.5",
      ),
      document.querySelectorAll('[data-split="custom"]').forEach((t) => {
        gsap.set(t, { autoAlpha: 1 });
        const e = gsap.timeline({
          markers: !0,
          scrollTrigger: {
            trigger: t,
            start: "top 85%",
            end: () => "+=" + 1.2 * window.innerHeight,
            scrub: 1,
          },
        });
        SplitText.create(t, {
          type: "lines, words",
          autoSplit: !0,
          reduceWhiteSpace: !1,
          mask: "lines",
          onSplit: (t) => (
            gsap.set(t.words, { yPercent: 110 }),
            e.to(
              t.words,
              { duration: 0.8, yPercent: 0, stagger: 0.1, ease: "expo.out" },
              "<",
            ),
            {}
          ),
        });
      }),
      e.to(".time-clock_layout", { opacity: 0.4, duration: 1 }, ">"),
      e
    );
  }
  runStickyTitleScroll() {
    document.querySelectorAll('[data-sticky-title="wrap"]').forEach((t) => {
      const e = Array.from(t.querySelectorAll('[data-sticky-title="heading"]')),
        r = gsap.timeline({
          scrollTrigger: {
            trigger: t,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }),
        i = 0.7,
        o = 0.7,
        n = 0.15;
      e.forEach((t, s) => {
        t.setAttribute("aria-label", t.textContent);
        const a = new SplitText(t, { type: "words,chars" });
        (a.words.forEach((t) => t.setAttribute("aria-hidden", "true")),
          gsap.set(t, { visibility: "visible" }),
          gsap.set(a.chars, { autoAlpha: 0 }));
        const l = gsap.timeline();
        (l.to(a.chars, {
          autoAlpha: 1,
          duration: i,
          stagger: { amount: i, from: "start" },
          ease: "none",
        }),
          s < e.length - 1 &&
            l.to(
              a.chars,
              {
                autoAlpha: 0,
                duration: o,
                stagger: { amount: o, from: "end" },
                ease: "none",
              },
              ">+1",
            ),
          r.add(l, 0 === s ? 0 : `-=${n}`));
      });
    });
  }
  _fitViewBoxToPath(t, e, r = 20) {
    const i = e.getBBox(),
      o = (parseFloat(getComputedStyle(e).strokeWidth) || 0) / 2 + r,
      n = i.x - o,
      s = i.y - o,
      a = i.width + 2 * o,
      l = i.height + 2 * o;
    t.setAttribute("viewBox", `${n} ${s} ${a} ${l}`);
  }
  _updateSvgMetrics(t, e, r) {
    ((t.style.overflow = "visible"),
      t.setAttribute("preserveAspectRatio", "none"));
    const i = r.getBoundingClientRect();
    ((t.style.width = `${i.width}px`),
      (t.style.height = `${i.height + window.innerHeight}px`),
      this._fitViewBoxToPath(t, e, 40));
  }
  _bindEvents() {
    this._onScroll = () => this.runCheckThemeSection();
    const t = (t, e) => {
      let r;
      return (...i) => {
        const o = this;
        (clearTimeout(r), (r = setTimeout(() => t.apply(o, i), e)));
      };
    };
    ((this._onResize = t(() => this.resize(), 150)),
      window.addEventListener("scroll", this._onScroll, { passive: !0 }),
      window.addEventListener("resize", this._onResize));
  }
}


