export default function(t, e, n) {

        "use strict";
        var i = n(949);
        i.define(
          "links",
          (t.exports = function (t, e) {
            var n,
              r,
              o,
              a = {},
              s = t(window),
              u = i.env(),
              c = window.location,
              l = document.createElement("a"),
              h = "w--current",
              d = /index\.(html|php)$/,
              f = /\/$/;
            function p() {
              var t = s.scrollTop(),
                n = s.height();
              e.each(r, function (e) {
                if (!e.link.attr("hreflang")) {
                  var i = e.link,
                    r = e.sec,
                    o = r.offset().top,
                    a = r.outerHeight(),
                    s = 0.5 * n,
                    u = r.is(":visible") && o + a - s >= t && o + s <= t + n;
                  e.active !== u && ((e.active = u), m(i, h, u));
                }
              });
            }
            function m(t, e, n) {
              var i = t.hasClass(e);
              (!n || !i) && (n || i) && (n ? t.addClass(e) : t.removeClass(e));
            }
            return (
              (a.ready =
                a.design =
                a.preview =
                  function () {
                    ((n = u && i.env("design")),
                      (o = i.env("slug") || c.pathname || ""),
                      i.scroll.off(p),
                      (r = []));
                    for (var e = document.links, a = 0; a < e.length; ++a)
                      !(function (e) {
                        if (!e.getAttribute("hreflang")) {
                          var i =
                            (n && e.getAttribute("href-disabled")) ||
                            e.getAttribute("href");
                          if (((l.href = i), !(i.indexOf(":") >= 0))) {
                            var a = t(e);
                            if (
                              l.hash.length > 1 &&
                              l.host + l.pathname === c.host + c.pathname
                            ) {
                              if (!/^#[a-zA-Z0-9\-\_]+$/.test(l.hash)) return;
                              var s = t(l.hash);
                              s.length &&
                                r.push({ link: a, sec: s, active: !1 });
                              return;
                            }
                            "#" !== i &&
                              "" !== i &&
                              m(
                                a,
                                h,
                                (!u && l.href === c.href) ||
                                  i === o ||
                                  (d.test(i) && f.test(o)),
                              );
                          }
                        }
                      })(e[a]);
                    r.length && (i.scroll.on(p), p());
                  }),
              a
            );
          }),
        );
      
}