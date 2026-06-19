export default function(t, e, n) {

        "use strict";
        var i = n(949);
        i.define(
          "focus",
          (t.exports = function () {
            var t = [],
              e = !1;
            function n(n) {
              e &&
                (n.preventDefault(),
                n.stopPropagation(),
                n.stopImmediatePropagation(),
                t.unshift(n));
            }
            function r(n) {
              var i, r;
              ((r = (i = n.target).tagName),
                ((/^a$/i.test(r) && null != i.href) ||
                  (/^(button|textarea)$/i.test(r) && !0 !== i.disabled) ||
                  (/^input$/i.test(r) &&
                    /^(button|reset|submit|radio|checkbox)$/i.test(i.type) &&
                    !i.disabled) ||
                  (!/^(button|input|textarea|select|a)$/i.test(r) &&
                    !Number.isNaN(Number.parseFloat(i.tabIndex))) ||
                  /^audio$/i.test(r) ||
                  (/^video$/i.test(r) && !0 === i.controls)) &&
                  ((e = !0),
                  setTimeout(() => {
                    for (e = !1, n.target.focus(); t.length > 0; ) {
                      var i = t.pop();
                      i.target.dispatchEvent(new MouseEvent(i.type, i));
                    }
                  }, 0)));
            }
            return {
              ready: function () {
                "undefined" != typeof document &&
                  document.body.hasAttribute("data-wf-focus-within") &&
                  i.env.safari &&
                  (document.addEventListener("mousedown", r, !0),
                  document.addEventListener("mouseup", n, !0),
                  document.addEventListener("click", n, !0));
              },
            };
          }),
        );
      
}