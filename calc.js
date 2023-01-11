'use strict';
/*

                    ~~~~ Calculator without using eval()... (kind of) ~~~~

  I sort of did this project backwards. I originally coded it so you could create
  any sequence of Digits and Operations on the screen. Then the parser would check if it's
  valid, and act according. As I started to add features, I got to the point where I was
  writing it so you couldn't create an invalid expression, and there was no need for a parser.
  I think every expression has to be [Digit, Operation, Digit, Operation,...].
  It seems the smart way to write this would've been preventing the user from entering 2
  operators in a row, then just evaluating the expression if the last item on the screen
  is a number. calc.js will have the new code.




  TODO:
    !!DONE!! -Start with basic design/buttons using html
    !!DONE!! -Create parser for a string of operations
    !!DONE!! -Clean up design afterwards
    !!DONE!! -Don't automatically clear last result. Let user create an expression
    from the last result, instead of clearing the last result when a new
    number is entered.
    !!DONE!! -Fix Add button positioning
    !!DONE!! -Refactor this mess
    -If screen is empty, prevent from adding an operation as the first item

    -Add backspace function

  FIXME:
    -Decimal Keybind
    !!DONE!! -Error when hitting enter multiple times in a row

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
    // If str isn't an operator
    if (!isOperator(str.trim())) {
      // Replace Screen Text with str
      screen.textContent = str;
    }
  } else {
    // Add str to Screen Text
    screen.textContent += str;
  }
}

function parser() {
  // Array of items on screen
  let screenStr = $(DOM.screenText).textContent.trim().split(' ');
  screenStr = screenStr.filter((n) => n != '');
  // console.log(screenStr);

  let result = 0;
  let valid = false;

  // Loop through screen text
  screenStr.every((item, index) => {
    let prevItem = parseFloat(screenStr[index - 1]);
    let nextItem = parseFloat(screenStr[index + 1]);

    valid = isValidSequence(item, nextItem);

    if (valid) {
      // If current item is a number and we're at the first item
      if (!isNaN(item) && index == 0) {
        // Set the result to the item
        result = parseFloat(item);

        // Else, if item is an operator and prev and next are numbers
      } else if (isOperator(item) && isNumber(prevItem) && isNumber(nextItem)) {
        eval(`result ${item}= nextItem;`);
      }
      return true;
    } else {
      return false;
    }
  });

  // Update the screen
  clearScreen();

  if (valid) {
    updateScreen(result.toString());
    clearScreenFlag = true;
  }
}

function isOperator(str) {
  // return str.match(/[\+\-\/\*]/); <- ugly
  return str == '+' || str == '-' || str == '*' || str == '/';
}

function isValidSequence(item, nextItem) {
  return !(
    (isNumber(item) && isNumber(nextItem)) ||
    (isNaN(item) && isNaN(nextItem))
  );
}

function setupEventListeners() {
  // Digit keys' event listener
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
