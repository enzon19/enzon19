'use strict';
// Códigos com asterisco significam roubados da internet e adaptados

document.onmousemove = e => mousePos(e);

let mouseX = 0;
let mouseY = 0;

const eyes = Array.from(document.getElementsByClassName('eye'));
const enzoFace = document.getElementsByClassName("face")[0];

function mousePos(e) {
  mouseX = e.clientX + document.body.scrollLeft; // *
  mouseY = e.clientY + document.body.scrollTop; // *

  eyes.forEach(eye => {
    let x = eye.getBoundingClientRect().left + eye.clientWidth / 2; // *
    let y = eye.getBoundingClientRect().top + eye.clientHeight / 2; // *
    let radian = Math.atan2(mouseY - y, mouseX - x); // *
    let rot = radian * (180 / Math.PI) * -1; // *
    eye.style.transform = 'rotate(' + (90 - rot) + 'deg)';
  });
};

function eyePos() {
  eyes.forEach((eye, i) => {
    const faceWidth = enzoFace.width;
    const faceHeight = enzoFace.height;

    const eyeHeight = [82, 72][i];
    const eyeWidth = [28, 24][i];

    let marginY = [(256 * faceWidth)/619, (239 * faceWidth)/619][i];
    let marginX = (enzoFace.getBoundingClientRect().left + eyeWidth / 2) + ([(163 * faceHeight)/687, (347 * faceHeight)/687][i] - 28);
    if (document.documentElement.clientWidth <= 570) {
      marginY += 20 - (document.documentElement.clientWidth / 100 * 2);
      marginX += document.documentElement.clientWidth / 100
    }

    eye.style.display = 'block';

    eye.style.backgroundSize = (eyeHeight * faceHeight)/687 + "px " + (eyeWidth * faceWidth)/619 + "px";
    eye.style.height = (eyeHeight * faceHeight)/687 + "px"; 
    eye.style.width = (eyeWidth * faceWidth)/619 + "px";

    eye.style.margin = marginY + "px " + marginX  + "px";

    console.log(marginY, marginX)
  });
};

async function createGallery() {
  const language = (navigator.language || navigator.userLanguage).split('-')[0];
  if (!['pt', 'en'].includes(language)) language = 'en';
  strings = await $.getJSON(`locales/${language}/strings.json`);

  const gallery = document.getElementsByClassName('gallery')[0];
  const projects = strings.projects.presentation;
  let buttonsElements = '';
  let presentationElements = '';

  for (let i = 0; i < projects.length; i++) {
    const buttonsList = projects[i].buttons;
    for (let j = 0; j < buttonsList.length; j++) {
      buttonsElements += `<a class="button noMarginButton" href="${buttonsList[j].url}" target="_blank" style="margin-right: 0px;">${buttonsList[j].name}</a>`;
    }
    presentationElements += `<div class="card">
    <img src="${projects[i].image}" class="cardImage" alt="${projects[i].title}">
    <h3 style="margin-top: 0px">${projects[i].title}</h3>
    <span>${projects[i].description}</span>
    <br>
    ${buttonsElements}
  </div>`
    buttonsElements = '';
  }

  gallery.innerHTML = presentationElements; 
}

function resetAnimation(element, className) {
  element.classList.add(className);
  element.style.animation = 'none';
  element.offsetHeight;
  element.style.animation = null;
}

function shuffle(array) { // *
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function scrollToDonate() {
  document.getElementById('donate.title').scrollIntoView({behavior: 'smooth'});
}

if (window.location.href.split('#')[1] == 'donate') {
  setTimeout(() => scrollToDonate(), 500);
}

$(document).ready(() => createGallery());
$(window).on("load", () => {
  eyePos();
  if (window.location.href.split('#')[1] == 'donate') scrollToDonate();
});