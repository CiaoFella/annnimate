async function copyAnimation(animationName, animationCategory) {
  const response = await fetch(
    `https://your-netlify-url/animations/${animationCategory}/${animationName}.html`
  );
  const animationData = await response.text();

  const userChoice = getUserChoice(); // Function to get user choice (HTML or Webflow)
  let processedData;

  if (userChoice === "HTML") {
    processedData = processHTML(animationData);
  } else if (userChoice === "Webflow") {
    processedData = processWebflow(animationData);
  }

  copyToClipboard(processedData);
}

function getUserChoice() {
  // Logic to get user choice (HTML or Webflow)
  const webflowButton = document.querySelector('[data-copy-button="webflow"]');
  const htmlButton = document.querySelector('[data-copy-button="html"]');

  if (webflowButton && webflowButton.matches(":focus")) {
    return "Webflow";
  } else if (htmlButton && htmlButton.matches(":focus")) {
    return "HTML";
  } else {
    return null;
  }
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
