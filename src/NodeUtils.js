/**
 *  Node utils function
 */

/**
 * Convert an attribute of an html node to boolean.
 * @param v
 * @returns {boolean}
 */
function toBoolean(v) {
    if (!v) {
        return false;
    }

    return 'TRUE' === v.toUpperCase();
}

/**
 * convert string to function attached to the window object
 * @param v
 * @returns {*}
 */
function toFunc(v) {
    if (!v) {
        throw () => {
        };
    }

    return window[v];
}

/**
 * Split the attribute value of an element by ','.
 * @param v
 * @returns {*}
 */
function toArrayOfString(v) {
    if (!v) {
        return [];
    }
    return v.split(',')
}


export default {
    toArrayOfString, toBoolean, toFunc
}