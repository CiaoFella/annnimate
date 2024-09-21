window.addEventListener("load", () => {
  console.log("hello");
  // Add event listeners to the buttons
  const buttons = document.querySelectorAll("[data-copy-button]");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const animationItem = event.target.closest(
        '[data-animation-list="item"]'
      );
      if (animationItem) {
        const animationName = animationItem.getAttribute("data-animation-name");
        const animationCategory = animationItem.getAttribute(
          "data-animation-category"
        );
        const userChoice = event.target.getAttribute("data-copy-button");
        console.log(animationName, animationCategory, event.target);
        copyAnimation(animationName, animationCategory, userChoice);
      }
    });
  });
});

async function copyAnimation(animationName, animationCategory, userChoice) {
  const response = await fetch(
    `https://annnimate.netlify.app/animations/${animationCategory}/${animationName}.html`
  );
  const animationData = await response.text();

  let processedData;

  if (userChoice === "html") {
    processedData = animationData; // Directly use the HTML content
  } else if (userChoice === "webflow") {
    processedData = processWebflow(animationData);
  }

  copyToClipboard(processedData);
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
