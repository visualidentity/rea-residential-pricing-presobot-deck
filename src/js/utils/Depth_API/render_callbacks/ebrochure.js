function ebrochureRenderCallback($pageContainer) {
	var renderFunction = this;
  var $elems = $pageContainer.find("[data-m-comparison-new]");
  var $stats = $pageContainer.find(".stat");

  this.renderDataeBrochureData = function(data) {
    console.log('renderDataeBrochureData', data);

    if (data) {
        if(data.items.averageClickThroughRate !== 0) {
          $($elems[0]).find(".comparison-new__stat").attr("data-value", parseFloat(data.items.averageClickThroughRate).toFixed(2)+"%").html(parseFloat(data.items.averageClickThroughRate).toFixed(2)+"%");
        } else {
          $($elems[0]).find(".comparison-new__stat").attr("data-value", data.items.averageClickThroughRate+"%").html(data.items.averageClickThroughRate+"%");
        }        
        $($elems[1]).find(".comparison-new__stat").attr("data-value", data.items.totalEBrochuresSent).html(data.items.totalEBrochuresSent);
        $($elems[2]).find(".comparison-new__stat").attr("data-value", data.items.additionalPropertyPageViews).html(data.items.additionalPropertyPageViews);

    } else {
      renderFunction.renderMissingStats();
    }
  }
  
  this.renderMissingStats = function() {
    $($elems[0]).find(".comparison-new__stat").attr("data-value", 0).html("0");
    $($elems[1]).find(".comparison-new__stat").attr("data-value", 0).html("0");
    $($elems[2]).find(".comparison-new__stat").attr("data-value", 0).html("0");    
  };
}