const wget = require('node-wget');
const decompress = require('decompress');
const decompressTarxz = require('decompress-tarxz');
const path = require('path');
const fs = require('fs-extra');
exports.nodeInstallProjectAtLinux = function(downloadTarxzDir, outputDir, projectDir, callback) {
	let result = false;
	let params = {};
	params['callback'] = callback;
	params['nodeVersion'] = '8.10.0';
	params['nodeBaseName'] = 'node-v'+params['nodeVersion']+'-linux-x86';
	params['nodeName'] = params['nodeBaseName'] + '.tar.xz';
	params['nodeUrl'] = 'https://nodejs.org/dist/v'+params['nodeVersion']+'/'+params['nodeName'];
	params['nodePath'] = path.join(downloadTarxzDir,params['nodeName']);
	params['outputPath']  = path.join(outputDir,'output');
	params['fromCopyDirectory'] = path.join(params['outputPath'],params['nodeBaseName']);
	params['libFromPath'] = path.join(params['fromCopyDirectory'],'lib');
	params['libToPath'] = path.join(projectDir,'lib');
	params['binFromPath'] = path.join(params['fromCopyDirectory'],'bin');
	params['binToPath'] = path.join(projectDir,'bin');
	if((!fs.existsSync(params['libToPath']))||(!fs.existsSync(params['binToPath']))) {
		if(fs.existsSync(params['outputPath'])) {
			stepCopyCommand(params);
		} else {
			if(fs.existsSync(params['nodePath'])) {
				stepDecompressNodeTarxz(params);
			}
			else {
				stepWgetNode(params)
			}
		}
	} else {
		callbackParam(params,true);
	}
}
async function stepWgetNode(params) {
	console.log('start download!');
	await wget({url:params['nodeUrl'],dest:params['nodePath']}, async function(error, response, body) {
		if(error) {
			console.log(error);
			callbackParam(params,false);
		} else {
			console.log('end download!');
			await stepDecompressNodeTarxz(params);
		}
	});
}
async function stepDecompressNodeTarxz(params) {
	let promise = decompress(params['nodePath'],params['outputPath'],{plugins:[decompressTarxz()]});
	await Promise.all([promise]).then(function() {
		console.log("decompressed");
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
