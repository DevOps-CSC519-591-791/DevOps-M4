var project = __dirname + '/../../solar-calc'


var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(project + '/test/test.js')
});

lineReader.on('line', function (line) {
	start = line.indexOf('it(');

	if(start >= 0){
		start += 4
		end = line.substring(start).indexOf('\'');
		console.log(line.substring(start, start+end));
	}
});
