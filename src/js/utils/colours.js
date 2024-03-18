//----------------------------------------------------//
// Colour testing ------------------------------------//
//----------------------------------------------------//

// returns "light" or "dark" //

function getContrastYIQ(hexcolour) {
	var hexcolour = hexcolour.substr(1, 7);
	var r = parseInt(hexcolour.substr(0, 2), 16);
	var g = parseInt(hexcolour.substr(2, 2), 16);
	var b = parseInt(hexcolour.substr(4, 2), 16);
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
	return (yiq >= 128) ? 'light' : 'dark';
}

// tests if Agent text colour is dark or light, and applies relevant class
function assetColourTest(testColour) {
	switch (getContrastYIQ(testColour)) {
		case "dark":
			return "dark-background";
			break;
		case "light":
		default:
			return "light-background";
			break;
	}
}
