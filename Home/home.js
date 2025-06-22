document.getElementById("findBusesBtn").addEventListener("click", () => {
  const from = document.getElementById("First").value.trim();
  const to = document.getElementById("Second").value.trim();

  if (!from || !to) {
    alert("Please fill both From and To fields");
    return;
  }

  window.location.href = `/Buslist/Datalist.html?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}`;
});

document.getElementById("searchBtn").addEventListener("click", () => {
  const code = document.getElementById("numberName").value.trim();

  if (!code) {
    alert("Enter A Valid Value");
    return;
  }

  window.location.href = `/Location/Directlocation.html?bus=${encodeURIComponent(code)}`;
});

// Data arrays for suggestions - city names
const cities = [
  "JBP - Jabalpur",
  "BPL - Bhopal",
  "MDL - Medical",
  "Shahpura",
  "Indore",
  "Nagpur",
  "Raipur",
  "Bilaspur",
  "Satna",
  "Gwalior",
  "Rewa",
  "Chhindwara",
  "Ujjain",
  "Sagar",
  "Durg",
  "Korba",
  "Raigarh",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Visakhapatnam",
  "Bangalore",
  "Hyderabad",
  "Coimbatore",
];

// Data arrays for buses
const buses = [
  { code: "00101", en: "Choudhary", hi: "चौधरी" },
   { code: "00102", en: "Choudhary", hi: "चौधरी" },
  { code: "00102", en: "Rathore", hi: "राठौर" },
  { code: "00103", en: "Sharma", hi: "शर्मा" },
  { code: "00104", en: "Verma", hi: "वर्मा" },
  { code: "00105", en: "Yadav", hi: "यादव" },
  { code: "00106", en: "Patel", hi: "पटेल" },
  { code: "00107", en: "Thakur", hi: "ठाकुर" },
  { code: "00108", en: "Khan", hi: "खान" },
  { code: "00109", en: "Meena", hi: "मीणा" },
  { code: "00110", en: "Gupta", hi: "गुप्ता" },
  { code: "00111", en: "Pandey", hi: "पांडेय" },
  { code: "00112", en: "Tiwari", hi: "तिवारी" },
  { code: "00113", en: "Jha", hi: "झा" },
  { code: "00114", en: "Saxena", hi: "सक्सेना" },
  { code: "00115", en: "Dubey", hi: "दुबे" },
];
 
// Utility function to create suggestion items
function createSuggestionItem(text) {
  const div = document.createElement("div");
  div.classList.add("suggestion-item");
  div.setAttribute("role", "option");
  div.textContent = text;
  return div;
}

// Generic function to handle input and suggestions
function setupAutocomplete(inputEl, suggestionsEl, dataList) {
  let selectedIndex = -1;

  inputEl.addEventListener("input", () => {
    const val = inputEl.value.trim().toLowerCase();
    suggestionsEl.innerHTML = "";
    selectedIndex = -1;
    if (!val) {
      suggestionsEl.classList.add("hidden");
      return;
    }
    const filtered = dataList.filter((item) =>
      item.toLowerCase().includes(val)
    );
    if (filtered.length === 0) {
      suggestionsEl.classList.add("hidden");
      return;
    }
    filtered.forEach((item) => {
      const suggestionItem = createSuggestionItem(item);
      suggestionItem.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Prevent losing focus
        inputEl.value = item;
        suggestionsEl.classList.add("hidden");
      });
      suggestionsEl.appendChild(suggestionItem);
    });
    suggestionsEl.classList.remove("hidden");
  });

  // Hide suggestions on blur with slight delay to allow click
  inputEl.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsEl.classList.add("hidden");
      selectedIndex = -1;
    }, 150);
  });

  // Keyboard navigation
  inputEl.addEventListener("keydown", (e) => {
    const items = suggestionsEl.querySelectorAll(".suggestion-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateActive(items, selectedIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateActive(items, selectedIndex);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        e.preventDefault();
        inputEl.value = items[selectedIndex].textContent;
        suggestionsEl.classList.add("hidden");
        selectedIndex = -1;
      }
    } else {
      selectedIndex = -1;
      updateActive(items, selectedIndex);
    }
  });

  function updateActive(items, index) {
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active");
        item.setAttribute("aria-selected", "true");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("active");
        item.removeAttribute("aria-selected");
      }
    });
  }
}

// Setup autocomplete for each input
setupAutocomplete(
  document.getElementById("First"),
  document.getElementById("FirstSuggestions"),
  cities
);
setupAutocomplete(
  document.getElementById("Second"),
  document.getElementById("SecondSuggestions"),
  cities
);
setupAutocomplete(
  document.getElementById("numberName"),
  document.getElementById("NumberNameSuggestions"),
  buses.map((bus) => `${bus.code} : ${bus.en} / ${bus.hi}`)
);
 
// Swap button functionality
const swapBtn = document.getElementById("swapBtn");
const firstInput = document.getElementById("First");
const secondInput = document.getElementById("Second");

swapBtn.addEventListener("click", () => {
  const temp = firstInput.value;
  firstInput.value = secondInput.value;
  secondInput.value = temp;
  firstInput.focus();
});
///////First Swap Second///////

//////////////////////////////
