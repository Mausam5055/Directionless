export default function(t, e, n) {

        "use strict";
        var i,
          r,
          o = {},
          a = {},
          s = [],
          u = window.Custom || [],
          c = window.jQuery,
          l = c(window),
          h = c(document),
          d = c.isFunction,
          f = (o._ = n(756)),
          p = (o.tram = n(487) && c.tram),
          m = !1,
          v = !1;
        function w(t) {
          (o.env() &&
            (d(t.design) && l.on("__wf_design", t.design),
            d(t.preview) && l.on("__wf_preview", t.preview)),
            d(t.destroy) && l.on("__wf_destroy", t.destroy),
            t.ready &&
              d(t.ready) &&
              (function (t) {
                if (m) return t.ready();
                f.contains(s, t.ready) || s.push(t.ready);
              })(t));
        }
        function b(t) {
          var e;
          (d(t.design) && l.off("__wf_design", t.design),
            d(t.preview) && l.off("__wf_preview", t.preview),
            d(t.destroy) && l.off("__wf_destroy", t.destroy),
            t.ready &&
              d(t.ready) &&
              ((e = t),
              (s = f.filter(s, function (t) {
                return t !== e.ready;
              }))));
        }
        ((p.config.hideBackface = !1),
          (p.config.keepInherited = !0),
          (o.define = function (t, e, n) {
            a[t] && b(a[t]);
            var i = (a[t] = e(c, f, n) || {});
            return (w(i), i);
          }),
          (o.require = function (t) {
            return a[t];
          }),
          (o.push = function (t) {
            if (m) {
              d(t) && t();
              return;
            }
            u.push(t);
          }),
          (o.env = function (t) {
            var e = window.__wf_design,
              n = void 0 !== e;
            return t
              ? "design" === t
                ? n && e
                : "preview" === t
                  ? n && !e
                  : "slug" === t
                    ? n && window.__wf_slug
                    : "editor" === t
                      ? window.CustomEditor
                      : "test" === t
                        ? window.__wf_test
                        : "frame" === t
                          ? window !== window.top
                          : void 0
              : n;
          }));
        var g = navigator.userAgent.toLowerCase(),
          y = (o.env.touch =
            "ontouchstart" in window ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)),
          x = (o.env.chrome =
            /chrome/.test(g) &&
            /Google/.test(navigator.vendor) &&
            parseInt(g.match(/chrome\/(\d+)\./)[1], 10)),
          k = (o.env.ios = /(ipod|iphone|ipad)/.test(g));
        ((o.env.safari = /safari/.test(g) && !x && !k),
          y &&
            h.on("touchstart mousedown", function (t) {
              i = t.target;
            }),
          (o.validClick = y
            ? function (t) {
                return t === i || c.contains(t, i);
              }
            : function () {
                return !0;
              }));
        var E = "resize.custom orientationchange.custom load.custom",
          _ = "scroll.custom " + E;
        function L(t, e) {
          var n = [],
            i = {};
          return (
            (i.up = f.throttle(function (t) {
              f.each(n, function (e) {
                e(t);
              });
            })),
            t && e && t.on(e, i.up),
            (i.on = function (t) {
              "function" == typeof t && (f.contains(n, t) || n.push(t));
            }),
            (i.off = function (t) {
              if (!arguments.length) {
                n = [];
                return;
              }
              n = f.filter(n, function (e) {
                return e !== t;
              });
            }),
            i
          );
        }
        function A(t) {
          d(t) && t();
        }
        function $() {
          (r && (r.reject(), l.off("load", r.resolve)),
            (r = new c.Deferred()),
            l.on("load", r.resolve));
        }
        ((o.resize = L(l, E)),
          (o.scroll = L(l, _)),
          (o.redraw = L()),
          (o.location = function (t) {
            window.location = t;
          }),
          o.env() && (o.location = function () {}),
          (o.ready = function () {
            ((m = !0),
              v ? ((v = !1), f.each(a, w)) : f.each(s, A),
              f.each(u, A),
              o.resize.up());
          }),
          (o.load = function (t) {
            r.then(t);
          }),
          (o.destroy = function (t) {
            ((t = t || {}),
              (v = !0),
              l.triggerHandler("__wf_destroy"),
              null != t.domready && (m = t.domready),
              f.each(a, b),
              o.resize.off(),
              o.scroll.off(),
              o.redraw.off(),
              (s = []),
              (u = []),
              "pending" === r.state() && $());
          }),
          c(o.ready),
          $(),
          (t.exports = window.Custom = o));
      
}