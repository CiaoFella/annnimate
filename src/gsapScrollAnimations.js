// Text reveal on scroll animation
function textRevealOnScroll() {
  // Needs Split and Scrolltrigger
  const sections = document.querySelectorAll('[annnimate-scroll-text=section]')

  const topClipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  const fullClipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[annnimate-scroller=scroller]') || window
      const sectionStart = section.getAttribute('annnimate-scroll-start')
      const headlines = section.querySelectorAll('[annnimate-scroll-text=headline]')
      const texts = section.querySelectorAll('[annnimate-scroll-text=text]')

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'expo.out' },
      })

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        scroller: scroller,
        start: 'top bottom',
        end: sectionStart ? sectionStart : 'top center',
        toggleActions: 'none play none reset',
      })

      if (headlines && headlines.length > 0) {
        headlines.forEach(headline => {
          const splitAttribute = headline.getAttribute('annnimate-split')
          const charsStaggerAttribute = headline.getAttribute('annnimate-chars-stagger')
          const wordsStaggerAttribute = headline.getAttribute('annnimate-words-stagger')
          const linesStaggerAttribute = headline.getAttribute('annnimate-lines-stagger')
          const delayAttribute = headline.getAttribute('annnimate-delay')
          if (splitAttribute) {
            const splitTypes = splitAttribute.split(',').map(type => type.trim())
            const splitHeadline = new SplitType(headline, {
              types: splitTypes,
            })
            splitTypes.forEach(type => {
              const splitElements = splitHeadline[type] || []
              let stagger = type === 'chars' ? 0.01 : 0.1
              if (type === 'chars' && charsStaggerAttribute) {
                stagger = parseFloat(charsStaggerAttribute)
              } else if (type === 'words' && wordsStaggerAttribute) {
                stagger = parseFloat(wordsStaggerAttribute)
              } else if (type === 'lines' && linesStaggerAttribute) {
                stagger = parseFloat(linesStaggerAttribute)
              }
              const yPosition = type === 'lines' ? splitHeadline.lines.length * 110 : 110

              tl.from(
                splitElements.length ? splitElements : [headline],
                {
                  y: yPosition,
                  stagger: splitElements.length ? stagger : 0,
                  delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                },
                0
              )
            })
          } else {
            tl.from(headline, {
              y: 100,
              delay: delayAttribute ? parseFloat(delayAttribute) : 0,
            })
          }
        })
      }

      if (texts && texts.length > 0) {
        texts.forEach(text => {
          const splitAttribute = text.getAttribute('annnimate-split')
          const charsStaggerAttribute = text.getAttribute('annnimate-chars-stagger')
          const wordsStaggerAttribute = text.getAttribute('annnimate-words-stagger')
          const linesStaggerAttribute = text.getAttribute('annnimate-lines-stagger')
          const delayAttribute = text.getAttribute('annnimate-delay')
          if (splitAttribute) {
            const splitTypes = splitAttribute.split(',').map(type => type.trim())
            const splitText = new SplitType(text, {
              types: splitTypes,
            })

            const linesYPosition = splitTypes.includes('lines') ? splitText.lines.length * 110 : 0

            let yPosition = 100

            if (linesYPosition) {
              yPosition = linesYPosition
            }
            splitTypes.forEach(type => {
              const splitElements = splitText[type] || []
              let stagger = type === 'chars' ? 0.01 : 0.1
              if (type === 'chars' && charsStaggerAttribute) {
                stagger = parseFloat(charsStaggerAttribute)
              } else if (type === 'words' && wordsStaggerAttribute) {
                stagger = parseFloat(wordsStaggerAttribute)
              } else if (type === 'lines' && linesStaggerAttribute) {
                stagger = parseFloat(linesStaggerAttribute)
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
              )
            })
          } else {
            tl.from(text, {
              opacity: 0,
              yPercent: 50,
              delay: delayAttribute ? parseFloat(delayAttribute) : 0,
            })
          }
        })
      }
    })
  }
}

// Scroll Flip Animation
function flipScrollAnimation() {
  // Needs Flip and Scrolltrigger
  const sections = document.querySelectorAll('[annnimate-flip-scroll=section]')

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[annnimate-scroller=scroller]') || window

      const targetElement = section.querySelector('[annnimate-flip-scroll=target]')
      const zoneElements = section.querySelectorAll('[annnimate-flip-scroll=zone]')

      let tl
      function createTimeline() {
        if (tl) {
          tl.kill()
          gsap.set(targetElement, { clearProps: 'all' })
        }

        const originalState = Flip.getState(targetElement)

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: zoneElements[0],
            scroller: scroller,
            start: 'center center',
            endTrigger: zoneElements[zoneElements.length - 1],
            end: 'center center',
            scrub: true,
          },
        })

        zoneElements.forEach((zoneElement, index) => {
          let nextZoneEl = zoneElements[index + 1]
          if (nextZoneEl) {
            let nextZoneDistance = nextZoneEl.offsetTop + nextZoneEl.offsetHeight / 2
            let thisZoneDistance = zoneElement.offsetTop + zoneElement.offsetHeight / 2
            let zoneDifference = nextZoneDistance - thisZoneDistance
            tl.add(
              Flip.fit(targetElement, nextZoneEl, {
                duration: zoneDifference,
                ease: 'power2.inOut',
              })
            )
          }
        })

        Flip.fit(targetElement, originalState, { duration: 0 })
      }
      createTimeline()
      // SETUP RESIZE
      let resizeTimer
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function () {
          createTimeline()
        }, 250)
      })
    })
  }
}

// Image reveal on scroll animation
function imageRevealOnScroll() {
  // Needs Scrolltrigger
  const sections = document.querySelectorAll('[annnimate-scroll-img=section]')

  const centerClipPath = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'
  const rightClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
  const leftClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
  const bottomClipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
  const topClipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  const fullClipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[annnimate-scroller=scroller]') || window
      const sectionStart = section.getAttribute('annnimate-scroll-start') || 'top center'
      const sectionEnd = section.getAttribute('annnimate-scroll-end') || 'bottom top'
      const sectionScrub = section.getAttribute('annnimate-scroll-scrub') || false
      const sectionReset = section.getAttribute('annnimate-scroll-reset') || false

      const images = section.querySelectorAll('[annnimate-scroll-img=img]')

      const tl = gsap.timeline()

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        scroller: scroller,
        start: sectionReset === 'true' ? 'top bottom' : sectionStart,
        end: sectionReset === 'true' ? sectionStart : sectionEnd,
        scrub: sectionScrub === 'true' ? true : false,
        toggleActions: sectionReset === 'true' ? 'none play none reset' : sectionScrub === 'true' ? null : 'play none none none',
      })

      if (images && images.length > 0) {
        images.forEach(image => {
          const type = image.getAttribute('annnimate-type') || 'clip'
          const delay = image.getAttribute('annnimate-delay') || 0
          const duration = image.getAttribute('annnimate-duration') || 1
          const ease = image.getAttribute('annnimate-ease') || 'power2.inOut'
          const direction = image.getAttribute('annnimate-direction') || 'top'

          switch (type) {
            case 'clip':
              switch (direction) {
                case 'top':
                  tl.fromTo(image, { clipPath: bottomClipPath }, { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'bottom':
                  tl.fromTo(image, { clipPath: topClipPath }, { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'left':
                  tl.fromTo(image, { clipPath: rightClipPath }, { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'right':
                  tl.fromTo(image, { clipPath: leftClipPath }, { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'center':
                  tl.fromTo(image, { clipPath: centerClipPath }, { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay }, 0)
                  break
              }
              break
            case 'opacity':
              tl.fromTo(image, { opacity: 0 }, { opacity: 1, duration: duration, ease: ease, delay: delay }, 0)
              break
            case 'slide':
              switch (direction) {
                case 'top':
                  tl.fromTo(image, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'bottom':
                  tl.fromTo(image, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'left':
                  tl.fromTo(image, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'right':
                  tl.fromTo(image, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
              }
              break
            case 'scale':
              switch (direction) {
                case 'in':
                  tl.fromTo(image, { scale: 0.8 }, { scale: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'out':
                  tl.fromTo(image, { scale: 1.2 }, { scale: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
              }
              break
            case 'rotate':
              switch (direction) {
                case 'in':
                  tl.fromTo(image, { rotate: -15, scale: 1.4 }, { rotate: 0, scale: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
                case 'out':
                  tl.fromTo(image, { rotate: 15, scale: 1.4 }, { rotate: 0, scale: 1, duration: duration, ease: ease, delay: delay }, 0)
                  break
              }
              break
          }
        })
      }
    })
  }
}

// Path / Element reveal on scroll animation

// scroll counter on scroll

// Parallax on scroll animation

// Section reveal on scroll animation

// Section overlap on scroll animation

// Bg color on scroll animation

// Follow path on scroll animation

textRevealOnScroll()
flipScrollAnimation()
imageRevealOnScroll()
