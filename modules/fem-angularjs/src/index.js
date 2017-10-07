const build = (root, opts) => {
    const bootstrap = () => {
        return new Promise((resolve) => {
            if (opts.strictDi) {
                opts.angular.bootstrap(root, [opts.mainAngularModule], {strictDi: opts.strictDi})
            } else {
                opts.angular.bootstrap(root, [opts.mainAngularModule])
            }
            resolve();
        });
    };
    const unmount = () => {
        return new Promise((resolve) => {
            let rootScope = root.injector().get('$rootScope');
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
    const mainAngularModule = config.getAttribute('mainAngularModule');
    const strictDi = config.getAttribute('strictDi');
    return build(root, {angular, mainAngularModule, strictDi});
};

window.femRouter = window.femRouter || {};
window.femRouter.angularjsModule = window.femRouter.angularjs || angularjs;
