function clearList(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

function revertName(string, spanObject) {
  spanObject.textContent = string;
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
  let data;

  try {
    const response = await fetch("../server/data/nested_data.json");
    data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return;
  }

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

  function handleSelection(type, value) {
    selected[type] = value;
    document.querySelector(selectors[type].span).textContent = value;
    document.querySelector(selectors[type].list).classList.add("hidden");

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
      document.querySelector(list).classList.toggle("hidden");
    });
  });
});
