function audienceSnapshotRenderCallback($pageContainer) {
	// var renderFunction = this;
  this.renderData = function(data) {

		var $elemOne = $pageContainer.find(".vertical-bar__item--one");
		var $elemTwo = $pageContainer.find(".vertical-bar__item--two");
    var $domainTitle = $pageContainer.find("[data-domain-title]");
    var $competitorTitle = $pageContainer.find("[data-competitor-title]");
    var $totalMinutesValue = $pageContainer.find("[data-total-minute]");

    var $updateValue  = $pageContainer.find('.time-stat__value').text().replace("x", "");
    $pageContainer.find('.time-stat__value').text($updateValue);

    var valueOne = 0;
    var valueTwo = 0;
    var domainTitleText;
    var competitorText;

    if (data.state) {
      switch(data.state) {
        case 'ACT':
          domainTitleText = 'allhomes.com.au';
          competitorText = 'allhomes.com.au';
          $pageContainer.find('.slide-header-center__subtitle span.state').html('in the Australian Capital Territory');
          break;
        default:
          domainTitleText = 'Domain';
          competitorText = 'domain.com.au';
          $pageContainer.find('.slide-header-center__subtitle span.state').html('in ' + data.state);
      }
    }

    $domainTitle.text(domainTitleText);
    $competitorTitle.text(competitorText);

    if (data.uaRea) {
      valueOne = parseFloat(data.uaRea.replace(/,/g, ''));
    }
    if(data.state == 'ACT') {
      if (data.uaAllhomes) {
        valueTwo = parseFloat(data.uaAllhomes.replace(/,/g, ''));
      }
    } else {
      if (data.uaDomain) {
        valueTwo = parseFloat(data.uaDomain.replace(/,/g, ''));
      }
    }
    
   

		if (valueOne > valueTwo) {
			$elemTwo.removeClass("full");
			$elemOne.addClass("full");
			var barHeight = (260 * ((valueTwo / valueOne) * 100)) / 100;
			$elemTwo.css("height", barHeight || 0);
		} else if (valueOne == 0 && valueTwo == 0) {
			$elemOne.removeClass("full");
			$elemTwo.removeClass("full");
			$elemOne.css("height", barHeight || 0);
			$elemTwo.css("height", barHeight || 0);
		} else {
			$elemOne.removeClass("full");
			$elemTwo.addClass("full");
			var barHeight = (260 * ((valueOne / valueTwo) * 100)) / 100;
			$elemOne.css("height", barHeight || 0);
		}

    if (data.state) {
      $pageContainer.find('.audience-block__footer span.state').html('for ' + data.state);      
    }

    if (data.uaRea) {
      $pageContainer.find('.vertical-bar__key__item--one .vertical-bar__key__val').html(data.uaRea);
    }

    if(data.state == 'ACT') { 
      if (data.uaAllhomes) {
        $pageContainer.find('.vertical-bar__key__item--two .vertical-bar__key__val').html(data.uaAllhomes);
      }
    } else {
      if (data.uaDomain) {
        $pageContainer.find('.vertical-bar__key__item--two .vertical-bar__key__val').html(data.uaDomain);
      }
    }
    

    if (data.uniqueRea) {
      $pageContainer.find('.icon-stat__value').html(data.uniqueRea);
    }

    if(data.timeOnSiteTotalMins) {
      $pageContainer.find('.time-stat__value').html(data.timeOnSiteTotalMins);
    }
    if (data.timeOnSite) {
      $totalMinutesValue.html(data.timeOnSite+'x');
    }

    $pageContainer.find('.disclaimer-copy').html(_.map(data.disclaimers, function(item) {
      if (item.charAt(item.length-1) != ".") {
        return item + '. ';
      }
      return item;
    }))

  }
}