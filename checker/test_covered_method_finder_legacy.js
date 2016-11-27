var readline = require('linebyline');
var exec = require('child_process').exec;
var fs = require('fs');
var S = require('string');

var appDir = __dirname + '/../../solar-calc/';
var sourceFileArr = ['moon.js', 'solarCalc.js', 'sun.js'];
var coverageFilePath = appDir + 'coverage/coverage.json';
var coverageFinalFilePath = appDir + 'coverage/coverage-final.json';

function main(){
	var separatedTestFolder = appDir + 'separated_tests/';
	fs.readdir(separatedTestFolder, function(err, files){
		files.forEach(function(testFileName){
			// if(fs.existsSync(coverageFilePath)) { fs.unlinkSync(coverageFilePath); }
			// if(fs.existsSync(coverageFinalFilePath)) { fs.unlinkSync(coverageFinalFilePath); }
			// ./node_modules/.bin/istanbul cover --report json ./node_modules/.bin/_mocha separated_tests/test_3.rb
			var command = './node_modules/.bin/istanbul cover --report json ./node_modules/.bin/_mocha separated_tests/' + testFileName;
			exec(command, {cwd: appDir});
			var jsonContent = JSON.parse(fs.readFileSync(coverageFinalFilePath, 'utf8'));
		// console.log('==' + testFileName + '======');
		// console.log(jsonContent);
		// console.log('========');
			parseIstanbulOutput(testFileName, jsonContent);
		});
	});
}

function parseIstanbulOutput(testFileName, jsonContent){
	sourceFileArr.forEach(function(sourceFile){
		// one source file statement/branch/function coverage info
		// function coverage info
		var key = S(__dirname).replaceAll('DevOps-M4/checker', 'solar-calc/lib/') + sourceFile;
		var funcCoverage = jsonContent[key]['f'];
// console.log(testFileName);
// console.log(funcCoverage);
		var coveredFunc = [];
		for(var num in funcCoverage){
			if(funcCoverage[num] > 0) { coveredFunc.push(num); }
		}
		console.log(testFileName + '-' + sourceFile + ': ' + coveredFunc);
		console.log('========');
	});
}

main();