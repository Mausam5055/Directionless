export default function(t, e, n) {

        "use strict";
        var i = n(949);
        i.define(
          "scroll",
          (t.exports = function (t) {
            var e = {
                WF_CLICK_EMPTY: "click.wf-empty-link",
                WF_CLICK_SCROLL: "click.wf-scroll",
              },
              n = window.location,
              r = !(function () {
                try {
                  return !!window.frameElement;
                } catch (t) {
                  return !0;
                }
              })()
                ? window.history
                : null,
              o = t(window),
              a = t(document),
              s = t(document.body),
              u =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function (t) {
                  window.setTimeout(t, 15);
                },
              c = i.env("editor") ? ".w-editor-body" : "body",
              l =
                "header, " +
                c +
                " > .header, " +
                c +
                " > .w-nav:not([data-no-scroll])",
              h = 'a[href="#"]',
              d = 'a[href*="#"]:not(.w-tab-link):not(' + h + ")",
              f = document.createElement("style");
            f.appendChild(
              document.createTextNode(
                '.wf-force-outline-none[tabindex="-1"]:focus{outline:none;}',
              ),
            );
            var p = /^#[a-zA-Z0-9][\w:.-]*$/;
            let m =
              "function" == typeof window.matchMedia &&
              window.matchMedia("(prefers-reduced-motion: reduce)");
            function v(t, e) {
              var n;
              switch (e) {
                case "add":
                  (n = t.attr("tabindex"))
                    ? t.attr("data-wf-tabindex-swap", n)
                    : t.attr("tabindex", "-1");
                  break;
                case "remove":
                  (n = t.attr("data-wf-tabindex-swap"))
                    ? (t.attr("tabindex", n),
                      t.removeAttr("data-wf-tabindex-swap"))
                    : t.removeAttr("tabindex");
              }
              t.toggleClass("wf-force-outline-none", "add" === e);
            }
            function w(e) {
              var a = e.currentTarget;
              if (
                !(
                  i.env("design") ||
                  (window.$.mobile &&
                    /(?:^|\s)ui-link(?:$|\s)/.test(a.className))
                )
              ) {
                var c =
                  p.test(a.hash) && a.host + a.pathname === n.host + n.pathname
                    ? a.hash
                    : "";
                if ("" !== c) {
                  var h,
                    d = t(c);
                  d.length &&
                    (e && (e.preventDefault(), e.stopPropagation()),
                    (h = c),
                    n.hash !== h &&
                      r &&
                      r.pushState &&
                      !(i.env.chrome && "file:" === n.protocol) &&
                      (r.state && r.state.hash) !== h &&
                      r.pushState({ hash: h }, "", h),
                    window.setTimeout(function () {
                      !(function (e, n) {
                        var i = o.scrollTop(),
                          r = (function (e) {
                            var n = t(l),
                              i =
                                "fixed" === n.css("position")
                                  ? n.outerHeight()
                                  : 0,
                              r = e.offset().top - i;
                            if ("mid" === e.data("scroll")) {
                              var a = o.height() - i,
                                s = e.outerHeight();
                              s < a && (r -= Math.round((a - s) / 2));
                            }
                            return r;
                          })(e);
                        if (i !== r) {
                          var a = (function (t, e, n) {
                              if (
                                "none" ===
                                  document.body.getAttribute(
                                    "data-wf-scroll-motion",
                                  ) ||
                                m.matches
                              )
                                return 0;
                              var i = 1;
                              return (
                                s.add(t).each(function (t, e) {
                                  var n = parseFloat(
                                    e.getAttribute("data-scroll-time"),
                                  );
                                  !isNaN(n) && n >= 0 && (i = n);
                                }),
                                (472.143 * Math.log(Math.abs(e - n) + 125) -
                                  2e3) *
                                  i
                              );
                            })(e, i, r),
                            c = Date.now(),
                            h = function () {
                              var t,
                                e,
                                o,
                                s,
                                l,
                                d = Date.now() - c;
                              (window.scroll(
                                0,
                                ((t = i),
                                (e = r),
                                (o = d) > (s = a)
                                  ? e
                                  : t +
                                    (e - t) *
                                      ((l = o / s) < 0.5
                                        ? 4 * l * l * l
                                        : (l - 1) * (2 * l - 2) * (2 * l - 2) +
                                          1)),
                              ),
                                d <= a ? u(h) : "function" == typeof n && n());
                            };
                          u(h);
                        }
                      })(d, function () {
                        (v(d, "add"),
                          d.get(0).focus({ preventScroll: !0 }),
                          v(d, "remove"));
                      });
                    }, 300 * !e));
                }
              }
            }
            return {
              ready: function () {
                var { WF_CLICK_EMPTY: t, WF_CLICK_SCROLL: n } = e;
                (a.on(n, d, w),
                  a.on(t, h, function (t) {
                    t.preventDefault();
                  }),
                  document.head.insertBefore(f, document.head.firstChild));
              },
            };
          }),
        );
      
}