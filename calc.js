'use strict';
/*
  TODO:
    -Start with basic design/buttons using html
    -Create parser for a string of operations
    -Clean up design afterwards
    -PEMDAS o_o   --ignore parenthesis on the first attempt, come back later
    OK apparently even the windows calculators don't do pemdas at all


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
document.getElementById(DOM.equals).addEventListener('click', parser);

// Clear Screen event listener
document.getElementById(DOM.C).addEventListener('click', clearScreen);
document.getElementById(DOM.CE).addEventListener('click', clearScreen);

function clearScreen() {
  $(DOM.screen).textContent = '';
}

function updateScreen(str) {
  $(DOM.screen).textContent += str;
}

function parser() {
  // Array of items on screen
  let screenStr = $(DOM.screen).textContent;
  screenStr = screenStr.split(' ');

  // Empty Result
  let result = 0;

  // Loop through screen text
  screenStr.forEach((item, index) => {
    let prevItem = parseInt(screenStr[index - 1]);
    let nextItem = parseInt(screenStr[index + 1]);

    // If current item is a number and result is 0
    if (!isNaN(item) && result == 0) {
      // Set the result to the item
      result = parseInt(item);

      // Else, if item is an operator and prev and next are numbers
    } else if (isOperator(item) && !isNaN(prevItem) && !isNaN(nextItem)) {
      // Figure out which operator it is and calculate the next result
      switch (item) {
        case '+':
          result += nextItem;
          break;
        case '-':
          result -= nextItem;
          break;
      }
    }
  });

  // Update the screen with the new result
  clearScreen();
  updateScreen(result);
}

function isOperator(str) {
  return str == '+' || str == '-' || str == '*' || str == '/';
}

function $(x) {
  return document.getElementById(x);
}

function $$(x) {
  return document.querySelectorAll(x);
}
