const selectThemeElement = document.querySelector("#selectTheme");

function handleThemeChange() {
  if (selectThemeElement?.value === "system") {
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");
    loadTheme();
    return;
  }

  // Whenever the user explicitly chooses light or dark mode
  localStorage.theme = selectThemeElement?.value;
  loadTheme();
}

function loadTheme() {
  const documentElement = document.documentElement;

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    documentElement.classList.add("dark");
    documentElement.style.setProperty("--caret-color", "rgb(225, 225, 225)");
  } else {
    documentElement.classList.remove("dark");
    documentElement.style.setProperty("--caret-color", "rgb(44, 44, 44)");
  }

  if (selectThemeElement)
    selectThemeElement.value = localStorage.theme || "system";
}

loadTheme();
