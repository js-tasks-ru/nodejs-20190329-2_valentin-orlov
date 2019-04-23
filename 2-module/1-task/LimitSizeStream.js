const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.currSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currSize += chunk.length;
    if (this.currSize > this.limit) {
      callback(new LimitExceededError(), null);
      return false;
    }
    callback(null, chunk);

  }
}

module.exports = LimitSizeStream;
