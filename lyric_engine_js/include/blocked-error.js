class BlockedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BlockedError';
  }
}

module.exports = BlockedError;
