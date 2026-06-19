# Technical Specification & Reconstruction Document: DIRECTIONLESS

This document provides a highly detailed, line-by-line, and mathematically precise analysis of the visual, layout, and animation systems of **DIRECTIONLESS** (`https://directionless.webflow.io/`). It functions as a complete engineering guide for recreating this premium experience 1:1 in a local, self-contained, offline environment.

---

## 1. Directory Structure & Workspace Asset Inventory

The project structure is organized locally as follows:

```
d:\directionless\directionless.webflow.io\
├── 694347ea3d2a1ac9916fe51e/          # Webflow Site ID Scope
│   ├── css/
│   │   └── directionless.webflow.shared.76de48e89.min.css  # Core layouts & resets
│   ├── js/
│   │   └── webflow.751e0867.7161e47da9598001.js            # Webflow UI interactions
│   ├── 6943d846108489a2ae626f97_PPNeueMontreal-Italic.otf  # Font weights (Thin to Bold)
│   ├── ...
│   └── [illustrations]                 # 50+ layout graphics & typography images
├── js/
│   └── jquery-3.5.1.min.dc5e7f18c8.js # jQuery framework dependency
├── npm/                               # Local Copies of animation packages
│   ├── gsap@3.12.5/
│   ├── gsap@3.13.0/                   # DrawSVG, CustomEase
│   ├── gsap@3.14.1/                   # ScrollTrigger, SplitText, Flip, ScrollSmoother
│   ├── lenis@1.2.3/
│   └── locomotive-scroll/
├── index.htm                          # Core HTML file
├── WEB.md                             # This documentation
└── webcopy-origin.txt                 # Original manifest from scraper
```

---

## 2. Global Styling System & Custom Reset

The site incorporates the **Osmo Supply Scaling System**, which relies on dynamic fluid typography scaled to the screen width using a calculated unit size clamp. In [index.htm](file:///d:/directionless/directionless.webflow.io/index.htm) (lines 23–66), the custom reset and scaling parameters are defined:

```css
:root {
  --size-unit: 16;              /* Base designer font size in pixels */
  --size-container-ideal: 1728; /* Base canvas width used in Figma design */
  --size-container-min: 992px;
  --size-container-max: 1920px;
  --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
  
  /* Font scale matches current container width relative to ideal design width */
  --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));

  /* Color Palette System */
  --black: #121212;
  --light: #ffffff;
  --dark: #1E1E1E;
  --grey: #F4F4F4;
  --lightBlue: #1A73E8;
  --dark-grey: #DFDFDF;
  --darker-grey: #6C6C6C;
  --blue: #514CF5;
}

/* Fluid Typography breakpoints for tablet and mobile viewports */
@media screen and (max-width: 991px)  { :root { --size-container-ideal: 768; } }
@media screen and (max-width: 767px)  { :root { --size-container-ideal: 550; } }
@media screen and (max-width: 479px)  { :root { --size-container-ideal: 402; } }

body {
  font-size: var(--size-font);
  color: var(--dark);
  transition: background-color 350ms ease, color 350ms ease;
}
```

---

## 3. Section Theme Switching Mechanism

As the user scrolls down, the page transitions smoothly between light, grey, dark, and blue themes. This is managed by the `runCheckThemeSection()` method:
1. All DOM elements with the attribute `data-theme-section` (e.g. `light`, `grey`, `dark`, `white`, `blue`, `saturated`) are gathered.
2. A trigger line is set at **95% of the viewport height**: `const triggerPos = window.innerHeight * 0.95`.
3. In the scroll event listener loop, the bounding rect of each section is evaluated. The section intersecting the trigger line determines the body theme:
   ```javascript
   let currentTheme = null;
   for (const section of sections) {
     const rect = section.getBoundingClientRect();
     if (rect.top <= triggerPos && rect.bottom >= triggerPos) {
       currentTheme = section.getAttribute("data-theme-section");
       break;
     }
   }
   if (currentTheme && document.body.getAttribute("data-theme") !== currentTheme) {
     document.body.setAttribute("data-theme", currentTheme);
   }
   ```
4. The CSS specifies transition-mappings that automatically morph variables based on `data-theme` state:
   ```css
   [data-theme="light"] { background-color: var(--grey); color: var(--dark); }
   [data-theme="dark"] { background-color: var(--black); color: var(--grey); }
   [data-theme="blue"] { background-color: var(--lightBlue); color: var(--light); }
   ```

---

## 4. Animation Timelines & Math Formulations

Here is the exact mathematical and programmatical breakdown of the animations orchestrated by GSAP:

### A. Preloader Sequence
* **DOM Structure:**
  ```html
  <div data-load-bg class="loader-wrapper">
    <div data-load-container class="loader-layout">
      <div class="loader-img_wrapper is--base"><img src="loader-image.png"></div>
      <div data-load-logo class="loader-img_wrapper is--top"><img src="loader-image.png"></div>
    </div>
  </div>
  ```
* **CSS Clip Path:** The overlay image `.is--top` uses absolute positioning and is clipped:
  ```css
  .loader-img_wrapper.is--top {
    -webkit-clip-path: inset(0% 100% 0% 0%);
    clip-path: inset(0% 100% 0% 0%);
  }
  ```
* **Timeline Logic:**
  - Instantiates `CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99")`.
  - Animates the clip-path of the logo to reveal it:
    ```javascript
    gsap.timeline({ defaults: { ease: "loader" } })
      .to("[data-load-logo]", { clipPath: "inset(0% 0% 0% 0%)", duration: 3.0 })
      .to("[data-load-container]", { autoAlpha: 0, duration: 0.5 })
      .to("[data-load-bg]", { yPercent: -101, duration: 1.0 }, "hideContent")
      .add(runHeroAnimation(), ">-0.5");
    ```

### B. Hero Words Slide-out & Flip
* **Visual Behavior:** Words slide out from boundary lines, and then re-append to a final reading line without snapping.
* **Flip Logic:**
  1. The entry layout contains text blocks with alignment data attributes (`data-anim="[[2,3],[1,4],[1,2]]"`).
  2. The position calculator reads these indices to translate elements to layout margins (1 = top-left, 2 = top-right, 3 = bottom-left, 4 = bottom-right):
     ```javascript
     function getCoords(parent, child, positionIndex) {
       const w = parent.clientWidth - child.offsetWidth;
       const h = parent.clientHeight - child.offsetHeight;
       switch (positionIndex) {
         case 1: return { x: 0, y: 0 };
         case 2: return { x: w, y: 0 };
         case 3: return { x: 0, y: h };
         case 4: return { x: w, y: h };
       }
     }
     ```
  3. Once layout animates and settles, the coordinates are captured: `const state = Flip.getState(words)`.
  4. The words are re-appended to `.hero-top_text-endwrap` inside the target DOM.
  5. The transition is smoothly interpolated:
     ```javascript
     Flip.from(state, { duration: 0.5, ease: "expo.inOut", absolute: true, nested: true, stagger: 0.03 });
     ```

### C. Drip Bars Screen Cover
* **Visual Behavior:** Large drips covering the screen.
* **Staggered Delay Calculations:**
  - Standard duration: $l = 2$ seconds.
  - Delay values: $n = [1.5, 1.2, 2.5, 2.0, 0.2, 1.6, 1.4, 1.9, 1.1, 1.2, 2.4, 2.1]$.
  - For each bar appended, its height is animated:
    ```javascript
    gsap.set(bar, { height: 0 });
    gsap.to(bar, { height: "120vh", duration: (c >= 2 ? 1 : l), delay: c, ease: "none" });
    ```

### D. Pixel Block Grid Cover
* **Logic:** 
  1. Calculates number of columns $C$ (Desktop: 8, Tablet: 6, Mobile: 4).
  2. Block size: $B = \lceil \text{window.innerWidth} / C \rceil$ pixels.
  3. Number of rows: $R = \lceil \text{window.innerHeight} / B \rceil + 2$.
  4. Grid size: $S = C \times R$ blocks.
  5. Generates $S$ child elements inside the `.pixel-transition` container.
  6. ScrollTrigger reveals them randomly:
     ```javascript
     gsap.timeline({
       scrollTrigger: {
         trigger: wrapper,
         start: "bottom bottom",
         end: () => "+=" + window.innerHeight * 1.2,
         scrub: 1,
         pin: true
       }
     }).to(blocks, { autoAlpha: 1, stagger: { amount: 1.0, from: "random" } });
     ```

### E. Spiraling Roman Clock SVG
* **Geometry Formulation:** 
  - Starts with an initial radius $o = 2200$ and decreases it geometrically by scaling $r = 0.985$ at each step.
  - Coordinates for line segments are computed:
    $$x_1 = o \times \cos(s), \quad y_1 = o \times \sin(s)$$
    $$x_2 = (o - d) \times \cos(s), \quad y_2 = (o - d) \times \sin(s)$$
    where $s$ increments by $c = \frac{2\pi}{60}$ (equivalent to a tick per minute) and $d$ is tick length ($0.15 \times o$ on hours, else $0.05 \times o$).
  - For Roman numeral positioning:
    $$p = o - d$$
    $$x_{\text{text}} = (p - 0.15 \times o) \times \cos(s)$$
    $$y_{\text{text}} = (p - 0.15 \times o) \times \sin(s)$$
  - Rotation of the numeral in degrees:
    $$\theta = \frac{180 \times s}{\pi} + 90$$
  - Code implementation:
    ```javascript
    let radius = 2200;
    const factor = 0.985;
    let angle = 0;
    const step = (2 * Math.PI) / 60;
    let hourCounter = 3;

    while (radius > 50) {
      const isHour = Math.round(angle / step) % 5 === 0;
      const strokeWidth = isHour ? 0.025 * radius : 0.01 * radius;
      const tickLength = isHour ? 0.15 * radius : 0.05 * radius;
      
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Line drawing...
      const x1 = radius * cos, y1 = radius * sin;
      const x2 = (radius - tickLength) * cos, y2 = (radius - tickLength) * sin;
      
      if (isHour) {
        // Appends Roman numeral text representing: ((hourCounter - 1) % 12) + 1
        // Rotates text dynamically by: (180 * angle / Math.PI) + 90
        hourCounter++;
      }
      angle += step;
      radius *= factor;
    }
    ```
* **Scroll-Bound Timeline:**
  ```javascript
  gsap.timeline({
    scrollTrigger: {
      trigger: clockLayout,
      start: "top 100%",
      end: () => "+=" + window.innerHeight * 3,
      scrub: 1
    }
  })
  .to("#spiral-group", { rotation: 45, transformOrigin: "center center" })
  .to(".clock-segment", { opacity: 1, scale: 1, y: 100, stagger: { amount: 2, from: "start" } }, "<")
  .to(".clock-segment", { opacity: 0, scale: 0.5, y: 150, stagger: { amount: 2, from: "start" } }, "<+=1.5");
  ```

### F. Character split scrolling (Sticky Titles)
* **Visual Behavior:** Words split character-by-character, fading in from left to right, holding, and then fading away from right to left (end to start) to reveal the next stacked slide.
* **Logic:**
  ```javascript
  const charsTimeline = gsap.timeline();
  // Fade In Characters from Start
  charsTimeline.to(split.chars, { 
    autoAlpha: 1, 
    duration: 0.7, 
    stagger: { amount: 0.7, from: "start" }, 
    ease: "none" 
  });
  // Fade Out Characters from End
  charsTimeline.to(split.chars, { 
    autoAlpha: 0, 
    duration: 0.7, 
    stagger: { amount: 0.7, from: "end" }, 
    ease: "none" 
  }, ">+1");
  ```

---

## 5. WebGL Interactive Shader Code Specification

The core hover trail distortion shader is compiled in WebGL2. Below is the complete fragment shader structure used to render this effect.

### Fragment Shader Source (GLSL ES 3.0)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
uniform sampler2D uTexture;

uniform vec2  uPlaneSize;
uniform vec2  uTextureSize;

uniform vec2  uMousePos;
uniform float uTrackMouse;

uniform float uAmount;
uniform float uSpread;
uniform float uAngle;
uniform float uTime;
uniform float uSkew;
uniform vec2  uPos;

uniform int   uMixRadiusInvert;
uniform int   uEasing;
uniform int   uOctaves;

uniform float uRadiusPx;
uniform float uFeatherPx;
uniform float uBlobAmpPx;
uniform float uBlobScale;
uniform float uBlobDrift;
uniform float uSeed;

uniform float uChromAbPx;
uniform float uSpeed;

uniform float uOpacity;
uniform vec2  uTrail[25];  // Supports up to 25 cursor history nodes
uniform float uTrailStrength;
uniform float uTrailPower;

out vec4 fragColor;

const float PI = 3.14159265359;

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

// Cover image fitting mapping
vec2 coverUv(vec2 uv, vec2 srcSize, vec2 dstSize) {
  float srcAspect = srcSize.x / max(1.0, srcSize.y);
  float dstAspect = dstSize.x / max(1.0, dstSize.y);

  vec2 scale = (dstAspect > srcAspect)
    ? vec2(dstAspect / srcAspect, 1.0)
    : vec2(1.0, srcAspect / dstAspect);

  vec2 outUv = (uv - 0.5) * scale + 0.5;
  return clamp(outUv, 0.0, 1.0);
}

float ease(int mode, float t) {
  t = clamp(t, 0.0, 1.0);
  if (mode == 1) return t * t * (3.0 - 2.0 * t);
  if (mode == 2) return (t < 0.5) ? (2.0*t*t) : (1.0 - pow(-2.0*t + 2.0, 2.0) / 2.0);
  return t;
}

vec2 random2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),
                        dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// Voronoi Noise Cell mapping for Shatter boundaries
vec2 voronoidNoise(vec2 st) {
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);

  float m_dist = 15.0;
  vec2 m_point = vec2(0.0);

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 point = random2(i_st + neighbor);
      point = 0.5 + 0.5 * sin(5.0 + uTime * 0.2 + 6.2831 * point);

      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);

      if (dist < m_dist) {
        m_dist = dist;
        m_point = point;
      }
    }
  }
  return m_point;
}

vec2 voronoiFBM(vec2 st) {
  vec2 value = vec2(0.0);
  vec2 shift = vec2(100.0);
  float xp = sqrt(2.0);
  mat2 r = rot(0.5);

  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) break;
    value += voronoidNoise(st);
    st = st * xp + shift;
    st = r * st;
  }
  return value / float(max(uOctaves, 1));
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractional Brownian Motion for liquid drift mask
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise2(p);
    p = p * 2.0 + 17.0;
    a *= 0.5;
  }
  return v;
}

// Mask generation in pixel coords
float maskAtPx(vec2 uv, vec2 center, float radiusPx, float featherPx) {
  vec2 dp = (uv - center) * uPlaneSize;
  float d = length(dp);

  vec2 seedv = vec2(uSeed * 10.0, uSeed * 17.0);
  float drift = uTime * uBlobDrift;
  float n = fbm(uv * (uBlobScale * 2.0) + seedv + vec2(drift));
  d += (n - 0.5) * uBlobAmpPx;

  float m = 1.0 - smoothstep(radiusPx, radiusPx + featherPx, d);
  m = ease(uEasing, m);

  if (uMixRadiusInvert == 1) m = max(0.0, 0.5 - m);
  return m;
}

void main() {
  vec2 uv = coverUv(vUv, uTextureSize, uPlaneSize);

  float aspectRatio = uPlaneSize.x / max(1.0, uPlaneSize.y);
  vec2 skewVec = mix(vec2(1.0), vec2(1.0, 0.0), uSkew);

  vec2 st = (uv - uPos) * vec2(aspectRatio, 1.0) * 50.0 * uAmount;
  st = (rot(uAngle * 2.0 * PI) * st) * skewVec;

  vec2 m_point = voronoiFBM(st);
  vec2 offset = (m_point * 0.4 * uSpread) - (uSpread * 0.2);

  vec2 center = mix(uPos, uMousePos, uTrackMouse);

  float distAcc = maskAtPx(uv, center, uRadiusPx, uFeatherPx);

  for (int i = 0; i < 25; i++) {
    float t = 1.0 - float(i) / 25.0;
    t = pow(t, uTrailPower);
    if (t > 0.01) {
      float r = mix(uRadiusPx * 0.65, uRadiusPx, t);
      float f = mix(uFeatherPx * 0.8, uFeatherPx, t);
      float m = maskAtPx(uv, uTrail[i], r, f);
      distAcc += m * t * uTrailStrength;
    }
  }

  distAcc = clamp(distAcc, 0.0, 1.0) * uOpacity;

  vec2 baseUv = uv + offset * distAcc;
  float minDim = max(1.0, min(uPlaneSize.x, uPlaneSize.y));

  // Chromatic Aberration scaling based on velocity
  float sp = clamp(uSpeed, 0.0, 1.0);
  float ca = (uChromAbPx / minDim) * distAcc * (0.75 + 2.25 * sp) * (1.0 + 1.5 * distAcc);

  vec2 dir = normalize(offset + vec2(1e-6));
  vec2 ortho = vec2(-dir.y, dir.x);

  vec2 dR = (dir + ortho * 0.55) * ca;
  vec2 dB = (dir - ortho * 0.55) * ca;

  vec2 uvR = clamp(baseUv + dR, 0.0, 1.0);
  vec2 uvG = clamp(baseUv, 0.0, 1.0);
  vec2 uvB = clamp(baseUv - dB, 0.0, 1.0);

  vec4 gS = texture(uTexture, uvG);
  float rC = texture(uTexture, uvR).r;
  float bC = texture(uTexture, uvB).b;

  fragColor = vec4(rC, gS.g, bC, gS.a);
}
```

---

## 6. Implementation Rebuild Steps

To complete the 1:1 local reproduction offline:

1. **Write JavaScript Bundle:**
   - Save the complete extracted Slater JavaScript into `/js/directionless.js` as an ES module.
2. **Decouple Dynamic Script Loading:**
   - Modify the custom script blocks in [index.htm](file:///d:/directionless/directionless.webflow.io/index.htm) to load `/js/directionless.js` locally.
3. **Correct Missing Assets:**
   - If `logo512.png` is needed for meta properties, create or download a replacement and save it to the asset folder.
4. **Local Verification:**
   - Serve the directory using a local static server to confirm WebGL contexts and GSAP timelines initialize without errors.
