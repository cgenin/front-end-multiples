import NodeUtils from './NodeUtils'

/**
 * Null implementation of the history state.
 * @type {{unmount: (function()), bootstrap: (function())}}
 */
export const EmptyType = {
    unmount() {
        return Promise.resolve();
    },
    bootstrap() {
        return Promise.resolve();
    }
};

// counter for unique node
let idNode = 0;

/**
 * Class for loading external scripts.
 */
export class LoadFile {
    constructor() {
        this.elements = [];
        this.head = document.getElementsByTagName("head")[0];
    }

    /**
     * Css file loader.
     * @param file
     * @returns {Promise}
     * @private
     */
    _loadStyle(file) {
        return new Promise((resolve) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = file;
            this.head.appendChild(link);
            this.elements.push(link);
            resolve(link)
        })
    }

    /**
     * Javascript file loader.
     * @param file
     * @returns {Promise}
     * @private
     */
    _loadScript(file) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = file;
            script.onload = () => {
                resolve(script)
            };
            this.elements.push(script);
            this.head.appendChild(script);
        })
    }

    /**
     * destroy all resources previously loaded.
     * @returns {Promise.<*[]>}
     */
    unmount() {
        return Promise.all(this.elements.map(
            elm => {
                if (elm && elm.parentNode) {
                    elm.parentNode.removeChild(elm);
                }
            }
        ));
    }

    /**
     * Load the resources files.
     * @param files
     * @returns {Promise.<TResult>}
     */
    run(files) {
        if (!files) {
            throw new Error('No null')
        }
        const arr = (Array.isArray(files)) ? files : [files];
        const cssFiles = arr.filter(f => /\.css$|\.css\?/.test(f))
            .map(f => this._loadStyle(f));
        const jsFiles = arr.filter(f => /\.js$|\.js\?/.test(f))
            .map(f => this._loadScript(f));

        return Promise.all(cssFiles.concat(jsFiles))
            .then(() => {
                return this;
            })
    }
}

/**
 * This class get the current route node information, load the matching module and create an object for the lifecycle.
 * The lifecycle's object has two methods : bootstrap for initializing the view and unmount for deleting the current view.
 */
export default class GenericDrawer {
    constructor(view) {
        this.view = view;
        this._findAttrs = this._findAttrs.bind(this)
        this._loadScripts = this._loadScripts.bind(this)
        this._newNode = this._newNode.bind(this)
        this.show = this.show.bind(this)
    }

    /**
     * Method for getting an attribute.
     * @param name
     * @returns {null}
     * @private
     */
    _findAttrs(name) {
        const attrs = Array.from(this.view.attributes);
        const typeNode = attrs.find(a => name === a.name) || {value: null}
        return typeNode.value;
    }

    /**
     * Load all scripts in the current route tag.
     * @returns {Promise.<TResult>}
     * @private
     */
    _loadScripts() {
        const scripts = this._findAttrs('scripts');
        const files = NodeUtils.toArrayOfString(scripts);
        return new LoadFile().run(files)
    }

    /**
     * Méthod for creating an node for the view.
     * @param root
     * @returns {Element}
     * @private
     */
    _newNode(root) {
        const div = document.createElement('div');
        div.id = `view-${idNode++}`;
        root.appendChild(div);
        return div;
    }

    /**
     * Main method.
     * @param root
     * @returns {Promise.<TResult>}
     */
    show(root) {
        const type = this._findAttrs('type') || 'JS';

        const newNode = this._newNode(root);
        const destroyNode = () => {
            if (root && newNode) {
                console.log('destroyNode');
                root.removeChild(newNode);
            }
            return true;
        };
        // module packaging in the main router.
        if (type === 'JS') {
            return this._loadScripts()
                .then((unmounter) => {
                    // call the js function with the view node in parameter.
                    const bootstrap = () => {
                        return new Promise((resolve) => {
                            const func = NodeUtils.toFunc(this._findAttrs('exec'));
                            func(newNode);
                            resolve();
                        });
                    };
                    // destroy all the nodes.
                    const unmount = () => {
                        return unmounter.unmount()
                            .then(destroyNode);
                    };

                    return {
                        unmount, bootstrap
                    };
                });
        } else {
            // other modules
            return this._loadScripts()
                .then((unmounter) => {
                    // try to load the module
                    const module = window.femRouter[type];

                    if (!module) {
                        throw new Error(`module not found for ${type}`)
                    }
                    // call the module for creating an new instance.
                    const moduleInstance = module(this.view, newNode);
                    // unmount the script, then unmount the module and delete node element.
                    const unmount = () => {
                        return Promise.all([unmounter.unmount(), moduleInstance.unmount(), destroyNode()]);
                    };
                    return {bootstrap: moduleInstance.bootstrap, unmount};
                });
        }
    }
}