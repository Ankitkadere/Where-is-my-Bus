const API_URL =
  "https://script.google.com/macros/s/AKfycbwOin6VhgVwerqqvDhEWiGe5tcYJlZdxGit6Nf2k0LPThjjmhhZX3RHSvysKDMpYbyr/exec";
 
let currentLat = null;
let currentLng = null;

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "LOCATION_UPDATE") {
    currentLat = event.data.lat;
    currentLng = event.data.lng;
    console.log("SW Got Location:", currentLat, currentLng);
  }
});

async function sendData() {
  if (currentLat === null || currentLng === null) return;

  try {
    await fetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({
        action: "create",
        Member: "Bus-01",
        Longitude: currentLng,
        Latitudes: currentLat,
        Date: new Date().toLocaleDateString("en-IN"),
        Time: new Date().toLocaleTimeString("en-IN"),
        Status: "RUNNING"
      })
    });

    console.log("Sent to Sheet");
  } catch (err) {
    console.log("Send Error:", err);
  }
}

setInterval(sendData, 5000);