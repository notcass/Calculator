'use strict';
/*

@TODO:
-CSS on different browsers is fucked
-If the most recent char on the screen is an operator, and the next button pressed is
also an operator, then replace the one on screen with the one that was pressed.
-Prevent invalid decimals being inserted
-Add backspace functionality

*/

(() => {
  const DOM = {
    C: 'btn-C',
    screenText: 'screen-text',
    equals: 'btn-equals',
  };
  let clearScreenFlag = false;

  function updateScreen(str) {
    if (clearScreenFlag) {
      clearScreenFlag = false;
      if (!isOperator(str)) {
        clearScreen();
      }
    }

    const screen = $(DOM.screenText);

    // Convert to array then filter out spaces
    let screenTextArray = screen.textContent.split('').filter((s) => s != ' ');
    // console.log(screenTextArray);

    // Get the right most char on screen
    let lastChar = screenTextArray[screenTextArray.length - 1];

    let ok = okToUpdate(lastChar, str);

    // TODO:
    // Check if there is a decimal in the most recent number on screen,
    // use that bool to determine if a decimal should be added.

    if (ok) {
      if (screen.textContent != '0' || str == '.') {
        screen.textContent += str;
      } else if (!isOperator(str)) {
        screen.textContent = str;
      }
    }
  }

  function okToUpdate(lastChar, nextItem) {
    // If str is an operator and last char is an operator, return false
    return !(isOperator(nextItem) && isOperator(lastChar));
  }

  function setupEventListeners() {
    $$('.digit').forEach((el) => {
      el.addEventListener('click', () => {
        // console.log(el);

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
        if ((isNumber(key.key) && key.key != ' ') || key.key == '.') {
          // console.log(key.key);

          updateScreen(key.key);
        }

        switch (key.key) {
          case '*':
          case '/':
          case '+':
          case '-':
            updateScreen(' ' + key.key + ' ');
            break;
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
  function parser() {
    const screen = $(DOM.screenText);
    try {
      let result = eval(screen.textContent);
      screen.textContent = result;
      clearScreenFlag = true;
    } catch (e) {}
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

  function isOperator(str) {
    str = str.trim();
    return str == '+' || str == '-' || str == '*' || str == '/';
  }

  function clearScreen() {
    $(DOM.screenText).textContent = '0';
  }
  setupEventListeners();
})();
