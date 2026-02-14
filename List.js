const scriptURL =
  "https://script.google.com/macros/s/AKfycbyhf7gsy7_zxqucs-PYBbCvnQDy-66RF10OrSLNhxTBMtrLQoAhdQstYZtNiGaI-iDr/exec";
const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get("from");
const to = urlParams.get("to");
const bus = urlParams.get("bus");

const divhead = document.getElementById("dataListhead");
divhead.className = "p-2 bg-gray-50 border border-gray-200 rounded shadow";
divhead.innerHTML = `
  <div class="w-full mx-auto fixed left-0 top-0 z-50">
    <!-- Blue Header -->
       <div style="background-color: rgba(26, 98, 163);"
          class="flex items-center text-white w-full sm:w-auto justify-between px-4 pt-2">
          <span class="text-lg font-bold flex items-left space-x-2  text-xl">
            <a href="/Buslist/List.html"><i id="location-back-btn" class="fas fa-arrow-left"></i></a>
            <span class="text-xl" >Where is My Bus</span>
          </span>
          <i class="fas fa-ellipsis-v text-xl cursor-pointer"></i>
        </div>
    <div style="background-color: rgba(26, 98, 163);" class="text-white px-3 py-4 flex flex-wrap w-full text-sm font-sans">
      <div class="w-full flex justify-between items-center text-white text-lg font-bold mb-1">
        <span class="min-w-[45%] bg-sky-800 rounded-md py-1 px-1">${from}</span>
        <span class="flex items-center w-[10%]">
          <i class="fas fa-arrow-right mx-2"></i>
        </span>
        <span class="min-w-[45%] text-right bg-sky-800 rounded-md py-1 px-1">${to}</span>
      </div>
    </div>
 
    <!-- Schedule Row -->
    <div class="flex justify-between items-center bg-gray-800 text-white text-sm font-semibold px-4 py-2">
      <div>
        <span id="datetimeBox" class="text-left">Time</span>
      </div>
      <div class="flex gap-8">
        <span>SCHEDULED</span>
        <span>EXPECTED</span>
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
          entry.From?.trim() == from?.trim() && entry.To?.trim() == to?.trim()
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
            ? `<button class="cursor-not-allowed text-center text-black rounded font-bold">
          ${entry.Password} .Rs
        </button>`
            : `<button href="/Booking/Form.html?number=${encodeURIComponent(
                entry.Number
              )}&english=${encodeURIComponent(
                entry.English
              )}&hindi=${encodeURIComponent(
                entry.Hindi
              )}&from=${encodeURIComponent(entry.From)}&to=${encodeURIComponent(
                entry.To
              )}&start=${encodeURIComponent(
                entry.Start
              )}&end=${encodeURIComponent(
                entry.End
              )}&password=${encodeURIComponent(entry.Password)}"
          class=" text-black rounded hover:bg-green-700 transition font-bold inline-block text-center">
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
            : "bg-gray-400";

        const div = document.createElement("div");
        div.className =
          "px-3 py-3 bg-gray-50 border-b border-gray-600 transition ";

        div.innerHTML = `
            <a href="location.html?number=${encodeURIComponent(
              entry.Number
            )}&start=${encodeURIComponent(
          entry.Start
        )}&end=${encodeURIComponent(entry.End)}&english=${encodeURIComponent(
          entry.English
        )}&hindi=${encodeURIComponent(entry.Hindi)}" >
    <div class="flex justify-between items-center">
      <span class="bg-sky-700 text-white font-bold px-3 rounded">${
        entry.Number
      }</span>
      <div class="text-right flex gap-4 ">
        <p class="text-gray-800 font-extrabold">${entry.Start}</p>
        <p class="text-red-600 font-extrabold">${entry.End}</p>
      </div>
    </div class="pt-2">
         <div class="flex pt-2 justify-between text-center">
         <p class="text-black font-bold">
         ${entry.English || "—"} /
           <span class="font-bold">${entry.Hindi || "—"}</span>
        </p>

     <p class="text-red-600 font-bold">
    ${entry.Arrival || "- -"}
       </p>
    </div>


    <div class="flex justify-between items-start mt-2 ">
      <div class="flex items-start space-x-3">
        <div class="flex flex-col items-center mt-2">
          <div class="w-2 h-2 bg-green-600 rounded-full"></div>
          <div class="h-5 border-l border-gray-400"></div>
          <div class="w-2 h-2 bg-red-600 rounded-full"></div>
        </div>
        <div>
          <p class="text-black  pb-[0.20rem]">${entry.From}</p>
          <p class="text-black  ">${entry.To}</p>
        </div>
      </div>

    <div class="text-right text-sm text-center">
  <span class="pb-3 block">${bookButton || "- -"}</span>
  <span class="${statusClass || 'bg-green-500'} text-white px-3 text-center rounded text-sm font-semibold">
    ${entry.Status || "RUNNING"}
  </span>
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
