export default function() {

        "use strict";
        window.tram = (function (t) {
          function e(t, e) {
            return new C.Bare().init(t, e);
          }
          function n(t) {
            var e = parseInt(t.slice(1), 16);
            return [(e >> 16) & 255, (e >> 8) & 255, 255 & e];
          }
          function i(t, e, n) {
            return (
              "#" + (0x1000000 | (t << 16) | (e << 8) | n).toString(16).slice(1)
            );
          }
          function r() {}
          function o(t, e, n) {
            if ((void 0 !== e && (n = e), void 0 === t)) return n;
            var i = n;
            return (
              Z.test(t) || !K.test(t)
                ? (i = parseInt(t, 10))
                : K.test(t) && (i = 1e3 * parseFloat(t)),
              0 > i && (i = 0),
              i == i ? i : n
            );
          }
          function a(t) {
            B.debug && window && window.console.warn(t);
          }
          var s,
            u,
            c,
            l = (function (t, e, n) {
              function i(t) {
                return "object" == typeof t;
              }
              function r(t) {
                return "function" == typeof t;
              }
              function o() {}
              return function a(s, u) {
                function c() {
                  var t = new l();
                  return (r(t.init) && t.init.apply(t, arguments), t);
                }
                function l() {}
                (u === n && ((u = s), (s = Object)), (c.Bare = l));
                var h,
                  d = (o[t] = s[t]),
                  f = (l[t] = c[t] = new o());
                return (
                  (f.constructor = c),
                  (c.mixin = function (e) {
                    return ((l[t] = c[t] = a(c, e)[t]), c);
                  }),
                  (c.open = function (t) {
                    if (
                      ((h = {}),
                      r(t) ? (h = t.call(c, f, d, c, s)) : i(t) && (h = t),
                      i(h))
                    )
                      for (var n in h) e.call(h, n) && (f[n] = h[n]);
                    return (r(f.init) || (f.init = s), c);
                  }),
                  c.open(u)
                );
              };
            })("prototype", {}.hasOwnProperty),
            h = {
              ease: [
                "ease",
                function (t, e, n, i) {
                  var r = (t /= i) * t,
                    o = r * t;
                  return (
                    e +
                    n *
                      (-2.75 * o * r +
                        11 * r * r +
                        -15.5 * o +
                        8 * r +
                        0.25 * t)
                  );
                },
              ],
              "ease-in": [
                "ease-in",
                function (t, e, n, i) {
                  var r = (t /= i) * t,
                    o = r * t;
                  return e + n * (-1 * o * r + 3 * r * r + -3 * o + 2 * r);
                },
              ],
              "ease-out": [
                "ease-out",
                function (t, e, n, i) {
                  var r = (t /= i) * t,
                    o = r * t;
                  return (
                    e +
                    n *
                      (0.3 * o * r +
                        -1.6 * r * r +
                        2.2 * o +
                        -1.8 * r +
                        1.9 * t)
                  );
                },
              ],
              "ease-in-out": [
                "ease-in-out",
                function (t, e, n, i) {
                  var r = (t /= i) * t,
                    o = r * t;
                  return e + n * (2 * o * r + -5 * r * r + 2 * o + 2 * r);
                },
              ],
              linear: [
                "linear",
                function (t, e, n, i) {
                  return (n * t) / i + e;
                },
              ],
              "ease-in-quad": [
                "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
                function (t, e, n, i) {
                  return n * (t /= i) * t + e;
                },
              ],
              "ease-out-quad": [
                "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
                function (t, e, n, i) {
                  return -n * (t /= i) * (t - 2) + e;
                },
              ],
              "ease-in-out-quad": [
                "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
                function (t, e, n, i) {
                  return (t /= i / 2) < 1
                    ? (n / 2) * t * t + e
                    : (-n / 2) * (--t * (t - 2) - 1) + e;
                },
              ],
              "ease-in-cubic": [
                "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
                function (t, e, n, i) {
                  return n * (t /= i) * t * t + e;
                },
              ],
              "ease-out-cubic": [
                "cubic-bezier(0.215, 0.610, 0.355, 1)",
                function (t, e, n, i) {
                  return n * ((t = t / i - 1) * t * t + 1) + e;
                },
              ],
              "ease-in-out-cubic": [
                "cubic-bezier(0.645, 0.045, 0.355, 1)",
                function (t, e, n, i) {
                  return (t /= i / 2) < 1
                    ? (n / 2) * t * t * t + e
                    : (n / 2) * ((t -= 2) * t * t + 2) + e;
                },
              ],
              "ease-in-quart": [
                "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
                function (t, e, n, i) {
                  return n * (t /= i) * t * t * t + e;
                },
              ],
              "ease-out-quart": [
                "cubic-bezier(0.165, 0.840, 0.440, 1)",
                function (t, e, n, i) {
                  return -n * ((t = t / i - 1) * t * t * t - 1) + e;
                },
              ],
              "ease-in-out-quart": [
                "cubic-bezier(0.770, 0, 0.175, 1)",
                function (t, e, n, i) {
                  return (t /= i / 2) < 1
                    ? (n / 2) * t * t * t * t + e
                    : (-n / 2) * ((t -= 2) * t * t * t - 2) + e;
                },
              ],
              "ease-in-quint": [
                "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
                function (t, e, n, i) {
                  return n * (t /= i) * t * t * t * t + e;
                },
              ],
              "ease-out-quint": [
                "cubic-bezier(0.230, 1, 0.320, 1)",
                function (t, e, n, i) {
                  return n * ((t = t / i - 1) * t * t * t * t + 1) + e;
                },
              ],
              "ease-in-out-quint": [
                "cubic-bezier(0.860, 0, 0.070, 1)",
                function (t, e, n, i) {
                  return (t /= i / 2) < 1
                    ? (n / 2) * t * t * t * t * t + e
                    : (n / 2) * ((t -= 2) * t * t * t * t + 2) + e;
                },
              ],
              "ease-in-sine": [
                "cubic-bezier(0.470, 0, 0.745, 0.715)",
                function (t, e, n, i) {
                  return -n * Math.cos((t / i) * (Math.PI / 2)) + n + e;
                },
              ],
              "ease-out-sine": [
                "cubic-bezier(0.390, 0.575, 0.565, 1)",
                function (t, e, n, i) {
                  return n * Math.sin((t / i) * (Math.PI / 2)) + e;
                },
              ],
              "ease-in-out-sine": [
                "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
                function (t, e, n, i) {
                  return (-n / 2) * (Math.cos((Math.PI * t) / i) - 1) + e;
                },
              ],
              "ease-in-expo": [
                "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
                function (t, e, n, i) {
                  return 0 === t ? e : n * Math.pow(2, 10 * (t / i - 1)) + e;
                },
              ],
              "ease-out-expo": [
                "cubic-bezier(0.190, 1, 0.220, 1)",
                function (t, e, n, i) {
                  return t === i
                    ? e + n
                    : n * (-Math.pow(2, (-10 * t) / i) + 1) + e;
                },
              ],
              "ease-in-out-expo": [
                "cubic-bezier(1, 0, 0, 1)",
                function (t, e, n, i) {
                  return 0 === t
                    ? e
                    : t === i
                      ? e + n
                      : (t /= i / 2) < 1
                        ? (n / 2) * Math.pow(2, 10 * (t - 1)) + e
                        : (n / 2) * (-Math.pow(2, -10 * --t) + 2) + e;
                },
              ],
              "ease-in-circ": [
                "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
                function (t, e, n, i) {
                  return -n * (Math.sqrt(1 - (t /= i) * t) - 1) + e;
                },
              ],
              "ease-out-circ": [
                "cubic-bezier(0.075, 0.820, 0.165, 1)",
                function (t, e, n, i) {
                  return n * Math.sqrt(1 - (t = t / i - 1) * t) + e;
                },
              ],
              "ease-in-out-circ": [
                "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
                function (t, e, n, i) {
                  return (t /= i / 2) < 1
                    ? (-n / 2) * (Math.sqrt(1 - t * t) - 1) + e
                    : (n / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + e;
                },
              ],
              "ease-in-back": [
                "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
                function (t, e, n, i, r) {
                  return (
                    void 0 === r && (r = 1.70158),
                    n * (t /= i) * t * ((r + 1) * t - r) + e
                  );
                },
              ],
              "ease-out-back": [
                "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
                function (t, e, n, i, r) {
                  return (
                    void 0 === r && (r = 1.70158),
                    n * ((t = t / i - 1) * t * ((r + 1) * t + r) + 1) + e
                  );
                },
              ],
              "ease-in-out-back": [
                "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
                function (t, e, n, i, r) {
                  return (
                    void 0 === r && (r = 1.70158),
                    (t /= i / 2) < 1
                      ? (n / 2) * t * t * (((r *= 1.525) + 1) * t - r) + e
                      : (n / 2) *
                          ((t -= 2) * t * (((r *= 1.525) + 1) * t + r) + 2) +
                        e
                  );
                },
              ],
            },
            d = {
              "ease-in-back": "cubic-bezier(0.600, 0, 0.735, 0.045)",
              "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1)",
              "ease-in-out-back": "cubic-bezier(0.680, 0, 0.265, 1)",
            },
            f = window,
            p = "bkwld-tram",
            m = /[\-\.0-9]/g,
            v = /[A-Z]/,
            w = "number",
            b = /^(rgb|#)/,
            g = /(em|cm|mm|in|pt|pc|px)$/,
            y = /(em|cm|mm|in|pt|pc|px|%)$/,
            x = /(deg|rad|turn)$/,
            k = "unitless",
            E = /(all|none) 0s ease 0s/,
            _ = /^(width|height)$/,
            L = document.createElement("a"),
            A = ["Webkit", "Moz", "O", "ms"],
            $ = ["-webkit-", "-moz-", "-o-", "-ms-"],
            z = function (t) {
              if (t in L.style) return { dom: t, css: t };
              var e,
                n,
                i = "",
                r = t.split("-");
              for (e = 0; e < r.length; e++)
                i += r[e].charAt(0).toUpperCase() + r[e].slice(1);
              for (e = 0; e < A.length; e++)
                if ((n = A[e] + i) in L.style) return { dom: n, css: $[e] + t };
            },
            T = (e.support = {
              bind: Function.prototype.bind,
              transform: z("transform"),
              transition: z("transition"),
              backface: z("backface-visibility"),
              timing: z("transition-timing-function"),
            });
          if (T.transition) {
            var S = T.timing.dom;
            if (((L.style[S] = h["ease-in-back"][0]), !L.style[S]))
              for (var q in d) h[q][0] = d[q];
          }
          var j = (e.frame =
              (s =
                f.requestAnimationFrame ||
                f.webkitRequestAnimationFrame ||
                f.mozRequestAnimationFrame ||
                f.oRequestAnimationFrame ||
                f.msRequestAnimationFrame) && T.bind
                ? s.bind(f)
                : function (t) {
                    f.setTimeout(t, 16);
                  }),
            M = (e.now =
              (c =
                (u = f.performance) &&
                (u.now || u.webkitNow || u.msNow || u.mozNow)) && T.bind
                ? c.bind(u)
                : Date.now ||
                  function () {
                    return +new Date();
                  }),
            F = l(function (e) {
              function n(t, e) {
                var n = (function (t) {
                    for (var e = -1, n = t ? t.length : 0, i = []; ++e < n; ) {
                      var r = t[e];
                      r && i.push(r);
                    }
                    return i;
                  })(("" + t).split(" ")),
                  i = n[0];
                e = e || {};
                var r = X[i];
                if (!r) return a("Unsupported property: " + i);
                if (!e.weak || !this.props[i]) {
                  var o = r[0],
                    s = this.props[i];
                  return (
                    s || (s = this.props[i] = new o.Bare()),
                    s.init(this.$el, n, r, e),
                    s
                  );
                }
              }
              function i(t, e, i) {
                if (t) {
                  var a = typeof t;
                  if (
                    (e ||
                      (this.timer && this.timer.destroy(),
                      (this.queue = []),
                      (this.active = !1)),
                    "number" == a && e)
                  )
                    return (
                      (this.timer = new P({
                        duration: t,
                        context: this,
                        complete: r,
                      })),
                      void (this.active = !0)
                    );
                  if ("string" == a && e) {
                    switch (t) {
                      case "hide":
                        u.call(this);
                        break;
                      case "stop":
                        s.call(this);
                        break;
                      case "redraw":
                        c.call(this);
                        break;
                      default:
                        n.call(this, t, i && i[1]);
                    }
                    return r.call(this);
                  }
                  if ("function" == a) return void t.call(this, this);
                  if ("object" == a) {
                    var d = 0;
                    (h.call(
                      this,
                      t,
                      function (t, e) {
                        (t.span > d && (d = t.span), t.stop(), t.animate(e));
                      },
                      function (t) {
                        "wait" in t && (d = o(t.wait, 0));
                      },
                    ),
                      l.call(this),
                      d > 0 &&
                        ((this.timer = new P({ duration: d, context: this })),
                        (this.active = !0),
                        e && (this.timer.complete = r)));
                    var f = this,
                      p = !1,
                      m = {};
                    j(function () {
                      (h.call(f, t, function (t) {
                        t.active && ((p = !0), (m[t.name] = t.nextStyle));
                      }),
                        p && f.$el.css(m));
                    });
                  }
                }
              }
              function r() {
                if (
                  (this.timer && this.timer.destroy(),
                  (this.active = !1),
                  this.queue.length)
                ) {
                  var t = this.queue.shift();
                  i.call(this, t.options, !0, t.args);
                }
              }
              function s(t) {
                var e;
                (this.timer && this.timer.destroy(),
                  (this.queue = []),
                  (this.active = !1),
                  "string" == typeof t
                    ? ((e = {})[t] = 1)
                    : (e = "object" == typeof t && null != t ? t : this.props),
                  h.call(this, e, d),
                  l.call(this));
              }
              function u() {
                (s.call(this), (this.el.style.display = "none"));
              }
              function c() {
                this.el.offsetHeight;
              }
              function l() {
                var t,
                  e,
                  n = [];
                for (t in (this.upstream && n.push(this.upstream), this.props))
                  (e = this.props[t]).active && n.push(e.string);
                ((n = n.join(",")),
                  this.style !== n &&
                    ((this.style = n), (this.el.style[T.transition.dom] = n)));
              }
              function h(t, e, i) {
                var r,
                  o,
                  a,
                  s,
                  u = e !== d,
                  c = {};
                for (r in t)
                  ((a = t[r]),
                    r in Y
                      ? (c.transform || (c.transform = {}),
                        (c.transform[r] = a))
                      : (v.test(r) &&
                          (r = r.replace(/[A-Z]/g, function (t) {
                            return "-" + t.toLowerCase();
                          })),
                        r in X ? (c[r] = a) : (s || (s = {}), (s[r] = a))));
                for (r in c) {
                  if (((a = c[r]), !(o = this.props[r]))) {
                    if (!u) continue;
                    o = n.call(this, r);
                  }
                  e.call(this, o, a);
                }
                i && s && i.call(this, s);
              }
              function d(t) {
                t.stop();
              }
              function f(t, e) {
                t.set(e);
              }
              function m(t) {
                this.$el.css(t);
              }
              function w(t, n) {
                e[t] = function () {
                  return this.children
                    ? b.call(this, n, arguments)
                    : (this.el && n.apply(this, arguments), this);
                };
              }
              function b(t, e) {
                var n,
                  i = this.children.length;
                for (n = 0; i > n; n++) t.apply(this.children[n], e);
                return this;
              }
              ((e.init = function (e) {
                if (
                  ((this.$el = t(e)),
                  (this.el = this.$el[0]),
                  (this.props = {}),
                  (this.queue = []),
                  (this.style = ""),
                  (this.active = !1),
                  B.keepInherited && !B.fallback)
                ) {
                  var n = G(this.el, "transition");
                  n && !E.test(n) && (this.upstream = n);
                }
                T.backface &&
                  B.hideBackface &&
                  H(this.el, T.backface.css, "hidden");
              }),
                w("add", n),
                w("start", i),
                w("wait", function (t) {
                  ((t = o(t, 0)),
                    this.active
                      ? this.queue.push({ options: t })
                      : ((this.timer = new P({
                          duration: t,
                          context: this,
                          complete: r,
                        })),
                        (this.active = !0)));
                }),
                w("then", function (t) {
                  return this.active
                    ? (this.queue.push({ options: t, args: arguments }),
                      void (this.timer.complete = r))
                    : a(
                        "No active transition timer. Use start() or wait() before then().",
                      );
                }),
                w("next", r),
                w("stop", s),
                w("set", function (t) {
                  (s.call(this, t), h.call(this, t, f, m));
                }),
                w("show", function (t) {
                  ("string" != typeof t && (t = "block"),
                    (this.el.style.display = t));
                }),
                w("hide", u),
                w("redraw", c),
                w("destroy", function () {
                  (s.call(this),
                    t.removeData(this.el, p),
                    (this.$el = this.el = null));
                }));
            }),
            C = l(F, function (e) {
              function n(e, n) {
                var i = t.data(e, p) || t.data(e, p, new F.Bare());
                return (i.el || i.init(e), n ? i.start(n) : i);
              }
              e.init = function (e, i) {
                var r = t(e);
                if (!r.length) return this;
                if (1 === r.length) return n(r[0], i);
                var o = [];
                return (
                  r.each(function (t, e) {
                    o.push(n(e, i));
                  }),
                  (this.children = o),
                  this
                );
              };
            }),
            I = l(function (t) {
              function e() {
                var t = this.get();
                this.update("auto");
                var e = this.get();
                return (this.update(t), e);
              }
              ((t.init = function (t, e, n, i) {
                ((this.$el = t), (this.el = t[0]));
                var r,
                  a,
                  s,
                  u = e[0];
                (n[2] && (u = n[2]),
                  U[u] && (u = U[u]),
                  (this.name = u),
                  (this.type = n[1]),
                  (this.duration = o(e[1], this.duration, 500)),
                  (this.ease =
                    ((r = e[2]),
                    (a = this.ease),
                    (s = "ease"),
                    void 0 !== a && (s = a),
                    r in h ? r : s)),
                  (this.delay = o(e[3], this.delay, 0)),
                  (this.span = this.duration + this.delay),
                  (this.active = !1),
                  (this.nextStyle = null),
                  (this.auto = _.test(this.name)),
                  (this.unit = i.unit || this.unit || B.defaultUnit),
                  (this.angle = i.angle || this.angle || B.defaultAngle),
                  B.fallback || i.fallback
                    ? (this.animate = this.fallback)
                    : ((this.animate = this.transition),
                      (this.string =
                        this.name +
                        " " +
                        this.duration +
                        "ms" +
                        ("ease" != this.ease ? " " + h[this.ease][0] : "") +
                        (this.delay ? " " + this.delay + "ms" : ""))));
              }),
                (t.set = function (t) {
                  ((t = this.convert(t, this.type)),
                    this.update(t),
                    this.redraw());
                }),
                (t.transition = function (t) {
                  ((this.active = !0),
                    (t = this.convert(t, this.type)),
                    this.auto &&
                      ("auto" == this.el.style[this.name] &&
                        (this.update(this.get()), this.redraw()),
                      "auto" == t && (t = e.call(this))),
                    (this.nextStyle = t));
                }),
                (t.fallback = function (t) {
                  var n =
                    this.el.style[this.name] ||
                    this.convert(this.get(), this.type);
                  ((t = this.convert(t, this.type)),
                    this.auto &&
                      ("auto" == n && (n = this.convert(this.get(), this.type)),
                      "auto" == t && (t = e.call(this))),
                    (this.tween = new D({
                      from: n,
                      to: t,
                      duration: this.duration,
                      delay: this.delay,
                      ease: this.ease,
                      update: this.update,
                      context: this,
                    })));
                }),
                (t.get = function () {
                  return G(this.el, this.name);
                }),
                (t.update = function (t) {
                  H(this.el, this.name, t);
                }),
                (t.stop = function () {
                  (this.active || this.nextStyle) &&
                    ((this.active = !1),
                    (this.nextStyle = null),
                    H(this.el, this.name, this.get()));
                  var t = this.tween;
                  t && t.context && t.destroy();
                }),
                (t.convert = function (t, e) {
                  if ("auto" == t && this.auto) return t;
                  var n,
                    r,
                    o = "number" == typeof t,
                    s = "string" == typeof t;
                  switch (e) {
                    case w:
                      if (o) return t;
                      if (s && "" === t.replace(m, "")) return +t;
                      r = "number(unitless)";
                      break;
                    case b:
                      if (s) {
                        if ("" === t && this.original) return this.original;
                        if (e.test(t))
                          return "#" == t.charAt(0) && 7 == t.length
                            ? t
                            : ((n = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(t))
                                ? i(n[1], n[2], n[3])
                                : t
                              ).replace(/#(\w)(\w)(\w)$/, "#$1$1$2$2$3$3");
                      }
                      r = "hex or rgb string";
                      break;
                    case g:
                      if (o) return t + this.unit;
                      if (s && e.test(t)) return t;
                      r = "number(px) or string(unit)";
                      break;
                    case y:
                      if (o) return t + this.unit;
                      if (s && e.test(t)) return t;
                      r = "number(px) or string(unit or %)";
                      break;
                    case x:
                      if (o) return t + this.angle;
                      if (s && e.test(t)) return t;
                      r = "number(deg) or string(angle)";
                      break;
                    case k:
                      if (o || (s && y.test(t))) return t;
                      r = "number(unitless) or string(unit or %)";
                  }
                  return (
                    a(
                      "Type warning: Expected: [" +
                        r +
                        "] Got: [" +
                        typeof t +
                        "] " +
                        t,
                    ),
                    t
                  );
                }),
                (t.redraw = function () {
                  this.el.offsetHeight;
                }));
            }),
            O = l(I, function (t, e) {
              t.init = function () {
                (e.init.apply(this, arguments),
                  this.original ||
                    (this.original = this.convert(this.get(), b)));
              };
            }),
            R = l(I, function (t, e) {
              ((t.init = function () {
                (e.init.apply(this, arguments), (this.animate = this.fallback));
              }),
                (t.get = function () {
                  return this.$el[this.name]();
                }),
                (t.update = function (t) {
                  this.$el[this.name](t);
                }));
            }),
            N = l(I, function (t, e) {
              function n(t, e) {
                var n, i, r, o, a;
                for (n in t)
                  ((r = (o = Y[n])[0]),
                    (i = o[1] || n),
                    (a = this.convert(t[n], r)),
                    e.call(this, i, a, r));
              }
              ((t.init = function () {
                (e.init.apply(this, arguments),
                  this.current ||
                    ((this.current = {}),
                    Y.perspective &&
                      B.perspective &&
                      ((this.current.perspective = B.perspective),
                      H(this.el, this.name, this.style(this.current)),
                      this.redraw())));
              }),
                (t.set = function (t) {
                  (n.call(this, t, function (t, e) {
                    this.current[t] = e;
                  }),
                    H(this.el, this.name, this.style(this.current)),
                    this.redraw());
                }),
                (t.transition = function (t) {
                  var e = this.values(t);
                  this.tween = new W({
                    current: this.current,
                    values: e,
                    duration: this.duration,
                    delay: this.delay,
                    ease: this.ease,
                  });
                  var n,
                    i = {};
                  for (n in this.current)
                    i[n] = n in e ? e[n] : this.current[n];
                  ((this.active = !0), (this.nextStyle = this.style(i)));
                }),
                (t.fallback = function (t) {
                  var e = this.values(t);
                  this.tween = new W({
                    current: this.current,
                    values: e,
                    duration: this.duration,
                    delay: this.delay,
                    ease: this.ease,
                    update: this.update,
                    context: this,
                  });
                }),
                (t.update = function () {
                  H(this.el, this.name, this.style(this.current));
                }),
                (t.style = function (t) {
                  var e,
                    n = "";
                  for (e in t) n += e + "(" + t[e] + ") ";
                  return n;
                }),
                (t.values = function (t) {
                  var e,
                    i = {};
                  return (
                    n.call(this, t, function (t, n, r) {
                      ((i[t] = n),
                        void 0 === this.current[t] &&
                          ((e = 0),
                          ~t.indexOf("scale") && (e = 1),
                          (this.current[t] = this.convert(e, r))));
                    }),
                    i
                  );
                }));
            }),
            D = l(function (e) {
              function o() {
                var t,
                  e,
                  n,
                  i = u.length;
                if (i)
                  for (j(o), e = M(), t = i; t--; ) (n = u[t]) && n.render(e);
              }
              var s = { ease: h.ease[1], from: 0, to: 1 };
              ((e.init = function (t) {
                ((this.duration = t.duration || 0),
                  (this.delay = t.delay || 0));
                var e = t.ease || s.ease;
                (h[e] && (e = h[e][1]),
                  "function" != typeof e && (e = s.ease),
                  (this.ease = e),
                  (this.update = t.update || r),
                  (this.complete = t.complete || r),
                  (this.context = t.context || this),
                  (this.name = t.name));
                var n = t.from,
                  i = t.to;
                (void 0 === n && (n = s.from),
                  void 0 === i && (i = s.to),
                  (this.unit = t.unit || ""),
                  "number" == typeof n && "number" == typeof i
                    ? ((this.begin = n), (this.change = i - n))
                    : this.format(i, n),
                  (this.value = this.begin + this.unit),
                  (this.start = M()),
                  !1 !== t.autoplay && this.play());
              }),
                (e.play = function () {
                  this.active ||
                    (this.start || (this.start = M()),
                    (this.active = !0),
                    1 === u.push(this) && j(o));
                }),
                (e.stop = function () {
                  var e, n;
                  this.active &&
                    ((this.active = !1),
                    (n = t.inArray(this, u)) >= 0 &&
                      ((e = u.slice(n + 1)),
                      (u.length = n),
                      e.length && (u = u.concat(e))));
                }),
                (e.render = function (t) {
                  var e,
                    n = t - this.start;
                  if (this.delay) {
                    if (n <= this.delay) return;
                    n -= this.delay;
                  }
                  if (n < this.duration) {
                    var r,
                      o,
                      a = this.ease(n, 0, 1, this.duration);
                    return (
                      (e = this.startRGB
                        ? ((r = this.startRGB),
                          (o = this.endRGB),
                          i(
                            r[0] + a * (o[0] - r[0]),
                            r[1] + a * (o[1] - r[1]),
                            r[2] + a * (o[2] - r[2]),
                          ))
                        : Math.round((this.begin + a * this.change) * c) / c),
                      (this.value = e + this.unit),
                      void this.update.call(this.context, this.value)
                    );
                  }
                  ((e = this.endHex || this.begin + this.change),
                    (this.value = e + this.unit),
                    this.update.call(this.context, this.value),
                    this.complete.call(this.context),
                    this.destroy());
                }),
                (e.format = function (t, e) {
                  if (((e += ""), "#" == (t += "").charAt(0)))
                    return (
                      (this.startRGB = n(e)),
                      (this.endRGB = n(t)),
                      (this.endHex = t),
                      (this.begin = 0),
                      void (this.change = 1)
                    );
                  if (!this.unit) {
                    var i = e.replace(m, "");
                    (i !== t.replace(m, "") &&
                      a("Units do not match [tween]: " + e + ", " + t),
                      (this.unit = i));
                  }
                  ((e = parseFloat(e)),
                    (t = parseFloat(t)),
                    (this.begin = this.value = e),
                    (this.change = t - e));
                }),
                (e.destroy = function () {
                  (this.stop(),
                    (this.context = null),
                    (this.ease = this.update = this.complete = r));
                }));
              var u = [],
                c = 1e3;
            }),
            P = l(D, function (t) {
              ((t.init = function (t) {
                ((this.duration = t.duration || 0),
                  (this.complete = t.complete || r),
                  (this.context = t.context),
                  this.play());
              }),
                (t.render = function (t) {
                  t - this.start < this.duration ||
                    (this.complete.call(this.context), this.destroy());
                }));
            }),
            W = l(D, function (t, e) {
              ((t.init = function (t) {
                var e, n;
                for (e in ((this.context = t.context),
                (this.update = t.update),
                (this.tweens = []),
                (this.current = t.current),
                t.values))
                  ((n = t.values[e]),
                    this.current[e] !== n &&
                      this.tweens.push(
                        new D({
                          name: e,
                          from: this.current[e],
                          to: n,
                          duration: t.duration,
                          delay: t.delay,
                          ease: t.ease,
                          autoplay: !1,
                        }),
                      ));
                this.play();
              }),
                (t.render = function (t) {
                  var e,
                    n,
                    i = this.tweens.length,
                    r = !1;
                  for (e = i; e--; )
                    (n = this.tweens[e]).context &&
                      (n.render(t), (this.current[n.name] = n.value), (r = !0));
                  return r
                    ? void (this.update && this.update.call(this.context))
                    : this.destroy();
                }),
                (t.destroy = function () {
                  if ((e.destroy.call(this), this.tweens)) {
                    var t;
                    for (t = this.tweens.length; t--; )
                      this.tweens[t].destroy();
                    ((this.tweens = null), (this.current = null));
                  }
                }));
            }),
            B = (e.config = {
              debug: !1,
              defaultUnit: "px",
              defaultAngle: "deg",
              keepInherited: !1,
              hideBackface: !1,
              perspective: "",
              fallback: !T.transition,
              agentTests: [],
            });
          ((e.fallback = function (t) {
            if (!T.transition) return (B.fallback = !0);
            B.agentTests.push("(" + t + ")");
            var e = RegExp(B.agentTests.join("|"), "i");
            B.fallback = e.test(navigator.userAgent);
          }),
            e.fallback("6.0.[2-5] Safari"),
            (e.tween = function (t) {
              return new D(t);
            }),
            (e.delay = function (t, e, n) {
              return new P({ complete: e, duration: t, context: n });
            }),
            (t.fn.tram = function (t) {
              return e.call(null, this, t);
            }));
          var H = t.style,
            G = t.css,
            U = { transform: T.transform && T.transform.css },
            X = {
              color: [O, b],
              background: [O, b, "background-color"],
              "outline-color": [O, b],
              "border-color": [O, b],
              "border-top-color": [O, b],
              "border-right-color": [O, b],
              "border-bottom-color": [O, b],
              "border-left-color": [O, b],
              "border-width": [I, g],
              "border-top-width": [I, g],
              "border-right-width": [I, g],
              "border-bottom-width": [I, g],
              "border-left-width": [I, g],
              "border-spacing": [I, g],
              "letter-spacing": [I, g],
              margin: [I, g],
              "margin-top": [I, g],
              "margin-right": [I, g],
              "margin-bottom": [I, g],
              "margin-left": [I, g],
              padding: [I, g],
              "padding-top": [I, g],
              "padding-right": [I, g],
              "padding-bottom": [I, g],
              "padding-left": [I, g],
              "outline-width": [I, g],
              opacity: [I, w],
              top: [I, y],
              right: [I, y],
              bottom: [I, y],
              left: [I, y],
              "font-size": [I, y],
              "text-indent": [I, y],
              "word-spacing": [I, y],
              width: [I, y],
              "min-width": [I, y],
              "max-width": [I, y],
              height: [I, y],
              "min-height": [I, y],
              "max-height": [I, y],
              "line-height": [I, k],
              "scroll-top": [R, w, "scrollTop"],
              "scroll-left": [R, w, "scrollLeft"],
            },
            Y = {};
          (T.transform &&
            ((X.transform = [N]),
            (Y = {
              x: [y, "translateX"],
              y: [y, "translateY"],
              rotate: [x],
              rotateX: [x],
              rotateY: [x],
              scale: [w],
              scaleX: [w],
              scaleY: [w],
              skew: [x],
              skewX: [x],
              skewY: [x],
            })),
            T.transform &&
              T.backface &&
              ((Y.z = [y, "translateZ"]),
              (Y.rotateZ = [x]),
              (Y.scaleZ = [w]),
              (Y.perspective = [g])));
          var Z = /ms/,
            K = /s|\./;
          return (t.tram = e);
        })(window.jQuery);
      
}