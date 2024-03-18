function rankAgainstCompetitorsFY24RenderCallback($pageContainer) {
	var renderFunction = this;
	this.renderData = function(data) {
		console.log('data test: ', data);

		if (data.items) {
			const { items, monthFrom, monthTo, yearFrom, yearTo } = data;
			const [{ years }] = items;
			const [{ youVsMarket }] = years;
			const [{ ranking }] = youVsMarket;
			const { agencyRank, top5, otherList, pieChart } = ranking;

			$('.agency-rank .agency-rank__value', $pageContainer).html(agencyRank);
			$('[data-sourceDateRange]', $pageContainer).html(`${monthFrom} ${yearFrom} - ${monthTo} ${yearTo}`);

			var tableRowsHtml = [...top5, ...otherList].map(({ agencyName, agencyRank, numberListings }) => `
				<div class="table-row">
					<div class="table-data">${agencyRank}</div>
					<div class="table-data">${agencyName}</div>
					<div class="table-data">${numberListings}</div>
				</div>
			`);

			$('[data-table-data-listings]', $pageContainer).html('Listings');
			$('.table .table-body', $pageContainer).html(tableRowsHtml);
			

			renderFunction.renderPieChart({
				data: pieChart
			});
		} else if (data.topAgencies) {
			$('.agency-rank .agency-rank__value', $pageContainer).html(data.agencyRank);
			$('[data-sourceDateRange]', $pageContainer).html(`${data.monthFrom} ${data.yearFrom} - ${data.monthTo} ${data.yearTo}`);

			var tableRowsHtml = data.topAgencies.map((item) => `
				<div class="table-row">
					<div class="table-data">${item.rank}</div>
					<div class="table-data">${item.agency}</div>
					<div class="table-data">${item.leads}</div>
				</div>
			`);

			var pieChart = data.topAgencies.splice(0, 5).reduce((res, item) => {
				res.push({agencyName: item.agency, percent: item.leads});
				return res;
			}, []);

			var otherTotal = data.topAgencies.splice(5).reduce((pv, cv)=>{
				return pv + (parseFloat(cv.leads)||0);
		 	}, 0);

			 pieChart[5] = {agencyName: 'Other', percent: otherTotal};

			$('[data-table-data-listings]', $pageContainer).html('Leads');
			$('.table .table-body', $pageContainer).html(tableRowsHtml);

			console.log('pieChart', pieChart);

			renderFunction.renderPieChart({
				data: pieChart
			});
		}
	};

	this.renderMissingStats = function(){}

	this.renderPieChart = function({
		pieChartElementId = "chartdiv",
		data = []
	}){
		am4core.useTheme(am4themes_animated);

		var pieChartColors = [am4core.color("#139BE9"), am4core.color("#8154AB"), am4core.color("#2BC5CA"), am4core.color("#F2636F"), am4core.color("#F3D371"), am4core.color("#BEBEBE")]

		// Create chart instance
		let chart = am4core.create(pieChartElementId, am4charts.PieChart);

		// Add data
		chart.data = data.map((properties, idx) => ({
			...properties,
			color: pieChartColors[idx]
		}));

		// Add and configure Series
		let pieSeries = chart.series.push(new am4charts.PieSeries());

		pieSeries.hiddenState.properties.endAngle = -90;
		
		chart.innerRadius = am4core.percent(50);
		chart.seriesContainer.align = "right";
		chart.seriesContainer.dx = -50;
		chart.seriesContainer.dy = 0;
		chart.seriesContainer.minWidth = 374;
		chart.seriesContainer.minHeight = 374;

		pieSeries.dataFields.value = "percent";
		pieSeries.dataFields.category = "agencyName";

		pieSeries.slices.template.propertyFields.fill = "color";

		pieSeries.labels.template.disabled = true;
		pieSeries.ticks.template.disabled = true;

		chart.legend = new am4charts.Legend();

		chart.legend.valueLabels.template.disabled = true;
		chart.legend.contentAlign = "left";
		console.log('chart: ', chart);
	}
}