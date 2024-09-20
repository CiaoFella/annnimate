document.addEventListener("DOMContentLoaded", () => {
  // Add buttons dynamically
  const animationLink = document.querySelector(".animation-link");
  if (animationLink) {
    const htmlButton = document.createElement("button");
    htmlButton.setAttribute("data-copy-button", "html");
    htmlButton.textContent = "Copy as HTML";

    const webflowButton = document.createElement("button");
    webflowButton.setAttribute("data-copy-button", "webflow");
    webflowButton.textContent = "Copy as Webflow";

    animationLink.insertAdjacentElement("afterend", htmlButton);
    animationLink.insertAdjacentElement("afterend", webflowButton);
  }

  // Add event listeners to the buttons
  const buttons = document.querySelectorAll("[data-copy-button]");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const animationItem = document.querySelector(".animation-link");
      if (animationItem) {
        const animationName = "basic-button";
        const animationCategory = "hover";
        const userChoice = event.target.getAttribute("data-copy-button");
        copyAnimation(animationName, animationCategory, userChoice);
      }
    });
  });
});

async function copyAnimation(animationName, animationCategory, userChoice) {
  const response = await fetch(
    `https://your-netlify-url/animations/${animationCategory}/${animationName}.html`
  );
  const animationData = await response.text();

  let processedData;

  if (userChoice === "html") {
    processedData = processHTML(animationData);
  } else if (userChoice === "webflow") {
    processedData = processWebflow(animationData);
  }

  copyToClipboard(processedData);
}

function processHTML(data) {
  // Extract content inside the body tag
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");
  return doc.body.innerHTML;
}

function processWebflow(data) {
  // Convert the data into valid Webflow JSON
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");

  // Convert HTML elements to Webflow elements
  // Store JS in an embed block
  const webflowData = {
    html: doc.body.innerHTML,
    js: extractJS(doc),
  };

  return JSON.stringify(webflowData);
}

function extractJS(doc) {
  // Extract JavaScript from the HTML document
  const scripts = doc.querySelectorAll("script");
  let jsCode = "";
  scripts.forEach((script) => {
    jsCode += script.innerHTML;
  });
  return jsCode;
}

function copyToClipboard(data) {
  navigator.clipboard.writeText(data).then(
    () => {
      alert("Animation copied to clipboard!");
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
}
