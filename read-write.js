/* Write and Read functions */

function storePianoData(fileName) {
  let pianoData = [];
  const keys = document.querySelectorAll(".key");
  keys.forEach((key, index) => {
    const keyText = key.querySelector(".key-text");
    pianoData.push({
      id: `key${index + 1}`,
      color: key.style.backgroundColor,
      text: keyText.textContent,
    });
  });

  const jsonData = JSON.stringify(pianoData, null, 2); // null and 2 for readability

  const blob = new Blob([jsonData], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;

  link.click();
}

function retrievePianoData(pianoData) {
  if (pianoData.length != 21) {
    console.error("bad data");
    return;
  }
  const keys = document.querySelectorAll(".key");
  keys.forEach((key, index) => {
    if (pianoData[index].id != key.id) {
      console.error("bad data");
      return;
    }
    const keyText = key.querySelector(".key-text");
    key.style.backgroundColor = pianoData[index].color;
    keyText.textContent = pianoData[index].text;
    // Make sure we initialize local storage
    if (key.style.backgroundColor != "")
      localStorage.setItem(`${key.id}-color`, key.style.backgroundColor);
    if (keyText.textContent != "")
      localStorage.setItem(`${key.id}-text`, keyText.textContent);
  });
}

document.getElementById("menu").addEventListener("change", function () {
  const selectedOption = this.value;

  if (selectedOption === "export") {
    const fileName = prompt("Enter the file name to export:");
    if (fileName !== null) {
      storePianoData(fileName);
    }
  } else if (selectedOption === "import") {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      alert(
        "File reading is not working in Safari. Please try a different browser."
      );
      return;
    }

    if (!confirm("OK to overwrite current piano?")) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";

    fileInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected.");
        return;
      }

      const reader = new FileReader();

      reader.onload = function (event) {
        try {
          const importedData = JSON.parse(event.target.result);
          retrievePianoData(importedData);
        } catch (error) {
          console.error("Error parsing the file:", error);
        }
      };

      reader.onerror = function (event) {
        console.error("Error reading the file:", event.target.error);
      };

      reader.readAsText(file);
    });

    fileInput.click();
  }
  // Reset selector
  this.value = "none";
});
