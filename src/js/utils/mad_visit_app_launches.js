var attachVisitsAppLaunchesEvents = function(options) {
	
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
    tab: 'visits'
  }  

  var disclaimers = function(tab) {
    var $disclaimers = $pageContainer.find("[data-footer-disclaimer-copy]");
    var disclaimerCopy;
    if (tab === 'visits') {
      disclaimerCopy = data.visitsData.disclaimer
    } else {
      disclaimerCopy = data.appLaunchesData.disclaimer
    }
    if (disclaimerCopy) { 
      $disclaimers.html(disclaimerCopy.replace('SOURCE:', ''))
    }
  }

	this.init = function() {
    $pageContainer = $(options.container);
    $selects = $pageContainer.find('[data-m-select]');
    $select = $selects.find('li[data-value]');
    disclaimers('visits');
    var state = Bridge.Context.get('tab_state' + slide);

    // Start tabs
    if (state) {		
      $selects.attr('data-selected', state.tab);
      $selects.find("h6.input-label").text($selects.find("li[data-value='"+state.tab+"']").text());
      $('[data-select-item]').hide();
      $('#' + state.tab).show();
      disclaimers(state.tab);
    }

		$selects.on('dropdown-value-changed', function (e) {
      Bridge.Event.trigger('tab_change--' + slide, {elem: $(this), tab: $(this).attr('data-selected')});
		});

    Bridge.Event.on('tab_change--' + slide, function(e) {
      $('[data-select-item]').hide();
      $('#' + e.tab).show();
      Bridge.Context.set('tab_state' + slide, e);
      disclaimers(e.tab);
    })   
  
    this.graph('visits', data.visitsData, data.visitsData.reaData, data.visitsData.domainData, data.visitsData.multiplierData, document.getElementById('visitsChart'));
    this.graph('appLaunches', data.appLaunchesData, data.appLaunchesData.reaData, data.appLaunchesData.domainData, data.appLaunchesData.multiplierData, document.getElementById('appLaunchesChart'));    

	};

  var checkLabels = function(type, data) {    
    var labels = data.labels;     
    var multiplierDataLength = data.multiplierData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;  
    var reaDataLength = data.reaData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var domainDataLength = data.domainData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var length = 0;
    length = multiplierDataLength > length ? multiplierDataLength : length;
    length = reaDataLength > length ? reaDataLength : length;
    length = domainDataLength > length ? domainDataLength : length;
    if (length < labels.length) {
      return labels.splice(0, length)
    }
    return data.labels      

  }

  this.graph = function(selection, selectionData, reaData, domainData, multiplierData, $container) {
    var barChartData = {
        labels: checkLabels(selection, selectionData),
        datasets: [{
          type: 'line',
          label: 'Multiplier',
          backgroundColor: 'transparent',
          borderColor: '#333F48',
          pointBackgroundColor: '#333F48',
          pointBorderColor: '#333F48',
          pointBorderWidth: '10',
          borderWidth: '4',
          data: multiplierData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }, {
          type: 'bar',
          barThickness: 38,
          label: 'Dataset 1',
          backgroundColor: '#E4002B',
          data: reaData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        },{
          type: 'bar',
          barThickness: 38,
          label: 'Dataset 2',
          backgroundColor: '#37BC72',
          data: domainData.filter(function(item) {
            return parseFloat(item) > 0
          }),
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
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                color: "#D0D0D0"
              },
              ticks: {
                fontSize: 18,
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#2E2C30",
                autoSkip: false
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero: false,
                display: false,
                fontColor: "#2E2C30",
              },
              gridLines: {
                color: "transparent"
              },
              scaleLabel: {
                display: true,
                labelString: '',
                fontSize: 18, 
                fontFamily: "'museo_sans', Arial, sans-serif",
              }
            }]
          },
          legend: {
            "display": false,
            "position": 'top'
          },
          tooltips: {
            "enabled": false
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

              this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  
                  var data = dataset.data[index];
                  var y;
                  var x = x = bar._model.x;
                  
                  if (i === 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.font = 'bold 18px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y - 10
                  } else {
                    ctx.fillStyle = "#000000";      
                    ctx.font = '18px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y - 10  
                  }

                  ctx.fillText(data, x, y);
                 
                });
              });
            }
          },
        }
      });
  }

	this.init();
};
