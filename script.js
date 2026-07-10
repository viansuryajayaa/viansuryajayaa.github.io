// ─── Custom Cursor (Desktop) ───
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");

if (cursor && follower) {
  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx - 16}px, ${fy - 16}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide on mobile
  if ("ontouchstart" in window) {
    cursor.style.display = "none";
    follower.style.display = "none";
  }
}

// ─── Chat Widget ───
const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const chatClose = document.getElementById("chatClose");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatMessages = document.getElementById("chatMessages");

const API_URL = "https://bot-line-ai.onrender.com";

chatBtn.addEventListener("click", () => {
  chatBox.classList.toggle("open");
  if (chatBox.classList.contains("open")) chatInput.focus();
});

chatClose.addEventListener("click", () => chatBox.classList.remove("open"));

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addBubble(text, "user");
  chatInput.value = "";

  // Local NLP fallback
  const local = getLocalReply(text);
  if (local) {
    setTimeout(() => addBubble(local, "bot"), 400);
    return;
  }

  try {
    const res = await fetch(API_URL + "/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "portfolio_guest", message: text }),
    });
    const data = await res.json();
    addBubble(data.reply || "Sorry, I could not process that.", "bot");
  } catch {
    addBubble("I am currently offline. Try again later!", "bot");
  }
}

function addBubble(text, type) {
  const div = document.createElement("div");
  div.className = "chat-bubble " + type;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ─── Local NLP (no API needed) ───
function getLocalReply(input) {
  const lower = input.toLowerCase();

  const keywords = {
    "who are you|about vian|about you": "I am Vian Suryajaya, a Flutter Mobile Developer from NDHU CSIE. I build premium cross-platform mobile apps!",
    "skills|tech|stack|arsenal": "Vian works with Flutter, Dart, Firebase, Python, Flask, Google Gemini API, Docker, and Coolify.",
    "yisuda|衣速達|laundry": "Yisuda is a multi-vendor laundry marketplace app built with Flutter and Firebase. It features live tracking and dual-role panels.",
    "simy|ai assistant|bot": "SIMY is an AI assistant bot that uses Google Gemini API with Google Calendar integration for automated scheduling.",
    "contact|hire|email|reach": "You can reach Vian at viansuryajaya37@gmail.com or connect via LinkedIn!",
    "flutter|dart": "Vian is a Flutter specialist with experience in state management (GetX/Bloc), core animations, and performance optimization.",
    "firebase": "Vian has deep experience with the Firebase ecosystem including Firestore, Auth, Cloud Functions, and Storage.",
    "experience|background|education": "Vian holds a B.Sc. in Computer Science & Information Engineering from NDHU and has 2+ years of dev experience.",
    "hello|hi|hey|halo|hai": "Hey there! Feel free to ask about Vian's projects, skills, or experience!",
    "thank|thanks|thx": "You are welcome! Anything else you want to know about Vian?",
  };

  for (const [pattern, reply] of Object.entries(keywords)) {
    if (new RegExp(pattern).test(lower)) return reply;
  }
  return null;
}
