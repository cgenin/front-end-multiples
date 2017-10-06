import {toArrayOfString, toFunc} from './NodeUtils'
import LoadFile from './LoadFile'

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
        this._loadScripts()
          .then(() => {
            const func = toFunc(this._findAttrs('func'));
            func(root)
          });
        break;
      default:
        throw new Error('Type not managed : ' + type)
    }
  }
}