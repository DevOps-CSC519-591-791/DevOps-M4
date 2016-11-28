var readline = require('linebyline');
var fs = require('fs');
var S = require('string');

function main()
{
	var args = process.argv.slice(2);
	if( args.length == 0 )
	{
		// default test file
		args = [__dirname + '/../../solar-calc/test/test.js'];
	}
	var filePath = args[0];
	TestSeparator(filePath);
}

function TestSeparator(filePath)
{
	var testCaseIterator = 0;
	// code block before test case
	var lineIterator = 0;
	var filePreBlock = '';
	var testPreBlock = '';
	var testBlock = '';

	file = readline(filePath);
	file.on('line', function(line, lineCount, byteCount) {
		// each test case has 3 line
		// first 2 line has different content
		// last line is just curly brace
		if (lineIterator < 2) {
			if (lineCount < 8) {
				// if line number < 8, directly adding into fileProBlock
				filePreBlock += (line + '\n');
			} else if (line.indexOf('describe') > 0) {
				// if line number > 8, and this line including 'describe'
				// empty the variable and add it into testPreBlock 
				testPreBlock = ''
				testPreBlock += (line + '\n');
			} else if (line.indexOf('it') == -1 && line.indexOf('assert') == -1){
				// if line number > 8, and this line not including 'describe'/'it'/'assert'
				// if this line is not empty, add it into test PreBlock
				if(!S(line).isEmpty()) { testPreBlock += (line + '\n'); }
			} else {
				// if line number > 8, and this line not including 'describe'
				// but this line include 'it' or'assert'
				// if this line is not empty, add it into test testBlock
				lineIterator += 1;
				if(!S(line).isEmpty()) { testBlock += (line + '\n'); }
			}
		} else {
			testCaseIterator += 1;
			// concatenate all blocks
			var fileContent = filePreBlock + testPreBlock + testBlock;
			// add ending curly braces
			fileContent += '    });\n'
			fileContent += '  });\n'
			fileContent += '});\n'

			// write content into file
			var filePath = __dirname + '/../../solar-calc/separated_tests/test_' + testCaseIterator + '.rb';
			fs.writeFile(filePath, fileContent, function(err) {
				if (err) { throw err }
			});

			// reset temp variables
			lineIterator = 0;
			testBlock = '';
		}
	}).on('error', function(e) {
		throw e;
	});
}

main();