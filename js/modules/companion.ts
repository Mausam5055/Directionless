import { dotWaveController } from './dotwave.ts';

export const companionController = {
  state: {
    conversation: [] as any[],
    isLoading: false
  },

  SYSTEM_PROMPT: `You are a warm, deeply empathetic companion — not a therapist, not a doctor, just someone who genuinely listens. You exist in a space called "Directionless," a project about the messy, beautiful struggle of being a creative trying to make something meaningful while life keeps pulling you in every direction.

Your entire purpose is to sit with someone in whatever they're feeling. You speak like a kind friend who's been through it too. Your tone is gentle, poetic, grounded. You never judge, never rush, never try to "fix" someone. You hold space.

Core principles:
- Validate their feelings first, always. "That sounds really heavy. I'm glad you said it."
- Use warm, human language. Short sentences. Room to breathe. Occasional soft metaphors.
- Never diagnose, never prescribe, never say "you should" or "you need to."
- If someone mentions self-harm or crisis, gently encourage them to reach out to a real human support line — but do it softly, without alarm.
- Keep responses concise — 2 to 4 sentences usually. Let them lead.
- Match their emotional energy. If they're quiet, be quiet with them. If they're ranting, let them rant.
- It's okay to not have an answer. Sometimes the most powerful thing is "I hear you. I'm here."

You are not here to impress. You are here to listen. That's it.`,

  GROQ_API: "https://api.groq.com/openai/v1/chat/completions",
  MODEL: "llama-3.3-70b-versatile",

  init() {
    const trigger = document.getElementById('companion-trigger-card');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.openCompanion();
    });
  },

  openCompanion() {
    let modal = document.getElementById('companion-modal');
    if (!modal) {
      this.injectModalMarkup();
      modal = document.getElementById('companion-modal')!;
      
      // Initialize state for a new session
      this.state.conversation = [
        { role: "system", content: this.SYSTEM_PROMPT }
      ];
      this.state.isLoading = false;
      this.bindChatEvents();
    }

    document.body.style.overflow = 'hidden';
    modal.classList.add('is-active');
    
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }

    this.bindModalEvents();
    
    const input = document.getElementById('chat-input') as HTMLTextAreaElement;
    if (input) {
      setTimeout(() => input.focus(), 300);
    }
  },

  closeCompanion() {
    const modal = document.getElementById('companion-modal');
    if (modal) {
      modal.classList.remove('is-active');
    }
    document.body.style.overflow = '';
    
    if ((window as any).lenis) {
      (window as any).lenis.start();
    }
  },

  injectModalMarkup() {
    const modalHtml = `
      <div id="companion-modal" class="wellbeing-quiz-overlay" role="dialog" aria-modal="true">
        <div class="wellbeing-quiz-container companion-container" data-lenis-prevent="true" style="position: relative; overflow: hidden;">
          <canvas id="dot-wave-canvas" class="dot-wave-canvas"></canvas>
          <button class="quiz-close-btn companion-close-btn" aria-label="Close Companion" style="z-index: 10;">&times;</button>
          
          <div class="quiz-modal-header companion-header">
            <span class="quiz-category-tag">Companion</span>
            <div class="chat-privacy-badge sg-text-body-mini">
              <svg width="14" height="14" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2ZM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6Z" fill="currentColor"/>
              </svg>
              end-to-end private
            </div>
          </div>

          <div class="companion-content-wrapper">
            <div id="chat-messages" class="chat-messages" data-lenis-prevent="true">
              <div class="chat-message bot">
                <div class="chat-avatar">
                  <svg width="20" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="currentColor" opacity="0.3"/>
                    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="chat-bubble">
                  <p>Hey. I'm here. No judgment, no agenda — just a quiet place to put down what you're carrying. Tell me what's on your mind, or don't. I'll be right here either way.</p>
                </div>
              </div>
            </div>
            
            <div class="chat-input-bar">
              <div class="chat-input-wrapper">
                <textarea id="chat-input" class="chat-input" rows="1" placeholder="Type what's on your mind..." maxlength="2000"></textarea>
                <button id="chat-send" class="chat-send-btn" aria-label="Send">
                  <svg width="20" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5621 6V15.75C18.5621 15.8992 18.5029 16.0423 18.3974 16.1477C18.2919 16.2532 18.1488 16.3125 17.9996 16.3125C17.8505 16.3125 17.7074 16.2532 17.6019 16.1477C17.4964 16.0423 17.4371 15.8992 17.4371 15.75V7.3575L6.39714 18.3975C6.29051 18.4969 6.14947 18.551 6.00375 18.5484C5.85802 18.5458 5.71898 18.4868 5.61592 18.3837C5.51286 18.2807 5.45383 18.1416 5.45126 17.9959C5.44869 17.8502 5.50278 17.7091 5.60214 17.6025L16.6421 6.5625H8.24964C8.10046 6.5625 7.95738 6.50324 7.85189 6.39775C7.7464 6.29226 7.68714 6.14918 7.68714 6C7.68714 5.85082 7.7464 5.70774 7.85189 5.60225C7.95738 5.49676 8.10046 5.4375 8.24964 5.4375H17.9996C18.1488 5.4375 18.2919 5.49676 18.3974 5.60225C18.5029 5.70774 18.5621 5.85082 18.5621 6Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <p class="chat-footnote sg-text-body-mini">Everything you say stays between you and this browser. No data saved.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Initialize the background wave once the canvas is in the DOM
    setTimeout(() => {
      dotWaveController.init();
    }, 50);
  },

  bindModalEvents() {
    const modal = document.getElementById('companion-modal')!;
    const closeBtn = modal.querySelector('.companion-close-btn')!;
    
    // Ensure we don't bind multiple times if already bound
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode!.replaceChild(newCloseBtn, closeBtn);

    document.getElementById('companion-modal')!.querySelector('.companion-close-btn')!.addEventListener('click', () => this.closeCompanion());
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeCompanion();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        this.closeCompanion();
      }
    });
  },

  bindChatEvents() {
    const form = document.getElementById("chat-input") as HTMLTextAreaElement;
    const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;

    const autoResize = () => {
      form.style.height = "auto";
      form.style.height = Math.min(form.scrollHeight, 6 * parseFloat(getComputedStyle(form).lineHeight || "1.5em")) + "px";
    };

    form.addEventListener("input", autoResize);

    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage(form.value);
      }
    });

    sendBtn.addEventListener("click", () => this.sendMessage(form.value));
  },

  addMessage(role: string, content: string) {
    const messagesEl = document.getElementById("chat-messages")!;
    const div = document.createElement("div");
    div.className = `chat-message ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "chat-avatar";
    if (role === "bot") {
      avatar.innerHTML =
        '<svg width="20" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="currentColor" opacity="0.3"/><path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2Z" fill="currentColor"/></svg>';
    } else {
      avatar.innerHTML =
        '<svg width="18" height="18" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" fill="currentColor"/></svg>';
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.innerHTML = `<p>${content}</p>`;

    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  },

  showTyping() {
    const messagesEl = document.getElementById("chat-messages")!;
    const div = document.createElement("div");
    div.className = "chat-message bot";
    div.id = "typing-indicator";
    
    const avatar = document.createElement("div");
    avatar.className = "chat-avatar";
    avatar.innerHTML =
      '<svg width="20" height="20" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" fill="currentColor" opacity="0.3"/><path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm0 10c-2.7 0-5.8 1.29-6 2h12c-.2-.71-3.3-2-6-2Z" fill="currentColor"/></svg>';
    
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble chat-typing";
    bubble.innerHTML = "<span></span><span></span><span></span>";
    
    div.appendChild(avatar);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  },

  hideTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  },

  async sendMessage(text: string) {
    if (this.state.isLoading || !text.trim()) return;

    const form = document.getElementById("chat-input") as HTMLTextAreaElement;
    const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;

    const msg = text.trim();
    form.value = "";
    form.style.height = "auto";
    this.addMessage("user", msg);

    this.state.conversation.push({ role: "user", content: msg });
    this.state.isLoading = true;
    sendBtn.disabled = true;
    this.showTyping();

    try {
      const res = await fetch(this.GROQ_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: this.state.conversation,
          max_tokens: 512,
          temperature: 0.8,
          top_p: 0.9,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices[0].message.content.trim();

      this.hideTyping();
      this.addMessage("bot", reply);
      this.state.conversation.push({ role: "assistant", content: reply });

      if (this.state.conversation.length > 30) {
        const systemMsg = this.state.conversation.shift();
        this.state.conversation = [systemMsg, ...this.state.conversation.slice(-20)];
      }
    } catch (err: any) {
      this.hideTyping();
      const errorMsg =
        err.message?.includes("401") || err.message?.includes("API key")
          ? "The companion connection isn't set up yet. The API key needs to be configured."
          : "Something went wrong. The connection faltered — try again in a moment.";
      this.addMessage("bot", errorMsg);
    }

    this.state.isLoading = false;
    sendBtn.disabled = false;
    form.focus();
  }
};
