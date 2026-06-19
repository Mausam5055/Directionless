# DIRECTIONLESS Reconstruction: Master Findings & Engineering Manual

This document consolidates all reverse-engineering findings, architectural decisions, mathematical formulations, and debugging resolutions discovered during the 1:1 reconstruction of the **DIRECTIONLESS** Webflow website into a local, self-contained Vite development environment.

---

## 1. Directory Structure & Workspace Asset Inventory

The reconstructed project workspace is organized as follows:

```
d:\directionless\directionless.webflow.io\
├── 694347ea3d2a1ac9916fe51e/          # Webflow Site Scope Folder
│   ├── css/
│   │   └── directionless.webflow.shared.76de48e89.min.css  # Core layout layouts & resets
│   ├── js/
│   │   └── webflow.751e0867.7161e47da9598001.js            # Webflow standard engine
│   ├── 6943d846108489a2ae626f97_PPNeueMontreal-Italic.otf  # Custom fonts
│   └── [illustrations]                 # 50+ background SVGs, illustrations & assets
├── js/
│   ├── directionless.js               # Consolidated local JS engine (reverse-engineered)
│   └── jquery-3.5.1.min.dc5e7f18c8.js # Local jQuery library dependency
├── npm/                               # Statically mapped JS animation libraries
│   ├── gsap@3.12.5/
│   ├── gsap@3.13.0/                   # DrawSVG, CustomEase
│   ├── gsap@3.14.1/                   # ScrollTrigger, SplitText, Flip
│   ├── lenis@1.2.3/
│   └── locomotive-scroll/
├── index.html                         # Re-mapped HTML template (renamed from index.htm)
├── package.json                       # Vite project script settings & dependencies
├── vite.config.js                     # Vite dev-server config mapping
└── findings.md                        # This master reference document
```

---

## 2. Core Layout & Fluid Styling System

The project relies on the **Osmo Supply Styling System** to enforce consistent layouts across resolutions using dynamic fluid typography. Instead of standard breakpoints, it calculates sizing using a screen-width ratio.

### Fluid CSS Reset Configuration
```css
:root {
  --size-unit: 16;              /* Designer base font size in pixels */
  --size-container-ideal: 1728; /* Base canvas width (Figma design width) */
  --size-container-min: 992px;  /* Minimum width bound */
  --size-container-max: 1920px; /* Maximum width bound */
  --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
  
  /* Font size scales fluidly based on viewport vs canvas width */
  --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));

  /* Harmonious Color Palette */
  --black: #121212;
  --light: #ffffff;
  --dark: #1E1E1E;
  --grey: #F4F4F4;
  --lightBlue: #1A73E8;
  --dark-grey: #DFDFDF;
  --darker-grey: #6C6C6C;
  --blue: #514CF5;
}

/* Fluid breakpoints adjustments for tablets/mobiles */
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

## 3. Dynamic Section Theme Switching

Theme transitions occur smoothly during vertical scroll operations. A dedicated trigger evaluation scans for custom section theme properties and updates the body attributes.

### Trigger Logic
1. Target DOM elements specify custom themes via `data-theme-section` attributes (e.g. `light`, `grey`, `dark`, `white`, `blue`, `saturated`).
2. An active evaluation threshold is defined at **95% of the viewport height**:
   $$\text{Trigger Position} = \text{Viewport Height} \times 0.95$$
3. As the scroll offset changes, the client coordinates are evaluated:
   ```javascript
   const triggerPos = window.innerHeight * 0.95;
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
4. CSS handles variable mappings based on `data-theme` updates:
   ```css
   [data-theme="light"] { background-color: var(--grey); color: var(--dark); }
   [data-theme="dark"] { background-color: var(--black); color: var(--grey); }
   [data-theme="blue"] { background-color: var(--lightBlue); color: var(--light); }
   ```

---

## 4. SVG Concentric Clock Spiral Math

A core graphic of the website is an interactive concentric clock spiral. Rather than rendering static SVG layouts, the clock geometry is generated programmatically at load time.

```
                  * * *
              *     12    *
            *    11    1     *  <-- Inner ticks spiral in geometrically
           *   10        2    *
          *   9     .     3    *   Radius scaling: R_n = R_{n-1} * 0.985
           *   8         4    *
            *    7     5     *
              *     6     *
                  * * *
```

### Mathematical Formulation
* **Radius Decay Loop:** Starting with $R_0 = 2200$, the radius decreases at each tick step $n$ by:
  $$R_n = R_{n-1} \times 0.985$$
* **Angle Delta:** Standard increment step maps to a clock minute tick:
  $$\Delta\theta = \frac{2\pi}{60}$$
* **Tick Segment Coordinates:** Hour ticks are drawn longer and thicker:
  $$\text{Length} (d) = \begin{cases} 0.15 \times R_n & \text{if } (n \bmod 5) = 0 \text{ (Hour)} \\ 0.05 \times R_n & \text{otherwise (Minute)} \end{cases}$$
  
  $$\text{Stroke Width} (w) = \begin{cases} 0.025 \times R_n & \text{if Hour} \\ 0.01 \times R_n & \text{otherwise} \end{cases}$$
  
  $$\text{Point}_1 = (R_n \cos(\theta), R_n \sin(\theta))$$
  
  $$\text{Point}_2 = ((R_n - d) \cos(\theta), (R_n - d) \sin(\theta))$$

* **Roman Numeral Placement & Orientation:** Hour indices are placed slightly inward from the tick marks:
  $$\text{Offset Radius} (R_{\text{num}}) = R_n - d - 0.15 \times R_n$$
  
  $$\text{Pos} = (R_{\text{num}} \cos(\theta), R_{\text{num}} \sin(\theta))$$
  
  $$\text{Text Rotation (degrees)} = \frac{180 \times \theta}{\pi} + 90$$

* **Scroll Animation Scrub Bindings:**
  - Scaled group wrapper dynamically rotates over scroll depth:
    ```javascript
    gsap.timeline({
      scrollTrigger: {
        trigger: ".time-clock_layout",
        start: "top 100%",
        end: () => "+=" + window.innerHeight * 3,
        scrub: 1
      }
    })
    .to("#spiral-group", { rotation: 45, transformOrigin: "center center" })
    .to(".clock-segment", { opacity: 1, scale: 1, y: 100, stagger: { amount: 2, from: "start" } }, "<")
    .to(".clock-segment", { opacity: 0, scale: 0.5, y: 150, stagger: { amount: 2, from: "start" } }, "<+=1.5");
    ```

---

## 5. WebGL Shatter Trail Distortion Engine

Hover events over images trigger a custom WebGL2 multi-texture shader rendering dynamic shattering ripples, trail histories, and chromatic splitting offsets.

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
uniform vec2  uTrail[25];  // 25-step coordinates array mapping trail history
uniform float uTrailStrength;
uniform float uTrailPower;

out vec4 fragColor;

const float PI = 3.14159265359;

mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

/* Fits image inside plane (background-size: cover equivalent) */
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

/* Voronoi Noise Cell Generator for Shard Boundaries */
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

/* Fractional Brownian Motion for Liquid Deformation */
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

/* Mask calculations inside pixel coords */
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

  /* Velocity-dependent Chromatic Aberration */
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

### Physics Tracking & Inertia Buffers
* **Exponential Move interpolation:** On active hover movements, cursor position coordinates interpolate over frame steps ($\text{dt}$):
  $$P_{\text{current}} = P_{\text{current}} + (P_{\text{target}} - P_{\text{current}}) \times (1 - e^{-\lambda \cdot \text{dt}})$$
  where $\lambda = 9$ represents the tracking ease factor.
* **Inertial Decay:** On hover exit, the speed velocity falls geometrically:
  $$V_{\text{current}} = V_{\text{current}} \times I^{60 \cdot \text{dt}}$$
  where $I = 0.45$ represents the inertia coefficient. Fade-out opacity is triggered using a delay parameter of 250ms and a duration scale of 700ms.
* **Multi-Substep Splitting:** If the delta between two cursor tracking ticks is larger than $14\text{px}$, the engine interpolates coordinates up to $8$ intermediate sub-steps, maintaining visual continuity:
  $$P_{\text{sub}} = P_{\text{last}} + (P_{\text{new}} - P_{\text{last}}) \times \frac{i}{\text{Steps}}$$

---

## 6. Animation Controller & GSAP Timelines

All standard timelines are combined under a unified client engine (`AnimationController`) configured using custom scroll-bound parameters.

### A. Preloader Sequence
* The loader uses a custom vector ease definition:
  ```javascript
  CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");
  ```
* Resolves the logo clip-path mask over 3 seconds, fades the layout, and slides up the container coordinates:
  ```javascript
  gsap.timeline({ defaults: { ease: "loader" } })
    .to("[data-load-logo]", { clipPath: "inset(0% 0% 0% 0%)", duration: 3.0 })
    .to("[data-load-container]", { autoAlpha: 0, duration: 0.5 })
    .to("[data-load-bg]", { yPercent: -101, duration: 1.0 }, "hideContent");
  ```

### B. FLIP Text Stagger
* Words load within boundary lines, and then re-append to a final reading line without visual snapping.
* Layout positions are evaluated dynamically (indices 1 to 4 map to top-left, top-right, bottom-left, and bottom-right container margins):
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
* The settled layout states are captured using GSAP FLIP, elements are re-appended, and animations resolve sequentially:
  ```javascript
  const state = Flip.getState(words);
  words.forEach((w, idx) => target[idx].appendChild(w));
  Flip.from(state, { duration: 0.5, ease: "expo.inOut", absolute: true, nested: true, stagger: 0.03 });
  ```

### C. Staggered Drip Bars Cover
* **Visual Behavior:** Large organic drops vertical cover.
* **Layout Adaptability:** Desktop initializes 12 columns, Tablet 6 columns, and Mobile 3 columns.
* **Calculated Delay offsets:** Delays mapped statically:
  $$D = [1.5, 1.2, 2.5, 2.0, 0.2, 1.6, 1.4, 1.9, 1.1, 1.2, 2.4, 2.1]\text{ seconds}$$
* Bars drop dynamically, covering the viewport:
  ```javascript
  gsap.set(bar, { height: 0 });
  gsap.to(bar, { height: "120vh", duration: (c >= 2 ? 1 : 2), delay: delayOffset, ease: "none" });
  ```

### D. Randomized Pixel Checkerboard Reveal
* **Grid calculations:**
  - Column counts scale by breakpoint (Desktop: 8, Tablet: 6, Mobile: 4).
  - Block size ($B$) maps directly to screen widths:
    $$B = \lceil \text{Width} / \text{Cols} \rceil\text{ px}$$
  - Row calculations ($R$):
    $$R = \lceil \text{Height} / B \rceil + 2$$
* Grid is populated with $S = \text{Cols} \times R$ nodes.
* Staggers blocks randomly with scrub animations over vertical scrolls:
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

### E. Character-Level Text Split Scrolls
* Target elements split to letter arrays using `SplitText`.
* Stagger timelines animate letters:
  - Fade-in starts from first characters index (**start**).
  - Fade-out starts from last characters index (**end**).
  ```javascript
  const charsTimeline = gsap.timeline();
  // Reveal characters from left-to-right
  charsTimeline.to(split.chars, { autoAlpha: 1, duration: 0.7, stagger: { amount: 0.7, from: "start" }, ease: "none" });
  // Fade out characters from right-to-left
  charsTimeline.to(split.chars, { autoAlpha: 0, duration: 0.7, stagger: { amount: 0.7, from: "end" }, ease: "none" }, ">+1");
  ```

---

## 7. Migration Quirks, Debugging & Resolutions

During the port from remote hosting into a static offline directory, several local execution bugs were identified and resolved.

### A. Subresource Integrity (SRI) Blockers
* **Symptom:** Scraped `<script>` and `<link>` tags (including standard jQuery and Webflow engines) failed to load locally, throwing script execution blockages in the browser console.
* **Cause:** The scraper saved absolute CDN file targets that had static `integrity="..."` hashes and `crossorigin` attributes. When served from a local address context, standard browser security blocked them due to cross-origin hashes mismatch.
* **Resolution:** Removed all `integrity` and `crossorigin` properties from local HTML link tags, allowing normal script asset loads.

### B. Vite %40-Escaped URL Path Failure
* **Symptom:** Scripts loaded under nested library routes returned HTTP `404` errors under Vite's development serving cycle.
* **Cause:** Webflow maps script CDN locations using URL-escaped structures, converting `@` into `%40` (e.g. `npm/lenis%401.2.3/...`). Vite struggles to process percentage-escaped characters in directory path structures.
* **Resolution:** Re-wrote and decoded all references to standard directory formats:
  ```html
  <!-- Before (Failed Local Resolution) -->
  <script src="npm/lenis%401.2.3/dist/lenis.min.js"></script>

  <!-- After (Fully Resolved) -->
  <script src="npm/lenis@1.2.3/dist/lenis.min.js"></script>
  ```

### C. Made in Webflow Watermark Suppression
* **Symptom:** A "Made in Webflow" branding badge displays dynamically in the bottom-right viewport corner.
* **Cause:** The Webflow core engine inserts dynamic badge markup at initialization.
* **Resolution:** Added a global stylesheet rule configuration override in `index.html` to suppress the watermark visually:
  ```css
  .w-webflow-badge {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  ```

---

## 8. Local Serving Guide

### Package Configuration (`package.json`)
```json
{
  "name": "directionless-clone",
  "version": "1.0.0",
  "description": "Local 1:1 self-contained clone of directionless.webflow.io",
  "main": "index.html",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
```

### Running the Project Locally
To run the local hot-reloading development server:
```powershell
# Install Vite dependencies
npm install

# Start Vite development server
npm run dev
```
The application will automatically launch and be available on `http://localhost:3000/`.
