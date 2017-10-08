let idModule = 0;

const build = (root, opts) => {
    const bootstrap = () => {
        return new Promise((resolve) => {
            if (opts.strictDi) {
                opts.angular.bootstrap(opts.bootstrapEl, [opts.mainAngularModule], {strictDi: opts.strictDi})
            } else {
                opts.angular.bootstrap(opts.bootstrapEl, [opts.mainAngularModule])
            }
            resolve();
        });
    };
    const unmount = () => {
        return new Promise((resolve) => {
            const elt = window.angular.element(root.querySelector(`#${opts.id}`));
            const injector = elt.injector();
            const rootScope = injector.get('$rootScope');
            const result = rootScope.$destroy();
            setTimeout(resolve);
        });
    };

    return {
        unmount, bootstrap
    };
};

const angularjs = (config, root) => {
    const angular = window.angular;
    const mainAngularModule = config.getAttribute('main-angular-module');
    const strictDi = config.getAttribute('strictDi');
    const uiview = config.getAttribute('ui-view');

    const bootstrapEl = document.createElement('div');
    bootstrapEl.id = `fem-angular-${idModule++}`;
    root.appendChild(bootstrapEl);
    if (config.hasAttribute('ui-view')) {
        const uiViewEl = document.createElement('div');
        uiViewEl.setAttribute('ui-view', uiview || '');
        bootstrapEl.appendChild(uiViewEl);
    }

    return build(root, {angular, mainAngularModule, strictDi, uiview,bootstrapEl, id:bootstrapEl.id});
};

window.femRouter = window.femRouter || {};
window.femRouter.angularjs = window.femRouter.angularjs || angularjs;
