// To be replaced when Underscore's chunk function is available

function chunkArray(array, chunk) {
	var i,j;
	var temparray = [];
	for (i=0,j=array.length; i<j; i+=chunk) {
		temparray.push(array.slice(i,i+chunk));
	}
	return temparray
}
