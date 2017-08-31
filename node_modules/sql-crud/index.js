const mysql = require('./mysql');

module.exports = function (obj) {
	var res;
	if (typeof obj === 'object') {
		if (obj.mode == 'mysql') {
			return res = mysql;
		} 
	} else if (typeof obj === 'string') {
		if (obj === 'mysql') {
			return res = mysql;
		}
	} 
	if (!res) {
		console.log(new Error("No database selected"));
	}
}

