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