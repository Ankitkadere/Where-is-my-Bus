const scriptURL =
  "https://script.google.com/macros/s/AKfycbyhf7gsy7_zxqucs-PYBbCvnQDy-66RF10OrSLNhxTBMtrLQoAhdQstYZtNiGaI-iDr/exec";
const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get("from");
const to = urlParams.get("to");
const bus = urlParams.get("bus");

const divhead = document.getElementById("dataListhead");
divhead.className = " bg-gray-50 border border-gray-200 rounded shadow";
divhead.innerHTML = `
<div class="fixed top-0 left-0 w-full z-50">

  <!-- Main Premium Header -->
  <div class="bg-gradient-to-r from-[#1a62a3] via-[#1f6fbf] to-[#144b7c] 
              shadow-xl  overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-2 pt-2 pb-2 text-white">

      <div class="flex items-center  ">
     <a href="javascript:void(0)"
   onclick="history.back()"
   class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full 
          flex items-center justify-center shadow-md 
          hover:scale-105 active:scale-95 transition">
  <i class="fas fa-arrow-left text-white text-lg"></i>
</a>
        <h1 class="text-xl ml-2 font-bold tracking-wide">
          Where is My Bus
        </h1>
      </div>

      <div class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full 
                  flex items-center justify-center shadow-md cursor-pointer">
        <i class="fas fa-ellipsis-v text-white"></i>
      </div>
    </div>

    <!-- Route Card -->
    <div class="px-2 pb-1">

      <div class="bg-white/15 backdrop-blur-xl 
                  rounded-2xl p-2  border border-white/20">

        <div class="flex items-center justify-between text-white font-semibold text-base">

          <!-- FROM -->
          <div class="flex flex-col w-[42%]">
            <span class="text-xs opacity-80 mb-1">FROM</span>
            <span class="bg-sky-900/70 px-3 py-1.5 rounded-lg text-center">
              ${from}
            </span>
          </div>

          <!-- Arrow -->
          <div class="flex items-center justify-center w-[16%]">
            <div class="w-10 h-10 bg-white/20 rounded-full 
                        flex items-center justify-center shadow">
              <i class="fas fa-arrow-right text-white text-sm"></i>
            </div>
          </div>

          <!-- TO -->
          <div class="flex flex-col w-[42%] text-right">
            <span class="text-xs opacity-80 mb-1">TO</span>
            <span class="bg-sky-900/70 px-3 py-1.5 rounded-lg text-center">
              ${to}
            </span>
          </div>

        </div>

      </div>
    </div>
  </div>

  <!-- Schedule Row -->
  <div class="bg-gray-900 text-white text-sm font-semibold 
              flex justify-between items-center px-4 py-2 shadow-md">

    <span id="datetimeBox" class="opacity-90">
      Time
    </span>

    <div class="flex gap-10 tracking-wide">
      <span class="text-gray-300">SCHEDULED</span>
      <span class="text-green-600">EXPECTED</span>
    </div>

  </div>

</div>
`;

const datetimeBox = document.getElementById("datetimeBox");

function updateDateTime() {
  const now = new Date();

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format date/time
  let formatted = now.toLocaleString("en-IN", options);
  formatted = formatted.replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
  datetimeBox.textContent = `${formatted}`;
}

updateDateTime(); // initial call
setInterval(updateDateTime, 1000); // update every second

function fetchData() {
  fetch(scriptURL)
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("dataList");
      container.innerHTML = ``;

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gray-50">
      <div class="w-64 h-64 mb-8 rounded-full overflow-hidden shadow-lg border-8 border-indigo-100 flex items-center justify-center bg-white">
        <img src="https://storage.googleapis.com/a1aa/image/c5c4988f-4845-43c7-a758-ea18bdb6b5d4.jpg" alt="404 illustration" class="object-cover w-full h-full" />
      </div>
      <h1 class="text-6xl font-extrabold text-indigo-600 mb-4">Not Found</h1>
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Oops! Page Entries Not Found</h2>
      <p class="text-gray-600 mb-8 max-w-xl">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a href="Index.html" class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition">
        <i class="fas fa-home mr-2"></i> Go to Homepage
      </a>
    </div>
  `;
        return;
      }
      const filtered = data.filter(
        (entry) =>
          entry.From?.trim() == from?.trim() && entry.To?.trim() == to?.trim(),
      );

      if (filtered.length === 0) {
        container.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gray-50">
      <div class="w-64 h-64 mb-8 rounded-full overflow-hidden shadow-lg border-8 border-indigo-100 flex items-center justify-center bg-white">
        <img src="https://storage.googleapis.com/a1aa/image/c5c4988f-4845-43c7-a758-ea18bdb6b5d4.jpg" alt="404 illustration" class="object-cover w-full h-full" />
      </div>
      <h1 class="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Oops! Page Not Found</h2>
      <p class="text-gray-600 mb-8 max-w-xl">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a href="Index.html" class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition">
        <i class="fas fa-home mr-2"></i> Go to Homepage
      </a>
    </div>
  `;
        return;
      }
      filtered.forEach((entry) => {
        const bookButton =
          entry.Book === "No"
            ? `<button class="cursor-not-allowed text-top bg-gray-200 px-2 text-black rounded font-bold">
            ${entry.Password} .Rs
          </button>`
            : `<span class="text-xs mr-1 font-semibold text-sky-700 px-1 py-1 rounded-md">
  Book
</span><button href="/Booking/Form.html?number=${encodeURIComponent(
                entry.Number,
              )}&english=${encodeURIComponent(
                entry.English,
              )}&hindi=${encodeURIComponent(
                entry.Hindi,
              )}&from=${encodeURIComponent(entry.From)}&to=${encodeURIComponent(
                entry.To,
              )}&start=${encodeURIComponent(
                entry.Start,
              )}&end=${encodeURIComponent(
                entry.End,
              )}&password=${encodeURIComponent(entry.Password)}"
            class=" px-2 rounded text-white bg-green-700 transition font-bold inline-block ">
            ${entry.Password} .Rs
          </button>`;

        // Status color logic
        const color =
          entry.Status === "ARRIVED"
            ? "green"
            : entry.Status === "DEPARTED"
              ? "red"
              : "gray";
        const statusClass =
          color === "green"
            ? "bg-green-600"
            : color === "red"
              ? "bg-red-600"
              : "bg-green-700";

        const div = document.createElement("div");
        div.className =
          "px-3 py-2 bg-white border-b border-gray-600 transition ";

        div.innerHTML = `
<a href="location.html?number=${encodeURIComponent(
          entry.Number,
        )}&start=${encodeURIComponent(
          entry.Start,
        )}&end=${encodeURIComponent(entry.End)}&english=${encodeURIComponent(
          entry.English,
        )}&hindi=${encodeURIComponent(entry.Hindi)}" >

<div class="bg-white  
transition-all duration-300  ">

  <div class="flex justify-between border-none items-center text-base">
    
    <span class="bg-gradient-to-r from-sky-600 to-sky-800 text-white font-bold px-3 py-1 rounded-lg shadow">
      ${entry.Number}
    </span>

    <div class="text-right flex gap-4">
      <p class="text-gray-800 font-extrabold tracking-wide">${entry.Start}</p>
      <p class="text-red-600 font-extrabold tracking-wide">${entry.End}</p>
    </div>

  </div>

  <div class="flex pt-3 justify-between text-center border-t mt-3">
    
    <p class="text-gray-800 font-semibold">
      ${entry.English || "—"} /
      <span class="font-bold text-gray-900">${entry.Hindi || "—"}</span>
    </p>

    <p class="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md">
      ${entry.Arrival || "- -"}
    </p>

  </div>

  <div class="flex justify-between items-start mt-3">

    <div class="flex items-start space-x-3">
      
      <div class="flex flex-col items-center mt-1">
        <div class="w-2.5 h-2.5 bg-green-600 rounded-full shadow"></div>
        <div class="h-6 border-l border-gray-300"></div>
        <div class="w-2.5 h-2.5 bg-red-600 rounded-full shadow"></div>
      </div>

      <div>
        <p class="text-gray-800 font-semibold pb-[0.20rem]">${entry.From}</p>
        <p class="text-gray-800 font-semibold">${entry.To}</p>
      </div>

    </div>

    <div class="flex flex-col items-center justify-end">

      <span class="text-sky-700 text-sm font-semibold bg-sky-50 px-2 py-0.5 rounded-md">
        Daily..
      </span>

      <span class="pt-2 block">
        ${bookButton || "- -"}
      </span>

    </div>

  </div>

</div>

</a>
`;

        container.appendChild(div);
      });
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      document.getElementById("dataList").innerHTML =
        '<p class="text-red-500 text-center">Failed to load data.</p>';
    });
}

window.onload = fetchData;
