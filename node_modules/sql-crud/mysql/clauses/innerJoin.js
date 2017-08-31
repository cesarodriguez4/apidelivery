//INNER JOIN table2 ON table1.column_name = table2.column_name;
module.exports = function(obj) {
	var table = obj.table[0];
	var table2 = obj.table[1];
	var on = obj.on[0] + ' = ' + obj.on[1] + ' ';
	var string = ' INNER JOIN '; 
	if(table) {
		string += table2 + ' ON ';
		string += on;
	return string;
	}
	return new Error("You must provide the fields for inner Join");
}