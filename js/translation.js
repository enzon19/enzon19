const selectLanguageElement = document.querySelector('#selectLanguage');

function handleLanguageChange() {
  window.location.search = 'lng=' + selectLanguageElement.value;
}

function loadLanguage() {
  selectLanguageElement.value = window.i18nextify.i18next.language;
}

window.i18nextify.i18next.on('initialized', loadLanguage);