export default function(t, e, n) {

        "use strict";
        var i,
          r,
          o,
          a,
          s,
          u,
          c,
          l,
          h,
          d,
          f,
          p,
          m,
          v,
          w,
          b,
          g,
          y,
          x,
          k,
          E = window.$,
          _ = n(487) && E.tram;
        (((i = {}).VERSION = "1.6.0-Custom"),
          (r = {}),
          (o = Array.prototype),
          (a = Object.prototype),
          (s = Function.prototype),
          o.push,
          (u = o.slice),
          o.concat,
          a.toString,
          (c = a.hasOwnProperty),
          (l = o.forEach),
          (h = o.map),
          o.reduce,
          o.reduceRight,
          (d = o.filter),
          o.every,
          (f = o.some),
          (p = o.indexOf),
          o.lastIndexOf,
          (m = Object.keys),
          s.bind,
          (v =
            i.each =
            i.forEach =
              function (t, e, n) {
                if (null == t) return t;
                if (l && t.forEach === l) t.forEach(e, n);
                else if (t.length === +t.length) {
                  for (var o = 0, a = t.length; o < a; o++)
                    if (e.call(n, t[o], o, t) === r) return;
                } else
                  for (var s = i.keys(t), o = 0, a = s.length; o < a; o++)
                    if (e.call(n, t[s[o]], s[o], t) === r) return;
                return t;
              }),
          (i.map = i.collect =
            function (t, e, n) {
              var i = [];
              return null == t
                ? i
                : h && t.map === h
                  ? t.map(e, n)
                  : (v(t, function (t, r, o) {
                      i.push(e.call(n, t, r, o));
                    }),
                    i);
            }),
          (i.find = i.detect =
            function (t, e, n) {
              var i;
              return (
                w(t, function (t, r, o) {
                  if (e.call(n, t, r, o)) return ((i = t), !0);
                }),
                i
              );
            }),
          (i.filter = i.select =
            function (t, e, n) {
              var i = [];
              return null == t
                ? i
                : d && t.filter === d
                  ? t.filter(e, n)
                  : (v(t, function (t, r, o) {
                      e.call(n, t, r, o) && i.push(t);
                    }),
                    i);
            }),
          (w =
            i.some =
            i.any =
              function (t, e, n) {
                e || (e = i.identity);
                var o = !1;
                return null == t
                  ? o
                  : f && t.some === f
                    ? t.some(e, n)
                    : (v(t, function (t, i, a) {
                        if (o || (o = e.call(n, t, i, a))) return r;
                      }),
                      !!o);
              }),
          (i.contains = i.include =
            function (t, e) {
              return (
                null != t &&
                (p && t.indexOf === p
                  ? -1 != t.indexOf(e)
                  : w(t, function (t) {
                      return t === e;
                    }))
              );
            }),
          (i.delay = function (t, e) {
            var n = u.call(arguments, 2);
            return setTimeout(function () {
              return t.apply(null, n);
            }, e);
          }),
          (i.defer = function (t) {
            return i.delay.apply(i, [t, 1].concat(u.call(arguments, 1)));
          }),
          (i.throttle = function (t) {
            var e, n, i;
            return function () {
              e ||
                ((e = !0),
                (n = arguments),
                (i = this),
                _.frame(function () {
                  ((e = !1), t.apply(i, n));
                }));
            };
          }),
          (i.debounce = function (t, e, n) {
            var r,
              o,
              a,
              s,
              u,
              c = function () {
                var l = i.now() - s;
                l < e
                  ? (r = setTimeout(c, e - l))
                  : ((r = null), n || ((u = t.apply(a, o)), (a = o = null)));
              };
            return function () {
              ((a = this), (o = arguments), (s = i.now()));
              var l = n && !r;
              return (
                r || (r = setTimeout(c, e)),
                l && ((u = t.apply(a, o)), (a = o = null)),
                u
              );
            };
          }),
          (i.defaults = function (t) {
            if (!i.isObject(t)) return t;
            for (var e = 1, n = arguments.length; e < n; e++) {
              var r = arguments[e];
              for (var o in r) void 0 === t[o] && (t[o] = r[o]);
            }
            return t;
          }),
          (i.keys = function (t) {
            if (!i.isObject(t)) return [];
            if (m) return m(t);
            var e = [];
            for (var n in t) i.has(t, n) && e.push(n);
            return e;
          }),
          (i.has = function (t, e) {
            return c.call(t, e);
          }),
          (i.isObject = function (t) {
            return t === Object(t);
          }),
          (i.now =
            Date.now ||
            function () {
              return new Date().getTime();
            }),
          (i.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g,
          }),
          (b = /(.)^/),
          (g = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029",
          }),
          (y = /\\|'|\r|\n|\u2028|\u2029/g),
          (x = function (t) {
            return "\\" + g[t];
          }),
          (k = /^\s*(\w|\$)+\s*$/),
          (i.template = function (t, e, n) {
            !e && n && (e = n);
            var r,
              o = RegExp(
                [
                  ((e = i.defaults({}, e, i.templateSettings)).escape || b)
                    .source,
                  (e.interpolate || b).source,
                  (e.evaluate || b).source,
                ].join("|") + "|$",
                "g",
              ),
              a = 0,
              s = "__p+='";
            (t.replace(o, function (e, n, i, r, o) {
              return (
                (s += t.slice(a, o).replace(y, x)),
                (a = o + e.length),
                n
                  ? (s += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'")
                  : i
                    ? (s += "'+\n((__t=(" + i + "))==null?'':__t)+\n'")
                    : r && (s += "';\n" + r + "\n__p+='"),
                e
              );
            }),
              (s += "';\n"));
            var u = e.variable;
            if (u) {
              if (!k.test(u))
                throw Error("variable is not a bare identifier: " + u);
            } else ((s = "with(obj||{}){\n" + s + "}\n"), (u = "obj"));
            s =
              "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" +
              s +
              "return __p;\n";
            try {
              r = Function(e.variable || "obj", "_", s);
            } catch (t) {
              throw ((t.source = s), t);
            }
            var c = function (t) {
              return r.call(this, t, i);
            };
            return ((c.source = "function(" + u + "){\n" + s + "}"), c);
          }),
          (t.exports = i));
      
}