// function to clear list, used when upper level is modified

function clearList(list) {
  const ul = list;
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

// function to revert name of dropdown menu, used when higher lever dropdown is modified
function revertName(string, spanObject) {
  spanObject.textContent = string;
}

//var url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.GOVT_API_KEY}&format=json&limit=200000`;

window.onload = function () {
  // fetch(url)
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));
  // defining DOM elements
  const stateSelectorSpan = document.querySelector("#stateSelector span");
  const districtSelectorSpan = document.querySelector("#districtSelector span");
  const marketSelectorSpan = document.querySelector("#marketSelector span");
  const commoditySelectorSpan = document.querySelector(
    "#commoditySelector span"
  );
  const stateList = document.querySelector("#stateList");
  const stateSelector = document.querySelector("#stateSelector");
  const districtList = document.querySelector("#districtList");
  const districtSelector = document.querySelector("#districtSelector");
  const marketList = document.querySelector("#marketList");
  const marketSelector = document.querySelector("#marketSelector");
  const commoditySelector = document.querySelector("#commoditySelector");
  const commodityList = document.querySelector("#commodityList");
  var selectedState;
  var selectedDistrict;
  var selectedCommodity;
  var selectedMarket;

  // fetching list of states from nested_json and adding them as li elements
  fetch("./nested_data.json")
    .then((res) => res.json())
    .then((data) => {
      const listofStates = Object.keys(data);
      listofStates.forEach((state) => {
        const listItem = document.createElement("li");
        listItem.className = "text-xl py-0.5 px-5 hover:bg-gray-100";
        listItem.textContent = state;
        stateList.appendChild(listItem);
      });
    });

  // listening for click to expand dropdown menu
  stateSelector.addEventListener("click", () => {
    stateList.classList.toggle("hidden");
  });

  // listen for state input
  stateList.addEventListener("click", function (event) {
    revertName("Select District", districtSelectorSpan);
    revertName("Select Market", marketSelectorSpan);
    revertName("Select Commodity", commoditySelectorSpan);
    clearList(districtList);
    clearList(marketList);
    clearList(commodityList);
    selectedState = event.target.innerHTML;
    stateSelectorSpan.textContent = selectedState;
    stateList.classList.toggle("hidden");
    fetch("./nested_data.json")
      .then((res) => res.json())
      .then((data) => {
        const stateData = data[selectedState];
        const listofDistricts = Object.keys(stateData);
        listofDistricts.forEach((district) => {
          const listItem = document.createElement("li");
          listItem.className = "text-xl py-0.5 px-5 hover:bg-gray-100";
          listItem.textContent = district;
          districtList.appendChild(listItem);
        });
      });
  });

  districtSelector.addEventListener("click", () => {
    if (selectedState != null) {
      districtList.classList.toggle("hidden");
    }
  });

  // listen for district input
  districtList.addEventListener("click", function (event) {
    revertName("Select Market", marketSelectorSpan);
    revertName("Select Commodity", commoditySelectorSpan);
    clearList(commodityList);
    clearList(marketList);
    selectedDistrict = event.target.innerHTML;
    districtSelectorSpan.textContent = selectedDistrict;
    districtList.classList.toggle("hidden");
    fetch("./nested_data.json")
      .then((res) => res.json())
      .then((data) => {
        const districtData = data[selectedState][selectedDistrict];
        const listofMarkets = Object.keys(districtData);
        listofMarkets.forEach((market) => {
          const listItem = document.createElement("li");
          listItem.className = "text-xl py-0.5 px-5 hover:bg-gray-100";
          listItem.textContent = market;
          marketList.appendChild(listItem);
        });
      });
  });

  marketSelector.addEventListener("click", () => {
    if (selectedDistrict != null) {
      marketList.classList.toggle("hidden");
    }
  });

  // listen for market input
  marketList.addEventListener("click", function (event) {
    revertName("Select Commodity", commoditySelectorSpan);
    clearList(commodityList);
    selectedMarket = event.target.innerHTML;
    marketSelectorSpan.textContent = selectedMarket;
    marketList.classList.toggle("hidden");
    fetch("./nested_data.json")
      .then((res) => res.json())
      .then((data) => {
        const marketData =
          data[selectedState][selectedDistrict][selectedMarket];
        const listofCommodities = Object.keys(marketData);
        listofCommodities.forEach((commodity) => {
          const listItem = document.createElement("li");
          listItem.className = "text-xl py-0.5 px-5 hover:bg-gray-100";
          listItem.textContent = commodity;
          commodityList.appendChild(listItem);
        });
      });
  });

  // listen for commodity input
  commoditySelector.addEventListener("click", () => {
    if (selectedMarket != null) {
      commodityList.classList.toggle("hidden");
    }
  });
  commodityList.addEventListener("click", function (event) {
    selectedCommodity = event.target.innerHTML;
    commoditySelectorSpan.textContent = selectedCommodity;
    commodityList.classList.toggle("hidden");
  });
};
