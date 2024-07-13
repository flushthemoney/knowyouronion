const stateList = document.querySelector("#stateList");
const stateSelector = document.querySelector("#stateSelector");

stateSelector.addEventListener("click", () => {
  stateList.classList.toggle("hidden");
});
