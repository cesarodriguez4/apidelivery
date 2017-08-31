module.exports = function(object) {
	var props = Object.keys(object);
	var str = '';
	str += ' VALUES (';
	for ( i = 0 ; i < props.length; i ++ ) {
		if(i !== props.length - 1) {
			str+= "'"+object[props[i]]+"'";
			str+= ',';
		} else {
			str+= "'"+object[props[i]]+"'";
		}
	}
	str+= ') ';
	return str;
}