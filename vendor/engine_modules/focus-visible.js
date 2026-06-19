export default function(t, e, n) {

        "use strict";
        n(949).define(
          "focus-visible",
          (t.exports = function () {
            return {
              ready: function () {
                if ("undefined" != typeof document)
                  try {
                    document.querySelector(":focus-visible");
                  } catch (t) {
                    !(function (t) {
                      var e = !0,
                        n = !1,
                        i = null,
                        r = {
                          text: !0,
                          search: !0,
                          url: !0,
                          tel: !0,
                          email: !0,
                          password: !0,
                          number: !0,
                          date: !0,
                          month: !0,
                          week: !0,
                          time: !0,
                          datetime: !0,
                          "datetime-local": !0,
                        };
                      function o(t) {
                        return (
                          !!t &&
                          t !== document &&
                          "HTML" !== t.nodeName &&
                          "BODY" !== t.nodeName &&
                          "classList" in t &&
                          "contains" in t.classList
                        );
                      }
                      function a(t) {
                        t.getAttribute("data-wf-focus-visible") ||
                          t.setAttribute("data-wf-focus-visible", "true");
                      }
                      function s() {
                        e = !1;
                      }
                      function u() {
                        (document.addEventListener("mousemove", c),
                          document.addEventListener("mousedown", c),
                          document.addEventListener("mouseup", c),
                          document.addEventListener("pointermove", c),
                          document.addEventListener("pointerdown", c),
                          document.addEventListener("pointerup", c),
                          document.addEventListener("touchmove", c),
                          document.addEventListener("touchstart", c),
                          document.addEventListener("touchend", c));
                      }
                      function c(t) {
                        (t.target.nodeName &&
                          "html" === t.target.nodeName.toLowerCase()) ||
                          ((e = !1),
                          document.removeEventListener("mousemove", c),
                          document.removeEventListener("mousedown", c),
                          document.removeEventListener("mouseup", c),
                          document.removeEventListener("pointermove", c),
                          document.removeEventListener("pointerdown", c),
                          document.removeEventListener("pointerup", c),
                          document.removeEventListener("touchmove", c),
                          document.removeEventListener("touchstart", c),
                          document.removeEventListener("touchend", c));
                      }
                      (document.addEventListener(
                        "keydown",
                        function (n) {
                          n.metaKey ||
                            n.altKey ||
                            n.ctrlKey ||
                            (o(t.activeElement) && a(t.activeElement),
                            (e = !0));
                        },
                        !0,
                      ),
                        document.addEventListener("mousedown", s, !0),
                        document.addEventListener("pointerdown", s, !0),
                        document.addEventListener("touchstart", s, !0),
                        document.addEventListener(
                          "visibilitychange",
                          function () {
                            "hidden" === document.visibilityState &&
                              (n && (e = !0), u());
                          },
                          !0,
                        ),
                        u(),
                        t.addEventListener(
                          "focus",
                          function (t) {
                            if (o(t.target)) {
                              var n, i, s;
                              (e ||
                                ((i = (n = t.target).type),
                                ("INPUT" === (s = n.tagName) &&
                                  r[i] &&
                                  !n.readOnly) ||
                                  ("TEXTAREA" === s && !n.readOnly) ||
                                  n.isContentEditable ||
                                  0)) &&
                                a(t.target);
                            }
                          },
                          !0,
                        ),
                        t.addEventListener(
                          "blur",
                          function (t) {
                            if (
                              o(t.target) &&
                              t.target.hasAttribute("data-wf-focus-visible")
                            ) {
                              var e;
                              ((n = !0),
                                window.clearTimeout(i),
                                (i = window.setTimeout(function () {
                                  n = !1;
                                }, 100)),
                                (e = t.target).getAttribute(
                                  "data-wf-focus-visible",
                                ) &&
                                  e.removeAttribute("data-wf-focus-visible"));
                            }
                          },
                          !0,
                        ));
                    })(document);
                  }
              },
            };
          }),
        );
      
}