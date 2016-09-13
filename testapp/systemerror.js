require('abrt')
fs = require('fs');

fs.appendFile('/etc/node.js.test', 'foo', (err) => {
  if (err) throw err;
});
