const iconv = require('iconv-lite');

exports.setMessageProc = function(proc,put,callback){
  proc.stdout.on('data',function(data) {
    put(transString(data));
  });
  proc.stderr.on('data',function(data) {
    put(transString(data));
  });
  proc.on('close',function(code) {
    if(callback) {
      callback();
    }
  });
}
var transString = function(data) {
  let locale = Intl.NumberFormat().resolvedOptions().locale;
  if((process.platform.startsWith("win32"))&&(locale.toString().startsWith("ja"))) {
    let encoding = "Shift_JIS";
    return iconv.decode(data,encoding);
  }
  return iconv.decode(data,"UTF-8");
}
