const API_URL =
  "https://script.google.com/macros/s/AKfycbwFXKcF2Th70pa-08CdWnKNOhnvXJ9dunIYgYApLbppe5K9S1hhPqyX5vhtHLliPRvO/exec";

let currentLat = null;
let currentLng = null;
let currentId = null;

let prevLat = null;
let prevLng = null;
let prevTime = null;

const MIN_DISTANCE = 0.01; // km (10 meters)

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

// Haversine Distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

async function sendData() {
  if (!currentLat || !currentLng || !currentId) return;

  let speed = 0;

  if (prevLat && prevLng && prevTime) {

    const distance = getDistance(prevLat, prevLng, currentLat, currentLng);

    // ❌ If location did not change enough → do nothing
    if (distance < MIN_DISTANCE) {
      return;
    }

    const timeDiff = (Date.now() - prevTime) / 1000 / 3600;

    if (timeDiff > 0) {
      speed = distance / timeDiff;
    }
  }

  prevLat = currentLat;
  prevLng = currentLng;
  prevTime = Date.now();

  try {
    await fetch(API_URL, {
      method: "POST",
      body: new URLSearchParams({
        action: "update",
        Id: currentId,
        Member: "Bus-01",
        Latitude: currentLat,
        Longitude: currentLng,
        Speed: speed.toFixed(2),
        Date: new Date().toLocaleDateString("en-IN"),
        Time: new Date().toLocaleTimeString("en-IN"),
        Status: "Active",
      }),
    });

    console.log("Location Updated", speed);

  } catch (err) {
    console.log("Send Error:", err);
  }
}

setInterval(sendData, 1000);