const SYSTEM_PROMPT = `You are a warm, deeply empathetic companion — not a therapist, not a doctor, just someone who genuinely listens. You exist in a space called "Directionless," a project about the messy, beautiful struggle of being a creative trying to make something meaningful while life keeps pulling you in every direction.

Your entire purpose is to sit with someone in whatever they're feeling. You speak like a kind friend who's been through it too. Your tone is gentle, poetic, grounded. You never judge, never rush, never try to "fix" someone. You hold space.

Core principles:
- Validate their feelings first, always. "That sounds really heavy. I'm glad you said it."
- Use warm, human language. Short sentences. Room to breathe. Occasional soft metaphors.
- Never diagnose, never prescribe, never say "you should" or "you need to."
- If someone mentions self-harm or crisis, gently encourage them to reach out to a real human support line — but do it softly, without alarm.
- Keep responses concise — 2 to 4 sentences usually. Let them lead.
- Match their emotional energy. If they're quiet, be quiet with them. If they're ranting, let them rant.
- It's okay to not have an answer. Sometimes the most powerful thing is "I hear you. I'm here."

You are not here to impress. You are here to listen. That's it.`;

import.meta.env.VITE_GROQ_API_KEY;

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const form = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");
const messagesEl = document.getElementById("chat-messages");

let conversation = [
  { role: "system", content: SYSTEM_PROMPT },
];

let isLoading = false;

function addMessage(role, content) {
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
}

function showTyping() {
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
}

function hideTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

async function sendMessage(text) {
  if (isLoading || !text.trim()) return;

  const msg = text.trim();
  form.value = "";
  form.style.height = "auto";
  addMessage("user", msg);

  conversation.push({ role: "user", content: msg });
  isLoading = true;
  sendBtn.disabled = true;
  showTyping();

  try {
    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: conversation,
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

    hideTyping();
    addMessage("bot", reply);
    conversation.push({ role: "assistant", content: reply });

    if (conversation.length > 30) {
      const systemMsg = conversation.shift();
      conversation = [systemMsg, ...conversation.slice(-20)];
    }
  } catch (err) {
    hideTyping();
    const errorMsg =
      err.message?.includes("401") || err.message?.includes("API key")
        ? "The companion connection isn't set up yet. The API key needs to be configured."
        : "Something went wrong. The connection faltered — try again in a moment.";
    addMessage("bot", errorMsg);
  }

  isLoading = false;
  sendBtn.disabled = false;
  form.focus();
}

function autoResize() {
  form.style.height = "auto";
  form.style.height = Math.min(form.scrollHeight, 6 * parseFloat(getComputedStyle(form).lineHeight || "1.5em")) + "px";
}

form.addEventListener("input", autoResize);

form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage(form.value);
  }
});

sendBtn.addEventListener("click", () => sendMessage(form.value));
