const path = require('path');
exports.getResourcePath = function() {
  if(process.env.NODE_ENV === 'development') {
    return path.join(__dirname,'..','..');
  }
  return process.resourcesPath;
};
