// Text reveal on scroll animation
function textRevealOnScroll() {
  // Needs Split and Scrolltrigger
  const sections = document.querySelectorAll("[annnimate-scroll-text=section]");

  const topClipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
  const fullClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      const scroller =
        section.closest("[annnimate-scroller=scroller]") || window;
      const sectionStart = section.getAttribute("annnimate-scroll-start");
      const headlines = section.querySelectorAll(
        "[annnimate-scroll-text=headline]"
      );
      const texts = section.querySelectorAll("[annnimate-scroll-text=text]");

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: "expo.out" },
      });

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        scroller: scroller,
        start: "top bottom",
        end: sectionStart ? sectionStart : "top center",
        toggleActions: "none play none reset",
      });

      if (headlines && headlines.length > 0) {
        headlines.forEach((headline) => {
          const splitAttribute = headline.getAttribute("annnimate-split");
          const charsStaggerAttribute = headline.getAttribute(
            "annnimate-chars-stagger"
          );
          const wordsStaggerAttribute = headline.getAttribute(
            "annnimate-words-stagger"
          );
          const linesStaggerAttribute = headline.getAttribute(
            "annnimate-lines-stagger"
          );
          const delayAttribute = headline.getAttribute("annnimate-delay");
          if (splitAttribute) {
            const splitTypes = splitAttribute
              .split(",")
              .map((type) => type.trim());
            const splitHeadline = new SplitType(headline, {
              types: splitTypes,
            });
            splitTypes.forEach((type) => {
              const splitElements = splitHeadline[type] || [];
              let stagger = type === "chars" ? 0.01 : 0.1;
              if (type === "chars" && charsStaggerAttribute) {
                stagger = parseFloat(charsStaggerAttribute);
              } else if (type === "words" && wordsStaggerAttribute) {
                stagger = parseFloat(wordsStaggerAttribute);
              } else if (type === "lines" && linesStaggerAttribute) {
                stagger = parseFloat(linesStaggerAttribute);
              }
              const yPosition =
                type === "lines" ? splitHeadline.lines.length * 110 : 110;

              tl.from(
                splitElements.length ? splitElements : [headline],
                {
                  y: yPosition,
                  stagger: splitElements.length ? stagger : 0,
                  delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                },
                0
              );
            });
          } else {
            tl.from(headline, {
              y: 100,
              delay: delayAttribute ? parseFloat(delayAttribute) : 0,
            });
          }
        });
      }

      if (texts && texts.length > 0) {
        texts.forEach((text) => {
          const splitAttribute = text.getAttribute("annnimate-split");
          const charsStaggerAttribute = text.getAttribute(
            "annnimate-chars-stagger"
          );
          const wordsStaggerAttribute = text.getAttribute(
            "annnimate-words-stagger"
          );
          const linesStaggerAttribute = text.getAttribute(
            "annnimate-lines-stagger"
          );
          const delayAttribute = text.getAttribute("annnimate-delay");
          if (splitAttribute) {
            const splitTypes = splitAttribute
              .split(",")
              .map((type) => type.trim());
            const splitText = new SplitType(text, {
              types: splitTypes,
            });

            const linesYPosition = splitTypes.includes("lines")
              ? splitText.lines.length * 110
              : 0;

            let yPosition = 100;

            if (linesYPosition) {
              yPosition = linesYPosition;
            }
            splitTypes.forEach((type) => {
              const splitElements = splitText[type] || [];
              let stagger = type === "chars" ? 0.01 : 0.1;
              if (type === "chars" && charsStaggerAttribute) {
                stagger = parseFloat(charsStaggerAttribute);
              } else if (type === "words" && wordsStaggerAttribute) {
                stagger = parseFloat(wordsStaggerAttribute);
              } else if (type === "lines" && linesStaggerAttribute) {
                stagger = parseFloat(linesStaggerAttribute);
              }

              tl.fromTo(
                splitElements.length ? splitElements : [text],
                {
                  clipPath: topClipPath,
                  yPercent: 50,
                },
                {
                  clipPath: fullClipPath,
                  yPercent: 0,
                  stagger: splitElements.length ? stagger : 0,
                  delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                },
                0
              );
            });
          } else {
            tl.from(text, {
              opacity: 0,
              yPercent: 50,
              delay: delayAttribute ? parseFloat(delayAttribute) : 0,
            });
          }
        });
      }
    });
  }
}

// Scroll Flip Animation
function flipScrollAnimation() {
  // Needs Flip and Scrolltrigger
  const sections = document.querySelectorAll("[annnimate-flip-scroll=section]");

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      const scroller =
        section.closest("[annnimate-scroller=scroller]") || window;

      const targetElement = section.querySelector(
        "[annnimate-flip-scroll=target]"
      );
      const zoneElements = section.querySelectorAll(
        "[annnimate-flip-scroll=zone]"
      );

      tl = gsap.timeline();

      const createAnimation = () => {
        tl.clear();
        gsap.set(targetElement, { clearProps: "all" });

        zoneElements.forEach((zoneElement, index) => {
          const nextZoneEl = zoneElements[index + 1];
          if (nextZoneEl) {
            const nextZoneDistance =
              nextZoneEl.offsetTop + nextZoneEl.offsetHeight / 2;
            const thisZoneDistance =
              zoneElement.offsetTop + zoneElement.offsetHeight / 2;
            const zoneDifference = nextZoneDistance - thisZoneDistance;

            // Manually set width and height before using Flip.fit
            const nextZoneRect = nextZoneEl.getBoundingClientRect();
            targetElement.style.width = `${nextZoneRect.width}px`;
            targetElement.style.height = `${nextZoneRect.height}px`;

            tl.add(
              Flip.fit(targetElement, nextZoneEl, {
                duration: zoneDifference / 1000, // Adjust duration as needed
                ease: "power1.inOut",
                scale: false, // Ensure scale is false to avoid skewing
              })
            );
          }
        });
      };

      ScrollTrigger.create({
        animation: tl,
        trigger: zoneElements[0],
        scroller: scroller,
        start: "center center",
        endTrigger: zoneElements[zoneElements.length - 1],
        end: "center center",
        scrub: true,
        onRefresh: createAnimation,
      });

      createAnimation();

      let resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          createAnimation();
        }, 250);
      });
    });
  }
}

// Image reveal on scroll animation

// Path / Element reveal on scroll animation

// Parallax on scroll animation

// Section reveal on scroll animation

// Section overlap on scroll animation

// Bg color on scroll animation

// Follow path on scroll animation

textRevealOnScroll();
flipScrollAnimation();
