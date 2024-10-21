window.addEventListener('load', () => {
  console.log('hello')
  // Add event listeners to the buttons
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
})

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
