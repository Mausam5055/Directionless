export const contactController = {
  init() {
    const trigger = document.getElementById('contact-trigger-card');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.openModal();
    });
    
    // Inject the modal markup if it doesn't exist yet
    if (!document.getElementById('contact-modal')) {
      this.injectModalMarkup();
      this.bindModalEvents();
    }
  },

  openModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
    modal.classList.add('is-active');
    
    if (window.lenis) {
      window.lenis.stop();
    }
  },

  closeModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    
    modal.classList.remove('is-active');
    
    if (window.lenis) {
      window.lenis.start();
    }
  },

  injectModalMarkup() {
    const modalHtml = `
      <div id="contact-modal" class="wellbeing-quiz-overlay" role="dialog" aria-modal="true">
        <div class="wellbeing-quiz-container contact-modal-container" data-lenis-prevent="true">
          <button class="quiz-close-btn contact-close-btn" aria-label="Close Contact Form">&times;</button>
          
          <div class="contact-modal-header">
            <h1 class="contact-heading">REACH<br>OUT</h1>
            <p class="contact-desc sg-text-body-small">
              We'd love to hear from you. Whether it's a collaboration, a question, or just to say hello.
            </p>
          </div>
          
          <form id="contact-form-modal" class="contact-form">
            <div class="contact-row">
              <div class="contact-field">
                <label for="modal-name" class="contact-label sg-text-body-mini">Name</label>
                <input type="text" id="modal-name" name="name" required class="contact-input" placeholder="Your name" />
              </div>
              <div class="contact-field">
                <label for="modal-email" class="contact-label sg-text-body-mini">Email</label>
                <input type="email" id="modal-email" name="email" required class="contact-input" placeholder="your@email.com" />
              </div>
            </div>
            <div class="contact-field">
              <label for="modal-subject" class="contact-label sg-text-body-mini">Subject</label>
              <input type="text" id="modal-subject" name="subject" required class="contact-input" placeholder="What's this about?" />
            </div>
            <div class="contact-field">
              <label for="modal-message" class="contact-label sg-text-body-mini">Message</label>
              <textarea id="modal-message" name="message" required class="contact-input contact-textarea" placeholder="Tell us what's on your mind..." rows="5"></textarea>
            </div>
            <button type="submit" class="contact-btn">
              <span>Send Message</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5621 6V15.75C18.5621 15.8992 18.5029 16.0423 18.3974 16.1477C18.2919 16.2532 18.1488 16.3125 17.9996 16.3125C17.8505 16.3125 17.7074 16.2532 17.6019 16.1477C17.4964 16.0423 17.4371 15.8992 17.4371 15.75V7.3575L6.39714 18.3975C6.29051 18.4969 6.14947 18.551 6.00375 18.5484C5.85802 18.5458 5.71898 18.4868 5.61592 18.3837C5.51286 18.2807 5.45383 18.1416 5.45126 17.9959C5.44869 17.8502 5.50278 17.7091 5.60214 17.6025L16.6421 6.5625H8.24964C8.10046 6.5625 7.95738 6.50324 7.85189 6.39775C7.7464 6.29226 7.68714 6.14918 7.68714 6C7.68714 5.85082 7.7464 5.70774 7.85189 5.60225C7.95738 5.49676 8.10046 5.4375 8.24964 5.4375H17.9996C18.1488 5.4375 18.2919 5.49676 18.3974 5.60225C18.5029 5.70774 18.5621 5.85082 18.5621 6Z" fill="currentColor"/>
              </svg>
            </button>
            <div id="contact-status-modal" class="contact-status"></div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  bindModalEvents() {
    const closeBtn = document.querySelector('.contact-close-btn');
    const modal = document.getElementById('contact-modal');
    const form = document.getElementById('contact-form-modal') as HTMLFormElement;
    const statusMsg = document.getElementById('contact-status-modal');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-active')) {
        this.closeModal();
      }
    });

    if (form && statusMsg) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
        const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
        const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim();
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

        if (!name || !email || !subject || !message) {
          statusMsg.textContent = "Please fill out all fields.";
          statusMsg.style.color = "#c62828";
          return;
        }

        statusMsg.textContent = "Sending...";
        statusMsg.style.color = "inherit";

        try {
          const response = await fetch("https://discord.com/api/webhooks/1517830185465024644/mWu7F83N-P76gVl43XselYFrE9TYCM8T1c8svsTZhnJPK2lj9MH40R3uGcJgrGcwvfUY", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              embeds: [{
                title: "New Contact Form Submission",
                color: 5344501,
                fields: [
                  { name: "Name", value: name, inline: true },
                  { name: "Email", value: email, inline: true },
                  { name: "Subject", value: subject, inline: false },
                  { name: "Message", value: message, inline: false }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "Directionless Contact Form (Popup)" }
              }]
            })
          });

          if (!response.ok) throw new Error("Failed to send message");

          statusMsg.textContent = "Message sent. We'll get back to you soon.";
          statusMsg.style.color = "#2e7d32";
          form.reset();
        } catch (error) {
          statusMsg.textContent = "Something went wrong. Please try again.";
          statusMsg.style.color = "#c62828";
        }
      });
    }
  }
};
