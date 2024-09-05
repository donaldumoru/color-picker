'use strict';

let colorDisplay = document.querySelector('.current-color');
let colorCode = document.querySelector('.code');
let getRandomColorButton = document.querySelector('.new-color');
let copyCodeButton = document.querySelector('.copy-code');
let favoriteColorButton = document.querySelector('.save-color');
let allListItems = document.querySelectorAll('.color-history');
let userColors = document.querySelectorAll('.user-colors');
let userRed = document.querySelector('#red');
let userGreen = document.querySelector('#green');
let userBlue = document.querySelector('#blue');
let displayHex = document.querySelector('.display-hex-value');
let favoriteColorList = document.querySelectorAll('.favorite-color');
let alertMessage = document.querySelector('.alert-user');

/** Initial variable on load */
colorCode.textContent = 'rgb (0, 0, 0)';
let colorString = 'rgb (0, 0, 0)';

/** Empty array that will be used later to store last five generated colors */
let lastFiveArr = [];

/** Counter to use later for updating list items with generated RGBs */
let liPosition = 0;
/** Counter to use later for storing favorite colors */
let favoriteColorPosition = 0;

/** Set current color to null to later use it to render favorite RGBs and check later if not null to save favorite colors */
let currentColor = null;

/** Empty array that will be used later to store favorite colors */
let favArr = [];

/** Convert RGB to Hex */
const changeToHex = function (value) {
  const hexValue = value.toString(16);
  return hexValue.length === 1 ? '0' + hexValue : hexValue;
};

const convertRGBToHex = (red, green, blue) => {
  return '#' + changeToHex(red) + changeToHex(green) + changeToHex(blue);
};

/** Function to generate random color */
const getRandomColor = () => {
  alertMessage.textContent = '';

  /** Easier to use an array to do this maybe but decided to use an object just to work a bit more with objects */
  let rgb = {
    r: Math.trunc(Math.random() * 256),
    g: Math.trunc(Math.random() * 256),
    b: Math.trunc(Math.random() * 256),
  };

  /** Initialize empty array that will store RGB values from the rgb object to render the generated color in the browser*/
  let arr = [];

  /** Convert the object to array */
  const rgbArr = Object.entries(rgb);

  /** Loop through the converted object */
  rgbArr.forEach(function (code) {
    /** Initialize empty string that will be filled up using a for loop to display the current generated RGB on the browser */
    let str = '';

    /** Push each value of RGB to the empty array that was initialized at the beginning of the function */
    arr.push(code[1]);

    /** For loop that fills the empty string that was initialized earlier */
    for (let i = 0; i < arr.length; i++) {
      str += `${arr[i]}, `;
    }

    /** Render a nice string without space and comma at the end based on result fron the for loop */
    colorString = `rgb(${str.trim().slice(0, -1)})`;
    colorCode.textContent = colorString;

    /** Set the color of swatch to the generated RGB by picking each RGB value from the array that is now filled up */
    colorDisplay.style.background = `rgb(${arr.join(',')})`;
  });

  /** Set user input section to generated RGB values to match with color swatch by destructuring arr*/

  [userRed.value, userGreen.value, userBlue.value] = arr;

  /** Push the color string of RGB to the last five empty array that was initialized at the beginning of the code */
  lastFiveArr.push(colorString);

  /** Spread operator used to spread elements of the arr passed as args to the convertRGBToHex function */
  displayHex.textContent = 'HEX Code: ' + convertRGBToHex(...arr).toUpperCase();

  /** IF statement to first fill up the list items with the generated RGBs */
  if (liPosition < allListItems.length) {
    allListItems[liPosition].textContent = colorString;
    liPosition++;
  } else if (lastFiveArr.length === 6) {
    /** Then Else if to keep them at 5 and remove the oldest one when a new one is generated */
    /** Remove the first item in the last five array to always keep the array length at 5 */
    lastFiveArr.shift();

    lastFiveArr.forEach(function (rgb, index) {
      allListItems[index].textContent = lastFiveArr[index];
    });
  }

  /** Set the value of inital empty currentColor variable to arr */
  currentColor = arr;
};

/** Function to take user RGB input */
function userRGBCode() {
  alertMessage.textContent = '';

  let userRedInput = userRed.value;
  let userGreenInput = userGreen.value;
  let userBlueInput = userBlue.value;

  /** Create array with user inputs*/
  const arr = [
    Number(userRedInput),
    Number(userGreenInput),
    Number(userBlueInput),
  ];

  /** Set swatch color to user RGB input by turning array into a string with commas between elements */
  colorDisplay.style.background = `rgb(${arr.join(',')})`;

  /** Set color string to User RGB input using the same array method as above */
  colorString = `rgb(${arr.join(',')})`;
  colorCode.textContent = colorString;

  currentColor = colorString.slice(4, -1).split(',').map(Number);

  /** Spread operator used to spread elements of the arr passed as args to the convertRGBToHex function */
  displayHex.textContent = 'HEX Code: ' + convertRGBToHex(...arr).toUpperCase();
}

getRandomColorButton.addEventListener('click', getRandomColor);

/** Function to copy RGB code using the navigator.clipboard */
const copyRGBCode = function () {
  /** Copy Color code to clipboard */
  navigator.clipboard.writeText(colorString);
  alert(`${colorString} copied to clipboard`);
};

/** Event listeners */
copyCodeButton.addEventListener('click', copyRGBCode);
userColors.forEach(function (userColor) {
  userColor.addEventListener('input', userRGBCode);
});

/** Function to favorite some color swatches for later use */
function saveToFavorites() {
  if (currentColor != null) {
    alertMessage.textContent = '';
    /** First check if the favorite colors section has been filled by checking if counter is less than length of list items */
    if (favoriteColorPosition < favoriteColorList.length) {
      /**Update background color of div at current position with currently generated RGB */
      favoriteColorList[
        favoriteColorPosition
      ].style.background = `rgb(${currentColor.join(',')})`;

      favArr.push(currentColor);
      /** Increase counter by one after each iteration */
      favoriteColorPosition++;
    }
  } else {
    alertMessage.textContent = 'please generate a color';
  }
}

favoriteColorButton.addEventListener('click', saveToFavorites);

// /** Function to copy favorite colors */
favoriteColorList.forEach(function (eachFav) {
  eachFav.addEventListener('click', function () {
    navigator.clipboard.writeText(eachFav.style.background);
    console.log(eachFav.style.background);
    alert(`${eachFav.style.background} copied to clipboard`);
  });
});
