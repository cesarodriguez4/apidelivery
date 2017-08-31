module.exports = function (con, obj, async, logs) {	
	var query = ''; 
	var insertInto = require('../clauses/insertInto')(obj.insertInto);
	var valuesToInsert = require('../clauses/valuesToInsert')(obj.values);
	var values = require('../clauses/values')(obj.values);

	query =  insertInto + valuesToInsert +  values;

	if (logs) {
		console.log(query);
	}

	con.query(query, function(error, row, fields) {
		if (async) {
			async(error, row, fields);
		}
	});
};
