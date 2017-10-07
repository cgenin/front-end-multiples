import createBrowserHistory from 'history/createBrowserHistory'
import warning from 'warning';

class BrowserRouter {
  constructor() {
    this.state = {}
    this._initiliazeState = this._initiliazeState.bind(this)
    this.mount = this.mount.bind(this)
    this.computeMatch = this.computeMatch.bind(this)
    this.unMount = this.unMount.bind(this)
  }

  mount() {
    return new Promise((resolve) => {
      this.history = createBrowserHistory(
        {  basename: '',             // The base URL of the app (see below)
          forceRefresh: false,      // Set true to force full page refreshes
          keyLength: 6,  }
      );

      this.listeners = [];
      this.unlisten = this.history.listen((location, action) => {
        warning(location, 'location must be set');
        this.state = this._initiliazeState(location, action);
        this.listeners.forEach(f => f(this.state))
      });
      this.state = this._initiliazeState(this.history.location, this.history.action);
      resolve(this)
    });

  }

  _initiliazeState(location, action) {
    return {
      match: this.computeMatch(location.pathname),
      location, action
    };
  }

  computeMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/'
    }
  }

  register(func) {
    this.listeners.push(func)
  }


  unMount() {
    this.unlisten()
  }
}

export default new BrowserRouter()