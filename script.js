// Theming

const colorThemes = document.querySelectorAll('[name="theme"]');

const storeTheme = (theme) => {
	localStorage.setItem("theme", theme);
};

const retrieveTheme = () => {
	const activeTheme = localStorage.getItem("theme");

	colorThemes.forEach((themeOption) => {
		if (themeOption.id === activeTheme) themeOption.checked = true;
	});
};

colorThemes.forEach((themeOption) => {
	themeOption.addEventListener("click", () => {
		storeTheme(themeOption.id);
	});
});

document.onload = retrieveTheme();

// Calculation Logic

const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");

let displayValue = "";
let firstInput = "";
let secondInput = "";
let waitingSecondInput = false;
let prevOperator = null;

const updateDisplay = () => {
	display.value = displayValue;
};

const setError = () => {
	displayValue = "Error";
	firstInput = "";
	secondInput = "";
	prevOperator = null;
	waitingSecondInput = false;
	updateDisplay();
	// return;
};

const clearError = () => {
	if (displayValue === "Error") {
		displayValue = "";
	}
};

const handleNumber = (num) => {
	clearError();

	displayValue += num;
	updateDisplay();

	if (waitingSecondInput) {
		secondInput += num;
	} else {
		firstInput += num;
	}
};

const handleDecimal = () => {
	clearError();

	if (waitingSecondInput && !secondInput.includes(".")) {
		secondInput += ".";
		displayValue += ".";
		updateDisplay();
	} else if (!firstInput.includes(".")) {
		firstInput += ".";
		displayValue += ".";
		updateDisplay();
	}
};

const deletion = () => {
	clearError();

	let deletedFigure = displayValue.at(-1);

	displayValue = displayValue.slice(0, -1);

	if (waitingSecondInput) {
		secondInput = secondInput.slice(0, -1);
	} else {
		firstInput = firstInput.slice(0, -1);
	}

	// Remove spaces when second input and operator deleted
	if (deletedFigure === " " && displayValue.at(-1) === prevOperator) {
		displayValue = firstInput;
		waitingSecondInput = false;
		prevOperator = null;
	}

	if (displayValue.length === 0) {
		resetAll();
	}

	updateDisplay();
};

const handleOperator = (operator) => {
	const allowFirstInputNegative = firstInput === "" && operator === "-";

	const allowSecondInputNegative =
		waitingSecondInput && secondInput === "" && prevOperator !== "-" && operator === "-";

	if (allowFirstInputNegative) {
		firstInput = "-";
		displayValue = "-";
		updateDisplay();
		return;
	}

	if (allowSecondInputNegative) {
		secondInput = "-";
		displayValue += "-";
		updateDisplay();
		return;
	}

	prevOperator = operator;

	if (firstInput) {
		displayValue = `${firstInput} ${prevOperator} `;
	} else {
		return;
	}

	if (secondInput) {
		displayValue = `${firstInput} ${prevOperator} ${secondInput}`;
	}

	waitingSecondInput = true;

	updateDisplay();
};

const calculate = () => {
	const firstNum = Number(firstInput);

	if (!prevOperator || isNaN(secondInput) || secondInput === "") {
		setError();
		return;
	}

	const secondNum = Number(secondInput);

	let result = 0;

	if (prevOperator === "+") {
		result = firstNum + secondNum;
	} else if (prevOperator === "-") {
		result = firstNum - secondNum;
	} else if (prevOperator === "x") {
		result = firstNum * secondNum;
	} else if (prevOperator === "/") {
		if (firstNum === 0 || secondNum === 0) {
			setError();
			return;
		}

		result = firstNum / secondNum;
	}

	displayValue = result.toString();
	firstInput = result.toString();
	secondInput = "";
	prevOperator = null;
	waitingSecondInput = false;

	updateDisplay();
};

const resetAll = () => {
	displayValue = "";
	firstInput = "";
	secondInput = "";
	waitingSecondInput = false;
	prevOperator = null;

	updateDisplay();
};

const handleFunctionalButtons = (value) => {
	switch (value) {
		case "del":
			deletion();
			break;

		case "reset":
			resetAll();
			break;

		case "+":
		case "-":
		case "x":
		case "/":
			handleOperator(value);
			break;

		case "=":
			calculate();
			break;

		case ".":
			handleDecimal();
			break;
	}
};

const handleButtons = (e) => {
	const buttonValue = e.target.value;

	if (isNaN(buttonValue)) {
		handleFunctionalButtons(buttonValue);
	} else {
		handleNumber(buttonValue);
	}
};

buttons.forEach((button) => button.addEventListener("click", handleButtons));
