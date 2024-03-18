	function BarGraph() {
		return {

		expandSettings: function(dataset, passedSettings) {
			this.settings = _.clone(passedSettings);

			if (!this.settings.axis.ticks && this.settings.axis.useDefaultTicks) this.settings.axis.ticks = this.defaultTicks;

			if (passedSettings.axis.max == 'auto') {
				var maxRaw = this.findMax(dataset);
				if (this.settings.axis.options) {
					// find a matching set of options
					var found = false;
					for (var whichOpt = 0; whichOpt < this.settings.axis.options.length && !found; whichOpt++) {
						var option = this.settings.axis.options[whichOpt];
						if (option.max >= maxRaw && option.min <= maxRaw ) {
							if (option.step) this.settings.axis.step = option.step;
							if (option.unitSuffix) this.settings.axis.unitSuffix = option.unitSuffix;
							if (option.tickDivider) this.settings.axis.tickDivider = option.tickDivider;
							if (option.autoPadding) this.settings.axis.autoPadding = option.autoPadding;
							found = true;
						}
					}
					if (!found) {
						// default to last range
						if (option.step) this.settings.axis.step = option.step;
						if (option.unitSuffix) this.settings.axis.unitSuffix = option.unitSuffix;
						if (option.tickDivider) this.settings.axis.tickDivider = option.tickDivider;
						if (option.autoPadding) this.settings.axis.autoPadding = option.autoPadding;
					}
				}

				this.settings.axis.autoPadding = this.settings.axis.autoPadding || 1;
				var max = maxRaw * this.settings.axis.autoPadding;
				var stepCount = Math.floor(max/passedSettings.axis.step);

				this.settings.axis.max =  passedSettings.axis.step * (stepCount+1);

			}

			this.settings.trailingSpace = this.settings.trailingSpace || 0;
			this.settings.openingSpace = this.settings.openingSpace || 0;
			this.settings.graphValuesRange = this.settings.axis.max - this.settings.axis.min;
			this.settings.isVertical = this.settings.orientation == 'vertical';
			this.settings.cssSizeTarget = this.settings.isVertical ? 'height' : 'width';
			this.settings.cssLocationTarget = this.settings.isVertical ? 'top' : null;
			this.settings.cssTickLocationTarget = this.settings.isVertical ? 'top' : 'left';
			// zero margins from geometry			
			if (this.settings.isVertical) {
				this.settings.lhsAxisMargin = this.settings.valuesAxis ? this.settings.lhsAxisMargin : 0;
				this.settings.bottomAxisMargin = this.settings.seriesAxis ? this.settings.bottomAxisMargin : 0;
			} else {
				this.settings.lhsAxisMargin = this.settings.seriesAxis ? this.settings.lhsAxisMargin : 0;
				this.settings.bottomAxisMargin = this.settings.valuesAxis ? this.settings.bottomAxisMargin : 0;
			}
		},


		defaultColorOrder: ['chosen-01','chosen-02','chosen-03','chosen-04','chosen-05','chosen-06','chosen-07','chosen-08'],

		defaultTicks: [
			{
				min: 0,
				max: 1000, 
				tickDivider: 1,
				unitSuffix: '',
			},
			{
				min: 1001,
				max: 999999, 
				tickDivider: 1000,
				unitSuffix: 'K',
			},
			{
				min: 1000000,
				max: 1000000000,
				tickDivider: 1000000,
				unitSuffix: 'M',
			},
		],

		createDefaultColorMap: function(labels) {
			var map = {};
			for (var whichL = 0; whichL < labels.length; whichL++) {
				var labelIndex = this.settings.isVertical && this.settings.graphType == "stacked" ? labels.length - whichL - 1 : whichL;
				map[labels[whichL]] = this.defaultColorOrder[labelIndex % this.defaultColorOrder.length];
			}
			return map;
		},
		

		setupInnerDivs: function($wrapperDiv) {
			//$wrapperDiv.children().remove();
			console.log('setupInnerDivs', $wrapperDiv.width(), $wrapperDiv.height());
			this.$targetDiv = $("<div/>")
				.addClass("inner")
				.width($wrapperDiv.width()- this.settings.lhsAxisMargin)
				.height($wrapperDiv.height()- this.settings.bottomAxisMargin)
				.css('left', this.settings.lhsAxisMargin);

			$wrapperDiv.append(this.$targetDiv);
			$wrapperDiv.addClass("graph");

			if (this.settings.lhsAxisMargin) {
				this.$axesYDiv = $('<div class="axisY" />')
					.width(this.settings.lhsAxisMargin)
					.height(this.$targetDiv.height());
					$wrapperDiv.append(this.$axesYDiv);
			}

			if (this.settings.bottomAxisMargin) {
				this.$axesXDiv = $('<div class="axisX" />')
					.width(this.$targetDiv.width())
					.height(this.settings.bottomAxisMargin)
					.css("left", this.settings.lhsAxisMargin)
					.css("bottom",0);
					$wrapperDiv.append(this.$axesXDiv);
			}
		
		},

		createBarGraph: function (dataset, $wrapperDiv, passedSettings, dataColorMap) {
			this.expandSettings(dataset, passedSettings);
			this.settings.graphType = 'bar';

			this.seriesDivMap = {};
			this.seriesDimensionsMap = {};
			var barSpace = 1 - this.settings.barWidth;

			var values = _.values(dataset);
			var labels = _.keys(dataset);
			var max = _.max(values);

			var totalUnits = values.length + this.settings.trailingSpace + this.settings.openingSpace;

			// set up default colour mappings
			this.dataColorMap = dataColorMap ? dataColorMap : this.createDefaultColorMap(labels);
			//this.dataColorMap = this.createDefaultColorMap(labels);
			//console.log('this.dataColorMap', this.dataColorMap);
			// this creates the innerDivs
			this.setupInnerDivs($wrapperDiv);

			graphTotalDimension = this.settings.isVertical ? this.$targetDiv.width() : this.$targetDiv.height();
			graphAxisDimension = this.settings.isVertical ? this.$targetDiv.height() : this.$targetDiv.width();
			this.settings.singleBarThickness = graphTotalDimension / totalUnits;
		//	console.log('singleBarThickness', this.settings.singleBarThickness);
			//maxBarHeight = graphTotalDimension * (max-this.settings.axis.min) / graphValuesRange;
			
			var $labelTargetDiv = this.settings.isVertical ? this.$axesXDiv : this.$axesYDiv;
			

			var runningPos = this.settings.isVertical ? Math.round((barSpace + this.settings.openingSpace) * this.settings.singleBarThickness) : 0;

			for (var whichBar = 0; whichBar < values.length; whichBar++) {
				var value = this.settings.isVertical ? values[whichBar] : values[values.length - whichBar - 1];
				var label = this.settings.isVertical ? labels[whichBar] : labels[values.length - whichBar - 1];

				var valueScaled = Math.round((value - this.settings.axis.min)/this.settings.graphValuesRange * graphAxisDimension);
				var barPxWidth = Math.round(this.settings.singleBarThickness * this.settings.barWidth);

				var colourId = this.dataColorMap[label];
				/*var barColor = this.colorMap[colourId];
				while (this.colorMap[barColor]) {
					barColor = this.colorMap[barColor];
				}*/

				var heightValue = this.settings.isVertical ? valueScaled : barPxWidth;
				var widthValue = this.settings.isVertical ? barPxWidth : valueScaled;

				// BAR
				var $innerDiv = $('<div/>').addClass('inner-bar')
					.addClass(colourId + "-bg")
					.addClass(this.makeSafeForCSS(label));
				var $barDiv = $('<div/>').addClass('graph-bar').addClass('series-' + whichBar)
					.height(heightValue)
					.width(widthValue)
					.append($innerDiv);
				this.$targetDiv.append($barDiv);
				if (this.settings.isVertical) {
							var topVal = Math.round(graphAxisDimension - valueScaled)
							var leftVal = runningPos;
					// $barDiv.css('top', Math.round(graphAxisDimension - valueScaled))
							// .css('left', runningPos);
					// loz change - for animation
					$barDiv.css('bottom', '0px')
							.css('left', runningPos);
				} else {
					topVal = runningPos;
					leftVal= 0;
					$barDiv.css('top', runningPos);
				}

				this.seriesDivMap[label] = $barDiv;
				this.seriesDimensionsMap[label] = {width: widthValue, height:heightValue, top:topVal, left: leftVal};
				// SERIES LABEL
				if (this.settings.seriesAxis) {
					$labelDiv = $('<div/>').addClass("graph-label graph-label-" + (whichBar+1));
					$labelInner = $("<div class='inner'/>")
						.appendTo($labelDiv)
						.text(label);


					$labelTargetDiv.append($labelDiv);



					if (this.settings.isVertical) {
						$labelDiv.css('left', runningPos)
						.width(widthValue)
						.height(this.settings.bottomAxisMargin);
					} else {
						$labelDiv.css('top', runningPos)
						.height(heightValue)
						.width(this.settings.lhsAxisMargin);
					}

				}

				runningPos = Math.round(runningPos + this.settings.singleBarThickness);
				//console.log(runningPos);

				// values
				if (this.settings.overlayValues) {
					$valuesDiv = $('<div/>').addClass('val').addClass(this.settings.orientation);
					//var valueDim = Math.round(this.settings.values.percentWidth * barPxWidth);
					//$valuesDiv.width(valueDim).height(valueDim);
					if (this.settings.values.startOffset) {
						var endPxOffset = Math.round(barPxWidth * this.settings.values.startOffset);
						var paramToSet = this.settings.orientation == 'vertical' ? 'bottom' : 'left';
					} else {
						endPxOffset = Math.round(barPxWidth * this.settings.values.endOffset);
						var paramToSet = this.settings.orientation == 'vertical' ? 'top' : 'right';

					}
					//var edgeOffset = Math.round((barPxWidth - valueDim) / 2);
					if (this.settings.orientation == 'vertical') {
						$valuesDiv.css(paramToSet, endPxOffset);
				//		$valuesDiv.css('left', edgeOffset);
					}
					if (this.settings.orientation == 'horizontal') {
						$valuesDiv.css(paramToSet, endPxOffset);
						//$valuesDiv.css('top', edgeOffset);
					}


					$inner = $("<div/>").addClass('inner')
					.appendTo($valuesDiv);
					// contents
					if (this.settings.values.template) {
						var compiledTemplate = _.template(this.settings.values.template, null, {variable: 'data'});
						$inner.html(compiledTemplate({label: label, val: value, suffix: this.settings.values.suffix}));
					} else {
						$inner.text(value + this.settings.values.unitSuffix);
					}
					// optional colour
					if (this.settings.values.useBarColour) $inner.addClass(colourId + "-fg");

					$innerDiv.append($valuesDiv);

				}
				// end values
				
			}

			// axes
			if (this.settings.valuesAxis) this.setupValueAxis();
		},

		setupValueAxis: function()

			{


				var $tickTargetDiv = this.settings.isVertical ? this.$axesYDiv : this.$axesXDiv;

				for (var tickValue = this.settings.axis.min; tickValue <= this.settings.axis.max; tickValue += this.settings.axis.step) {
					var percentWidth = (tickValue- this.settings.axis.min)/this.settings.graphValuesRange;
					var tickLocation = Math.round(percentWidth * graphAxisDimension);
					if (this.settings.isVertical) tickLocation = graphAxisDimension - tickLocation;
					var tickText;
					if (tickValue === 0) {
						tickText = tickValue;
					} else if (this.settings.axis.ticks) {
						// multiple values, each with a range
						var matchingTick = _.find(this.settings.axis.ticks, function(tickObject) {return tickObject.min <= tickValue && tickObject.max >= tickValue });
						if (matchingTick) {
							tickText = (matchingTick.tickDivider ? tickValue / matchingTick.tickDivider : tickValue) + matchingTick.unitSuffix;
						} else {
							tickText = '';
						}
					} else {
						// simple, same scale right through
						tickText = tickValue === 0 ? tickValue : (this.settings.axis.tickDivider ? tickValue / this.settings.axis.tickDivider : tickValue)  + this.settings.axis.unitSuffix;
						
					}
					var $tickDiv = $("<div/>").addClass('tick')
					var $tickDivInner = $('<div/>').addClass('inner').html("<p class='xhighlight'>" + tickText + "</p>").appendTo($tickDiv)
					
					$tickDiv.css(this.settings.cssTickLocationTarget, tickLocation);
					
					if (this.settings.isVertical) {
						$tickDiv.width(this.settings.lhsAxisMargin).height(100).css('margin-top', '-50px');
					} else {
					//	$tickDiv.width(50).css('margin-left', '-25px');
					}
					$tickTargetDiv.append($tickDiv);
				}
			},
			// end axes

		createStackedBarGraph: function(dataset, $wrapperDiv, passedSettings, dataColorMap) {
			this.expandSettings(dataset, passedSettings);
			this.settings.graphType = 'stacked';
			
			// match what we make to the dataset
			this.seriesDivMap = {};
			this.seriesDimensionsMap = {};

			var barSpace = 1 - this.settings.barWidth;

			var values = _.values(dataset);
			var labels = _.keys(dataset);
			
			var max = this.findMax(dataset);

			// set up default colour mappings, once per bar
			var firstBarLabels = _.keys(values[0]);
			// this.dataColorMap = dataColorMap ? dataColorMap : this.createDefaultColorMap(firstBarLabels);

			var totalUnits = values.length + this.settings.trailingSpace + this.settings.openingSpace;

			this.setupInnerDivs($wrapperDiv);
			graphTotalDimension = this.settings.isVertical ? this.$targetDiv.width() : this.$targetDiv.height();
			graphAxisDimension = this.settings.isVertical ? this.$targetDiv.height() : this.$targetDiv.width();
			this.settings.singleBarThickness = graphTotalDimension / totalUnits;
//			console.log('singleBarThickness', singleBarThickness);
			//maxBarHeight = graphTotalDimension * (max-this.settings.axis.min) / graphValuesRange;
			//console.log(graphTotalDimension, maxBarHeight);

			$wrapperDiv.append(this.$axesYDiv, this.$axesXDiv);
			var $labelTargetDiv = this.settings.isVertical ? this.$axesXDiv : this.$axesYDiv;
				

			var runningPos = this.settings.isVertical ? Math.round((barSpace + this.settings.openingSpace) * this.settings.singleBarThickness /2) : 0;
			for (var whichBar = 0; whichBar < values.length; whichBar++) {
				console.log("runningPos", runningPos);
				var valuesObject = values[whichBar];
				var thisBarValues = _.values(valuesObject);
				var thisBarLabels = _.keys(valuesObject);
				// rewrite the colour map for each series
				this.dataColorMap = this.createDefaultColorMap(thisBarLabels);
				culmulativeValues = _.reduce(thisBarValues, this.runningTotal, []);
				//console.log(">> culmulativeValues", thisBarValues, culmulativeValues);

				// label here is the whole column label
				var label = labels[whichBar];
				// wrap all the sub bars in a div, for stretching
				var $stackedBarDiv = $("<div/>").addClass('stacked-bar').addClass('stacked-bar-' + (whichBar+1))
						.addClass(this.makeSafeForCSS(label))
						.appendTo(this.$targetDiv);
				// iterate in reverse, to layer up divs correctly
				for (var whichSubBar = thisBarValues.length-1; whichSubBar >= 0 ; whichSubBar--) {
					var nextBarHeight = whichSubBar > 0 ? culmulativeValues[whichSubBar-1] : 0;

					var subLabel = thisBarLabels[whichSubBar];
					var subValue = thisBarValues[whichSubBar];
					var divSizeValue = culmulativeValues[whichSubBar];

					var valueScaled = Math.round((divSizeValue - this.settings.axis.min)/this.settings.graphValuesRange * graphAxisDimension);
					var nextValueScaled = Math.round((nextBarHeight - this.settings.axis.min)/this.settings.graphValuesRange * graphAxisDimension);
					var barPxWidth = this.settings.singleBarThickness * this.settings.barWidth;
					
					
					var colourId = this.dataColorMap[subLabel];

					var heightValue = this.settings.isVertical ? valueScaled : barPxWidth;
					var widthValue = this.settings.isVertical ? barPxWidth : valueScaled;

					// BAR

					var $innerDiv = $('<div/>').addClass('inner-bar')
						.addClass(colourId + "-bg")
						.addClass(this.makeSafeForCSS(subLabel));

						if (this.settings.roundedTop && whichSubBar== thisBarValues.length-1) {
							$innerDiv.css('border-top-left-radius', widthValue/2);
							$innerDiv.css('border-top-right-radius', widthValue/2);
						}
					var $barDiv = $('<div/>').addClass('graph-bar')
						.height(heightValue)
						.width(widthValue)
						.append($innerDiv);
					$stackedBarDiv.append($barDiv);
					if (this.settings.isVertical) {
						var topVal = Math.round(graphAxisDimension - valueScaled)
						var leftVal = runningPos;
						// $barDiv.css('top', graphAxisDimension - valueScaled)
						// 		.css('left', runningPos);

						// Loz change - for animation purposes
						$barDiv.css('bottom', '0px')
								.css('left', runningPos);
					} else {
						topVal = runningPos;
						leftVal = 0;
						$barDiv.css('top', runningPos);

					}
					// attach labels above largest (first) bar
					if (whichSubBar == thisBarValues.length-1) {
						this.seriesDivMap[label] = $barDiv;
						this.seriesDimensionsMap[label] = {width: widthValue, height:heightValue, top:topVal, left: leftVal};
					}

					if (this.settings.overlayValues) {

						var ghostHeightValue = this.settings.isVertical ? (valueScaled-nextValueScaled) : barPxWidth;
						var ghostWidthValue = this.settings.isVertical ? barPxWidth : (valueScaled-nextValueScaled);

						$valuesWrapper = $('<div/>').addClass('ghost')
						.height(ghostHeightValue)
						.width(ghostWidthValue);

						if (this.settings.isVertical) {
								$valuesWrapper
								.css('left', 0);
								//.css('top', graphAxisDimension - nextValueScaled)
						} else {
							$valuesWrapper.css('top', 0).css('left', nextValueScaled);

						}
						$innerDiv.append($valuesWrapper);

						$valuesDiv = $('<div/>').addClass('val');
						var valueDim = Math.round(this.settings.values.percentWidth * barPxWidth);
						//$valuesDiv.width(valueDim).height(valueDim);
						var endPxOffset = barPxWidth * this.settings.values.endOffset;
						var edgeOffset = (barPxWidth - valueDim) / 2;
						if (this.settings.orientation == 'vertical') {
							//$valuesDiv.css('top', endPxOffset);
							//$valuesDiv.css('left', edgeOffset);
						}
						if (this.settings.orientation == 'horizontal') {
							//$valuesDiv.css('right', endPxOffset);
							//$valuesDiv.css('top', edgeOffset);
						}

						$inner = $("<div/>").addClass('inner');

						// contents
						if (this.settings.values.template) {
							var compiledTemplate = _.template(this.settings.values.template, null, {variable: 'data'});
							$inner.html(compiledTemplate({label: subLabel, val: subValue, suffix: this.settings.values.suffix}));
						} else {
							$inner.text(subValue + this.settings.values.unitSuffix);
						}
						// optional colour
						if (this.settings.values.useBarColour) $inner.addClass(colourId + "-fg");

						$inner.appendTo($valuesDiv);
						$valuesWrapper.append($valuesDiv);
					}

				}
				// LABEL

				if (this.settings.seriesAxis) {

					$labelDiv = $('<div/>').addClass("graph-label graph-label-" + (whichBar+1));
					$labelInner = $("<div class='inner'/>")
						.appendTo($labelDiv)
						.html("<p class='xhighlight'>" + label + "</p>");


					if (this.settings.isVertical) {
						$labelDiv.css('left', runningPos + barPxWidth/2)
						// .width(widthValue)
						.height(this.settings.bottomAxisMargin);
					} else {
						$labelDiv.css('top', runningPos)
						.height(heightValue)
						.width(this.settings.lhsAxisMargin);
					}

					$labelTargetDiv.append($labelDiv);
				}

				runningPos += this.settings.singleBarThickness;
				// console.log(runningPos);

				// values
				
				
				// end values
		}

			// axes
			if (this.settings.valuesAxis) this.setupValueAxis();
	},



	generateOverlays: function(labelset, dataset) {
		var overlaySettings = this.settings.seriesOverlays;
		var labelIds = _.keys(labelset);
		var labels = _.values(labelset);
		
		var values = _.values(dataset);
		var allLabels = _.keys(dataset)

		
		for (var whichL = 0; whichL < labels.length; whichL++) {
			var labelId = labelIds[whichL];
			var label = labels[whichL];
			var value = dataset[labelId];
			var whichSeries = allLabels.indexOf(label);
			if (this.settings.graphType == 'stacked') {
				// value is an object of stacked values
				// and colour map is keyed by stack units, not series 
				this.dataColorMap = this.createDefaultColorMap(_.keys(value));
				var labelIndex = (_.size(value)-1);
				
				var labelKeys = _.keys(value);
				var colourId = labelKeys[labelIndex];
			} else {
				//one colour per bar
				var colourId = labelId;
			}

			

			var $seriesLabelDiv = $("<div/>")
				.addClass('series-overlay')
				.addClass('series-overlay-' + (whichL+1))
				.addClass(this.makeSafeForCSS(labelId))
				.appendTo(this.$targetDiv);
			var $barDiv = this.seriesDivMap[labelId];
			var barDims = this.seriesDimensionsMap[labelId];
			var valueTemplate = _.template(label, null, {variable:'data'});
			// a snippet for the template's use, if it wants it
			var dataSnippet = {label: labelId, val: value, suffix: this.settings.values.suffix};
			var $labelDiv = $("<div/>").addClass('box').html(valueTemplate(dataSnippet))
				.addClass(this.dataColorMap[colourId] + "-border");

			var $lineDiv = $("<div/>").addClass('connector')
				.addClass(this.dataColorMap[colourId] + "-border");

			var overlayWidth = Math.round(this.settings.singleBarThickness * overlaySettings.percentWidth); //- parseInt($labelDiv.css('padding')) - parseInt($labelDiv.css('padding'))
			$seriesLabelDiv.append($labelDiv);
			$seriesLabelDiv.append($lineDiv);

			// line it up
			if (this.settings.isVertical) {
				
				// this does not appear to be accurate?
				$labelDiv.width(overlayWidth);
				var resultWidth = $labelDiv.outerWidth();
				$labelDiv.width(Math.round(overlayWidth - (resultWidth - overlayWidth)));

				var overlayHeight = overlaySettings.height == 'auto' ? $labelDiv.outerHeight() : overlaySettings.height;

				if (overlaySettings.height != 'auto') {
					// reset it to futz padding
					$labelDiv.height(overlayHeight);
					var resultHeight = $labelDiv.outerHeight();
					$labelDiv.height(overlayHeight - (resultHeight - overlayHeight));
				}

				//console.log('overlayHeight + overlaySettings.offset', overlayHeight,  overlaySettings.offset)


				var leftPos = Math.round(barDims.left + barDims.width/2);
				
				$labelDiv.css('left', leftPos)
					.css('margin-left', - Math.round(overlayWidth / 2));
				$lineDiv.css('left', leftPos).addClass('top');
				if (overlaySettings.style == 'top-aligned') {
					$labelDiv.css('top', -(overlayHeight + overlaySettings.offset));
					$lineDiv.css('top', -overlaySettings.offset).css('height', barDims.top + overlaySettings.offset)
				} else {
					// offset from bar top
					$labelDiv.css('top', barDims.top - (overlayHeight + overlaySettings.offset));
					$lineDiv.css('top', (barDims.top - overlaySettings.offset)).css('height', barDims.top + overlayHeight + overlaySettings.offset)
					$lineDiv.css('height', overlaySettings.offset);
				}
			} else {

				$labelDiv.height(overlayWidth);
				var resultWidth = $labelDiv.outerHeight();
				$labelDiv.height(overlayWidth - (resultWidth - overlayWidth));

				var overlayHeight = overlaySettings.height == 'auto' ? ($labelDiv.outerWidth()) : overlaySettings.height;
				
				if (overlaySettings.height != 'auto') {
					// reset it to futz padding
					$labelDiv.width(overlayHeight);
					var resultHeight = $labelDiv.outerWidth();
					$labelDiv.width(overlayHeight - (resultHeight - overlayHeight));
				} else {
					$labelDiv.css('width', null);
				}

				var topPos = Math.round(barDims.top + barDims.height/2);
				$labelDiv.css('top', topPos)
					.css('margin-top', - Math.round((overlayWidth) / 2));

				$lineDiv.css('top', topPos).height('2px').addClass('right');
				if (overlaySettings.style == 'top-aligned') {
					$labelDiv.css('right', -(overlayHeight + overlaySettings.offset));
					$lineDiv.css('left', barDims.width).width(this.$targetDiv.width() - barDims.width + overlaySettings.offset)
				} else {
					// offset from bar top
					$labelDiv.css('left', barDims.width + overlaySettings.offset);
					$lineDiv.css('left', barDims.width).css('width', overlaySettings.offset);
					$lineDiv.css('height', overlaySettings.offset);
				}
			}


			
		};
	},


	// list of summed values, for culmulative heights
	// after http://stackoverflow.com/questions/11890897/how-to-obtain-cumulative-sum-array-using-underscore-js
	runningTotal: function (acc, n) {
        var lastNum = acc.length > 0 ? acc[acc.length-1] : 0;
        acc.push(lastNum + n);
        return acc;
    },

    // works with single or multidimension datasets
    findMax: function(dataset) {

		var values = _.values(dataset);
		var labels = _.keys(dataset);
		var max = -1;
		if (_.isObject(values[0])) {
			max = _.max(_.map(dataset, function(list) {
				return _.reduce(_.values(list), function(memo, num){return memo + num; }, 0);
			}
			));
		} else {
			max = _.max(values);
		}
		return max;
    },

    makeSafeForCSS : function(name) {
		var rawClassName = name.replace(/[^a-z0-9]/g, function(s) {
			var c = s.charCodeAt(0);
			if (c == 32 || c == 46) return '-';
			if (c >= 65 && c <= 90) return s.toLowerCase();
			return '';
		});
		if ('0123456789'.indexOf(rawClassName.substr(0,1)) > -1) rawClassName = "c" + rawClassName;
		return rawClassName;
	},
}}



	/** usage
	// collate your data
	var dataset = {'16-24': 27, '25-34': 26, '35-44':16, '45-59':9, '60+' : 3};

	//	var graph = new BarGraph();
	//graph.createBarGraph(dataset, $tDiv, settings);


	OPTIONAL ADD RECTANGULAR LABEL BOXES ABOVE LINES 
	var labels = {
					'25-34': "a snippet of <strong>html</strong> can go here, or even a value: <%=dataset['25-34'] %>",
					'35-44': "or something shorter mebe?"
				}

	graph.generateOverlays(labels,dataset);
*/