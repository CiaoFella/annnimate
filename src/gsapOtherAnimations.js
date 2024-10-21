// Fill list hover animation
function listHoverAnimation() {
  const lists = document.querySelectorAll('[anm-fill-list=wrap]')

  lists.forEach(list => {
    const listItems = list.querySelectorAll('[anm-fill-list=item]')

    listItems.forEach(item => {
      const bg = item.querySelector('[anm-fill-list=bg]')
      const bgPath = bg.querySelector('[anm-fill-list=bg-path]')
      const text = item.querySelector('[anm-fill-list=text]')

      // Start color of the text
      const startColor = text.style.color

      // EDIT: Adjust the end color as you like
      const endColor = '#FFF'

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
            }
        return paths[mouseDirection] || paths.top
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

      item.addEventListener('mouseenter', event => {
        const mouseDirection = getMouseEnterDirection(event, item)
        const pathDirection = handleHoverIn(mouseDirection, false)
        animateHover(bgPath, pathDirection.start, pathDirection.end)
        gsap.to(text, { color: endColor, marginLeft: '1rem', duration: 0.35 })
      })

      item.addEventListener('mouseleave', event => {
        const mouseDirection = getMouseEnterDirection(event, item)
        const pathDirection = handleHoverOut(mouseDirection, false)
        animateHover(bgPath, pathDirection.start, pathDirection.end)
        gsap.to(text, { color: startColor, marginLeft: '0', duration: 0.35 })
      })
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

// Image Trail after mouse

// Accordion Animation

// Modal Animation

// GSAP Flip Card Animation

listHoverAnimation()
