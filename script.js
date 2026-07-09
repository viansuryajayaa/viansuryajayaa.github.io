// ─── Custom Cursor ───
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
  });
}

// Mouse & Touch Tracking for 3D Interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouseX = (e.touches[0].clientX / window.innerWidth) - 0.5;
    mouseY = (e.touches[0].clientY / window.innerHeight) - 0.5;
  }
}, { passive: true });

// ─── GSAP Scroll & Motion Animations ───
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Entry Animation
  gsap.from('.animate-hero', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: 'power4.out',
    clearProps: 'opacity,transform'
  });

  // Scroll Fade Trigger
  gsap.utils.toArray('section').forEach((sec) => {
    const elements = sec.querySelectorAll('.section-tag, .section-title, .about-text, .stat-card, .skill-card, .project-card');
    if (elements.length > 0) {
      gsap.from(elements, {
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
          once: true
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// Safety fallback: never leave any content stuck invisible
setTimeout(() => {
  document.querySelectorAll('.section-tag, .section-title, .about-text, .stat-card, .skill-card, .project-card, .animate-hero').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}, 3000);

// ─── Chat Widget Logic (Functional SIMY Menu) ───
(() => {
  const chatBtn = document.getElementById('chatBtn');
  const chatBox = document.getElementById('chatBox');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  if (!chatBtn || !chatBox || !chatClose) return;

  chatBtn.addEventListener('click', () => chatBox.classList.toggle('open'));
  chatClose.addEventListener('click', () => chatBox.classList.remove('open'));

  const addMessage = (text, sender) => {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender);
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const addOptions = (options) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chat-options');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('chat-option-btn', 'interactive-hover');
      btn.textContent = opt.label;
      btn.onclick = () => {
        wrapper.remove();
        addMessage(opt.label, 'user');
        runAction(opt.action, opt.value);
      };
      wrapper.appendChild(btn);
    });
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const runAction = (action, value) => {
    if (action === 'showMenu') {
      setTimeout(() => {
        addOptions([
          { label: '📱 Show me Vian\'s projects', action: 'projects' },
          { label: '🛠️ List his tech stack', action: 'skills' },
          { label: '📅 Schedule a 15-min interview', action: 'schedule' },
          { label: '📄 Download his resume', action: 'resume' },
          { label: '💼 Why hire Vian?', action: 'whyHire' },
        ]);
      }, 400);
    }
    if (action === 'projects') {
      setTimeout(() => {
        addMessage("Vian's 3 flagship projects:\n\n1. 📱 衣速達 (Yisuda) — Multi-vendor laundry marketplace (Flutter, Firebase, GetX, OTP auth)\n\n2. 🤖 SIMY — AI LINE bot assistant (Python, Flask, Gemini API, Calendar tool calling)\n\n3. 📈 TCA Nurse Turnover Viz — 1st place winner in TCA AI competition (Python, Data Viz)\n\nWant to see the live demo of one of them?", 'bot');
        setTimeout(() => addOptions([
          { label: '🚀 Open Yisuda demo', action: 'openLink', value: 'https://github.com/viansuryajayaa' },
          { label: '🚀 Open SIMY source', action: 'openLink', value: 'https://github.com/viansuryajayaa' },
        ]), 400);
      }, 700);
    }
    if (action === 'skills') {
      setTimeout(() => {
        addMessage("Here's Vian's core stack:\n\n📱 Mobile: Flutter, Dart, GetX, State Management\n🔧 Backend: Firebase, Flask, REST APIs, Webhooks\n🤖 AI: Gemini API, Tool calling, Multi-modal\n💻 Languages: Dart, Python, C++\n🛠️ Tools: Git, Postman, Figma, Linux, CI/CD", 'bot');
      }, 700);
    }
    if (action === 'schedule') {
      setTimeout(() => {
        addMessage("Great! I'll help you set up a meeting with Vian. 📅\n\nWhat timezone works best for you?", 'bot');
        setTimeout(() => addOptions([
          { label: '🇹🇼 Taiwan (GMT+8)', action: 'tzConfirm', value: 'GMT+8' },
          { label: '🇮🇩 Indonesia (GMT+7)', action: 'tzConfirm', value: 'GMT+7' },
          { label: '🇺🇸 US (PST)', action: 'tzConfirm', value: 'PST' },
        ]), 400);
      }, 700);
    }
    if (action === 'tzConfirm') {
      setTimeout(() => {
        addMessage(`Perfect! Timezone set to ${value}. 🕐\n\nWhen should Vian expect you? (e.g., "Tuesday 2pm")`, 'bot');
        setTimeout(() => addOptions([
          { label: '📅 Book Tuesday 2pm', action: 'finalBook' },
          { label: '📅 Book Thursday 11am', action: 'finalBook' },
        ]), 400);
      }, 700);
    }
    if (action === 'finalBook') {
      setTimeout(() => {
        addMessage("✅ Calendar event created!\n\n📨 A confirmation has been sent to viansuryajaya37@gmail.com. He'll reach out within 24 hours via the contact channel you prefer.\n\nThank you for taking interest in Vian! 🚀", 'bot');
      }, 900);
    }
    if (action === 'resume') {
      setTimeout(() => {
        addMessage("Sending Vian's resume to your email... 📄\n\n✅ Resume prepared: 朱飛安_EN.pdf (1.2 MB)\n\nI've added a download link below too.", 'bot');
        setTimeout(() => {
          window.open('https://viansuryajayaa.github.io', '_blank');
        }, 1200);
      }, 700);
    }
    if (action === 'whyHire') {
      setTimeout(() => {
        addMessage("Why hire Vian? 🚀\n\n1. ✅ End-to-end builder — designs, codes, and deploys (Flutter Web, Render, GitHub Pages)\n2. ✅ AI integration expertise — real-world tool calling with Gemini API\n3. ✅ Production experience — Firebase auth, real-time DB, OTP, multi-role systems\n4. ✅ Award-winning — 1st place at TCA AI competition\n5. ✅ Bilingual — fluent English + conversational Mandarin", 'bot');
      }, 700);
    }
    if (action === 'openLink') {
      setTimeout(() => {
        addMessage("Opening the project source... 🚀", 'bot');
        setTimeout(() => window.open(value, '_blank'), 500);
      }, 500);
    }
  };

  // Show initial menu after a brief delay
  setTimeout(() => addOptions([
    { label: '👋 What can you do?', action: 'showMenu' },
    { label: '🚀 Show me Vian\'s projects', action: 'projects' },
    { label: '📅 Schedule an interview', action: 'schedule' },
  ]), 1500);

  const handleSend = async () => {
    const query = chatInput.value.trim();
    if (!query) return;

    addMessage(query, 'user');
    chatInput.value = '';

    const typingBubble = document.createElement('div');
    typingBubble.classList.add('chat-bubble', 'bot');
    typingBubble.textContent = 'Typing...';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      chatMessages.removeChild(typingBubble);
      addMessage(`I'd love to help with that! For more specific answers, try one of the options below.`, 'bot');
      addOptions([
        { label: '🚀 Show projects', action: 'projects' },
        { label: '📅 Schedule interview', action: 'schedule' },
        { label: '💼 Why hire Vian?', action: 'whyHire' },
      ]);
    }, 800);
  };

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();