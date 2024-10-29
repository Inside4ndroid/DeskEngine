/*
 * Developed by Inside4ndroid Studios Ltd
 */
const root = document.documentElement;
const dropdownTitle = document.querySelector(".dropdown-title");
const dropdownList = document.querySelector(".dropdown-list");
const mainButton = document.querySelector(".main-button");

const listItems = ["English", "More Coming Soon..."];

const listItemTemplate = (text, translateValue) => {
  return `
    <li class="dropdown-list-item">
      <button class="dropdown-button list-button" data-translate-value="${translateValue}%">
        <span class="text-truncate">${text}</span>
      </button>
    </li>
  `;
};

const renderListItems = () => {
  dropdownList.innerHTML += listItems
    .map((item, index) => {
      return listItemTemplate(item, 100 * index);
    })
    .join("");
};

window.addEventListener("load", () => {
  renderListItems();
});

const setDropdownProps = (deg, ht, opacity) => {
  root.style.setProperty("--rotate-arrow", deg !== 0 ? deg + "deg" : 0);
  root.style.setProperty("--dropdown-height", ht !== 0 ? ht + "rem" : 0);
  root.style.setProperty("--list-opacity", opacity);
};

mainButton.addEventListener("click", () => {
  const listWrapperSizes = 3.5;
  const dropdownOpenHeight = 4.6 * listItems.length + listWrapperSizes;
  const currDropdownHeight =
    root.style.getPropertyValue("--dropdown-height") || "0";

  currDropdownHeight === "0"
    ? setDropdownProps(180, dropdownOpenHeight, 1)
    : setDropdownProps(0, 0, 0);
});

dropdownList.addEventListener("click", (e) => {
  const langText = document.getElementById('languageText2');
  const clickedItemText = e.target.innerText.trim();
  dropdownTitle.innerHTML = clickedItemText;
  langText.innerHTML = 'Language - '+clickedItemText;
  setDropdownProps(0, 0, 0);

  // TODO AFTER SELECTING LANGUAGE WE SHOULD INITIATE A TRANSLATED VERSION OR INTERNAL TRANSLATOR.

});
