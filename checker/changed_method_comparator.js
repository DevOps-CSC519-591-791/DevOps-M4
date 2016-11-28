var fs = require("fs");
var testCoveredMethods = fs.readFileSync(__dirname + '/../results/test_covered_methods.json') <---- have problem!!
var iterator = 0
var fileName = ''

fs.readFile(__dirname + '/../results/commit_changed_method', 'utf8', function (err,data) {
	if (err) {  throw err; }
	var methodArr = data.split(",");
	methodArr.forEach(function(methodName) {
		// the first 'methodName' is actually fileName
		if(iterator == 0){
			fileName = methodName.substring(4, methodName.len);
		} else {
			console.log(testCoveredMethods[fileName][methodName]);
		}
		iterator += 1;
	});
});