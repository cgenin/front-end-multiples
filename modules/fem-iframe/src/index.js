let number = 0;

const DEFAULt_CLASSNAME = 'femrouter-iframe';

const key = (id) => {
    return `window-${id}`;
};

const addClassName = (id) => {
    const header = document.querySelector('head');
    const style = document.createElement('style');
    style.innerText = `
        .${DEFAULt_CLASSNAME}.${key(id)} {
            width:100%;
            min-height:25vh;
            border: 0;
        }
    
    `;
    header.appendChild(style);
    return style;
};


const iframe = (config, root) => {
    const id = ++number;
    const className = config.getAttribute('className') || DEFAULt_CLASSNAME;
    const src = config.getAttribute('src');
    const style = (className === DEFAULt_CLASSNAME) ? addClassName(id) : null;
    const iframe = document.createElement('iframe');
    iframe.classList.add(className);
    iframe.classList.add(key(id));
    iframe.src = src;

    const unmount = () => {
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
        if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    };

    const bootstrap = () => {
        return new Promise((resolve) => {
            root.appendChild(iframe);
            resolve();
        });
    };
    return {
        unmount, bootstrap
    };
};

window.femRouter = window.femRouter || {};
window.femRouter.iframe = window.femRouter.iframe || iframe;
