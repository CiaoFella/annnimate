// Basic button animation
function textButtonAnimation() {
  const buttons = document.querySelectorAll('[anm-text-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      const underline = button.querySelector('[anm-text-button=underline]')

      gsap.set(underline, { scaleX: 0 })

      button.addEventListener('mouseenter', () => {
        gsap.fromTo(
          underline,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left',
            duration: 0.3,
            ease: 'power1.inOut',
          }
        )
      })

      button.addEventListener('mouseleave', () => {
        gsap.fromTo(
          underline,
          { scaleX: 1 },
          {
            scaleX: 0,
            transformOrigin: 'right',
            duration: 0.3,
            ease: 'power1.inOut',
          }
        )
      })
    })
  }
}

// Button push up animation
function buttonPushAnimation() {
  const buttons = document.querySelectorAll('[anm-push-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      // Get the direction of the push animation - can be "up", "down", "left", "right"
      const direction = button.getAttribute('anm-direction')
      const text = button.querySelector('[anm-push-button=text]')

      // create a copy of the text and add a class to it
      const textClone = text.cloneNode(true)
      textClone.style.position = 'absolute'

      text.after(textClone)

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut', duration: 0.5 },
        paused: true,
      })

      if (direction === 'up') {
        textClone.style.bottom = '-105%'
        timeline.to(text, { yPercent: -105 }).to(textClone, { yPercent: -105 }, '<')
      } else if (direction === 'down') {
        textClone.style.top = '-105%'
        timeline.to(text, { yPercent: 105 }).to(textClone, { yPercent: 105 }, '<')
      } else if (direction === 'left') {
        textClone.style.top = '0'
        textClone.style.right = '105%'
        timeline.to(text, { xPercent: 105 }).to(textClone, { xPercent: 105 }, '<')
      } else if (direction === 'right') {
        textClone.style.top = '0'
        textClone.style.left = '105%'
        timeline.to(text, { xPercent: -105 }).to(textClone, { xPercent: -105 }, '<')
      }

      button.addEventListener('mouseenter', () => {
        timeline.play()
      })

      button.addEventListener('mouseleave', () => {
        timeline.reverse()
      })
    })
  }
}

// Curve button animation
function curveButtonAnimation() {
  const buttons = document.querySelectorAll('[anm-curve-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      const bg = button.querySelector('[anm-curve-button=bg]')
      const bgPath = bg.querySelector('[anm-curve-button=bg-path]')
      const text = button.querySelector('[anm-curve-button=text]')
      const endColor = button.getAttribute('anm-color')

      // Start color of the text
      const startColor = window.getComputedStyle(text).color

      function getMouseEnterDirection(mouseEvent, item) {
        const rect = item.getBoundingClientRect()
        const edges = {
          top: Math.abs(rect.top - mouseEvent.clientY),
          bottom: Math.abs(rect.bottom - mouseEvent.clientY),
          left: Math.abs(rect.left - mouseEvent.clientX),
          right: Math.abs(rect.right - mouseEvent.clientX),
        }
        return Object.keys(edges).find(key => edges[key] === Math.min(...Object.values(edges)))
      }

      function handleHoverIn(mouseDirection) {
        const paths = {
          top: { start: svgStartFromTop, end: svgEndFromTop },
          bottom: { start: svgStartFromBottom, end: svgEndFromBottom },
          left: { start: svgStartFromLeft, end: svgEndFromLeft },
          right: { start: svgStartFromRight, end: svgEndFromRight },
        }
        return paths[mouseDirection] || paths.top
      }

      function handleHoverOut(mouseDirection) {
        const paths = {
          top: { start: svgStartToTop, end: svgEndToTop },
          bottom: { start: svgStartToBottom, end: svgEndToBottom },
          left: { start: svgStartToLeft, end: svgEndToLeft },
          right: { start: svgStartToRight, end: svgEndToRight },
        }
        return paths[mouseDirection] || paths.top
      }

      function animateHover(element, start, end) {
        if (start && end) {
          return gsap.fromTo(
            element,
            { attr: { d: start } },
            {
              attr: { d: end },
              duration: 0.5,
              ease: 'power3.out',
            }
          )
        }
      }

      button.addEventListener('mouseenter', event => {
        const mouseDirection = getMouseEnterDirection(event, button)
        const pathDirection = handleHoverIn(mouseDirection, true)
        animateHover(bgPath, pathDirection.start, pathDirection.end)
        gsap.to(text, { color: endColor, duration: 0.2 })
      })

      button.addEventListener('mouseleave', event => {
        const mouseDirection = getMouseEnterDirection(event, button)
        const pathDirection = handleHoverOut(mouseDirection, true)
        animateHover(bgPath, pathDirection.start, pathDirection.end)
        gsap.to(text, { color: startColor, duration: 0.2 })
      })
    })

    // SVG Paths - DO NOT ADJUST IF YOU DON'T KNOW WHAT YOU'RE DOING
    let svgStartFromTop = 'M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z'
    let svgEndFromTop = 'M 0 100 V 100 Q 50 125 100 100 V 0 H 0 z'
    let svgStartFromBottom = 'M 0 100 V 100 Q 75 50 100 100 V 100 z'
    let svgEndFromBottom = 'M 0 100 V 0 Q 50 0 100 0 V 100 z'

    let svgStartToTop = 'M 0 100 V 100 Q 50 50 100 100 V 0 H 0 z'
    let svgEndToTop = 'M 0 100 V 0 Q 50 0 100 0 V 0 H 0 z'
    let svgStartToBottom = 'M 0 100 V 0 Q 50 50 100 0 V 100 z'
    let svgEndToBottom = 'M 0 100 V 100 Q 50 100 100 100 V 100 z'

    let svgStartFromLeft = 'M 0 0 H 0 Q 0 50 0 100 H 0 V 0 z'
    let svgEndFromLeft = 'M 0 0 H 100 Q 110 50 100 100 H 0 V 0 z'
    let svgStartFromRight = 'M 100 0 H 100 Q 100 50 100 100 H 100 V 0 z'
    let svgEndFromRight = 'M 100 0 H 0 Q -10 50 0 100 H 100 V 0 z'

    let svgStartToLeft = 'M 0 0 H 100 Q 75 50 100 100 H 0 V 0 z'
    let svgEndToLeft = 'M 0 0 H 0 Q 0 50 0 100 H 0 V 0 z'
    let svgStartToRight = 'M 100 0 H 0 Q 25 50 0 100 H 100 V 0 z'
    let svgEndToRight = 'M 100 0 H 100 Q 100 50 100 100 H 100 V 0 z'
  }
}

// Button stagger animation
function buttonStaggerAnimation() {
  const buttons = document.querySelectorAll('[anm-stagger-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      // Get the direction of the push animation - can be "up", "down"
      const direction = button.getAttribute('anm-direction')

      // Get the reverse attribute - can be "true" or "false"
      const isReverse = button.getAttribute('anm-reverse')

      const text = button.querySelector('[anm-stagger-button=text]')

      // create a copy of the text and add a class to it
      const textClone = text.cloneNode(true)
      textClone.style.position = 'absolute'

      text.after(textClone)

      const textSplit = new SplitType(text, { types: 'chars' })
      const clonedSplit = new SplitType(textClone, { types: 'chars' })

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut', duration: 0.5, stagger: 0.0075 },
        paused: true,
      })

      if (direction === 'up') {
        textClone.style.top = '100%'
        timeline.fromTo(textSplit.chars, { yPercent: 0 }, { yPercent: -100 }).to(clonedSplit.chars, { yPercent: -100 }, '<')
      } else if (direction === 'down') {
        textClone.style.top = '-100%'
        timeline.fromTo(textSplit.chars, { yPercent: 0 }, { yPercent: 100 }).fromTo(clonedSplit.chars, { yPercent: 0 }, { yPercent: 100 }, '<')
      }

      button.addEventListener('mouseenter', () => {
        timeline.restart()
      })

      button.addEventListener('mouseleave', () => {
        if (isReverse === 'true') {
          timeline.reverse()
        } else {
          return
        }
      })
    })
  }
}

// Button Icon animation
function buttonIconAnimation() {
  const buttons = document.querySelectorAll('[anm-icon-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      const icon = button.querySelector('[anm-icon-button=icon]')
      const bg = button.querySelector('[anm-icon-button=bg]')
      const targetColor = button.getAttribute('anm-color') || window.getComputedStyle(button).color

      const iconClone = icon.cloneNode(true)
      iconClone.style.position = 'absolute'

      icon.after(iconClone)
      iconClone.style.left = '-100%'
      iconClone.style.top = '100%'

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut', duration: 0.5 },
        paused: true,
      })

      timeline
        .to(button, { color: targetColor })
        .to(icon, { xPercent: 100, yPercent: -100 }, '<')
        .to(iconClone, { xPercent: 100, yPercent: -100 }, '<')
        .to(bg, { scaleX: 10, scaleY: 5 }, '<')

      button.addEventListener('mouseenter', () => {
        timeline.play()
      })

      button.addEventListener('mouseleave', () => {
        timeline.reverse()
      })
    })
  }
}

// Circle fill animation like here: https://www.prets.io/
function circleFillAnimation() {
  const buttons = document.querySelectorAll('[anm-circle-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      const circle = button.querySelector('[anm-circle-button=circle]')
      const text = button.querySelector('[anm-circle-button=text]')
      const targetColor = button.getAttribute('anm-theme')
      const startColor = window.getComputedStyle(button).color
      const scale = button.getAttribute('anm-scale')

      let scaleValue = 20

      if (scale) {
        scaleValue = scale
      }

      button.addEventListener('mouseenter', event => {
        const tl = gsap.timeline({
          defaults: { ease: 'power4.out', duration: 1 },
        })

        setCirclePosition(event, button, circle, tl)

        tl.to(circle, {
          scale: scaleValue,
          transformOrigin: 'center',
        })

        if (targetColor) {
          tl.to(text, { color: targetColor, duration: 0.5 }, '<')
        }
      })

      button.addEventListener('mouseleave', event => {
        const tl = gsap.timeline({
          defaults: { ease: 'power4.out', duration: 1 },
        })

        setCirclePosition(event, button, circle, tl)

        tl.to(circle, {
          scale: 0,
          transformOrigin: 'center',
        })

        if (targetColor) {
          tl.to(text, { color: startColor, duration: 0.5 }, '<')
        }
      })
    })
  }

  function setCirclePosition(event, button, circle, tl) {
    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    tl.set(circle, {
      x,
      y,
    })
  }
}

// Rectangle fill animation like here: https://betteroff.studio/pricing
function rectangleFillAnimation() {
  const buttons = document.querySelectorAll('[anm-rectangle-button=wrap]')

  if (buttons && buttons.length > 0) {
    buttons.forEach(button => {
      const rect = button.querySelector('[anm-rectangle-button=rect]')
      const text = button.querySelector('[anm-rectangle-button=text]')
      const targetColor = button.getAttribute('anm-color') || window.getComputedStyle(button).color

      const tl = gsap.timeline({
        defaults: { ease: 'power4.inOut', duration: 0.75 },
        paused: true,
      })

      tl.fromTo(rect, { scale: 0.8, yPercent: 0 }, { scale: 1, yPercent: -100 }).to(
        text,
        { color: targetColor, duration: 0.25, ease: 'power1.inOut' },
        '<+25%'
      )

      button.addEventListener('mouseenter', () => {
        tl.play()
      })

      button.addEventListener('mouseleave', () => {
        tl.reverse()
      })
    })
  }
}

// Variable Font hover
function variableFontHover() {
  let mm = gsap.matchMedia()

  // Add a media query that targets screens with a minimum width of 992px
  mm.add('(min-width: 992px)', () => {
    const fontWeightItems = document.querySelectorAll('[anm-variable-font=element]')

    let MAX_DISTANCE = 200 // Adjust the maximum distance for font weight change as needed
    let MAX_FONT_WEIGHT = 800 // Maximum font weight
    let MIN_FONT_WEIGHT = 100 // Minimum font weight

    if (fontWeightItems && fontWeightItems.length > 0) {
      // Split up any text with the data attribute into individual characters
      fontWeightItems.forEach(item => {
        new SplitType(item, { types: 'chars' }).chars

        const maxDistance = item.getAttribute('anm-max-distance')
        const maxFontWeight = item.getAttribute('anm-max-weight')
        const minFontWeight = item.getAttribute('anm-min-weight')

        if (maxDistance) {
          MAX_DISTANCE = parseInt(maxDistance)
        }

        if (maxFontWeight) {
          MAX_FONT_WEIGHT = parseInt(maxFontWeight)
        }

        if (minFontWeight) {
          MIN_FONT_WEIGHT = parseInt(minFontWeight)
        }
      })

      // Add mousemove event listener to change font weight based on mouse position
      document.addEventListener('mousemove', event => {
        // Get the mouse position
        const mouseX = event.pageX
        const mouseY = event.pageY

        fontWeightItems.forEach(item => {
          item.querySelectorAll('.char').forEach(char => {
            // Get the center of each character and calculate the distance from the mouse
            const itemRect = char.getBoundingClientRect()
            const itemCenterX = itemRect.left + itemRect.width / 2 + window.scrollX
            const itemCenterY = itemRect.top + itemRect.height / 2 + window.scrollY

            const distance = Math.sqrt(Math.pow(mouseX - itemCenterX, 2) + Math.pow(mouseY - itemCenterY, 2))

            // map the distance to the font weight range
            let fontWeight =
              distance < MAX_DISTANCE
                ? gsap.utils.mapRange(0, MAX_DISTANCE, MIN_FONT_WEIGHT, MAX_FONT_WEIGHT, Math.max(0, MAX_DISTANCE - distance))
                : MIN_FONT_WEIGHT

            gsap.to(char, { fontWeight, duration: 0.5 })
          })
        })
      })
    }
  })
}

// Icon Hover Animation

// Tool Tip on hover with animation

// Magnetic Button

// Video on hover

// Image follow on hover

// Image zoom on hover

// Card Flip on hover

// Glitch Text on hover

textButtonAnimation()
curveButtonAnimation()
buttonPushAnimation()
buttonStaggerAnimation()
buttonIconAnimation()
circleFillAnimation()
rectangleFillAnimation()
variableFontHover()
