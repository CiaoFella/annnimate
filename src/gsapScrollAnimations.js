// Text reveal on scroll animation
function textRevealOnScroll() {
  // Needs Split and Scrolltrigger
  const sections = document.querySelectorAll('[anm-scroll-text=section]')

  const topClipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  const fullClipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[anm-scroller=scroller]') || window
      const sectionStart = section.getAttribute('anm-scroll-start')
      const headlines = section.querySelectorAll('[anm-scroll-text=headline]')
      const texts = section.querySelectorAll('[anm-scroll-text=text]')

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
          const distanceAttribute = headline.getAttribute('anm-distance') || 110
          const splitAttribute = headline.getAttribute('anm-split')
          const charsStaggerAttribute = headline.getAttribute('anm-chars-stagger')
          const wordsStaggerAttribute = headline.getAttribute('anm-words-stagger')
          const linesStaggerAttribute = headline.getAttribute('anm-lines-stagger')
          const durationAttribute = headline.getAttribute('anm-duration') || 1
          const delayAttribute = headline.getAttribute('anm-delay')
          const easeAttribute = headline.getAttribute('anm-ease')
          const customAttribute = headline.getAttribute('anm-custom')

          // Function to parse custom attribute into an object
          const parseCustomAttribute = attr => {
            const props = {}
            if (attr) {
              attr.split(',').forEach(pair => {
                const [key, value] = pair.split(':').map(item => item.trim())
                if (key && value) {
                  // Remove quotes from around the value if present
                  props[key] = value.replace(/^['"]|['"]$/g, '')
                }
              })
            }
            return props
          }

          const animationProps = parseCustomAttribute(customAttribute)

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
              const yPosition = type === 'lines' ? splitHeadline.lines.length * distanceAttribute : distanceAttribute

              tl.from(
                splitElements.length ? splitElements : [headline],
                {
                  y: yPosition,
                  stagger: splitElements.length ? stagger : 0,
                  delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                  duration: durationAttribute ? parseFloat(durationAttribute) : 1,
                  ease: easeAttribute ? easeAttribute : 'expo.out',
                  ...animationProps, // Spread the animation properties here
                },
                0
              )
            })
          } else {
            tl.from(headline, {
              y: 100,
              delay: delayAttribute ? parseFloat(delayAttribute) : 0,
              duration: durationAttribute ? parseFloat(durationAttribute) : 1,
              ease: easeAttribute ? easeAttribute : 'expo.out',
              ...animationProps, // Spread the animation properties here
            })
          }
        })
      }

      if (texts && texts.length > 0) {
        texts.forEach(text => {
          const distanceAttribute = text.getAttribute('anm-distance') || 50
          const splitAttribute = text.getAttribute('anm-split')
          const charsStaggerAttribute = text.getAttribute('anm-chars-stagger')
          const wordsStaggerAttribute = text.getAttribute('anm-words-stagger')
          const linesStaggerAttribute = text.getAttribute('anm-lines-stagger')
          const durationAttribute = text.getAttribute('anm-duration') || 1
          const delayAttribute = text.getAttribute('anm-delay')
          const easeAttribute = text.getAttribute('anm-ease')
          const customAttribute = text.getAttribute('anm-custom')

          // Function to parse custom attribute into an object
          const parseCustomAttribute = attr => {
            const props = {}
            if (attr) {
              attr.split(',').forEach(pair => {
                const [key, value] = pair.split(':').map(item => item.trim())
                if (key && value) {
                  props[key] = value
                }
              })
            }
            return props
          }

          // Function to transform values for the 'to' state
          const transformValuesForToState = (element, props) => {
            const transformedValues = {}
            const computedStyles = window.getComputedStyle(element)
            for (const key in props) {
              let value = props[key]
              // Replace any number with 0, keeping the rest of the string intact
              transformedValues[key] = value.replace(/(\d+(\.\d+)?)/g, match => {
                // Check if the number has a unit and replace it with 0 and the same unit
                const unitMatch = match.match(/(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/)
                return unitMatch ? `0${unitMatch[3] || ''}` : '0'
              })

              // If no number is present, capture the current state
              if (!/\d/.test(value)) {
                transformedValues[key] = computedStyles[key] || value
              }
            }
            return transformedValues
          }

          const animationProps = parseCustomAttribute(customAttribute)
          const toStateProps = transformValuesForToState(text, animationProps)

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
                  yPercent: parseFloat(distanceAttribute),
                  ...animationProps, // Apply original custom properties in the 'from' state
                },
                {
                  clipPath: fullClipPath,
                  yPercent: 0,
                  stagger: splitElements.length ? stagger : 0,
                  duration: durationAttribute ? parseFloat(durationAttribute) : 1,
                  delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                  ease: easeAttribute ? easeAttribute : 'expo.out',
                  ...toStateProps, // Apply transformed properties in the 'to' state
                },
                0
              )
            })
          } else {
            tl.fromTo(
              text,
              {
                opacity: 0,
                yPercent: parseFloat(distanceAttribute),
                ...animationProps, // Apply original custom properties in the 'from' state
              },
              {
                opacity: 1,
                yPercent: 0,
                duration: parseFloat(durationAttribute),
                delay: delayAttribute ? parseFloat(delayAttribute) : 0,
                ease: easeAttribute ? easeAttribute : 'expo.out',
                ...toStateProps, // Apply transformed properties in the 'to' state
              },
              0
            )
          }
        })
      }
    })
  }
}

// Scroll Flip Animation
function flipScrollAnimation() {
  // Needs Flip and Scrolltrigger
  const sections = document.querySelectorAll('[anm-flip-scroll=section]')

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[anm-scroller=scroller]') || window

      const targetElement = section.querySelector('[anm-flip-scroll=target]')
      const zoneElements = section.querySelectorAll('[anm-flip-scroll=zone]')

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
  const sections = document.querySelectorAll('[anm-scroll-img=section]')

  const centerClipPath = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'
  const rightClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
  const leftClipPath = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
  const bottomClipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
  const topClipPath = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
  const fullClipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[anm-scroller=scroller]') || window
      const sectionStart = section.getAttribute('anm-scroll-start') || 'top center'
      const sectionEnd = section.getAttribute('anm-scroll-end') || 'bottom top'
      const sectionScrub = section.getAttribute('anm-scroll-scrub') || false
      const sectionReset = section.getAttribute('anm-scroll-reset') || false

      const images = section.querySelectorAll('[anm-scroll-img=img]')

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
          const type = image.getAttribute('anm-type') || 'clip'
          const delay = image.getAttribute('anm-delay') || 0
          const duration = image.getAttribute('anm-duration') || 1
          const ease = image.getAttribute('anm-ease') || 'power2.inOut'
          const direction = image.getAttribute('anm-direction') || 'top'
          const customAttribute = image.getAttribute('anm-custom')

          // Function to parse custom attribute into an object
          const parseCustomAttribute = attr => {
            const props = {}
            if (attr) {
              attr.split(',').forEach(pair => {
                const [key, value] = pair.split(':').map(item => item.trim())
                if (key && value) {
                  props[key] = value
                }
              })
            }
            return props
          }

          // Function to transform values for the 'to' state
          const transformValuesForToState = (element, props) => {
            const transformedValues = {}
            const computedStyles = window.getComputedStyle(element)
            for (const key in props) {
              let value = props[key]
              // Replace any number with 0, keeping the rest of the string intact
              transformedValues[key] = value.replace(/(\d+(\.\d+)?)/g, match => {
                // Check if the number has a unit and replace it with 0 and the same unit
                const unitMatch = match.match(/(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/)
                return unitMatch ? `0${unitMatch[3] || ''}` : '0'
              })

              // If no number is present, capture the current state
              if (!/\d/.test(value)) {
                transformedValues[key] = computedStyles[key] || value
              }
            }
            return transformedValues
          }

          const animationProps = parseCustomAttribute(customAttribute)
          const toStateProps = transformValuesForToState(image, animationProps)

          switch (type) {
            case 'clip':
              switch (direction) {
                case 'top':
                  tl.fromTo(
                    image,
                    { clipPath: bottomClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'bottom':
                  tl.fromTo(
                    image,
                    { clipPath: topClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'left':
                  tl.fromTo(
                    image,
                    { clipPath: rightClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'right':
                  tl.fromTo(
                    image,
                    { clipPath: leftClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'center':
                  tl.fromTo(
                    image,
                    { clipPath: centerClipPath, ...animationProps },
                    { clipPath: fullClipPath, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
              }
              break
            case 'opacity':
              tl.fromTo(image, { opacity: 0, ...animationProps }, { opacity: 1, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
              break
            case 'slide':
              switch (direction) {
                case 'top':
                  tl.fromTo(
                    image,
                    { y: -100, opacity: 0, ...animationProps },
                    { y: 0, opacity: 1, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'bottom':
                  tl.fromTo(
                    image,
                    { y: 100, opacity: 0, ...animationProps },
                    { y: 0, opacity: 1, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'left':
                  tl.fromTo(
                    image,
                    { x: -100, opacity: 0, ...animationProps },
                    { x: 0, opacity: 1, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'right':
                  tl.fromTo(
                    image,
                    { x: 100, opacity: 0, ...animationProps },
                    { x: 0, opacity: 1, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
              }
              break
            case 'scale':
              switch (direction) {
                case 'in':
                  tl.fromTo(image, { scale: 0.8, ...animationProps }, { scale: 1, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
                case 'out':
                  tl.fromTo(image, { scale: 1.2, ...animationProps }, { scale: 1, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
              }
              break
            case 'rotate':
              switch (direction) {
                case 'in':
                  tl.fromTo(
                    image,
                    { rotate: -15, ...animationProps },
                    { rotate: 0, duration: duration, ease: ease, delay: delay, ...toStateProps },
                    0
                  )
                  break
                case 'out':
                  tl.fromTo(image, { rotate: 15, ...animationProps }, { rotate: 0, duration: duration, ease: ease, delay: delay, ...toStateProps }, 0)
                  break
              }
              break
          }
        })
      }
    })
  }
}

// scroll counter on scroll
function scrollCounterOnScroll() {
  const sections = document.querySelectorAll('[anm-scroll-counter=section]')

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[anm-scroller=scroller]') || window
      const counters = section.querySelectorAll('[anm-scroll-counter=counter]')
      const counterStart = section.getAttribute('anm-start') || 'top center'
      const counterEnd = section.getAttribute('anm-end') || 'bottom top'
      const counterScrub = section.getAttribute('anm-scrub') || false
      const counterReset = section.getAttribute('anm-reset') || false

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power2.inOut' },
      })

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        scroller: scroller,
        start: counterReset === 'true' ? 'top bottom' : counterStart,
        end: counterReset === 'true' ? counterStart : counterEnd,
        scrub: counterScrub === 'true' ? true : false,
        toggleActions: counterReset === 'true' ? 'none play none reset' : counterScrub === 'true' ? null : 'play none none none',
      })

      counters.forEach(counter => {
        const snap = counter.getAttribute('anm-snap') || 1
        const duration = counter.getAttribute('anm-duration') || 1
        const ease = counter.getAttribute('anm-ease') || 'power2.inOut'
        const delay = counter.getAttribute('anm-delay') || 0

        tl.from(counter, { textContent: '0', snap: { textContent: snap }, duration: duration, ease: ease, delay: delay }, 0)
      })
    })
  }
}

// Parallax on scroll animation
function parallaxOnScroll() {
  const sections = document.querySelectorAll('[anm-scroll-parallax=section]')

  if (sections && sections.length > 0) {
    sections.forEach(section => {
      const scroller = section.closest('[anm-scroller=scroller]') || window
      const parallaxWrap = section.querySelectorAll('[anm-scroll-parallax=wrap]')

      parallaxWrap.forEach(wrap => {
        const element = wrap.querySelector('[anm-scroll-parallax=element]')
        const scaleAttribute = element.getAttribute('anm-scale') || 1.2
        const yAttribute = element.getAttribute('anm-y') || 10
        const scrubAttribute = element.getAttribute('anm-scrub') || 0.5

        const tl = gsap.timeline({
          defaults: { duration: 1, ease: 'power2.inOut' },
        })

        tl.set(element, { scale: scaleAttribute })

        tl.fromTo(element, { y: -yAttribute }, { y: yAttribute, ease: 'linear' }, 0)

        ScrollTrigger.create({
          animation: tl,
          trigger: wrap,
          scroller: scroller,
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrubAttribute,
        })
      })
    })
  }
}

// Bg color on scroll animation
function bgColorOnScroll() {
  const sections = document.querySelectorAll('[anm-scroll-bg=section]')

  if (sections && sections.length > 0) {
    sections.forEach((section, i) => {
      const zones = section.querySelectorAll('[anm-scroll-bg=zone]')

      if (zones && zones.length > 0) {
        zones.forEach((zone, j) => {
          const zoneStart = zone.getAttribute('anm-start') || 'top bottom'
          const prevZone = j === 0 ? null : zones[j - 1]
          const prevBg = prevZone ? prevZone.getAttribute('anm-bg') : ''
          const prevText = prevZone ? prevZone.getAttribute('anm-text') : ''

          ScrollTrigger.create({
            trigger: zone,
            scroller: section.closest('[anm-scroller=scroller]') || window,
            start: zoneStart,
            onEnter: () =>
              gsap.to(section, {
                backgroundColor: zone.getAttribute('anm-bg'),
                color: zone.getAttribute('anm-text'),
                overwrite: 'auto',
              }),
            onLeaveBack: () =>
              gsap.to(section, {
                backgroundColor: prevBg,
                color: prevText,
                overwrite: 'auto',
              }),
          })
        })
      }
    })
  }
}

// Path / Element reveal on scroll animation

// Section reveal on scroll animation

// Section overlap on scroll animation

// Follow path on scroll animation

textRevealOnScroll()
flipScrollAnimation()
imageRevealOnScroll()
scrollCounterOnScroll()
parallaxOnScroll()
bgColorOnScroll()
