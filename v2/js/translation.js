const selectLanguageElement = document.querySelector("#selectLanguage");

function handleLanguageChange() {
  if (selectLanguageElement)
    window.location.search = "lng=" + selectLanguageElement.value;
}

function loadLanguage() {
  if (selectLanguageElement)
    selectLanguageElement.value =
      ["pt", "eng"].find((lng) => lng == window.i18nextify.i18next.language) ||
      "";
}

window.i18nextify.i18next.on("initialized", loadLanguage);
