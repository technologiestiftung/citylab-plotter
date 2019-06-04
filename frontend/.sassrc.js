// as seen herehttps://github.com/parcel-bundler/parcel/issues/39#issuecomment-353722786
const path = require('path');

const CWD = process.cwd();

module.exports = {
  "includePaths": [
    path.resolve(CWD, 'node_modules'),
    path.resolve(CWD, 'src'),
  ]
};
