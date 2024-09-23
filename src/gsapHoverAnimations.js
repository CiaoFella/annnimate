// Basic button animation
function basicButtonAnimation() {
  const buttons = document.querySelectorAll("[annnimate-basic-button=wrap]");

  buttons.forEach((button) => {
    const underline = button.querySelector(
      "[annnimate-basic-button=underline]"
    );

    gsap.set(underline, { scaleX: 0 });

    button.addEventListener("mouseenter", () => {
      gsap.fromTo(
        underline,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left",
          duration: 0.3,
          ease: "power1.inOut",
        }
      );
    });

    button.addEventListener("mouseleave", () => {
      gsap.fromTo(
        underline,
        { scaleX: 1 },
        {
          scaleX: 0,
          transformOrigin: "right",
          duration: 0.3,
          ease: "power1.inOut",
        }
      );
    });
  });
}

// Fill button animation
function fillButtonAnimation() {
  const buttons = document.querySelectorAll("[annnimate-fill-button=wrap]");

  buttons.forEach((button) => {
    const bg = button.querySelector("[annnimate-fill-button=bg]");
    const bgPath = bg.querySelector("[annnimate-fill-button=bg-path]");
    const text = button.querySelector("[annnimate-fill-button=text]");

    // Start color of the text
    const startColor = text.style.color;

    // EDIT: Adjust the end color as you like
    const endColor = "#FFF";

    function getMouseEnterDirection(mouseEvent, item) {
      const rect = item.getBoundingClientRect();
      const edges = {
        top: Math.abs(rect.top - mouseEvent.clientY),
        bottom: Math.abs(rect.bottom - mouseEvent.clientY),
        left: Math.abs(rect.left - mouseEvent.clientX),
        right: Math.abs(rect.right - mouseEvent.clientX),
      };
      return Object.keys(edges).find(
        (key) => edges[key] === Math.min(...Object.values(edges))
      );
    }

    function handleHoverIn(mouseDirection, allDirections) {
      const paths = {
        top: { start: svgStartFromTop, end: svgEndFromTop },
        bottom: { start: svgStartFromBottom, end: svgEndFromBottom },
        left: { start: svgStartFromLeft, end: svgEndFromLeft },
        right: { start: svgStartFromRight, end: svgEndFromRight },
      };
      return paths[mouseDirection] || paths.top;
    }

    function handleHoverOut(mouseDirection, allDirections) {
      const paths = {
        top: { start: svgStartToTop, end: svgEndToTop },
        bottom: { start: svgStartToBottom, end: svgEndToBottom },
        left: { start: svgStartToLeft, end: svgEndToLeft },
        right: { start: svgStartToRight, end: svgEndToRight },
      };
      return paths[mouseDirection] || paths.top;
    }

    function animateHover(element, start, end) {
      if (start && end) {
        return gsap.fromTo(
          element,
          { attr: { d: start } },
          {
            attr: { d: end },
            duration: 0.5,
            ease: "power3.out",
          }
        );
      }
    }

    button.addEventListener("mouseenter", (event) => {
      const mouseDirection = getMouseEnterDirection(event, button);
      const pathDirection = handleHoverIn(mouseDirection, true);
      animateHover(bgPath, pathDirection.start, pathDirection.end);
      gsap.to(text, { color: endColor, duration: 0.2 });
    });

    button.addEventListener("mouseleave", (event) => {
      const mouseDirection = getMouseEnterDirection(event, button);
      const pathDirection = handleHoverOut(mouseDirection, true);
      animateHover(bgPath, pathDirection.start, pathDirection.end);
      gsap.to(text, { color: startColor, duration: 0.2 });
    });
  });

  // SVG Paths - DO NOT ADJUST IF YOU DON'T KNOW WHAT YOU'RE DOING
  let svgStartFromTop = "M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z";
  let svgEndFromTop = "M 0 100 V 100 Q 50 125 100 100 V 0 H 0 z";
  let svgStartFromBottom = "M 0 100 V 100 Q 75 50 100 100 V 100 z";
  let svgEndFromBottom = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

  let svgStartToTop = "M 0 100 V 100 Q 50 50 100 100 V 0 H 0 z";
  let svgEndToTop = "M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z";
  let svgStartToBottom = "M 0 100 V 0 Q 50 50 100 0 V 100 z";
  let svgEndToBottom = "M 0 100 V 100 Q 50 100 100 100 V 100 z";

  let svgStartFromLeft = "M 0 0 H 0 Q 0 50 0 100 H 0 V 0 z";
  let svgEndFromLeft = "M 0 0 H 100 Q 110 50 100 100 H 0 V 0 z";
  let svgStartFromRight = "M 100 0 H 100 Q 100 50 100 100 H 100 V 0 z";
  let svgEndFromRight = "M 100 0 H 0 Q -10 50 0 100 H 100 V 0 z";

  let svgStartToLeft = "M 0 0 H 100 Q 75 50 100 100 H 0 V 0 z";
  let svgEndToLeft = "M 0 0 H 0 Q 0 50 0 100 H 0 V 0 z";
  let svgStartToRight = "M 100 0 H 0 Q 25 50 0 100 H 100 V 0 z";
  let svgEndToRight = "M 100 0 H 100 Q 100 50 100 100 H 100 V 0 z";
}

// Button push up animation
function buttonPushAnimation() {
  const buttons = document.querySelectorAll("[annnimate-push-button=wrap]");

  buttons.forEach((button) => {
    // Get the direction of the push animation - can be "up", "down", "left", "right"
    const direction = button.getAttribute("annnimate-direction");
    const text = button.querySelector("[annnimate-push-button=text]");

    // create a copy of the text and add a class to it
    const textClone = text.cloneNode(true);
    textClone.style.position = "absolute";

    text.after(textClone);

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 0.5 },
      paused: true,
    });

    if (direction === "up") {
      textClone.style.bottom = "-105%";
      timeline
        .to(text, { yPercent: -105 })
        .to(textClone, { yPercent: -105 }, "<");
    } else if (direction === "down") {
      textClone.style.top = "-105%";
      timeline
        .to(text, { yPercent: 105 })
        .to(textClone, { yPercent: 105 }, "<");
    } else if (direction === "left") {
      textClone.style.top = "0";
      textClone.style.right = "105%";
      timeline
        .to(text, { xPercent: 105 })
        .to(textClone, { xPercent: 105 }, "<");
    } else if (direction === "right") {
      textClone.style.top = "0";
      textClone.style.left = "105%";
      timeline
        .to(text, { xPercent: -105 })
        .to(textClone, { xPercent: -105 }, "<");
    }

    button.addEventListener("mouseenter", () => {
      timeline.play();
    });

    button.addEventListener("mouseleave", () => {
      timeline.reverse();
    });
  });
}

// Button stagger animation
function buttonStaggerAnimation() {
  const buttons = document.querySelectorAll("[annnimate-stagger-button=wrap]");

  buttons.forEach((button) => {
    // Get the direction of the push animation - can be "up", "down"
    const direction = button.getAttribute("annnimate-direction");

    // Get the reverse attribute - can be "true" or "false"
    const isReverse = button.getAttribute("annnimate-reverse");

    const text = button.querySelector("[annnimate-stagger-button=text]");

    // create a copy of the text and add a class to it
    const textClone = text.cloneNode(true);
    textClone.style.position = "absolute";

    text.after(textClone);

    const textSplit = new SplitType(text, { types: "chars" });
    const clonedSplit = new SplitType(textClone, { types: "chars" });

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 0.5, stagger: 0.0075 },
      paused: true,
    });

    if (direction === "up") {
      textClone.style.top = "100%";
      timeline
        .fromTo(textSplit.chars, { yPercent: 0 }, { yPercent: -100 })
        .to(clonedSplit.chars, { yPercent: -100 }, "<");
    } else if (direction === "down") {
      textClone.style.top = "-100%";
      timeline
        .fromTo(textSplit.chars, { yPercent: 0 }, { yPercent: 100 })
        .fromTo(clonedSplit.chars, { yPercent: 0 }, { yPercent: 100 }, "<");
    }

    button.addEventListener("mouseenter", () => {
      timeline.restart();
    });

    button.addEventListener("mouseleave", () => {
      if (isReverse === "true") {
        timeline.reverse();
      } else {
        return;
      }
    });
  });
}

// Button Icon animation
function buttonIconAnimation() {
  const buttons = document.querySelectorAll("[annnimate-icon-button=wrap]");

  buttons.forEach((button) => {
    const icon = button.querySelector("[annnimate-icon-button=icon]");
    const bg = button.querySelector("[annnimate-icon-button=bg]");

    const iconClone = icon.cloneNode(true);
    iconClone.style.position = "absolute";

    icon.after(iconClone);
    iconClone.style.left = "-100%";
    iconClone.style.top = "100%";

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut", duration: 0.5 },
      paused: true,
    });

    timeline
      .to(icon, { xPercent: 100, yPercent: -100 })
      .to(iconClone, { xPercent: 100, yPercent: -100 }, "<")
      .to(bg, { scaleX: 10, scaleY: 5 }, "<");

    button.addEventListener("mouseenter", () => {
      timeline.play();
    });

    button.addEventListener("mouseleave", () => {
      timeline.reverse();
    });
  });
}

// Fill list hover animation
function listHoverAnimation() {
  const lists = document.querySelectorAll("[annnimate-fill-list=wrap]");

  lists.forEach((list) => {
    const listItems = list.querySelectorAll("[annnimate-fill-list=item]");

    listItems.forEach((item) => {
      const bg = item.querySelector("[annnimate-fill-list=bg]");
      const bgPath = bg.querySelector("[annnimate-fill-list=bg-path]");
      const text = item.querySelector("[annnimate-fill-list=text]");

      // Start color of the text
      const startColor = text.style.color;

      // EDIT: Adjust the end color as you like
      const endColor = "#FFF";

      function getMouseEnterDirection(mouseEvent, item) {
        const rect = item.getBoundingClientRect();
        const edges = {
          top: Math.abs(rect.top - mouseEvent.clientY),
          bottom: Math.abs(rect.bottom - mouseEvent.clientY),
          left: Math.abs(rect.left - mouseEvent.clientX),
          right: Math.abs(rect.right - mouseEvent.clientX),
        };
        return Object.keys(edges).find(
          (key) => edges[key] === Math.min(...Object.values(edges))
        );
      }

      function handleHoverIn(mouseDirection, allDirections) {
        const paths = allDirections
          ? {
              top: { start: svgStartFromTop, end: svgEndFromTop },
              bottom: { start: svgStartFromBottom, end: svgEndFromBottom },
              left: { start: svgStartFromLeft, end: svgEndFromLeft },
              right: { start: svgStartFromRight, end: svgEndFromRight },
            }
          : {
              top: { start: svgStartFromTop, end: svgEndFromTop },
              bottom: { start: svgStartFromBottom, end: svgEndFromBottom },
            };
        return paths[mouseDirection] || paths.top;
      }

      function handleHoverOut(mouseDirection, allDirections) {
        const paths = allDirections
          ? {
              top: { start: svgStartToTop, end: svgEndToTop },
              bottom: { start: svgStartToBottom, end: svgEndToBottom },
              left: { start: svgStartToLeft, end: svgEndToLeft },
              right: { start: svgStartToRight, end: svgEndToRight },
            }
          : {
              top: { start: svgStartToTop, end: svgEndToTop },
              bottom: { start: svgStartToBottom, end: svgEndToBottom },
            };
        return paths[mouseDirection] || paths.top;
      }

      function animateHover(element, start, end) {
        if (start && end) {
          return gsap.fromTo(
            element,
            { attr: { d: start } },
            {
              attr: { d: end },
              duration: 0.5,
              ease: "power3.out",
            }
          );
        }
      }

      item.addEventListener("mouseenter", (event) => {
        const mouseDirection = getMouseEnterDirection(event, item);
        const pathDirection = handleHoverIn(mouseDirection, false);
        animateHover(bgPath, pathDirection.start, pathDirection.end);
        gsap.to(text, { color: endColor, marginLeft: "1rem", duration: 0.35 });
      });

      item.addEventListener("mouseleave", (event) => {
        const mouseDirection = getMouseEnterDirection(event, item);
        const pathDirection = handleHoverOut(mouseDirection, false);
        animateHover(bgPath, pathDirection.start, pathDirection.end);
        gsap.to(text, { color: startColor, marginLeft: "0", duration: 0.35 });
      });
    });
  });

  // SVG Paths - DO NOT ADJUST IF YOU DON'T KNOW WHAT YOU'RE DOING
  let svgStartFromTop = "M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z";
  let svgEndFromTop = "M 0 100 V 100 Q 50 125 100 100 V 0 H 0 z";
  let svgStartFromBottom = "M 0 100 V 100 Q 75 50 100 100 V 100 z";
  let svgEndFromBottom = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

  let svgStartToTop = "M 0 100 V 100 Q 50 50 100 100 V 0 H 0 z";
  let svgEndToTop = "M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z";
  let svgStartToBottom = "M 0 100 V 0 Q 50 50 100 0 V 100 z";
  let svgEndToBottom = "M 0 100 V 100 Q 50 100 100 100 V 100 z";

  let svgStartFromLeft = "M 0 0 H 0 Q 0 50 0 100 H 0 V 0 z";
  let svgEndFromLeft = "M 0 0 H 100 Q 110 50 100 100 H 0 V 0 z";
  let svgStartFromRight = "M 100 0 H 100 Q 100 50 100 100 H 100 V 0 z";
  let svgEndFromRight = "M 100 0 H 0 Q -10 50 0 100 H 100 V 0 z";

  let svgStartToLeft = "M 0 0 H 100 Q 75 50 100 100 H 0 V 0 z";
  let svgEndToLeft = "M 0 0 H 0 Q 0 50 0 100 H 0 V 0 z";
  let svgStartToRight = "M 100 0 H 0 Q 25 50 0 100 H 100 V 0 z";
  let svgEndToRight = "M 100 0 H 100 Q 100 50 100 100 H 100 V 0 z";
}

// Glitch Text on hover

// Variable Font hover

// Video on hover

// Image follow on hover

// Image zoom on hover

// Tool Tip on hover with animation

// Card Flip on hover

basicButtonAnimation();
fillButtonAnimation();
buttonPushAnimation();
buttonStaggerAnimation();
buttonIconAnimation();
listHoverAnimation();
