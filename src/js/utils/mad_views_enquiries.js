var attachMadViewsEnquiriesEvents = function(options) {
	
	var $pageContainer;
  var $selects;
  var $select;
  var __this;
  

  var {
    slide,
    data,
    exclusiveAudienceData
  } = options

  var contextStore = {
    tab: 'NSW'
  }    

  
	this.init = function() {
    $pageContainer = $(options.container);
    $selects = $pageContainer.find('[data-m-select]');
    $select = $selects.find('li[data-value]');
    var state = Bridge.Context.get('select_state' + slide);

    $tabs = $pageContainer.find('[data-m-tabs]');
    $tab = $pageContainer.find('[data-tab]');
    var tabState = Bridge.Context.get('tab_state' + slide);

    // Start tabs or select
    if (state) {		
      $selects.attr('data-selected', state.tab);
      $selects.find("h6.input-label").text($selects.find("li[data-value='"+state.tab+"']").text());
      $('[data-select-item]').hide();

      $('.' + state.tab).show();
    }

    if (tabState) {    
      $tab.removeClass('active');
      $('[data-tab="' + tabState.tab +'"]').addClass('active');
      $('[data-tab-item]').hide();

      $('.' + tabState.tab).show();
    }

		$selects.on('dropdown-value-changed', function (e) {
      Bridge.Event.trigger('select_change--' + slide, {elem: $(this), tab: $(this).attr('data-selected')});
		});

    $tab.on('click', function (e) {
      Bridge.Event.trigger('tab_change--' + slide, {elem: $(this), tab: $(this).attr('data-tab')});
    });

    Bridge.Event.on('select_change--' + slide, function(e) {
      $('[data-select-item]').hide();
      $('.' + e.tab).show();
      Bridge.Context.set('select_state' + slide, e);
    })   

    Bridge.Event.on('tab_change--' + slide, function(e) {
      $tab.removeClass('active');
      $('[data-tab="' + e.tab +'"]').addClass('active');
      $('[data-tab-item]').hide();
      $('.' + e.tab).show();
      Bridge.Context.set('tab_state' + slide, e);
    })
  
    data.buyNSWData ? this.graph('NSW', data.buyNSWData, data.buyNSWData.propertyViewData, data.buyNSWData.enquiriesData, document.getElementById('nswBuyChart'), $("[data-nsw-buy-property-view]"), $("[data-nsw-buy-enquiries]")) : "";
    data.rentNSWData ? this.graph('NSW', data.rentNSWData, data.rentNSWData.propertyViewData, data.rentNSWData.enquiriesData, document.getElementById('nswRentChart'), $("[data-nsw-rent-property-view]"), $("[data-nsw-rent-enquiries]")) : "";

    data.buyACTData ? this.graph('ACT', data.buyACTData, data.buyACTData.propertyViewData, data.buyACTData.enquiriesData, document.getElementById('actBuyChart'), $("[data-act-buy-property-view]"), $("[data-act-buy-enquiries]")) : "";
    data.rentACTData ? this.graph('ACT', data.rentACTData, data.rentACTData.propertyViewData, data.rentACTData.enquiriesData, document.getElementById('actRentChart'), $("[data-act-rent-property-view]"), $("[data-act-rent-enquiries]")) : "";

    data.buyQLDData ? this.graph('QLD', data.buyQLDData, data.buyQLDData.propertyViewData, data.buyQLDData.enquiriesData, document.getElementById('qldBuyChart'), $("[data-qld-buy-property-view]"), $("[data-qld-buy-enquiries]")) : "";
    data.rentQLDData ? this.graph('QLD', data.rentQLDData, data.rentQLDData.propertyViewData, data.rentQLDData.enquiriesData, document.getElementById('qldRentChart'), $("[data-qld-rent-property-view]"), $("[data-qld-rent-enquiries]")) : "";

    data.buySAData ? this.graph('SA', data.buySAData, data.buySAData.propertyViewData, data.buySAData.enquiriesData, document.getElementById('saBuyChart'), $("[data-sa-buy-property-view]"), $("[data-sa-buy-enquiries]")) : "";
    data.rentSAData ? this.graph('SA', data.rentSAData, data.rentSAData.propertyViewData, data.rentSAData.enquiriesData, document.getElementById('saRentChart'), $("[data-sa-rent-property-view]"), $("[data-sa-rent-enquiries]")) : "";

    data.buyTASData ? this.graph('TAS', data.buyTASData, data.buyTASData.propertyViewData, data.buyTASData.enquiriesData, document.getElementById('tasBuyChart'), $("[data-tas-buy-property-view]"), $("[data-tas-buy-enquiries]")) : "";
    data.rentTASData ? this.graph('TAS', data.rentTASData, data.rentTASData.propertyViewData, data.rentTASData.enquiriesData, document.getElementById('tasRentChart'), $("[data-tas-rent-property-view]"), $("[data-tas-rent-enquiries]")) : "";

    data.buyVICData ? this.graph('VIC', data.buyVICData, data.buyVICData.propertyViewData, data.buyVICData.enquiriesData, document.getElementById('vicBuyChart'), $("[data-vic-buy-property-view]"), $("[data-vic-buy-enquiries]")) : "";
    data.rentVICData ? this.graph('VIC', data.rentVICData, data.rentVICData.propertyViewData, data.rentVICData.enquiriesData, document.getElementById('vicRentChart'), $("[data-vic-rent-property-view]"), $("[data-vic-rent-enquiries]")) : "";

    data.buyWAData ? this.graph('WA', data.buyWAData, data.buyWAData.propertyViewData, data.buyWAData.enquiriesData, document.getElementById('waBuyChart'), $("[data-wa-buy-property-view]"), $("[data-wa-buy-enquiries]")) : "";
    data.rentWAData ? this.graph('WA', data.rentWAData, data.rentWAData.propertyViewData, data.rentWAData.enquiriesData, document.getElementById('waRentChart'), $("[data-wa-rent-property-view]"), $("[data-wa-rent-enquiries]")) : "";

    data.buyNTData ? this.graph('NT', data.buyNTData, data.buyNTData.propertyViewData, data.buyNTData.enquiriesData, document.getElementById('ntBuyChart'), $("[data-nt-buy-property-view]"), $("[data-nt-buy-enquiries]")) : "";
    data.rentNTData ? this.graph('NT', data.rentNTData, data.rentNTData.propertyViewData, data.rentNTData.enquiriesData, document.getElementById('ntRentChart'), $("[data-nt-rent-property-view]"), $("[data-nt-rent-enquiries]")) : "";
	};

  var checkLabels = function(type, data) {    
    var labels = data.labels; 
    var propertyViewDataLength = data.propertyViewData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var enquiriesDataLength = data.enquiriesData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var length = 0;
    length = propertyViewDataLength > length ? propertyViewDataLength : length;
    length = enquiriesDataLength > length ? enquiriesDataLength : length;
    if (length < labels.length) {
      return labels.splice(0, length)
    }
    return data.labels     

  }

  var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  this.graph = function(selection, selectionData, propertyViewData, keyEnquiriesData, $container, $yoyPropertyView, $yoyEnquries) {
    var barChartData = {
        labels: checkLabels(selection, selectionData),
        datasets: [{
          type: 'line',
          label: 'Key Enquiries',
          backgroundColor: 'transparent',
          borderColor: '#000000',
          pointBackgroundColor: 'white',
          pointBorderColor: 'black',
          pointBorderWidth: '3',
          pointRadius: 5,
          borderWidth: '3',
          data: keyEnquiriesData.filter(function(item) {
            return parseFloat(item) > 0
          }),
          yAxisID: 'B'
        },{
          type: 'bar',
          barThickness: 38,
          label: 'Property Views',
          backgroundColor: '#E4002B',
          data: propertyViewData.filter(function(item) {
            return parseFloat(item) > 0
          }),
          yAxisID: 'A'
        }]
      };

      var ctx = $container.getContext('2d');
      window.myBar = new Chart(ctx, {
        data: barChartData,
        type: 'bar',
        options: {          
          defaultFontFamily: "'museo_sans', Arial, sans-serif",
          responsive: true,
          maintainAspectRatio: false,
          lineWidth: 2,
          tooltips: {
            mode: 'index',
            intersect: true
          },
          layout: {
            padding: {
                top: 30
            }
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
                color: "#2BC5CA"
              },
              ticks: {
                fontSize: 18,
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#2E2C30",
                autoSkip: false,
                fontColor: "#716E75",
                fontStyle: 'bold',
                maxRotation: 90,
                minRotation: 90
              },
            }], 
            yAxes: [{
              id: 'A',
              scalePositionLeft: true,
              ticks: {
                beginAtZero: true,
                display: false,
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#716E75",
                callback: function(value, index, values) {
                  if (value.toString() === '0') {
                    return '0'
                  } else {
                    return value.toString().slice(0, -6)
                  }
                }
              },
              gridLines: {
                display: false,
                color: "#2BC5CA"
              },
              scaleLabel: {
                display: true,
                labelString: "Property Views (millions)",
                fontSize: 18, 
                fontColor: "#716E75",
                fontFamily: "'museo_sans', Arial, sans-serif",
              }
            }, {
              id: 'B',
              position: 'right',
              scalePositionLeft: false,
              ticks: {
                beginAtZero: true,
                display: false, 
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#716E75", 
                callback: function(value, index, values) {
                  if (value.toString() === '0') {
                    return '0'
                  } else { 
                    console.log(value);
                    return value/1000000
                  }
                }
              }, 
              gridLines: {
                display: false,
                color: "#2BC5CA"
              },
              scaleLabel: {
                display: true,
                labelString: "Enquiries ('000)",
                fontSize: 18, 
                fontColor: "#716E75",
                fontFamily: "'museo_sans', Arial, sans-serif",
              }
            }]
          },
          legend: {
            "display": false,
            "position": 'top'
          },
          tooltips: {
            "enabled": false,
            callbacks: {
              label: function (tooltipItem, data) {
                var tooltipValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return numberWithCommas(tooltipValue);
              }
            }
          },
          "hover": {
            "animationDuration": 0
          },
          "animation": {
            "onComplete": function() {
              $yoyPropertyView.text(selectionData.yoyPropertyView);
              $yoyEnquries.text(selectionData.yoyEnquiries);
            }
          },
        }
      });

    
  }

	this.init();
};
