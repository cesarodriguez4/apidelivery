module.exports = function(object) {
	var props = Object.keys(object);
	var response = ' (';
	for ( i = 0; i<props.length; i++ ) {
		if(i !== props.length - 1) {
			response +='`';
			response += props[i];
			response +='`';
			response += ',';
		} else {
			response +='`';
			response += props[i];
			response +='`';
		}
	}
	response  += ') ';
	return response;
}