import matchPath from './matchPath'
import NodeUtils from './NodeUtils'
import BrowserRouter from './BrowserRouter'
import GenericDrawer, {EmptyType} from './GenericDrawer'
import warning from 'warning';

/**
 * Main element which managed the routes.
 */
class FemRouter extends HTMLElement {

    constructor() {
        super();
        this.views = [];
        this.lastMatchedView = {};
    }


    /**
     * Method for managing history change.
     * @param state new Stateof the history
     * @private
     */
    _changed(state) {
        const {location} = state;

        const view = this.views.find(v => {
            const t = {location, ...v};
            return this._computeMatch(t)
        });

        if (this.lastMatchedView === view.element) {
            return;
        }

        const errorCb = (err)=>{
            warning(false, err);
        };

        this.current.unmount()
            .then(
                () => {

                    if (view) {
                        new GenericDrawer(view.element)
                            .show(this)
                            .then(c => {
                                this.current = c;
                                return c;
                            })
                            .then(c => c.bootstrap())
                            .then(() => this.lastMatchedView = view.element)
                            .catch(err => errorCb(err));
                    } else {
                        const def = this.views.find(v => NodeUtils.toBoolean(v.default));
                        if (def) {
                            BrowserRouter.history.push(def.path)
                        }
                        warning(def, `path not ${location.pathname} found and default route not existe. Impossible to redirect`);
                    }
                }
            )
            .catch(err => errorCb(err));


    }

    /**
     * Method for choosing if the path match the current location.
     * @param location
     * @param path
     * @param strict
     * @param exact
     * @param sensitive
     * @returns {*}
     * @private
     */
    _computeMatch({location, path, strict, exact, sensitive}) {
        const pathname = location.pathname;
        return path ? matchPath(pathname, {path, strict, exact, sensitive}) : false
    }


    createdCallback() {
        this.current = EmptyType;
        this._changed = this._changed.bind(this)
        // create the current history router.
        BrowserRouter.mount();
    }


    attachedCallback() {
        // get all routes define for this router.
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
        // match the loading route
        this._changed(BrowserRouter.state);
        // registering the change listener.
        BrowserRouter.register(this._changed)

    }

    detachedCallback() {
        // destroy the history router.
        BrowserRouter.unMount();
        this.views = []
    }
}

document.registerElement('fem-router', FemRouter)
