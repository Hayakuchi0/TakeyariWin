const path = require('path');
exports.getResourcePath = function() {
  console.log(process.env.NODE_ENV);
  if(process.env.NODE_ENV === 'development') {
    return path.join(__dirname,'..','..');
  }
  return process.resourcesPath;
};
