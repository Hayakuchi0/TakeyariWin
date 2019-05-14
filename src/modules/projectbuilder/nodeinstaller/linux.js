const wget = require('node-wget');
const decompress = require('decompress');
const decompressTarxz = require('decompress-tarxz');
const path = require('path');
const fs = require('fs-extra');
exports.nodeInstallProject = function(downloadTarxzDir, outputDir, projectDir, callback, message) {
	let result = false;
	let params = {};
	params['callback'] = callback;
  params['message'] = message;
	params['nodeVersion'] = '8.10.0';
	params['nodeBaseName'] = 'node-v'+params['nodeVersion']+'-linux-'+process.arch;
	params['nodeName'] = params['nodeBaseName'] + '.tar.xz';
	params['nodeUrl'] = 'https://nodejs.org/dist/v'+params['nodeVersion']+'/'+params['nodeName'];
	params['nodePath'] = path.join(downloadTarxzDir,params['nodeName']);
	params['outputPath']  = path.join(outputDir,'output');
	params['fromCopyDirectory'] = path.join(params['outputPath'],params['nodeBaseName']);
	params['libFromPath'] = path.join(params['fromCopyDirectory'],'lib');
	params['libToPath'] = path.join(projectDir,'lib');
	params['binFromPath'] = path.join(params['fromCopyDirectory'],'bin');
	params['binToPath'] = path.join(projectDir,'bin');
  if(fs.existsSync(params['libToPath'])&&fs.existsSync(params['binToPath'])) {
	  stepCopyCommand(params);
	} else {
    fs.removeSync(params['outputPath']);
	  if(fs.existsSync(params['nodePath'])) {
			stepDecompressNodeTarxz(params);
		}
		else {
			stepWgetNode(params)
		}
	}
}
async function stepWgetNode(params) {
	params['message']('start download'+params['nodeName']);
	await wget({url:params['nodeUrl'],dest:params['nodePath']}, async function(error, response, body) {
		if(error) {
			params['message'](error);
			callbackParam(params,false);
		} else {
			params['message']('end download!');
			await stepDecompressNodeTarxz(params);
		}
	});
}
async function stepDecompressNodeTarxz(params) {
	params['message']("start decompress node and npm");
	let promise = decompress(params['nodePath'],params['outputPath'],{plugins:[decompressTarxz()]});
	await Promise.all([promise]).then(function() {
		params['message']("end decompress!");
		stepCopyCommand(params);
	});
}
function stepCopyCommand(params) {
	if((!fs.existsSync(params['libToPath']))&&fs.existsSync(params['libFromPath'])) {
		fs.copySync(params['libFromPath'],params['libToPath']);
	}
	if((!fs.existsSync(params['binToPath']))&&fs.existsSync(params['binFromPath'])) {
		fs.copySync(params['binFromPath'],params['binToPath']);
	}
	callbackParam(params,fs.existsSync(params['libToPath'])&&fs.existsSync(params['binToPath']));
}
function callbackParam(params,result) {
	if(params['callback']) {
		params['callback'](result);
	}
}
