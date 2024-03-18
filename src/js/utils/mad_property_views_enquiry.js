var attachPropertyViewsEnquiryEvents = function(options) {
	
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
    tab: 'Buy'
  }    

  var growthUpdate = function(tab) {
    var $growthValue = $pageContainer.find("[data-yoy-growth]");
    var $growthTime = $pageContainer.find("[data-yoy-time]");    
   
    if (tab === 'Buy') { 
      $growthValue.html(data.buyData.yoyValue.indexOf("-") ? data.buyData.yoyValue+" higher" : data.buyData.yoyValue+" lower"); 
      $growthTime.html(data.buyData.yoyTime);
    } else if (tab === 'Rent') {
      $growthValue.html(data.rentData.yoyValue.indexOf("-") ? data.rentData.yoyValue+" higher" : data.rentData.yoyValue+" lower");
      $growthTime.html(data.rentData.yoyTime);
    } else if (tab === 'Sold') {
      $growthValue.html(data.soldData.yoyValue.indexOf("-") ? data.soldData.yoyValue+" higher" : data.soldData.yoyValue+" lower");
      $growthTime.html(data.soldData.yoyTime);
    } else {
      $growthValue.html(data.developerData.yoyValue.indexOf("-") ? data.developerData.yoyValue+" higher" : data.developerData.yoyValue+" lower");
      $growthTime.html(data.developerData.yoyTime);
    }
    
  }

	this.init = function() {
    $pageContainer = $(options.container);
    $selects = $pageContainer.find('[data-m-select]');
    $select = $selects.find('li[data-value]');
    var state = Bridge.Context.get('tab_state' + slide);

    growthUpdate('Buy');

    // Start tabs
    if (state) {		
      $selects.attr('data-selected', state.tab);
      $selects.find("h6.input-label").text($selects.find("li[data-value='"+state.tab+"']").text());
      $('[data-select-item]').hide();
      $('#' + state.tab).show();
      growthUpdate(state.tab);
    }

		$selects.on('dropdown-value-changed', function (e) {
      Bridge.Event.trigger('tab_change--' + slide, {elem: $(this), tab: $(this).attr('data-selected')});
		});

    Bridge.Event.on('tab_change--' + slide, function(e) {
      $('[data-select-item]').hide();
      $('#' + e.tab).show();
      Bridge.Context.set('tab_state' + slide, e);
      growthUpdate(e.tab);
    })   
  
    this.graph('Buy', data.buyData, data.buyData.propertyViewData, data.buyData.keyEnquiriesData, document.getElementById('buyChart'));
    this.graph('Rent', data.rentData, data.rentData.propertyViewData, data.rentData.keyEnquiriesData, document.getElementById('rentChart'));
    this.graph('Sold', data.rentData, data.soldData.propertyViewData, data.soldData.keyEnquiriesData, document.getElementById('soldChart'));
    this.graph('Developer', data.rentData, data.developerData.propertyViewData, data.developerData.keyEnquiriesData, document.getElementById('developerChart'));

	};

  var checkLabels = function(type, data) {    
    var labels = data.labels; 
    var propertyViewDataLength = data.propertyViewData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var keyEnquiriesDataLength = data.keyEnquiriesData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var length = 0;
    length = propertyViewDataLength > length ? propertyViewDataLength : length;
    length = keyEnquiriesDataLength > length ? keyEnquiriesDataLength : length;
    if (length < labels.length) {
      return labels.splice(0, length)
    }
    return data.labels     

  }

  var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  this.graph = function(selection, selectionData, propertyViewData, keyEnquiriesData, $container) {
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
          data: keyEnquiriesData,
          yAxisID: 'B'
        },{
          type: 'bar',
          barThickness: 38,
          label: 'Property Views',
          backgroundColor: '#ffffff',
          data: propertyViewData,
          yAxisID: 'A'
        }]
      };

      var ctx = $container.getContext('2d');
      window.myBar = new Chart(ctx, {
        data: barChartData,
        type: 'bar',
        options: {          
          defaultFontFamily: "'museo_sans', Arial, sans-serif",
          aspectRatio: 2.8,
          lineWidth: 2,
          tooltips: {
            mode: 'index',
            intersect: true
          },
          layout: {
            padding: {
                top: 20
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
                fontColor: "#ffffff",
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
                fontColor: "#ffffff",
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
                fontColor: "#ffffff",
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
                fontColor: "#ffffff", 
                callback: function(value, index, values) {
                  if (value.toString() === '0') {
                    return '0'
                  } else {
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
                fontColor: "#ffffff",
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
              var chartInstance = this.chart,
              ctx = chartInstance.ctx,
              scales = chartInstance.scales; 

              ctx.font = '22px "museo_sans", Helvetica, Arial, sans-serif';
              
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              ctx.strokeStyle = "rgba(0, 0, 0, 1)"
              ctx.fillStyle = "rgba(0, 0, 0, 1)"

              
            }
          },
        }
      });
  }

	this.init();
};
