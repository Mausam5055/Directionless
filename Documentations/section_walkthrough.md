# Directionless - Presentation Walkthrough Script

This document is written in a natural, conversational tone so you can use it directly as a guide or script during your presentation. It blends layman explanations with the actual technical logic behind the scenes, explaining *how* the web scrolling experience is driven.

## 🧠 Mind Chart (Quick Reference)
Here is a quick-glance list of all the key effects, methods, and approaches used across the site for rapid memorization before your presentation:

*   **Smooth Scrolling** [Lenis library for overriding default browser scroll to make it fluid]
*   **Scroll Mapping** [GSAP ScrollTrigger to tie animations directly to the scrollbar instead of time]
*   **Text Masking & Reveals** [GSAP SplitText to split paragraphs, combined with hidden CSS frames to slide text up into view]
*   **Theme Switching / Crossfading** [Scroll tracking logic that updates a global `data-theme` attribute to trigger smooth CSS color transitions]
*   **Parallax Effect** [Pinning a section and moving foreground floating images at different speeds than the background to create 3D depth]
*   **Screen Wipes (Drip / Shatter)** [GSAP stagger animations combined with dynamically generated vertical bars or grid squares based on the user's screen width]
*   **Continuous Line Drawing** [GSAP DrawSVGPlugin mapping the total mathematical length of a vector path to scroll progress]
*   **Interactive Hovers & Underlines** [CSS pseudo-elements and scale transformations to create dynamic underlines and sliding arrow masks]
*   **Deep Zoom & Vertigo Effect** [GSAP rotation and scaling applied to spiral clock elements to give a falling sensation]

---

### Introduction: The Scrolling Experience
"When we built Directionless, we didn't want it to feel like a standard webpage where you just scroll through static content. We wanted it to feel like an interactive video. To do this, we hijacked the default browser scroll using a library called **Lenis**. This gives us a buttery-smooth scrolling experience. 

Then, we used GSAP's **ScrollTrigger** to tie all of our animations directly to the scrollbar. The logic here is that instead of an animation playing based on a timer, your scroll wheel acts like the playback head of a video—if you scroll down, the animation plays forward; if you stop, it pauses; and if you scroll up, it rewinds in real-time."

### 1. The Loader & Hero Reveal
"Right when you load the site, we wanted a dramatic entrance. We use a clipping mask to slide open and reveal the logo, and then we push the loading screen up and out of the way. 

For the main title, instead of a simple fade-in, we wrote logic that calculates exactly where the text should start and where it needs to end up in its final layout. We then smoothly 'flip' the text into place based on those mathematical coordinates. It makes the typography feel incredibly intentional and weighty."

### 2. Text Masking & Reveals
"You’ll notice that throughout the site, text doesn’t just appear—it slides up from nowhere. The logic here is really elegant. We take a paragraph and programmatically split it into individual lines. Then, we wrap each line in an invisible 'mask' or frame. 

The text itself starts pushed down, completely hidden outside that frame. As your scroll position reaches that section, we trigger an animation that smoothly slides the text up into the frame. Because the frame hides anything outside of its borders, the text appears to magically rise into existence."

### 3. The 'Theme Tracker' (Seamless Transitions)
"We wanted the journey between sections—like going from the white hero area to the dark middle section—to feel like a movie transitioning scenes. To do this, we built a 'Theme Tracker'. 

The logic essentially acts like a GPS. We have an event listener that constantly monitors your scroll position. When a new section reaches a specific threshold on your screen—say 95% of the viewport height—our script instantly updates a master 'theme' attribute on the entire website. This triggers a smooth CSS crossfade of all background and text colors, preventing any harsh visual jumps."

### 4. The Parallax Dream (Dark Section)
"When you reach the dark section with the delirious face, you'll notice you stop moving down the page, but things keep happening. We achieve this by 'pinning' the section to the screen. 

The logic here maps your scroll distance directly to the movement of those floating elements—like the falling man or the chair. Because we move the foreground items at different speeds than the background items, it creates a parallax effect, giving a fake sense of 3D depth. You're physically scrolling your mouse, but visually, you're just fast-forwarding the floating animation."

### 5. Scene Wipes: The Drip & Pixel Shatter
"For more dramatic scene changes, we wrote some custom dynamic logic to wipe the screen.
*   **The Drip Wipe:** We run a script that calculates how wide your screen is and divides it into columns. It dynamically creates vertical black bars for each column. As you scroll, we animate their heights to 100% with slight delays, making it look like dripping paint wiping the screen.
*   **The Pixel Shatter:** Similarly, for the shatter effect, we use math to calculate how many square blocks fit on your specific screen size and build a grid. As you scroll into the section, we use a stagger effect to randomly turn these blocks opaque. It essentially pixelates the screen to reveal the next area underneath."

### 6. The Continuous Vector Line
"In the lighter sections, there's a thin line that seems to draw itself as you scroll. The logic behind this relies on SVGs—vector graphics drawn with math. 

Because it's math-based, we can calculate the exact total length of the line. We then map that length directly to your scroll progress. When you start the section, we tell the browser to draw 0% of the line. As you scroll to the very bottom, it updates in real-time until 100% of the line is drawn. It perfectly matches your pace."

### 7. Hover Logic & The Spiral Clock
"Finally, we wanted the interactive elements to feel just as alive. When you hover over the footer social links, for instance, we use a masking trick where the current arrow slides up and out of its frame, while a new arrow smoothly slides in from the bottom. 

And to really emphasize the feeling of time and being lost, we built the spiral clock sequence. By pinning the screen again and mapping your scroll to the rotation of the main clock group—while simultaneously making individual pieces scale up toward you—it gives the user a sense of vertigo or falling forward through time."
