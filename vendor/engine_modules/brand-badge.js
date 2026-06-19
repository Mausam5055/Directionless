export default function(t, e, n) {

        "use strict";
        var i = n(949);
        i.define(
          "brand",
          (t.exports = function (t) {
            var e,
              n = {},
              r = document,
              o = t("html"),
              a = t("body"),
              s = window.location,
              u = /PhantomJS/i.test(navigator.userAgent),
              c =
                "fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange";
            function l() {
              var n =
                r.fullScreen ||
                r.mozFullScreen ||
                r.webkitIsFullScreen ||
                r.msFullscreenElement ||
                !!r.webkitFullscreenElement;
              t(e).attr("style", n ? "display: none !important;" : "");
            }
            function h() {
              var t = a.children(".w-custom-badge"),
                n = t.length && t.get(0) === e,
                r = i.env("editor");
              if (n) {
                r && t.remove();
                return;
              }
              (t.length && t.remove(), r || a.append(e));
            }
            return (
              (n.ready = function () {
                var n,
                  i,
                  a,
                  d = o.attr("data-wf-status"),
                  f = o.attr("data-wf-domain") || "";
                (/\.custom\.io$/i.test(f) && s.hostname !== f && (d = !0),
                  d &&
                    !u &&
                    ((e =
                      e ||
                      ((n = t('<a class="w-custom-badge"></a>').attr(
                        "href",
                        "https://custom.com?utm_campaign=brandjs",
                      )),
                      (i = t("<img>")
                        .attr(
                          "src",
                          "https://d3e54v103j8qbb.cloudfront.net/img/custom-badge-icon-d2.89e12c322e.svg",
                        )
                        .attr("alt", "")
                        .css({ marginRight: "4px", width: "26px" })),
                      (a = t("<img>")
                        .attr(
                          "src",
                          "https://d3e54v103j8qbb.cloudfront.net/img/custom-badge-text-d2.c82cec3b78.svg",
                        )
                        .attr("alt", "Made in Custom")),
                      n.append(i, a),
                      n[0])),
                    h(),
                    setTimeout(h, 500),
                    t(r).off(c, l).on(c, l)));
              }),
              n
            );
          }),
        );
      
}