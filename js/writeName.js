function shuffleArray (array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const nameElement = document.querySelector('#name');

async function type() {
  if (nameElement.classList.contains('running')) return;
  
  const nicknames = ['Enzão', 'Barata', 'Baratinha'];
  let shuffledNicknames = shuffleArray(nicknames);
  shuffledNicknames.push('Enzo', 'enzon19');

  nameElement.classList.add('running');
  for (let index = 0; index < shuffledNicknames.length; index++) {    
    const text = shuffledNicknames[index];
    await deleteText();
    await changeText(text);
    if (index === shuffledNicknames.length - 1) nameElement.classList.remove('running');
  }
}

function deleteText() {
  return new Promise((resolve) => {
    setTimeout(() => {
      nameElement.classList.remove('type');
      nameElement.classList.add('delete');

      resolve(true);
    }, 1700);
  });
}

function changeText(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      nameElement.querySelector('h1').innerText = text;
      nameElement.classList.remove('delete');
      nameElement.classList.add('type');

      resolve(true);
    }, 1000);
  });
}

type();