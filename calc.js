'use strict';
/*
  TODO:
    -Start with basic design/buttons using html
    -Create parser for a string of operations
    -Clean up design afterwards
    -PEMDAS   o_o

  FIXME:
    -Prevent screen from getting wider than the calc
    when too many numbers are added and then
    pushing the buttons off the calc also.



*/

const DOM = {
  CE: 'btn-CE',
  C: 'btn-C',
  screen: 'screen',
  equals: 'btn-=',
};

// Digit event listeners
document.querySelectorAll('.digit').forEach((el) => {
  el.addEventListener('click', () => {
    updateScreen(el.textContent);
  });
});

// Operation event listeners
document.querySelectorAll('.operation').forEach((el) => {
  el.addEventListener('click', () => {
    updateScreen(` ${el.textContent} `);
  });
});

// Equals event listener
document.getElementById(DOM.equals).addEventListener('click', result);

// Clear Screen event listener
document.getElementById(DOM.C).addEventListener('click', clearScreen);
document.getElementById(DOM.CE).addEventListener('click', clearScreen);

function clearScreen() {
  $(DOM.screen).textContent = '';
}

function updateScreen(str) {
  $(DOM.screen).textContent += str;
}

function result() {
  console.log('Result');
  // Parse screen
  /*
      ---Ideas?---
  Store everything in array
  arr.forEach(item => {
    switch(item)
  })

  */
  let screenStr = $(DOM.screen).textContent;
  console.log(screenStr.split(' '));
}

function $(x) {
  return document.getElementById(x);
}

function $$(x) {
  return document.querySelectorAll(x);
}
