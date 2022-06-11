let strings = '';
translate()

async function translate() {
  const language = (navigator.language || navigator.userLanguage).split('-')[0];
  if (!['pt', 'en'].includes(language)) language = 'en';
  strings = await $.getJSON(`locales/${language}/strings.json`);

  try {
    const elements = document.querySelectorAll('[id]');
    elements.forEach(e => {
      let value = strings;
      const path = e.id.split('.');

      for (let i = 0; i < path.length; i++) {
        value = value[path[i]]
      }

      if (['IMG', 'IFRAME'].includes(e.tagName)) {
        e.src = value;
      } else if (e.tagName == 'META') {
        e.content = value;
      } else {
        e.innerHTML = value;
      }
    });
  } catch (error) {
    console.error(error);
  }
}