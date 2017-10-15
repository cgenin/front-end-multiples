let number = 0;
const toId = (id) => {
    return `fem-vue-${id}`;
};
const vue = (config, root) => {
    const id = ++number;
    const key = toId(id);
    const componentGetter = config.getAttribute('component-getter');
    const loader = window[componentGetter];
    const componentName = config.getAttribute('component-name');
    const Vue = window.Vue;
    const storage = {};
    if (!Vue) {
        throw new Error("expected vue instance attached in window.Vue");
    }

    return {
        unmount() {
            return new Promise((resolve) => {
                if (storage.instance) {
                    try {

                        console.log("call $destroy");
                        storage.instance.$destroy();
                    } catch (err) {
                        console.log(err);
                    }
                    storage.instance.$el.innerHTML = '';
                    delete storage.instance;
                }
                if (window.Vue) {
                    delete window.Vue;
                }
                setTimeout(resolve);
            });
        },
        bootstrap() {
            return new Promise((resolve) => {
                const div = document.createElement('div');
                div.id = key;
                root.appendChild(div);
                storage.div = div;

                const components = {};

                components[componentName] = loader();

                storage.instance = new Vue({
                    el: `#${key}`,
                    template: `<${componentName}/>`,
                    components,
                });
                resolve();
            });
        }
    }
};

window.femRouter = window.femRouter || {};
window.femRouter.vue = window.femRouter.vue || vue;
