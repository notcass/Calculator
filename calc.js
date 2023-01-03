'use strict';
/*

          ~~~~ Calculator without using eval() ~~~~


  TODO:
    !!DONE!! -Start with basic design/buttons using html
    !!DONE!! -Create parser for a string of operations
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
  screenText: 'screen-text',
  equals: 'btn-=',
};
let clearScreenFlag = false;

function clearScreen() {
  $(DOM.screenText).textContent = '0';
}

function updateScreen(str) {
  if (clearScreenFlag) {
    clearScreenFlag = false;
    clearScreen();
  }

  let screenText = $(DOM.screenText).textContent;

  if (screenText != '0') {
    // console.log('Not zero');
    // console.log(`Str is ${str}`);
    $(DOM.screenText).textContent += str;
  } else {
    // console.log('is zero');
    // console.log(`Str is ${str}`);
    $(DOM.screenText).textContent = str;
  }
}

function parser() {
  // Array of items on screen
  let screenStr = $(DOM.screen).textContent;
  screenStr = screenStr.split(' ');

  // Empty Result
  let result = 0;

  // Invalid expression flag
  let invalid = false;

  // If array is only one number, ignore 'accidental' parse
  // request and let user continue constructing the expression
  if (screenStr.length != 1) {
    // Loop through screen text
    screenStr.forEach((item, index) => {
      let prevItem = parseInt(screenStr[index - 1]);
      let nextItem = parseInt(screenStr[index + 1]);
      // console.log(`prevItem: ${prevItem}`);
      // console.log(`nextItem: ${nextItem}`);

      // Check for invalid expression
      // if current and next are both numbers  or current and next are both NOT numbers
      if (
        (!isNaN(item) && !isNaN(nextItem)) ||
        (isNaN(item) && isNaN(nextItem))
      ) {
        console.log('INVALID');
        invalid = true;
      } else {
        // If current item is a number and we're at the first item
        if (!isNaN(item) && index == 0) {
          // Set the result to the item
          result = parseInt(item);

          // Else, if item is an operator and prev and next are numbers
        } else if (isOperator(item) && !isNaN(prevItem) && !isNaN(nextItem)) {
          // Figure out which operator it is and calculate the next result
          switch (item) {
            case '+':
              result += nextItem;
              console.log(`${result} + ${nextItem}`);
              break;
            case '-':
              result -= nextItem;
              console.log(`${result} - ${nextItem}`);

              break;
            case '*':
              result *= nextItem;
              break;
            case '/':
              result /= nextItem;
              break;
          }
        }
      }
    });

    // Update the screen with the new result
    if (!invalid) {
      clearScreen();
      updateScreen(result);
      clearScreenFlag = true;
    } else {
      clearScreen();
    }
  }
}

function isOperator(str) {
  return str == '+' || str == '-' || str == '*' || str == '/';
}

(function () {
  // Digit event listeners
  $$('.digit').forEach((el) => {
    el.addEventListener('click', () => {
      updateScreen(el.textContent);
    });
  });

  // Operation event listeners
  $$('.operation').forEach((el) => {
    el.addEventListener('click', () => {
      updateScreen(` ${el.textContent} `);
    });
  });

  // Equals event listener
  $(DOM.equals).addEventListener('click', parser);

  // Clear Screen event listener
  $(DOM.C).addEventListener('click', clearScreen);
  $(DOM.CE).addEventListener('click', clearScreen);

  // Keyboard keybinds
  document.addEventListener('keydown', (key) => {
    // If enough space in the box
    if ($(DOM.screenText).textContent.length < 57) {
      // If digit key
      if (!isNaN(key.key)) {
        updateScreen(key.key);
      }

      switch (key.key) {
        case '*':
        case '/':
        case '+':
        case '-':
          updateScreen(' ' + key.key + ' ');
          break;
        case '=':
        case 'Enter':
          parser();
          break;
        case 'Escape':
          clearScreen();
          break;
      }
    }
  });
})();

function $(x) {
  return document.getElementById(x);
}

function $$(x) {
  return document.querySelectorAll(x);
}
