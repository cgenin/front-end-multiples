import {toArrayOfString, toFunc, cleanNodes} from './NodeUtils'

export const EmptyType = {
    unmount() {
        return Promise.resolve();
    },
    bootstrap() {
        return Promise.resolve();
    }
};

export class LoadFile {
    constructor() {
        this.elements = [];
        this.head = document.getElementsByTagName("head")[0];
    }

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

    unmount() {
        return Promise.all(this.elements.map(
            elm =>{
                if(elm && elm.parentNode){
                    elm.parentNode.removeChild(elm);
                }
            }
        ));
    }

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
            .then(()=>{
                return this;
            })
    }
}


export default class GenericDrawer {
    constructor(view) {
        this.view = view;
        this._findAttrs = this._findAttrs.bind(this)
        this._loadScripts = this._loadScripts.bind(this)
        this.show = this.show.bind(this)
    }


    _findAttrs(name) {
        const attrs = Array.from(this.view.attributes);
        const typeNode = attrs.find(a => name === a.name) || {value: null}
        return typeNode.value;
    }

    _loadScripts() {
        const scripts = this._findAttrs('scripts');
        const files = toArrayOfString(scripts);
        return new LoadFile().run(files)
    }


    show(root) {
        const type = this._findAttrs('type') || 'JS';
        switch (type) {
            case 'JS':
                return this._loadScripts()
                    .then((unmounter) => {
                        const bootstrap = () => {
                            return new Promise((resolve) => {
                                const func = toFunc(this._findAttrs('func'));
                                func(root);
                                resolve();
                            });
                        };
                        const unmount = () => {
                            return unmounter.unmount()
                                .then(() => {
                                    cleanNodes(root);
                                    return true;
                                });
                        };
                        return {
                            unmount, bootstrap
                        };
                    });
                break;
            default:
                return new Promise.reject('Type not managed : ' + type)
        }
    }
}