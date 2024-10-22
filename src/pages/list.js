window.addEventListener('DOMContentLoaded', () => {
  function normalizeCategoryClear() {
    document.querySelectorAll('[fs-cmsfilter-element="tag-template"]').forEach(element => {
      element.addEventListener('click', () => {
        const childElement = element.querySelector('[fs-cmsfilter-element="tag-text"]')
        const categoryElement = element.querySelector('[fs-cmsfilter-field="filter-checkbox"] [fs-cmsfilter-field="category"]')

        if (childElement && categoryElement) {
          const textContent = childElement.textContent
          const categoryTextContent = categoryElement.textContent

          if (textContent === categoryTextContent) {
            console.log('The text contents are equal.')
          } else {
            console.log('The text contents are not equal.')
          }
        }
      })
    })
  }

  function initButtons() {
    const buttons = document.querySelectorAll('[data-copy-button]')
    buttons.forEach(button => {
      button.addEventListener('click', event => {
        const animationItem = event.target.closest('[data-animation-list="item"]')
        if (animationItem) {
          const animationName = animationItem.getAttribute('data-animation-name')
          const animationCategory = animationItem.getAttribute('data-animation-category')
          const userChoice = event.target.getAttribute('data-copy-button')
          console.log(animationName, animationCategory, event.target)
          copyAnimation(animationName, animationCategory, userChoice)
        }
      })
    })
  }

  async function copyAnimation(animationName, animationCategory, userChoice) {
    let response, animationData

    if (userChoice === 'webflow') {
      response = await fetch(`https://annnimate.netlify.app/animations/${animationCategory}/${animationName}/${animationName}.json`)
      animationData = await response.json()
      animationData = JSON.stringify(animationData) // Convert JSON to string
    } else {
      response = await fetch(`https://annnimate.netlify.app/animations/${animationCategory}/${animationName}/${animationName}.html`)
      animationData = await response.text()
    }

    copyToClipboard(animationData, userChoice)
  }

  function copyToClipboard(data, userChoice) {
    document.addEventListener('copy', function onCopy(event) {
      if (userChoice === 'webflow') {
        event.clipboardData.setData('application/json', data)
      } else {
        event.clipboardData.setData('text/plain', data)
      }
      event.preventDefault()
      document.removeEventListener('copy', onCopy)
    })

    document.execCommand('copy')
    alert(`Animation copied to clipboard as ${userChoice === 'webflow' ? 'JSON' : 'text'}!`)
  }

  normalizeCategoryClear()
  initButtons()
})
