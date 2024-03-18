function amaxRenderCallback($pageContainer) {
	var renderFunction = this;
	var $elems = $pageContainer.find("[data-m-comparision-new]");
	var $stats = $pageContainer.find(".stat");

  this.renderDataAmaxData = function(data) {
    console.log('renderDataAmaxData', data);

    if (data) {

        $($elems[0]).find(".comparision-new__stat").attr("data-value", data.numberOfAudienceMaximiserAllListings).html(data.numberOfAudienceMaximiserAllListings);
        $($elems[1]).find(".comparision-new__stat").attr("data-value", data.totalImpressions).html(data.totalImpressions);
        $($elems[2]).find(".comparision-new__stat").attr("data-value", data.totalClicks).html(data.totalClicks);
        $($elems[3]).find(".comparision-new__stat").attr("data-value", data.averagePropertyPageViews).html(data.averagePropertyPageViews);


        $($elems[4]).find(".comparision-new__chart img").css('opacity', '1').attr({"src" : data.listing.image, "alt": data.listing.addressLineOne+" "+data.listing.addressLineTwo});
        $($elems[4]).find(".comparision-new__chart .addressLineOne").html(data.listing.addressLineOne);
        $($elems[4]).find(".comparision-new__chart .addressLineTwo").html(data.listing.addressLineTwo);
        $($elems[4]).find(".comparision-new__chart .listing-bedroom").html(data.listing.bedrooms);
        $($elems[4]).find(".comparision-new__chart .listing-bathroom").html(data.listing.bathrooms);
        $($elems[4]).find(".comparision-new__chart .listing-carpark").html(data.listing.carspaces);

        $($elems[5]).find(".top-listing-agent img").css('opacity', '1').attr({"src" : data.topAgent.image, "alt": data.topAgent.name});
        $($elems[5]).find(".top-listing-agent p").html(data.topAgent.name);

        var $topList = "";
        $.each(data.topWebsites, function(index, value){
          $topList += "<li>"+value+"</li>";
        });
        $($elems[6]).find(".top-visits ul").html($topList);

    } else {
      renderFunction.renderMissingStats();
    }
  }
  this.renderMissingStats = function() {
    $($elems[0]).find(".comparision-new__stat").attr("data-value", 0).html("0");
    $($elems[1]).find(".comparision-new__stat").attr("data-value", 0).html("0");
    $($elems[2]).find(".comparision-new__stat").attr("data-value", 0).html("0");
    $($elems[3]).find(".comparision-new__stat").attr("data-value", 0).html("0");
    $($elems[4]).find(".comparision-new__chart img").css('opacity', '0')
    $($elems[4]).find(".addressLineOne, .addressLineTwo, .listing-bedroom, .listing-bathroom, .listing-carpark").html("");
    $($elems[5]).find(".top-listing-agent img").css('opacity', '0')
    $($elems[5]).find(".top-listing-agent p").html("");
    $($elems[6]).find(".top-visits ul").html("");
  };
}
