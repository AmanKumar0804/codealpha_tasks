const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    if (operation != null) {
        previousDisplay.innerText = `${previousInput} ${getOperatorSymbol(operation)}`;
    } else {
        previousDisplay.innerText = '';
    }
}

function getOperatorSymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    
    if (currentInput === '0' && number !== '.' || shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && previousInput === '') return;
    
    if (previousInput !== '' && !shouldResetDisplay) {
        calculate();
    }
    
    operation = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clearDisplay();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }
    
    // Fix floating point issues (e.g., 0.1 + 0.2)
    currentInput = parseFloat(computation.toFixed(8)).toString();
    operation = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteNumber() {
    if (shouldResetDisplay) return;
    if (currentInput.length <= 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}