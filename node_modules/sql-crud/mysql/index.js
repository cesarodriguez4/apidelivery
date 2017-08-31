var select = require('./crud/select');
var insert = require('./crud/insert');
var update = require('./crud/update');
var Delete = require('./crud/delete');

module.exports = {
	select,
	insert, 
	update, 
	delete: Delete
};