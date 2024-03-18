var attachDepthAgentsEvents = function($pageContainer, feed, callback) {
	console.log('rendering on ', $pageContainer);
	console.log('using ', feed);

	var subslides = $pageContainer.find(".subslide");
	var topAgents = Bridge.Feed.get(feed).raw();
	var agents = topAgents.items.length > 0 ? topAgents.items[0].years[0].agents : [];
	var $agentDepthContent = $pageContainer.find(".depth-top-agents").html();
	var $slideFooter = $pageContainer.find(".slide-footer");

	if(agents.length == 0) {
		$slideFooter.find(".navbtn").remove();
		$slideFooter.find(".navbtn-target").remove();
	}
	if(subslides.length < 2) {
		$slideFooter.find(".navbtn").remove();
		$slideFooter.find(".navbtn-target").remove();
	}
	for(var i = 0; i < subslides.length; i++) {
		var data = agents.splice(0, 4);
		var agentRankModifier = i;
		$(subslides[i]).append($agentDepthContent);
		callback(subslides[i], data, agentRankModifier);
	}

	$pageContainer.find(".depth-top-agents").remove();
	var disclaimer = _.template("REA Internal Data (<%- from %>-<%- to %>).  Enquiries are a combination of email enquiries, phone reveals and SMS. This information is produced for Customer's internal office use only. It may not be reproduced or communicated externally for any purpose, whether in whole or in part and neither the information, nor any data or conclusions derived from it, may be attributed to realestate.com.au under any circumstances.")
	$pageContainer.find('.disclaimer-copy').html(disclaimer({
		from: topAgents.monthFrom + topAgents.yearFrom,
		to: topAgents.monthTo + topAgents.yearTo,
	}));
}
