// Surface area and diameter calculators
var getDiameter = function(surfaceArea) {
	return Math.sqrt(surfaceArea / Math.PI) * 2;
};
var getSurfaceArea = function(diameter) {
	return Math.pow(diameter / 2, 2) * Math.PI;
};
