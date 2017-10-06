export default class LoadFile {
  constructor() {
    this.files = [];
    this.js = [];
    this.head = document.getElementsByTagName("head")[0];
  }

  _loadStyle(file) {
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = file;
      this.head.appendChild(link);
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
      this.head.appendChild(script);
    })
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
  }
}