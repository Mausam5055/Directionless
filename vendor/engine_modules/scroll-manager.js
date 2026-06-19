export default function(t, e, n) {

        "use strict";
        var i = n(949);
        i.define(
          "edit",
          (t.exports = function (t, e, n) {
            if (
              ((n = n || {}),
              (i.env("test") || i.env("frame")) &&
                !n.fixture &&
                !(function () {
                  try {
                    return !!(window.top.__Cypress__ || window.PLAYWRIGHT_TEST);
                  } catch (t) {
                    return !1;
                  }
                })())
            )
              return { exit: 1 };
            var r,
              o = t(window),
              a = t(document.documentElement),
              s = document.location,
              u = "hashchange",
              c =
                n.load ||
                function () {
                  var e, n, i;
                  ((r = !0),
                    (window.CustomEditor = !0),
                    o.off(u, h),
                    (e = function (e) {
                      var n;
                      t.ajax({
                        url: f("https://editor-api.custom.com/api/editor/view"),
                        data: { siteId: a.attr("data-wf-site") },
                        xhrFields: { withCredentials: !0 },
                        dataType: "json",
                        crossDomain: !0,
                        success:
                          ((n = e),
                          function (e) {
                            var i, r, o;
                            if (!e)
                              return void console.error(
                                "Could not load editor data",
                              );
                            ((e.thirdPartyCookiesSupported = n),
                              (r =
                                (i = e.scriptPath).indexOf("//") >= 0
                                  ? i
                                  : f("https://editor-api.custom.com" + i)),
                              (o = function () {
                                window.CustomEditor(e);
                              }),
                              t
                                .ajax({
                                  type: "GET",
                                  url: r,
                                  dataType: "script",
                                  cache: !0,
                                })
                                .then(o, d));
                          }),
                      });
                    }),
                    ((n = window.document.createElement("iframe")).src =
                      "https://custom.com/site/third-party-cookie-check.html"),
                    (n.style.display = "none"),
                    (n.sandbox = "allow-scripts allow-same-origin"),
                    (i = function (t) {
                      "WF_third_party_cookies_unsupported" === t.data
                        ? (p(n, i), e(!1))
                        : "WF_third_party_cookies_supported" === t.data &&
                          (p(n, i), e(!0));
                    }),
                    (n.onerror = function () {
                      (p(n, i), e(!1));
                    }),
                    window.addEventListener("message", i, !1),
                    window.document.body.appendChild(n));
                },
              l = !1;
            try {
              l =
                localStorage &&
                localStorage.getItem &&
                localStorage.getItem("CustomEditor");
            } catch (t) {}
            function h() {
              !r && /\?edit/.test(s.hash) && c();
            }
            function d(t, e, n) {
              throw (console.error("Could not load editor script: " + e), n);
            }
            function f(t) {
              return t.replace(/([^:])\/\//g, "$1/");
            }
            function p(t, e) {
              (window.removeEventListener("message", e, !1), t.remove());
            }
            return (
              /[?&](update)(?:[=&?]|$)/.test(s.search) ||
              /\?update$/.test(s.href)
                ? (function () {
                    var t = document.documentElement,
                      e = t.getAttribute("data-wf-site"),
                      n = t.getAttribute("data-wf-page"),
                      i = t.getAttribute("data-wf-item-slug"),
                      r = t.getAttribute("data-wf-collection"),
                      o = t.getAttribute("data-wf-domain");
                    if (e && n) {
                      var a = "pageId=" + n + "&mode=edit";
                      ((a += "&simulateRole=editor"),
                        i &&
                          r &&
                          o &&
                          (a +=
                            "&domain=" +
                            encodeURIComponent(o) +
                            "&itemSlug=" +
                            encodeURIComponent(i) +
                            "&collectionId=" +
                            r),
                        (window.location.href =
                          "https://custom.com/external/designer/" +
                          e +
                          "?" +
                          a));
                    }
                  })()
                : l
                  ? c()
                  : s.search
                    ? (/[?&](edit)(?:[=&?]|$)/.test(s.search) ||
                        /\?edit$/.test(s.href)) &&
                      c()
                    : o.on(u, h).triggerHandler(u),
              {}
            );
          }),
        );
      
}