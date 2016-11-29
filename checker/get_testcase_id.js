var project = __dirname + '/../../solar-calc'
var fs = require("fs");
var readline = require('linebyline');
var testFiles = [];

function getTestFiles(callback){
	var file = readline(__dirname + '/../results/commit_touched_testcases');
	file.on('line', function(line, lineCount, byteCount) {
		if(lineCount == 1) 
		{ 
			testFiles = line.split(','); 
			callback(testFiles);
		}
	}).on('error', function(e) {
		throw e;
	});
}

fs.writeFile(__dirname + '/../results/commit_touched_testcases_desc', '', function (err,data) {
	if (err) { return console.log(err); }
});

getTestFiles(function(testFiles){
	testFiles.forEach(function(testFileName){
		file = readline(project + '/separated_tests/' + testFileName);

		
		file.on('line', function(line, lineCount, byteCount) {
			start = line.indexOf('it(');

			testCaseDesc = ''
			
			if(start >= 0){
				start += 4
				end = line.substring(start).indexOf('\'');
				testCaseDesc += line.substring(start, start + end) + '|';
				// console.log(start + ' : ' + testCaseDesc);
				// write test case description into file

				fs.appendFile(__dirname + '/../results/commit_touched_testcases_desc', testCaseDesc, function (err) {
				  if (err) { throw err; }
				});
				
			}

			// testCaseDesc = testCaseDesc.substring(0, testCaseDesc.lastIndexOf('|'))
			// console.log(testCaseDesc)
			
		}).on('error', function(e) {
			throw e;
		}).on('close', function(e){

			fs.readFile(__dirname + '/../results/commit_touched_testcases_desc', 'utf8', function (err,data) {
			  if (err) {
			    return console.log(err);
			  }

			  // console.log(data)
			  // console.log(data.substring(0, data.lastIndexOf('|')))

			  fs.writeFile(__dirname + '/../results/commit_touched_testcases_desc', data.substring(0, data.lastIndexOf('|')), 'utf8', function (err) {
			     if (err) return console.log(err);
			  });
			});
		});
	});



});	

