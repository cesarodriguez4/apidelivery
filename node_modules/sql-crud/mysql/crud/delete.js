
module.exports = function(con, options, async, debug) {

	var Delete = 'DELETE ';
	var from = require('../clauses/from')(options.from);
	var where = require('../clauses/where')(options.where);

	var queryFields = {
		Delete, from, where
	};
	
	function generateQuery(obj) {
		if (options.from && obj.where) {
			return Delete + from + where;
		} else if (options.from) {	
			return Delete + from;
		}
	return "Sorry, the query you're lookig for doesn't been buit yet.";
	}
	if (debug) {
		console.log(generateQuery(queryFields));
	}
	con.query(generateQuery(queryFields), function(error, rows, fields) {
		if (typeof async == 'function') {
			return async(error, rows, fields);
		}
		return;
	});
}