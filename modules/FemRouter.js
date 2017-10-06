import matchPath from './matchPath'
import {toBoolean} from './NodeUtils'
import BrowserRouter from './BrowserRouter'
import GenericDrawer from './GenericDrawer'


class FemRouter extends HTMLElement {

  constructor() {
    super();
    this.views = []

  }

  _changed(state) {
    if (this.hasChildNodes()) {
      Array.from(this.childNodes)
        .filter(node => node.tagName !== 'FEM-ROUTE')
        .forEach(node => this.removeChild(node))
    }
    const {location} = state;

    const view = this.views.find(v => {
      const t = {location, ...v};
      return this.computeMatch(t)
    });

    if (view) {
      new GenericDrawer(view.element).show(this);
    } else {
      console.error(`path not ${location.pathname} found`)
      const def = this.views.find(v => toBoolean(v.default))
      if (def) {
        //  callFunction(def.func, this);
        BrowserRouter.history.push(def.path)
      }
    }
  }

  computeMatch({location, path, strict, exact, sensitive}) {

    const pathname = location.pathname

    return path ? matchPath(pathname, {path, strict, exact, sensitive}) : false
  }

  createdCallback() {
    this._changed = this._changed.bind(this)
    BrowserRouter.mount();
  }


  attachedCallback() {

    this.views = Array.from(document.querySelectorAll('fem-route'))
      .map(elm => {
        const attrs = Array.from(elm.attributes)
          .map(m => {
            const obj = {};
            obj[m.name] = m.value;
            return obj;
          })
          .reduce((a, b) => Object.assign({}, a, b));
        return Object.assign({}, attrs, {element: elm});
      });

    this._changed(BrowserRouter.state);
    BrowserRouter.register(this._changed)

  }

  detachedCallback() {
    BrowserRouter.unMount()
    this.views = []
  }
}

document.registerElement('fem-router', FemRouter)
