/* Things to add/debug: 
    1. write the code better for concatenating the strings 
    2. Fix toggle button to be able to do -30 * -20
    3. incorporate decimals
    4. add delete button to remove previously added numbers
*/
const displayEl = document.querySelector(".calculator-display");

let data = {
    //initial values
    maxChars: 10,
    storedResult: null,
    currentValue: '0',
    currentRunningValue: null,
    currentOperation: null,

  // Map the keys (key index values)
    mapKeys: { 
    // number and decimal buttons
    48 : { type: 'input', value:  '0' },
    49 : { type: 'input', value:  '1' },
    50 : { type: 'input', value:  '2' },
    51 : { type: 'input', value:  '3' },
    52 : { type: 'input', value:  '4' },
    53 : { type: 'input', value:  '5' },
    54 : { type: 'input', value:  '6' },
    55 : { type: 'input', value:  '7' },
    56 : { type: 'input', value:  '8' },
    57 : { type: 'input', value:  '9' },
    190: { type: 'input', value:  '.' },

    //dark gray buttons
    67 : { type: 'clear', value:  'clear' },
    84 : { type: 'toggle', value:  'toggle' },
    88 : { type: 'operation', value:  'exponent' },
    
    // orange operators, right side buttons
    191: { type: 'operation', value:  'divide' },
    77 : { type: 'operation', value:  'multiply' },
    189: { type: 'operation', value:  'subtract' },
    187: { type: 'operation', value:  'add' },
    13 : { type: 'result', value:  null }, //return button (enter)
     
    //backspace (not on calculator)
    8  : { type: 'delete', value:  null },
  },
};


// This is purely for aesthetic, adds the 'active' tag to the html element for the button press effect that lasts 150ms! 
const activateButtonWithKeypress = (keyCode) => {
    const chooseBtn = document.querySelectorAll(`.calculator button[data-keycode="${keyCode}"]`)[0];
    if (chooseBtn) {
      chooseBtn.classList.toggle('active');
      setTimeout(() => {
        chooseBtn.classList.toggle('active');
      }, 150);
    }
};


//makes event listeners for the keyboard, whenever a button is pressed, if the keycode corresponds to a keycode that we are using in the mapkeys object, the calculator starts working
const bindKeyboard = () => {
    document.addEventListener('keydown', (event) => {
      const mapKeys = data.mapKeys;
      let keyCode = event.keyCode;

      // binds shift + 8 to 'multiply by'
      if (keyCode === 56 && event.shiftKey) {
        keyCode = 77;
      }
      //binds shift + 6 to exponent
      if (keyCode === 54 && event.shiftKey) {
          keyCode = 88;
      }
      
      // binds shift + delete to clear
      if (keyCode === 8 && event.shiftKey) {
          keyCode = 67;
      }
      if (mapKeys[keyCode]) {
        processUserInput(mapKeys[keyCode])
        activateButtonWithKeypress(keyCode)
      }
    });
};

//makes event listeners for each button! the user input is processed in the processerUserInput function. the way the event is handled depends on the button TYPE that is defiend in the mapKeys object!
const bindButtons = () => {
    const buttons = document.querySelectorAll('.calculator button');
    const mapKeys = data.mapKeys;

    Array.from(buttons).forEach((button) => {
        button.addEventListener('click', (event) => {
        processUserInput(mapKeys[event.target.dataset.keycode]) //see javascript.dataset!! access all data-_____ within an element in html! in this case data-keycode. Also see .target 
      });
    });
};

// processes userInput, either from the keyboard or from clicking a button. This function takes the keycode type and handles each one differently.
const processUserInput = (keycode) => {
    console.log(keycode);
    if(keycode.type === 'input') {
        data.currentValue = keycode.value;
        updateDisplay(data.currentValue);
    }
    
    if(keycode.type ==='operation') {
        data.currentOperation = keycode.value;
    }

    if(keycode.type ==='result') {
        updateDisplay('');
    }

    if(keycode.type ==='clear') {
        data.currentValue = 0;
        data.storedResult = 0;
        data.currentOperation = '';
        updateDisplay('clear');
    }
    
    if(keycode.type === 'toggle') {
        data.storedResult *= -1;
        if (data.storedResult){
            displayEl.innerHTML = data.storedResult;
        }

     }

    // if(keycode.type === 'delete') {
    //     updateDisplay('delete');
    // }


}


// this updates the display depending on what stage of the calculation process the user is in. picking numbers, picking an operation, selecting the second number, equating, toggling, clearing, etc. 
const updateDisplay = (newValue) => {
    if (newValue === 'clear') {
        displayEl.innerHTML = 0;
        console.log(data.currentValue, data.currentOperation, data.storedResult);
    }

    if (data.currentValue && !data.currentOperation) {
        //have concatenating string while the operation isn't defined
        if (data.storedResult) {
            displayEl.innerHTML = data.storedResult + newValue;
            data.storedResult += newValue;
        } else {
            displayEl.innerHTML = newValue;
            data.storedResult = newValue;
        }
    }

    if (data.currentValue && data.currentOperation) {
        //have concatenating string for current value until an operator button is pushed
        if(data.currentRunningValue){
            displayEl.innerHTML = data.currentRunningValue + newValue;
            data.currentRunningValue += newValue;
            data.currentValue = data.currentRunningValue;
            console.log(data.currentValue, 'currentValue');
        } else {
            displayEl.innerHTML = data.currentValue;
            data.currentRunningValue = data.currentValue;
        }

        // console.log(data.storedResult, data.currentValue);
    }
3
    if (data.currentValue && data.currentOperation && data.storedResult) {
        console.log('current, op, stored |||', data.currentValue, data.currentOperation, data.storedResult);
        let newResult = calculateResult(data.currentValue, data.currentOperation, data.storedResult);
        console.log(newResult, 'newResult');
        if (newValue === '') {
            data.storedResult = newResult;
            displayEl.innerHTML = newResult;
            data.currentOperation = null;
            data.currentValue = 0;
            data.currentRunningValue = 0;
        }
    }

}


// this calculates the result depending on the operation that is selected and returns it to the updateDisplay function.
const calculateResult = (current, operation, stored) => {
    if (operation === 'divide') {
        return parseInt(stored) / parseInt(current);
    }
    if (operation === 'multiply') {
        return parseInt(current) * parseInt(stored);
    }
    if (operation === 'subtract') {
        return parseInt(stored) - parseInt(current);
    }
    if (operation === 'add') {
        return parseInt(current) + parseInt(stored);
    }
    if (operation === 'exponent') {
        return Math.pow(parseInt(stored), parseInt(current));
    }

}


bindKeyboard();
bindButtons();