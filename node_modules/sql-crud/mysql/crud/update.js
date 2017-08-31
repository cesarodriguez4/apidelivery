module.exports = function (con, obj, async, logs) {
	/*
	@options: 
		update, 
		set, 
		where, 
		orderBy,
		limit 
*/	
	var query = ''; 
	var table = obj.table;
	var update = 'UPDATE `'+table+'` ';
	var set = require('../clauses/set')(obj.values);
	var where = require('../clauses/where')(obj.where);

	if (obj.where) {
		query =  update + set + where;
	} else {
		query =  update + set;
	}
	
	if (logs) {
		console.log(query);
	}

	con.query(query, function(error, row, fields) {
		if (async) {
			async(error, row, fields);
		}
	});
}
