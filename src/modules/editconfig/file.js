const fs = require("fs-extra");
const path = require("path");
exports.getAboutImagePath = function(configDirectoryPath) {
  return path.join(configDirectoryPath,"aboutimage.png");
};
exports.getTopImagePath = function(configDirectoryPath) {
  return path.join(configDirectoryPath,"topimage.png");
};
exports.getFaviconPath = function(configDirectoryPath) {
  return path.join(configDirectoryPath,"favicon.ico");
};
exports.setAboutImage = function(configDirectoryPath, newImagePath) {
  copyConfig(newImagePath, exports.getAboutImagePath(configDirectoryPath));
};
exports.setTopImage = function(configDirectoryPath, newImagePath) {
  copyConfig(newImagePath, exports.getTopImagePath(configDirectoryPath));
};
exports.setFavicon = function(configDirectoryPath, newImagePath) {
  copyConfig(newImagePath, exports.getFaviconPath(configDirectoryPath));
};
var copyConfig = function(newImagePath, targetPath) {
  let absoluteNewImagePath = path.resolve(newImagePath);
  let absoluteTargetPath = path.resolve(targetPath);
  if(absoluteNewImagePath != absoluteTargetPath) {
    fs.copyFileSync(newImagePath, targetPath);
  }
};
