const scriptURL =
  "https://script.google.com/macros/s/AKfycbyhf7gsy7_zxqucs-PYBbCvnQDy-66RF10OrSLNhxTBMtrLQoAhdQstYZtNiGaI-iDr/exec";
const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get("from");
const to = urlParams.get("to");
const bus = urlParams.get("bus");

const divhead = document.getElementById("dataListhead");
divhead.className = "p-2 bg-gray-50 border border-gray-200 rounded shadow";
divhead.innerHTML = `
          <div  class="w-full mx-auto fixed left-0 top-0 " >
    <div style="background-color: rgba(26, 98, 163);" class=" text-white px-4 py-2 flex flex-wrap w-full text-sm font-sans pt-4">
      <div class="w-full flex justify-between text-white text-lg font-serif font-bold mb-2">
        <span>${from}</span>
        <span class="flex items-center">
          <i class="fas fa-arrow-right"></i>
        </span>
        <span>${to}</span>
      </div>
    </div>
    <div class="bg-gray-900 text-white text-lg px-2 py-1 text-center">
      Day 1 - 2025-06-11
    </div>
  </div>
          `;

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
          entry.Book == "No"
            ? `<button class="mt-14 col-1 text-black text-sm font-bold px-4 py-1 rounded transition cursor-not-allowed">
       ${entry.Password} .Rs
     </button>`
            : `<a  href="/Booking/Form.html?number=${encodeURIComponent(
                entry.Number
              )}&english=${encodeURIComponent(
                entry.English
              )}&hindi=${encodeURIComponent(
                entry.Hindi
              )}&from=${encodeURIComponent(entry.From)}&to=${encodeURIComponent(
                entry.To
              )}&start=${encodeURIComponent(
                entry.Start
              )}&end=${encodeURIComponent(entry.End)}&password=${encodeURIComponent(
                entry.Password
              )}"
   class="col-1 bg-green-600 text-white text-sm font-bold px-5 py-1 rounded hover:bg-green-700 transition inline-block text-center">
  ${entry.Password} ${entry.Book}
</a>
`;

        const div = document.createElement("div");
        div.className =
          "p-2 bg-gray-50 border border-gray-200 mt-20 rounded shadow";
        div.innerHTML = `
            <a href="/Location/location.html?number=${encodeURIComponent(
              entry.Number
            )}&start=${encodeURIComponent(
          entry.Start
        )}&end=${encodeURIComponent(entry.End)}&english=${encodeURIComponent(
          entry.English
        )}&hindi=${encodeURIComponent(entry.Hindi)}" 
            <div  class="flex items-start sm:items-center justify-between ">
              <div class="">
                <span class="bg-sky-600 text-white text-sm font-semibold px-2 py-0.5 rounded">${
                  entry.Number
                }</span>
                <span class="font-bold ml-2 text-sm">${entry.Start}</span>
                <span class="font-semibold text-sm">→</span>
                <span class="font-semibold text-sm">${entry.End}</span>
                <div class="mt-2 font-bold text-base">${
                  entry.English
                } / <span class="font-normal">${entry.Hindi}</span></div>
              </div>
               <div class=" col-1 text-right -mt-6">
                 <spam class="text-sky-600 text-sm select-none w-lg  "></spam>
                 ${bookButton}
               </div>
            </div>   </a>
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
