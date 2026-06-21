# Directionless Website - Presentation & Cross-Questioning Guide

This document is prepared to help you navigate your cross-questioning session regarding the **Directionless** web project. It breaks down the complex animations, underlying logic, and the various assets (images, fonts, audio) used in the website in simple, easy-to-explain terms.

---

## 1. Core Technologies & Logic (Lenis & GSAP)

### Q: How does the smooth scrolling work on the website? What is Lenis?
**A:** We use a library called **Lenis** to achieve the smooth scrolling effect. Unlike default browser scrolling which can feel jumpy, Lenis intercepts the scroll events and applies mathematical interpolation (easing) to create a buttery smooth, continuous scroll.
- **Integration with GSAP:** We tie Lenis's scroll updates directly to GSAP's `ScrollTrigger.update()`. This ensures that all scroll-based animations stay perfectly in sync with the smooth scroll position without any visual lag.

### Q: You use GSAP for animations. Can you explain what ScrollTrigger is and how it’s utilized?
**A:** GSAP (GreenSock Animation Platform) is our core animation engine. **ScrollTrigger** is a GSAP plugin that allows us to trigger and scrub animations based on the user's scroll position.
- **How it's used:** Instead of animations playing automatically based on time, they are tied to the scrollbar. As the user scrolls down, the animation progresses forward; if they scroll up, it reverses. For example, the `runDeliriousFaceAnimation()` and `runSpiralScroll()` use `scrub: 1` to smoothly map the animation progress to the scroll distance with a 1-second smoothing delay.

### Q: What is the `AnimationController` and why is it structured this way?
**A:** The `AnimationController` (in `animation.ts`) is a centralized class that orchestrates all animations on the site. It initializes Lenis, sets up the GSAP ticker, and registers various animation routines (like `runLoaderAnimation`, `runHeroAnimation`, `runScrollAnimations`). Structuring it this way ensures our code is modular, easy to maintain, and prevents animation logic from being scattered randomly across files.

---

## 2. Complex Animations Explained Simply

### Q: How does the "Shatter" or Pixel Transition effect work?
**A:** The pixel transition (`runInitPixelTransition`) dynamically creates a grid of `<div>` elements based on the screen's width and height. GSAP then animates these grid blocks (`.pixel-transition-block`) to appear randomly (`stagger: { amount: 1, from: "random" }`), creating a retro, pixelated wipe effect that transitions the user into the next section.

### Q: Explain the text animations. How do words and lines appear so cleanly?
**A:** We use GSAP's **SplitText** plugin. It takes standard HTML text and breaks it down into individual `<div>` elements for lines, words, or characters. We then use GSAP timelines to animate these smaller parts—typically revealing them from the bottom up (`yPercent: 110` to `0`) and fading them in, giving a polished, cascading reveal effect as the user scrolls into view.

### Q: How does the interactive Globe (Wireframe) work?
**A:** The globe is built using **D3.js** and **TopoJSON** mapped onto an HTML5 `<canvas>`.
- **Logic:** It fetches world atlas data (countries-110m.json), sets up an orthographic projection (which makes it look like a 3D sphere), and uses a continuous `requestAnimationFrame` loop to slowly rotate the projection coordinates. We draw a sphere outline, a graticule (the grid lines), and the landmasses on the canvas on every frame. It's completely math-driven rather than relying on a heavy 3D engine like Three.js.

### Q: How is the SVG Path drawing animation achieved?
**A:** We use GSAP's **DrawSVG** plugin. In `runPathScroll()`, we animate the `drawSVG` property from 0% to 100%. As the user scrolls, the plugin mathematically calculates the length of the vector path and manipulates the `stroke-dasharray` and `stroke-dashoffset` CSS properties to create the illusion of a line being drawn in real-time.

---

## 3. Visual Assets (Images, Parallax, and Design)

### Q: How do you handle the floating images and the "parallax" effect?
**A:** The floating images (like `man-drowning.png`, `delirious-face.png`, etc.) create a parallax effect. Parallax means things in the foreground move at a different speed than things in the background. We achieve this by applying GSAP `y` or `yPercent` translations to the image wrappers as the user scrolls. Some elements also use a continuous bouncing animation (`runConstantAnimations`), which just loops a `y` movement up and down using `yoyo: true`.

### Q: What kind of images are used and how are they optimized?
**A:** We use a mix of `.png` files (for elements with transparency like the floating items: `ball.png`, `chair.png`, `man-falling.png`) and `.jpg` (like `depression.jpg` for solid backgrounds).
- **Optimization:** In our HTML, we use the `srcset` attribute. We serve different resolutions (e.g., `-p-500.png`, `-p-800.png`, `-p-1080.png`) based on the user's device screen size (`sizes="100vw"`). This ensures mobile users don't download massive images meant for 4K desktop screens, optimizing load times significantly.

### Q: What SVGs are used and why?
**A:** SVGs (Scalable Vector Graphics) are used for the main background path animation, the clock segments, and UI elements like footer arrows. SVGs are math-based, meaning they are infinitely scalable without losing quality and have a tiny file size compared to PNGs.

---

## 4. Typography & Fonts

### Q: What font is the website using and why?
**A:** The site exclusively uses **PP Neue Montreal** (available in Bold, Book, Italic, Medium, SemiBoldItalic, and Thin weights). It's a premium, modern sans-serif font that gives the website an editorial, sophisticated, and slightly brutalist aesthetic, fitting the theme of "Directionless" perfectly. It ensures high readability while maintaining a strong design personality.

---

## 5. Audio & Atmosphere

### Q: I noticed there's an audio component. How does that fit into the experience?
**A:** The website features background audio (`calm.mp3` and `sad.mp3`) which is controlled via an interactive toggle button (`#audio-toggle`) featuring animated CSS waves. The audio is vital to the "Directionless" experience, transforming it from a simple webpage into an immersive, emotional digital art piece. The tracks evoke specific moods that align with the visual narrative of feeling lost or overwhelmed.

---

## Inspiration & Conceptual Questions

### Q: What was the inspiration behind this site's specific aesthetic?
**A:** The inspiration comes from modern digital storytelling, brutalism, and editorial web design. It aims to visualize the feeling of being "Directionless"—hence the use of disjointed, floating elements, shifting color themes (from light to dark to saturated blue), and erratic pixel transitions. It’s "An ode to those who feel...", balancing chaotic feelings with a highly controlled, beautiful execution.

### Q: How does the "Theme Check" (`runCheckThemeSection`) logic work?
**A:** As the user scrolls, `AnimationController` constantly checks the bounding boxes of sections tagged with `data-theme-section`. If a section enters the viewport threshold, the controller updates a `data-theme` attribute on the `<body>` tag. Our CSS utilizes this global attribute to dynamically transition the background and text colors (e.g., to dark, grey, white, saturated) using smooth CSS transitions.
