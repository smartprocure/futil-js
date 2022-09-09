export let scrollToMethod = (name: string) => {
  let element = document.getElementById(`${name}-method`)
  element && element.scrollIntoView({ behavior: 'smooth' })
}
let scrollToHash = () => {
  scrollToMethod(window.location.hash.replace('#', ''))
}

export let setupHashScroll = () => {
  scrollToHash()
  window.addEventListener('hashchange', scrollToHash)
  return () => {
    window.removeEventListener('hashchange', scrollToHash)
  }
}
