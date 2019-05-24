const fs = require("fs-extra");
const path = require("path");
const iconv = require("iconv-lite");
exports.readAll = function(configDirectory) {
  let result = {};
  result['about'] = exports.readAbout(configDirectory);
  result['copyright'] = exports.readCopyright(configDirectory);
  result['encoding'] = exports.readEncoding(configDirectory);
  result['sitename'] = exports.readSitename(configDirectory);
  return result;
};
exports.readAbout = function(configDirectory) {
  return readConfig(configDirectory,'about.txt');
};
exports.readCopyright = function(configDirectory) {
  return readConfig(configDirectory,'copyright.txt');
};
exports.readEncoding = function(configDirectory) {
  let configPath = path.join(configDirectory,'encoding.txt');
  let buffer = fs.readFileSync(configPath);
  return iconv.decode(buffer, 'utf-8');
};
exports.readSitename = function(configDirectory) {
  return readConfig(configDirectory,'sitename.txt');
};
exports.readTakeyariViewerVersion = function(configDirectory) {
  return JSON.parse(fs.readFileSync(path.join(configDirectory,"..","package.json"),"utf-8"))["version"];
}
var readConfig = function(directoryPath, name) {
  let configPath = path.join(directoryPath,name);
  let buffer = fs.readFileSync(configPath);
  return iconv.decode(buffer, exports.readEncoding(directoryPath));
}
