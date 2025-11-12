const API_URL =
  "https://script.google.com/macros/s/AKfycbwOin6VhgVwerqqvDhEWiGe5tcYJlZdxGit6Nf2k0LPThjjmhhZX3RHSvysKDMpYbyr/exec"; // same URL

self.addEventListener("install", (e) => {
  console.log("🧩 Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("⚡ Service Worker active");
  e.waitUntil(self.clients.claim());
});

// 🔁 Background periodic sync (requires user permission)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "send-time") {
    event.waitUntil(sendTime());
  }
});

// 🕒 Function to send time in background
async function sendTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  try {
    await fetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({ action: "addTime", Time: timeString }),
    });
    console.log("⏰ Background Sent:", timeString);
  } catch (err) {
    console.error("❌ Background send failed:", err);
  }
}

// 🧠 Fallback background loop every 2s (if periodic sync unavailable)
setInterval(sendTime, 2000);
