'use strict';
// Códigos com asterisco significam roubados da internet e adaptados

const nicknames = ['Enzão', 'Barata', 'Baratinha'];

function type(text) {
  return new Promise((resolve) => {
    document.getElementsByClassName('bigTitle')[0].classList.remove('type');
    document.getElementsByClassName('bigTitle')[0].classList.add('delete');
    setTimeout(() => {
      document.getElementsByClassName('bigTitle')[0].innerHTML = text;
      document.getElementsByClassName('bigTitle')[0].classList.remove('delete');
      document.getElementsByClassName('bigTitle')[0].classList.add('type');
      setTimeout(() => {
        resolve(true);
      }, 1000);
    }, 1100);
  });
}

function showPrevious(previousNickname) {
  return new Promise((resolve) => {
    if (!previousNickname) previousNickname = 'enzon19';
    resetAnimation(document.getElementsByClassName('logNames')[0], 'descriptionUpdate'); 
    document.getElementsByClassName('logNames')[0].innerHTML = `(${strings.log.or} ${previousNickname})`;
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

(async () => {
  const shuffledNicknames = shuffle(nicknames);
  shuffledNicknames.push('Enzo', 'enzon19');

  for (let i = 0; i < shuffledNicknames.length; i++) {
    await type(shuffledNicknames[i]);
    await showPrevious(shuffledNicknames[i - 1]);
  }
})()