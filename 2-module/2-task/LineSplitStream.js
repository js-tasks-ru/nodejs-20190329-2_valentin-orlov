const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.last = '';
  }

  _transform(chunk, encoding, callback) {
    let strings = (this.last + chunk.toString()).split(os.EOL);
    this.last = strings.pop();
    strings.forEach((el) => this.push(el));
    callback();
  }

  _flush(callback) {
    callback(null, this.last);
  }
}

module.exports = LineSplitStream;
