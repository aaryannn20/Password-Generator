const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector(".password-length");
const passwordDisplay = document.querySelector(".display");
const copyButton = document.querySelector(".copyBtn");
const copyMessage = document.querySelector(".copyMsg");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const passwordIndicator = document.querySelector(".indicator");
const generateButton = document.querySelector(".generateBtn");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_-+=[]{}\|`~,<.>/?;:"';

let password="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100"
}

function setIndicator(color) {
    passwordIndicator.style.backgroundColor = color;
    passwordIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0,9);
}

function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase() {
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol() {
    const randomNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

function handleCheckboxChange() {
    checkCount=0;
    checkBoxes.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
};

checkBoxes.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

async function copytoClipboard() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "copied";
    } catch (e) {
        copyMessage.innerText = "Failed";
    }

    copyMessage.classList.add("active");
    setTimeout(() => {
        copyMessage.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyButton.addEventListener('click', () =>{
    if(passwordDisplay.value)
        copytoClipboard();
});

function shufflePassword(Array){
    for(let i=Array.length - 1; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str;
}

generateButton.addEventListener('click', () => {
    if(checkCount == 0){
        return;
    }
    
    if(passwordLength < checkCount ){
        passwordLength = checkCount;
        handleSlider();
    }

    password="";
    
    let functionArray = [];

    if(uppercaseCheck.checked){
        functionArray.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        functionArray.push(generateLowercase);
    }
    if(numberCheck.checked){
        functionArray.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        functionArray.push(generateSymbol);
    }

    for (let i = 0; i < functionArray.length; i++) {
        password += functionArray[i]();
        
    }
    for (let i = 0; i < passwordLength - functionArray.length; i++) {
        let randomIndex = getRandomInteger(0, functionArray.length);
        password += functionArray[randomIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();
})