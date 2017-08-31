
module.exports = function(con, options, async, debug) {
	/*
	@options: 
		-select: 'a, b, c' or [{prop: 'documentos', as: 'd'}]
		-from: string
		-where: object {id: 'id'}
		cond: object {type: 'or', id: 'id'}, 
		group: string, 
		having : object, 
		order: object, 
		limit: object, 
		-innerJoin: object
	*/
	var q = '';
	var select = require('../clauses/select');
	var from = require('../clauses/from');
	var where = require('../clauses/where');
	var innerJoin  = require('../clauses/innerJoin');

	var _select = select(options.select);
	var _from = from(options.from);
	var _where = where(options.where);
	
	var _innerJoin = false;
	if (options.innerJoin) {
	innerJoin = innerJoin(options.innerJoin);	
	}
	

	var queryFields = {
		_select, 
		_from, 
		_where, 
		_innerJoin
	};

	function generateQuery(obj) {
		if (obj._select && obj._from && obj._innerJoin && obj._where) {
			return obj._select + obj._from + obj._innerJoin + obj._where;
		} else if (obj._select && obj._from && obj._innerJoin) {	
			return obj._select + obj._from + obj._innerJoin;
		} else if (obj._select && obj._from && obj._where) {
			return obj._select + obj._from + obj._where;
		} else if (obj._select && obj._from) {
			return obj._select + obj._from;
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