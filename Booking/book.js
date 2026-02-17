const input = document.getElementById("filterInput");
const buttons = document.querySelectorAll("button[data-value]");
const clearBtn = document.getElementById("clearBtn");
const deleteBtn = document.getElementById("deleteBtn");
const settext = document.getElementById("settext");
const submitBtn = document.getElementById("submitBtn");
const dataBody = document.getElementById("dataBody");
const dialPadBox = document.querySelector(".max-w-md");
const loader = document.getElementById("loader");

const urlParams = new URLSearchParams(window.location.search);
const passcode = urlParams.get("passcode");

const API_URL =
  "https://script.google.com/macros/s/AKfycbzkdg6vHCPXYmo8LdLB6Bk6c6hWzqpGNiAzWHBORtIVntStTPPxOTHo3buy31fMhO1Z_g/exec";


// ---------------- DIAL PAD ----------------
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (input.value.length < 10) {
      input.value += btn.getAttribute("data-value");
    }
  });
});

clearBtn.addEventListener("click", () => (input.value = ""));
deleteBtn.addEventListener("click", () => {
  input.value = input.value.slice(0, -1);
});


// ---------------- SUBMIT BUTTON ----------------
submitBtn.addEventListener("click", () => {
  const passcode = input.value.trim();

  // CHECK MODE
  if (submitBtn.textContent === "Check Ticket") {
    if (!passcode) {
      settext.textContent = "Please Enter A Passcode";
      return;
    }

    loader.classList.remove("hidden");
    fetchData(passcode);

    dialPadBox.classList.add("hidden");
    settext.textContent = "";
    input.value = "";

    submitBtn.textContent = "Clear";
    submitBtn.classList.remove("bg-green-600");
    submitBtn.classList.add("bg-red-600");

    return;
  }

  // CLEAR MODE
  if (submitBtn.textContent === "Clear") {
    window.location.reload();
  }
});


// ---------------- FETCH DATA ----------------
async function fetchData(passcode) {
  loader.classList.remove("hidden");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data, passcode);
  } catch (error) {
    console.error("Error fetching data:", error);
    settext.textContent = "Failed to fetch data.";
  } finally {
    loader.classList.add("hidden");
  }
}


// ---------------- RENDER ----------------
function renderTable(data, passcode) {
  dataBody.innerHTML = "";

  const filtered = data.filter(
    (row) => row.Passcode == passcode || row.Usermobile == passcode
  );

  if (filtered.length === 0) {
    dialPadBox.classList.remove("hidden");
    dataBody.innerHTML =
      "<p class='text-center text-gray-500 py-6'>No matching records found.</p>";
    return;
  }

  function formatTime(time24) {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  filtered.forEach((row) => {
    const showButtons = row.Usermobile == passcode;

    const actionButtons = showButtons
      ? `
      <div class="flex justify-between p-4 border-t">
        <button onclick='editEntry(${JSON.stringify(
          row
        )})' class="px-4 py-2 bg-blue-600 text-white rounded">
          Update
        </button>
        <button onclick='deleteEntry("${row.Passcode}")'
          class="px-4 py-2 bg-red-600 text-white rounded">
          Cancel Booking
        </button>
      </div>`
      : "";

    const card = document.createElement("div");
    card.className =
      "w-full max-w-md mx-auto bg-white shadow-lg border rounded-lg mt-6 overflow-hidden";

    card.innerHTML = `
      <div class="bg-green-800 text-white p-4 flex justify-between">
        <div>
          <div class="text-3xl font-bold">${row.Seat}</div>
          <div class="text-lg">${row.TBName}</div>
          <div class="text-sm">${row.TBNumber}</div>
        </div>
      </div>

      <div class="p-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-xs text-gray-500">Passenger</p>
            <p class="font-semibold">${row.Username}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Last Name</p>
            <p class="font-semibold">${row.Userlast}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Age</p>
            <p>${row.Age}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Gender</p>
            <p>${row.Gender}</p>
          </div>
        </div>

        <div class="border-t pt-3 flex justify-between">
          <div>
            <p class="text-xs text-gray-500">From</p>
            <p class="font-semibold">${row.TStart}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500">To</p>
            <p class="font-semibold">${row.TEnd}</p>
          </div>
        </div>

        <div class="border-t pt-3 flex justify-between">
          <div>
            <p class="text-xs text-gray-500">Class</p>
            <p>${row.Class}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Price</p>
            <p>₹${row.Price * row.Child}</p>
          </div>
        </div>

        <div class="text-center pt-3 border-t">
          <p class="text-xl font-bold">${row.Passcode}</p>
          <p class="text-green-700 font-semibold">Ticket Confirmed</p>
        </div>
      </div>

      ${actionButtons}
    `;

    dataBody.appendChild(card);
  });
}


// ---------------- EDIT ----------------
function editEntry(row) {
  const form = document.getElementById("editForm");
  for (const input of form.elements) {
    if (input.name) input.value = row[input.name] || "";
  }
  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const json = Object.fromEntries(formData.entries());

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(json),
  });

  closeEditModal();
  fetchData(input.value);
});


// ---------------- DELETE ----------------
async function deleteEntry(passcode) {
  if (!confirm("Delete entry with Passcode: " + passcode + "?")) return;

  try {
    const res = await fetch(
      `${API_URL}?passcode=${encodeURIComponent(passcode)}`,
      { method: "DELETE" }
    );

    const text = await res.text();
    if (text.trim() === "Deleted") {
      alert("Entry deleted successfully.");
      fetchData(input.value);
    } else {
      alert("Entry not found.");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete entry.");
  }
}
