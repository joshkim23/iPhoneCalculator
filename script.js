/* Things to add/debug: 
    1. DONE write the code better for concatenating the strings 
    2. DONE Fix toggle button to be able to do -30 * -20
    3. DONE incorporate decimals
    4. DONE add delete button to remove previously added numbers
    5. DONE make an initialize calculator function
*/
const displayEl = document.querySelector(".calculator-display");

let data = {
    //initial values
    maxChars: 10,
    storedValue: null,
    currentValue: 0,
    interimValue: null,
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
    // console.log(keycode);
    if(keycode.type === 'input') {
        if (data.interimValue === null) {
            data.interimValue = keycode.value;
        } else {
            data.interimValue += keycode.value;
        }
        updateDisplay(data.interimValue);
    }

    if(keycode.type ==='operation') {
        data.currentOperation = keycode.value;
        data.storedValue = data.interimValue; //clears interim value for the next one to be the current value
        data.interimValue = null;
    }

    if(keycode.type ==='result') { //pushing equal sign doesn't change the current operation data value
        data.currentValue = data.interimValue;
        updateDisplay('');
    }

    if(keycode.type ==='clear') {
        data.currentValue = 0;
        data.storedValue = 0;
        data.currentOperation = '';
        data.interimValue = null;
        displayEl.innerHTML = 0;
    }
    
    if(keycode.type === 'toggle') {
        data.interimValue *= -1;
        displayEl.innerHTML = data.interimValue;
     }

    if(keycode.type === 'delete') {
    console.log(data.interimValue);
       data.interimValue = data.interimValue.substring(0,data.interimValue.length-1);
       if (data.interimValue.length >=1 ) {
        updateDisplay(data.interimValue);
       } else {
           data.interimValue = null;
           displayEl.innerHTML = 0;
       }
    }


}


// this updates the display depending on what stage of the calculation process the user is in. picking numbers, picking an operation, selecting the second number, equating, toggling, clearing, etc. 
const updateDisplay = (newValue) => {
    if (newValue === 'clear') {
        displayEl.innerHTML = 0;
    }

    // before the operator has been hit
    if (!data.currentOperation) { 
        displayEl.innerHTML = data.interimValue;
    }

    //once the operator has been hit
    if (data.currentOperation) {
        displayEl.innerHTML = data.interimValue;
    }

    // once all components have been defined, run the calculation
    if (data.currentValue && data.currentOperation && data.storedValue) {
        console.log('stored, op, current |||', data.storedValue, data.currentOperation, data.currentValue);
        let newResult = calculateResult(data.currentValue, data.currentOperation, data.storedValue);
        // console.log(newResult, 'newResult');
        if (newValue === '') {
            data.storedValue = newResult;
            displayEl.innerHTML = newResult;
            data.currentOperation = null;
            data.currentValue = 0;
            data.interimValue = newResult.toString(); //to do follow up calculations on the result! 
        }
    }
}


// this calculates the result depending on the operation that is selected and returns it to the updateDisplay function.
const calculateResult = (current, operation, stored) => {
    if (operation === 'divide') {
        return parseFloat(stored) / parseFloat(current); //parseFloat returns even strings with . as a full number, with parseInt it turns 1.1 into 1
    }
    if (operation === 'multiply') {
        return parseFloat(current) * parseFloat(stored);
    }
    if (operation === 'subtract') {
        return parseFloat(stored) - parseFloat(current);
    }
    if (operation === 'add') {
        return parseFloat(current) + parseFloat(stored);
    }
    if (operation === 'exponent') {
        return Math.pow(parseFloat(stored), parseFloat(current));
    }

}


const initializeCalc = () => {  
    bindKeyboard();
    bindButtons();
}

initializeCalc();
