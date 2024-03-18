function amaxNewRenderCallback($pageContainer) {
	var renderFunction = this;
	var $elems = $pageContainer.find("[data-m-comparison-new]");

  this.renderDataAmaxData = function(data) {
    console.log('renderDataAmaxData', data);

	var dateRange = $('.date-range .input-label', $pageContainer).text();

	$('[data-sourceDate]', $pageContainer).text(dateRange);

    if (data) {
        $($elems[0]).find(".comparison-new__stat").attr("data-value", data.totalImpressions).html(data.totalImpressions);
        $($elems[1]).find(".comparison-new__stat").attr("data-value", data.totalClicks).html(data.totalClicks);

        var $topList = "";
        $.each(data.topWebsites, function(index, value){
			let classes = '';
			if(value === 'facebook'){
				classes = 'facebook'
			} else if(value === 'dailymail.co.uk'){
				classes = 'dailymail'
			} else if(value === 'news.com.au'){
				classes = 'news'
			} else if(value === 'Yahoo*'){
				classes = 'yahoo'
			} else if(value === 'nine.com.au'){
				classes = 'nine'
			} else if(value === 'msn.com'){
				classes = 'msn'
			}
          	$topList += `<li class="${classes}">${value}</li>`;
        });
        $($elems[2]).find(".top-visits ul").html($topList);

    } else {
      renderFunction.renderMissingStats();
    }
  }
  this.renderMissingStats = function() {
    $($elems[0]).find(".comparison-new__stat").attr("data-value", 0).html("0");
    $($elems[1]).find(".comparison-new__stat").attr("data-value", 0).html("0");
    $($elems[2]).find(".top-visits ul").html("");
  };
}
