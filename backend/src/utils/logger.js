const levels = { info: 'INFO', warn: 'WARN', error: 'ERROR' };

function log(level, message, meta = {}) {
  const safeMeta = { ...meta };
  delete safeMeta.password;
  delete safeMeta.token;
  delete safeMeta.jwt;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...safeMeta,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

module.exports = {
  info: (message, meta) => log(levels.info, message, meta),
  warn: (message, meta) => log(levels.warn, message, meta),
  error: (message, meta) => log(levels.error, message, meta),
};
