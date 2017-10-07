export function toBoolean(v) {
    if (!v) {
        return false;
    }

    return 'TRUE' === v.toUpperCase();
}

export function toFunc(v) {
    if (!v) {
        throw () => {
        };
    }

    return window[v];
}

export function toArrayOfString(v) {
    if (!v) {
        return [];
    }
    return v.split(',')
}

export function cleanNodes(root) {
    if (root && root.hasChildNodes()) {
        Array.from(root.childNodes)
            .filter(node => node.tagName !== 'FEM-ROUTE')
            .forEach(node => root.removeChild(node))
    }
}