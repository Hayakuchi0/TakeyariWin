const fs = require('fs-extra');
const path = require('path');
const iconv = require('iconv-lite');
exports.saveAll = function(configDirectory, configs) {
  exports.saveAbout(configDirectory,configs["about"], configs["encoding"]);
  exports.saveCopyright(configDirectory,configs["copyright"], configs["encoding"]);
  exports.saveEncoding(configDirectory,configs["encoding"]);
  exports.saveSitename(configDirectory,configs["sitename"], configs["encoding"]);
};
exports.saveAbout = function(configDirectory, text, encoding) {
  saveConfig(configDirectory, 'about.txt', text, encoding);
};
exports.saveCopyright = function(configDirectory, text, encoding) {
  saveConfig(configDirectory, 'copyright.txt', text, encoding);
};
exports.saveEncoding = function(configDirectory, text) {
  saveConfig(configDirectory, 'encoding.txt', text, 'utf-8');
};
exports.saveSitename = function(configDirectory, text, encoding) {
  saveConfig(configDirectory, 'sitename.txt', text, encoding);
};
var saveConfig = function(directoryPath, name, text, encoding) {
  let configPath = path.join(directoryPath,name);
  fs.writeFileSync(configPath, iconv.encode(text, encoding));
};
