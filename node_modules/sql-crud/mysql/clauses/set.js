module.exports = function(obj) {
	var set = '';
	var props = Object.keys(obj);
	set += ' SET ';
	for ( i = 0 ; i < props.length; i ++ ) {
		if(i !== props.length - 1) {
			set+= "`" + props[i] + "`" + " = '"+obj[props[i]]+"'";
			set+= ',';
		} else {
			set+= "`" + props[i] + "`" + " = '"+obj[props[i]]+"' ";
		}
	}
	return set;
}