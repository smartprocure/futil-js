export let setTimeoutAsync = delay =>
  new Promise(resolve => setTimeout(resolve, delay))
