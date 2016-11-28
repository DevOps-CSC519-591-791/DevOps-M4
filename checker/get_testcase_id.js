var project = __dirname + '/../../solar-calc'
var fs = require("fs");
var readline = require('linebyline');

file = readline(project + '/test/test.js');
file.on('line', function(line, lineCount, byteCount) {
	start = line.indexOf('it(');

	if(start >= 0){
		start += 4
		end = line.substring(start).indexOf('\'');
		testCaseDesc = line.substring(start, start + end);
		console.log(testCaseDesc);
		// write test case description into file
		fs.appendFile(__dirname + '/../results/test_case_desc', testCaseDesc + '\n', function (err) {
		  if (err) { throw err; }
		});
	}
}).on('error', function(e) {
	throw e;
});