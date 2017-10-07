import BrowserRouter from './BrowserRouter'

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

/**
 * Function for changing the router view.
 * @param to
 * @param replace
 * @returns {function(*=)}
 * @constructor
 */
export default function Link(to, replace = false) {
  return (event) => {
    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault()

      const {history} = BrowserRouter


      if (replace) {
        history.replace(to)
      } else {
        history.push(to)
      }
    }
  }
}
