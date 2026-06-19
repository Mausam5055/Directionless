// @ts-nocheck
export function initClockSVG() {
  function t(t) {
    const e = {
      M: 1e3,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let r = "";
    for (const i in e) for (; t >= e[i]; ) ((r += i), (t -= e[i]));
    return r;
  }
  const e = "http://www.w3.org/2000/svg",
    r = document.getElementById("spiral-group"),
    i = getComputedStyle(document.documentElement)
      .getPropertyValue("--dark")
      .trim();
  let o = 2200;
  const n = 0.985;
  let s = 0;
  const a = (2 * Math.PI) / 60,
    l = document.createDocumentFragment();
  let c = 3;
  for (; o > 50; ) {
    const r = Math.round(s / a) % 5 == 0,
      u = r ? 0.025 * o : 0.01 * o,
      h = r ? 0.15 * o : 0.05 * o,
      m = Math.cos(s),
      d = Math.sin(s),
      p = o - h,
      f = o * m,
      g = o * d,
      _ = p * m,
      x = p * d,
      v = document.createElementNS(e, "g");
    v.setAttribute("class", "clock-segment");
    const b = document.createElementNS(e, "line");
    if (
      (b.setAttribute("x1", f),
      b.setAttribute("y1", g),
      b.setAttribute("x2", _),
      b.setAttribute("y2", x),
      b.setAttribute("class", "clock-ink tick-mark"),
      b.setAttribute("stroke-width", u),
      v.appendChild(b),
      r)
    ) {
      const r = ((c - 1) % 12) + 1,
        n = p - 0.15 * o,
        a = n * m,
        l = n * d,
        u = document.createElementNS(e, "text");
      ((u.textContent = t(r)), u.setAttribute("class", "hour-text"));
      const h = 0.2 * o,
        f = 0.06 * h;
      (u.setAttribute("font-size", h),
        u.setAttribute("fill", i),
        u.setAttribute("stroke", i),
        u.setAttribute("stroke-width", f),
        u.setAttribute("stroke-linejoin", "round"));
      const g = (180 * s) / Math.PI + 90;
      (u.setAttribute("transform", `translate(${a}, ${l}) rotate(${g})`),
        v.appendChild(u),
        c++);
    }
    (l.appendChild(v), (s += a), (o *= n));
  }
  (r.appendChild(l),
    gsap.set(".clock-segment", {
      opacity: 0,
      scale: 0.5,
      transformOrigin: "50% 50%",
    }));
}