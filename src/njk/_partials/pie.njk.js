{% macro rendered() %}
	$pageContainer.find(".pie-chart-container").html(createPieChart(pieValues, []));
	if (iamIE9 || screenshot) {
		$pageContainer.find(".the-pie.pie-anim").removeClass("pie-anim");
	}
{% endmacro %}

{% macro renderInverseOf(value, target) %}
	console.log("pie values", {{value}}, "{{ target }}");
	var valueObj = {first: {{value}}, other: (100-{{value}})};
	$pageContainer.find("{{target}} .pie-chart-container").html(createPieChart(valueObj, []));
	$pageContainer.find("{{target}} .pie-chart-container .pie-chart").append('<div class="number"><span>0</span>%</div>');
	$pageContainer.find("{{target}} .pie-chart-container .pie-chart .number span").data({value:{{value}}});
	if (iamIE9 || screenshot) {
		$pageContainer.find("{{target}}.the-pie.pie-anim").removeClass("pie-anim");
		$pageContainer.find("{{target}} .pie-chart-container .pie-chart .number span").html("{{value}}");
	} 
{% endmacro %}

{% macro fill_key() %}
	pieValues = _.mapObject(pieValues, function(val, key) {
		$pageContainer.find(".the-pie .keys .key[data-id="+key+"] h3").html(val+"%");
		return parseInt(val);
	});
{% endmacro %}

{% macro ready() %}
	$pageContainer.find(".the-pie.pie-anim").removeClass("pie-anim");
{% endmacro %}


{% macro pie_values() %}
		$pageContainer.find('[data-m-complete]').length;
{% endmacro %}



