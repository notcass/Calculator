'use strict';
/*

          ~~~~ Calculator without using eval() ~~~~


  TODO:
    !!DONE!! -Start with basic design/buttons using html
    !!DONE!! -Create parser for a string of operations
    !!DONE!! -Clean up design afterwards
    !!DONE!! -Don't automatically clear last result. Let user create an expression
    from the last result, instead of clearing the last result when a new
    number is entered.
    !!DONE!! -Fix Add button positioning
    !!DONE!! -Refactor this mess

    -Add backspace function

*/

const DOM = {
  C: 'btn-C',
  screenText: 'screen-text',
  equals: 'btn-equals',
};
let clearScreenFlag = false;

function clearScreen() {
  $(DOM.screenText).textContent = '0';
}

function updateScreen(str) {
  // If I press 2 + 2 and the screen says 4
  // If I then press 3, I don't want the screen to show 43, I want it to replace 4 with 3
  // This code block handles that
  if (clearScreenFlag) {
    clearScreenFlag = false;
    if (!isOperator(str.trim())) {
      clearScreen();
    }
  }

  let screen = $(DOM.screenText);

  if (screen.textContent == '0') {
    // Replace Screen Text with str
    screen.textContent = str;
  } else {
    // Add str to Screen Text
    screen.textContent += str;
  }
}

function parser() {
  // Array of items on screen
  let screenStr = $(DOM.screenText).textContent.trim().split(' ');
  screenStr = screenStr.filter((n) => n != '');
  console.log(screenStr);

  // Empty Result
  let result = 0;

  // Invalid expression flag
  let valid = false;

  // Loop through screen text
  screenStr.forEach((item, index) => {
    let prevItem = parseFloat(screenStr[index - 1]);
    let nextItem = parseFloat(screenStr[index + 1]);

    // Check for invalid expression
    // if current and next are both numbers  or current and next are both NOT numbers
    valid = isValidSequence(item, nextItem);

    if (valid) {
      // If current item is a number and we're at the first item
      if (!isNaN(item) && index == 0) {
        // Set the result to the item
        result = parseFloat(item);

        // Else, if item is an operator and prev and next are numbers
      } else if (isOperator(item) && !isNaN(prevItem) && !isNaN(nextItem)) {
        // Evaluate the expression
        eval(`result ${item}= nextItem;`);
      }
    }
  });

  // Update the screen with the new result
  clearScreen();
  if (valid) {
    updateScreen(result);
    clearScreenFlag = true;
  }
}

function isOperator(str) {
  return str == '+' || str == '-' || str == '*' || str == '/';
}

function isValidSequence(item, nextItem) {
  // If current and next are matching, return false
  return !(
    (isNumber(item) && isNumber(nextItem)) ||
    (isNaN(item) && isNaN(nextItem))
  );
}

function setupEventListeners() {
  // Digit keys' event listeners
  $$('.digit').forEach((el) => {
    el.addEventListener('click', () => {
      updateScreen(el.textContent);
    });

    // Prevent enter key from triggering the digit keys
    el.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
  });

  // Operation keys' event listeners
  $$('.operation').forEach((el) => {
    el.addEventListener('click', () => {
      updateScreen(` ${el.textContent} `);
    });

    // Prevent enter key from triggering the operator keys
    el.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
  });

  // Equals event listener
  $(DOM.equals).addEventListener('click', parser);

  // Clear Screen event listener
  $(DOM.C).addEventListener('click', clearScreen);

  // Keyboard keybinds
  document.addEventListener('keydown', (key) => {
    // If enough space in the box
    if ($(DOM.screenText).textContent.length < 57) {
      // If digit key
      if (isNumber(key.key) && key.key != ' ') {
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
}

function $(x) {
  return document.getElementById(x);
}

function $$(x) {
  return document.querySelectorAll(x);
}

function isNumber(n) {
  return !isNaN(n);
}

setupEventListeners();
