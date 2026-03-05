const API_URL =
  "https://script.google.com/macros/s/AKfycbwFXKcF2Th70pa-08CdWnKNOhnvXJ9dunIYgYApLbppe5K9S1hhPqyX5vhtHLliPRvO/exec";

let currentLat = null;
let currentLng = null;
let currentId = null;

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
    currentId = event.data.id;
  }
});

async function sendData() {
  if (!currentLat && !currentLng && !currentId) return;

  try {
    await fetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({
        action: "update",
        Id: currentId,
        Member: "Bus-01",
        Longitude: currentLng,
        Latitudes: currentLat,
        Date: new Date().toLocaleDateString("en-IN"),
        Time: new Date().toLocaleTimeString("en-IN"),
        Status: "Active",
      }),
    });

    console.log("Sent:", currentId);
  } catch (err) {
    console.log("Send Error:", err);
  }
}

// Every 1 second
setInterval(sendData, 1000);
