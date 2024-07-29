function clearList(list) {
  const ul = list;
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
    console.log("Hey");
  }
}

window.onload = function () {
  const stateList = document.querySelector("#stateList");
  const stateSelector = document.querySelector("#stateSelector");
  const stateInput = "";
  const districtList = document.querySelector("#districtList");
  const districtSelector = document.querySelector("#districtSelector");
  var selectedState;

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

  stateSelector.addEventListener("click", () => {
    stateList.classList.toggle("hidden");
  });
  stateList.addEventListener("click", function (event) {
    clearList(districtList);
    selectedState = event.target.innerHTML;
    stateSelector.textContent = selectedState;
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
          console.log(listItem.textContent);
        });
      });
  });

  districtSelector.addEventListener("click", () => {
    if (selectedState != null) {
      districtList.classList.toggle("hidden");
    }
  });

  console.log(selectedState);
};
