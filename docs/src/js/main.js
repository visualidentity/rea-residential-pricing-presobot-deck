$("document").ready(function() {
	$("article").find(".content").addClass("currentpage");
	$(".content_container").find(".section").each(function() {
		var $sectionli = $("<li><a></a><span></span><ul></ul></li>");
		$sectionli.find("a").attr('href', "#" + $(this).attr('id'));
		$sectionli.find("a").html($(this).find('.section_title').html());
		var $list = $sectionli.find("ul");
		$(this).find(".ex").each(function() {
			var $li = $("<li><a></a></li>");
			$li.find("a").attr('href', "#" + $(this).attr('id'));
			$li.find("a").html($(this).find('.example_title').html());
			$list.append($li);
		});
		$(".sidebar > ul").append($sectionli);
	});

	$(".sidebar").on("click", "span", function() {
		var $li = $(this).parent();
		if ($li.hasClass("open")) {
			$li.removeClass("open");
		} else {
			$li.addClass("open");
		}
	})
});
