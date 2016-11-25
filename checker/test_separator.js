var readline = require('linebyline');
var fs = require('fs');

function main()
{
	var args = process.argv.slice(2);
	if( args.length == 0 )
	{
		args = [__dirname + '/../../solar-calc/test/test.js'];
	}
	var filePath = args[0];
	
	TestSeparator(filePath);
}

function TestSeparator(filePath)
{
	var testCaseIterator = 0;
	file = readline(filePath);
	file.on('line', function(line, lineCount, byteCount) {
		// code block before test case
		lineIterator = 0;
		filePreBlock = '';
		testPreBlock = '';
		testBlock = '';
		if (lineIterator < 2) {
			
			if (lineCount < 8) {
				filePreBlock += (line + '\n');
			} else if (line.indexOf('describe')) {
				testPreBlock = ''
				testPreBlock += (line + '\n');
			} else if (!line.indexOf('it') && !line.indexOf('assert')){
				testPreBlock += (line + '\n');
			} else {
				lineIterator += 1;
				testBlock += (line + '\n');
			}
		} else {
			testCaseIterator += 1;
			var fileContent = filePreBlock + testPreBlock + testBlock;
			var filePath = __dirname + '/../../solar-calc/separated_tests/test_' + testCaseIterator;
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