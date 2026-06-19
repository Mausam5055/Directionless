export default function(t, e, n) {

        "use strict";
        n(949).define(
          "touch",
          (t.exports = function (t) {
            var e = {},
              n = window.getSelection;
            function i(e) {
              var i,
                r,
                o = !1,
                a = !1,
                s = Math.min(Math.round(0.04 * window.innerWidth), 40);
              function u(t) {
                var e = t.touches;
                (e && e.length > 1) ||
                  ((o = !0),
                  e ? ((a = !0), (i = e[0].clientX)) : (i = t.clientX),
                  (r = i));
              }
              function c(e) {
                if (o) {
                  if (a && "mousemove" === e.type) {
                    (e.preventDefault(), e.stopPropagation());
                    return;
                  }
                  var i,
                    u,
                    c,
                    l,
                    d = e.touches,
                    f = d ? d[0].clientX : e.clientX,
                    p = f - r;
                  ((r = f),
                    Math.abs(p) > s &&
                      n &&
                      "" === String(n()) &&
                      ((i = "swipe"),
                      (u = e),
                      (c = { direction: p > 0 ? "right" : "left" }),
                      (l = t.Event(i, { originalEvent: u })),
                      t(u.target).trigger(l, c),
                      h()));
                }
              }
              function l(t) {
                if (o && ((o = !1), a && "mouseup" === t.type)) {
                  (t.preventDefault(), t.stopPropagation(), (a = !1));
                  return;
                }
              }
              function h() {
                o = !1;
              }
              (e.addEventListener("touchstart", u, !1),
                e.addEventListener("touchmove", c, !1),
                e.addEventListener("touchend", l, !1),
                e.addEventListener("touchcancel", h, !1),
                e.addEventListener("mousedown", u, !1),
                e.addEventListener("mousemove", c, !1),
                e.addEventListener("mouseup", l, !1),
                e.addEventListener("mouseout", h, !1),
                (this.destroy = function () {
                  (e.removeEventListener("touchstart", u, !1),
                    e.removeEventListener("touchmove", c, !1),
                    e.removeEventListener("touchend", l, !1),
                    e.removeEventListener("touchcancel", h, !1),
                    e.removeEventListener("mousedown", u, !1),
                    e.removeEventListener("mousemove", c, !1),
                    e.removeEventListener("mouseup", l, !1),
                    e.removeEventListener("mouseout", h, !1),
                    (e = null));
                }));
            }
            return (
              (t.event.special.tap = {
                bindType: "click",
                delegateType: "click",
              }),
              (e.init = function (e) {
                return (e = "string" == typeof e ? t(e).get(0) : e)
                  ? new i(e)
                  : null;
              }),
              (e.instance = e.init(document)),
              e
            );
          }),
        );
      
}