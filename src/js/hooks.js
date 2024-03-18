define([
	"./hooks/fieldsets.js",
	"./hooks/selections.js",
	"./hooks/selectionRules.js"
],
function (Fieldsets, Selections, SelectionRules) {
	return {
		fieldsets: Fieldsets,
		selections: Selections,
		selectionRules: SelectionRules
	}
});

