// Function to load the key data from local storage
function loadKeyData() {
  const keys = document.querySelectorAll(".key");

  keys.forEach((key) => {
    const keyId = key.id;

    const storedKeyColor = localStorage.getItem(`${keyId}-color`);

    if (storedKeyColor !== null) {
      key.style.backgroundColor = storedKeyColor;
    }

    const storedKeyText = localStorage.getItem(`${keyId}-text`);

    if (storedKeyText !== null) {
      const keyText = key.querySelector(".key-text");
      keyText.textContent = storedKeyText;
      keyText.style.display = "block";
    }
  });
}

window.addEventListener("load", loadKeyData);

/* This part of the code changes the color of the keys. */

const keys = document.querySelectorAll(".key");
const colorPicker = document.getElementById("colorPicker");

/* Force the user to choose a color first */
let currentColor = "";

function changeColor(e) {
  // only change color if key is selected, not one of its children.
  if (e.target.classList.contains("key")) {
    if (currentColor !== "") {
      e.target.style.backgroundColor = currentColor;
      localStorage.setItem(`${e.target.id}-color`, currentColor);
    }
  }
}

keys.forEach((key) => {
  key.addEventListener("click", changeColor);
});

colorPicker.addEventListener("input", function () {
  currentColor = this.value;
});

/* This part of the code allows the user to add vertical labels as text. */

function toggleTextBox(textBoxId) {
  // First close all the other text boxes, in case any were left open.
  const textBoxes = document.querySelectorAll(".text-box");
  textBoxes.forEach((box) => {
    if (box.id != textBoxId) box.style.display = "none";
  });

  const textBox = document.getElementById(textBoxId);
  const parentKey = textBox.parentElement;
  const keyText = parentKey.querySelector(".key-text");

  if (textBox.style.display === "" || textBox.style.display === "none") {
    textBox.style.display = "block";
    keyText.style.display = "none";
    textBox.value = keyText.textContent.trim();
  } else {
    textBox.style.display = "none";
    keyText.style.display = "block";
    keyText.textContent = textBox.value.trim();
    localStorage.setItem(`${parentKey.id}-text`, keyText.textContent);
  }
}

const textInputs = document.querySelectorAll(".text-box");

// Function to add rotated text under the key
// 'this' is the text box that the user typed into.
// It will be rotated and moved into place by css code.
function rotateKeyText(event) {
  if (event.key === "Enter") {
    const parentKey = this.parentElement;
    const keyText = parentKey.querySelector(".key-text");
    keyText.style.display = "block";
    keyText.textContent = this.value.trim();
    localStorage.setItem(`${parentKey.id}-text`, keyText.textContent);
    this.style.display = "none";
    this.value = "";
  }
}

textInputs.forEach((input) => {
  input.addEventListener("keypress", rotateKeyText);
});

/* Functions to reset key data */

function resetKeys() {
  // Put up the hidden menu to make sure the user wants a reset.
  modal.classList.add("show");
}

const modal = document.getElementById("resetModal");

const resetForm = document.getElementById("resetForm");
const cancelResetBtn = document.getElementById("cancelReset");
const confirmResetBtn = document.getElementById("confirmReset");

resetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const resetColors = document.getElementById("resetColors").checked;
  const resetText = document.getElementById("resetText").checked;

  const keys = document.querySelectorAll(".key");

  if (resetColors) {
    keys.forEach((key) => {
      key.style.backgroundColor = "white";
      localStorage.removeItem(`${key.id}-color`);
    });
  }

  if (resetText) {
    keys.forEach((key) => {
      keyText = key.querySelector(".key-text");
      keyText.textContent = "";
      localStorage.removeItem(`${key.id}-text`);
    });
  }

  closeModal();
});

function closeModal() {
  document.getElementById("resetColors").checked = false;
  document.getElementById("resetText").checked = false;
  modal.classList.remove("show");
}

cancelResetBtn.addEventListener("click", function () {
  closeModal();
});

/* Function to hide some of the keys for mobile and tablet */
/* as defined in styles.css by setting the variable --key-number */

function hideKeysBasedOnWindowSize() {
  const rootStyles = getComputedStyle(document.documentElement);
  const keyNumber = parseInt(rootStyles.getPropertyValue("--key-number"));

  const keys = document.querySelectorAll(".key");
  keys.forEach((key, index) => {
    if (index >= keyNumber) {
      key.style.display = "none"; // Hide keys beyond --key-number
    } else {
      key.style.display = ""; // Show keys within --key-number
    }
  });
}

hideKeysBasedOnWindowSize();

window.addEventListener("resize", hideKeysBasedOnWindowSize);
