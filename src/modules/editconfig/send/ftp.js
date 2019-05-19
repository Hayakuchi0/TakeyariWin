const fs = require("fs-extra");
const path = require("path");
const iconv = require("iconv-lite");
exports.fields = ["host","port","user","password","remoteRoot"];
exports.read = function(sendDirectoryPath) {
  let buffer = fs.readFileSync(path.join(sendDirectoryPath,"ftp.json"));
  return iconv.decode(buffer,'utf-8');
}
exports.save = function(sendDirectoryPath, json) {
  fs.writeFileSync(path.join(sendDirectoryPath, "ftp.json"), iconv.encode(JSON.stringify(json),'utf-8'));
}
