window.onload = function () {
  const stateList = document.querySelector("#stateList");
  const stateSelector = document.querySelector("#stateSelector");

  fetch("./nested_data.json")
    .then((res) => res.json())
    .then((data) => {
      const listofStates = Object.keys(data);
      listofStates.forEach((state) => {
        console.log(state);
        const listItem = document.createElement("li");
        listItem.className = "text-xl py-0.5 px-5 hover:bg-gray-100";
        listItem.textContent = state;
        stateList.appendChild(listItem);
      });
    });

  stateSelector.addEventListener("click", () => {
    stateList.classList.toggle("hidden");
  });
};
