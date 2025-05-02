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

const handleDecimal = () => {
	if (!displayValue.includes(".")) displayValue += ".";
	updateDisplay();

	if (waitingSecondInput) {
		secondInput += ".";
	} else {
		firstInput += ".";
	}
};

const deletion = () => {
	displayValue = displayValue.slice(0, -1);
	updateDisplay();

	if (waitingSecondInput) {
		secondInput = secondInput.slice(0, -1);
	} else {
		firstInput = firstInput.slice(0, -1);
	}
};

const resetAll = () => {
	displayValue = "";
	firstInput = "";
	secondInput = "";
	waitingSecondInput = false;
	prevOperator = null;

	updateDisplay();
};

const handleNumber = (num) => {
	displayValue += num;
	updateDisplay();

	if (waitingSecondInput) {
		secondInput += num;
	} else {
		firstInput += num;
	}
};

const calculate = () => {
	firstNum = Number(firstInput);
	secondNum = Number(secondInput);

	if (prevOperator === null) return;

	let result = 0;

	if (prevOperator === "+") {
		result = firstNum + secondNum;
	} else if (prevOperator === "-") {
		result = firstNum - secondNum;
	} else if (prevOperator === "x") {
		result = firstNum * secondNum;
	} else if (prevOperator === "/") {
		result = firstNum / secondNum;
	}

	displayValue = result.toString();
	firstInput = result.toString();
	secondInput = "";
	prevOperator = null;
	waitingSecondInput = false;

	updateDisplay();
};

const handleOperator = (operator) => {
	if (firstInput === "") return;

	displayValue = "";
	updateDisplay();

	waitingSecondInput = true;
	prevOperator = operator;
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
