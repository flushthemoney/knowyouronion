function clearList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function revertName(string, spanObject) {
  spanObject.textContent = string;
}

// Open IndexedDB database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PriceDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("prices")) {
        db.createObjectStore("prices", { keyPath: "id" });
      }
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject("Failed to open IndexedDB");
    };
  });
}

// Save data in IndexedDB
function saveDataToIndexedDB(data) {
  openDB().then((db) => {
    const transaction = db.transaction("prices", "readwrite");
    const store = transaction.objectStore("prices");
    store.put({ id: "priceData", data, timestamp: Date.now() });
  });
}

// Load data from IndexedDB
function loadDataFromIndexedDB() {
  return new Promise((resolve) => {
    openDB().then((db) => {
      const transaction = db.transaction("prices", "readonly");
      const store = transaction.objectStore("prices");
      const request = store.get("priceData");

      request.onsuccess = function () {
        if (request.result && request.result.data) {
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };
    });
  });
}

// Fetch data using HTTP caching
async function fetchData() {
  try {
    const response = await fetch("http://localhost:8000", {
      cache: "force-cache", // Use cached response if available
    });
    const data = await response.json();
    saveDataToIndexedDB(data); // Store in IndexedDB for backup
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return loadDataFromIndexedDB(); // Fallback to IndexedDB if API fails
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const selectors = {
    state: {
      span: "#stateSelector span",
      list: "#stateList",
      selector: "#stateSelector",
    },
    district: {
      span: "#districtSelector span",
      list: "#districtList",
      selector: "#districtSelector",
    },
    market: {
      span: "#marketSelector span",
      list: "#marketList",
      selector: "#marketSelector",
    },
    commodity: {
      span: "#commoditySelector span",
      list: "#commodityList",
      selector: "#commoditySelector",
    },
  };

  let selected = { state: null, district: null, market: null, commodity: null };
  let data = await fetchData(); // Load data via HTTP cache or IndexedDB fallback

  function populateList(listElement, items, onClickCallback) {
    clearList(listElement);
    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className =
        "text-xl py-0.5 px-5 hover:bg-gray-100 cursor-pointer";
      listItem.textContent = item;
      listItem.addEventListener("click", () => onClickCallback(item));
      listElement.appendChild(listItem);
    });
  }

  function closeAllDropdowns() {
    Object.keys(selectors).forEach((key) => {
      document.querySelector(selectors[key].list).classList.add("hidden");
    });
  }

  function handleSelection(type, value) {
    selected[type] = value;
    document.querySelector(selectors[type].span).textContent = value;
    closeAllDropdowns();

    if (type === "state") {
      selected.district = selected.market = selected.commodity = null;
      revertName(
        "Select District",
        document.querySelector(selectors.district.span)
      );
      revertName(
        "Select Market",
        document.querySelector(selectors.market.span)
      );
      revertName(
        "Select Commodity",
        document.querySelector(selectors.commodity.span)
      );
      populateList(
        document.querySelector(selectors.district.list),
        Object.keys(data[value]),
        (item) => handleSelection("district", item)
      );
    } else if (type === "district") {
      selected.market = selected.commodity = null;
      revertName(
        "Select Market",
        document.querySelector(selectors.market.span)
      );
      revertName(
        "Select Commodity",
        document.querySelector(selectors.commodity.span)
      );
      populateList(
        document.querySelector(selectors.market.list),
        Object.keys(data[selected.state][value]),
        (item) => handleSelection("market", item)
      );
    } else if (type === "market") {
      selected.commodity = null;
      revertName(
        "Select Commodity",
        document.querySelector(selectors.commodity.span)
      );
      populateList(
        document.querySelector(selectors.commodity.list),
        Object.keys(data[selected.state][selected.district][value]),
        (item) => handleSelection("commodity", item)
      );
    } else if (type === "commodity") {
      fetchPriceFromLocal();
    }
  }

  function fetchPriceFromLocal() {
    const { state, district, market, commodity } = selected;
    if (state && district && market && commodity) {
      const priceData = data[state][district][market][commodity]?.[0]; // First entry in array

      if (priceData) {
        const priceDisplay = document.createElement("div");
        priceDisplay.className = "text-2xl mt-4 text-center";
        priceDisplay.textContent = `Price: ${priceData.modal_price}`;
        document.querySelector("body").appendChild(priceDisplay);
      } else {
        console.error("No price data available for the selected options.");
      }
    }
  }

  populateList(
    document.querySelector(selectors.state.list),
    Object.keys(data),
    (item) => handleSelection("state", item)
  );

  Object.keys(selectors).forEach((key) => {
    const { selector, list } = selectors[key];
    document.querySelector(selector).addEventListener("click", () => {
      if (
        key !== "state" &&
        !selected[
          key === "district"
            ? "state"
            : key === "market"
            ? "district"
            : "market"
        ]
      )
        return;
      closeAllDropdowns();
      document.querySelector(list).classList.toggle("hidden");
    });
  });
});
