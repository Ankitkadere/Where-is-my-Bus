const input = document.getElementById("filterInput");
const buttons = document.querySelectorAll("button[data-value]");
const clearBtn = document.getElementById("clearBtn");
const deleteBtn = document.getElementById("deleteBtn");
const settext = document.getElementById("settext");
const submitBtn = document.getElementById("submitBtn");
const API_URL =
  "https://script.google.com/macros/s/AKfycbzkdg6vHCPXYmo8LdLB6Bk6c6hWzqpGNiAzWHBORtIVntStTPPxOTHo3buy31fMhO1Z_g/exec";

// Dial Pad Logic
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (input.value.length < 10) input.value += btn.getAttribute("data-value");
  });
});
clearBtn.addEventListener("click", () => (input.value = ""));
deleteBtn.addEventListener(
  "click",
  () => (input.value = input.value.slice(0, -1))
);

//LOader

const loader = document.getElementById("loader");
loader.classList.remove("hidden");
// Submit
const databox = document.querySelector(".overflow-x-auto");
const dialPadBox = document.querySelector(".max-w-sm");
const dataBody = document.getElementById("dataBody");

databox.classList.add("hidden");

submitBtn.addEventListener("click", () => {
  const passcode = input.value.trim();

  if (submitBtn.textContent === "Check Ticket" || passcode) {
    if (!passcode) {
      settext.textContent = "Please Enter A Passcode";
      return;
    }
    loader.classList.remove("hidden");
    fetchData(passcode);
    setTimeout(() => {
      loader.classList.add("hidden");
      submitBtn.textContent = "Clear";
      submitBtn.style.background = "green";
    }, 5000);
    dialPadBox.classList.add("hidden");
    databox.classList.remove("hidden");
    settext.textContent = "";
    input.value = "";

    return;
  }

  // CASE 2: If the button says "Clear"
  if (!submitBtn.textContent == "Check Ticket" || passcode == "") {
    window.location.reload();
    return;
  }
});

async function fetchData(passcode) {
  loader.classList.remove("hidden"); // Show loader when fetch starts
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data, passcode);
  } catch (error) {
    console.error("Error fetching data:", error);
    settext.textContent = "Failed to fetch data.";
  } finally {
    loader.classList.add("hidden"); // Always hide loader after fetch
  }
}

function renderTable(data, passcode) {
  const tbody = document.getElementById("dataBody");
  const dialPadBox = document.querySelector(".max-w-sm"); // dial pad container
  tbody.innerHTML = "<p> loading </p>";

  const filtered = passcode
    ? data.filter(
        (row) => row.Passcode == passcode || row.Usermobile == passcode
      )
    : [];

  if (filtered.length === 0) {
    dialPadBox.classList.remove("hidden"); // show again if no match
    tbody.innerHTML = `<tr><td colspan="11" class="text-center text-gray-500 py-4">No matching records found.</td></tr>`;
    return;
  }

  function formatTime(time24) {
    if (!time24) return "";

    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // convert 0 to 12 for midnight
    return `${hour}:${minute} ${ampm}`;
  }

  filtered.forEach((row) => {
    const tr = dataBody;
    const showButtons = row.Usermobile === passcode;
    const actionButtons = showButtons
      ? `
    <div class="flex justify-between space-x-4 p-4 border-t border-gray-300 bg-white">
      <button onclick='editEntry(${JSON.stringify(
        row
      )})' class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
        Update
      </button>
      <button onclick='deleteEntry("${
        row.Passcode
      }")' class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1">
        Cancel Booking
      </button>
    </div>
  `
      : "";

    tr.innerHTML = `         
    <body class="bg-gray-100 flex items-center justify-center w-full p-4">
        <div class="  w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden  ">
            <div class="w-full flex items-center justify-between bg-green-800 p-2">
                <div class="flex items-center space-x-3">
                     <div
                        class="w-20 h-20  rounded-full border-2 border-white  bg-custom-blue flex items-center justify-center">
                      <span class="text-white text-4xl font-bold select-none">
  ${row.Seat}
</span>

                    </div>
                    <div>
                        <h1 class="text-white text-xl font-semibold tracking-wide">
                            SwiftLine Express
                        </h1>
                        <p class="text-blue-200 text-sm font-medium">
                            Intercity Bus Service
                        </p>
                    </div>
                </div>
                <div class="text-white text-sm font-semibold tracking-wide">
                    <i class="fas fa-ticket-alt mr-1">
                    </i>
                    Ticket #A1234 
                </div>
            </div>
            <div class="p-6 space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Passenger
                        </p>
                        <p class="text-gray-900 font-medium text-lg">
                            ${row.Username}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Last Name
                        </p>
                        <p class="text-gray-900 font-medium text-lg">
                            ${row.Userlast}
                        </p>
                    </div>
                          <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Age
                        </p>
                        <p class="text-gray-900 font-medium text-lg">
                            ${row.Age}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Gender
                        </p>
                        <p class="text-gray-900 font-medium text-lg">
                            ${row.Gender}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                           Boooking Date
                        </p>
                        <p class="text-gray-900 font-medium text-lg">
                            ${row.Date}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Booking Time
                        </p>
                       <p class="text-gray-900 font-medium text-lg">
                           ${formatTime(row.Time)}
                      </p>

                    </div>
                
                </div>
                <div class="border-t border-gray-300 pt-4 flex justify-between items-center">
                  <div>
                        <p class="text-gray-500 uppercase text-xs text-left font-semibold tracking-wider mb-1">
                            From
                        </p>
                        <p class="text-gray-900 font-medium text-lg flex items-center">
                         <i class="fas fa-map-marker-alt text-green-500 mr-2">
                           
                            </i>
                           ${row.TStart}
                        </p>
                    </div>
                    <div>
                        <p class="text-gray-500 text-right uppercase text-xs font-semibold tracking-wider mb-1">
                            To
                        </p>
                        <p class="text-gray-900 font-medium text-lg flex items-center">
                            <i class="fas fa-map-marker-alt text-red-500 mr-2">
                            </i>
                           ${row.TEnd}
                        </p>
                    </div>
                </div>
                <div class="border-t border-gray-300 pt-4 flex justify-between items-center">
                     <div class="text-left">
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Class
                        </p>
                        <p class="text-blue-700 font-medium text-lg">
                            ${row.Class}
                        </p>
                    </div>
                     <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Child
                        </p>
                        <p class="text-blue-700 font-bold text-xl text-center">
                            ${row.Child}
                        </p>
                    </div>
                     <div>
                        <p class="text-gray-500 uppercase text-xs font-semibold tracking-wider mb-1">
                            Cash Price
                        </p>
                        <p class="text-blue-700 font-bold text-xl">
                            ${row.Price * row.Child} .Rs
                        </p>
                    </div>
                </div>
                 <div
    class="bg-white p-2 flex flex-row sm:flex-row items-center justify-center border-t border-gray-300 space-y-0 sm:space-y-0">
    <div class="flex items-center text-center space-x-0">
        <p class="text-green-700 text-center font-bold text-sm">
          Ticket Confirmed
        </p>
    </div>
  </div>
            </div>
            
            ${actionButtons}
        </div>
    </body>
        `;
    tbody.appendChild(tr);
  });
}

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

async function deleteEntry(passcode) {
  if (!confirm("Delete entry with Passcode: " + passcode + "?")) return;

  try {
    const res = await fetch(
      `${API_URL}?passcode=${encodeURIComponent(passcode)}`,
      {
        method: "DELETE",
      }
    );

    const text = await res.text();
    if (text.trim() === "Deleted") {
      alert("Entry deleted successfully.");
      fetchData(input.value); // Refresh list
    } else {
      alert("Entry not found or could not be deleted.");
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete entry.");
  }
}

// Fetch data automatically on load if input has a value
window.addEventListener("DOMContentLoaded", () => {
  const existingValue = input.value.trim();
  if (existingValue) fetchData(existingValue);
});
// Hide call wrapper on scroll
const callWrapper = document.getElementById("callWrapper");
let scrollTimeout;

window.addEventListener("scroll", () => {
  callWrapper.classList.add("opacity-0");
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    callWrapper.classList.remove("opacity-0");
  }, 300);
});





///////////////////////////////////////////////////////////////////













