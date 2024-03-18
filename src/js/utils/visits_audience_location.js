var attachVisitsAudienceLocationEvents = function(options) {
	
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


  
    data.buyNSWData ? this.graph('NSW', data.buyNSWData, document.getElementById('nswBuyAudienceLocationChart')) : "";
    data.rentNSWData ? this.graph('NSW', data.rentNSWData, document.getElementById('nswRentAudienceLocationChart')) : "";

    data.buyACTData ? this.graph('ACT', data.buyACTData, document.getElementById('actBuyAudienceLocationChart')) : "";
    data.rentACTData ? this.graph('ACT', data.rentACTData, document.getElementById('actRentAudienceLocationChart')) : "";

    data.buyQLDData ? this.graph('QLD', data.buyQLDData, document.getElementById('qldBuyAudienceLocationChart')) : "";
    data.rentQLDData ? this.graph('QLD', data.rentQLDData, document.getElementById('qldRentAudienceLocationChart')) : "";

    data.buySAData ? this.graph('SA', data.buySAData, document.getElementById('saBuyAudienceLocationChart')) : "";
    data.rentSAData ? this.graph('SA', data.rentSAData, document.getElementById('saRentAudienceLocationChart')) : "";

    data.buyTASData ? this.graph('TAS', data.buyTASData, document.getElementById('tasBuyAudienceLocationChart')) : "";
    data.rentTASData ? this.graph('TAS', data.rentTASData, document.getElementById('tasRentAudienceLocationChart')) : "";

    data.buyVICData ? this.graph('VIC', data.buyVICData, document.getElementById('vicBuyAudienceLocationChart')) : "";
    data.rentVICData ? this.graph('VIC', data.rentVICData, document.getElementById('vicRentAudienceLocationChart')) : "";

    data.buyWAData ? this.graph('WA', data.buyWAData, document.getElementById('waBuyAudienceLocationChart')) : "";
    data.rentWAData ? this.graph('WA', data.rentWAData, document.getElementById('waRentAudienceLocationChart')) : "";

    data.buyNTData ? this.graph('NT', data.buyNTData, document.getElementById('ntBuyAudienceLocationChart')) : "";
    data.rentNTData ? this.graph('NT', data.rentNTData, document.getElementById('ntRentAudienceLocationChart')) : "";
    
	};

  var checkLabels = function(type, data) {    
    var labels = data.labels; 

    var internaltionalDataLength = data.internaltionalData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var waDataLength = data.waData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var ntDataLength = data.ntData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var saDataLength = data.saData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var vicDataLength = data.vicData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var nswDataLength = data.nswData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var qldDataLength = data.qldData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var tasDataLength = data.tasData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;    
    var actDataLength = data.actData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;

    var length = 0;

    length = internaltionalDataLength > length ? internaltionalDataLength : length;
    length = waDataLength > length ? waDataLength : length;
    length = ntDataLength > length ? ntDataLength : length;
    length = saDataLength > length ? saDataLength : length;
    length = vicDataLength > length ? vicDataLength : length;
    length = nswDataLength > length ? nswDataLength : length;
    length = qldDataLength > length ? qldDataLength : length;
    length = tasDataLength > length ? tasDataLength : length;
    length = actDataLength > length ? actDataLength : length;

    if (length < labels.length) {
      return labels.splice(0, length)
    }
    return data.labels     

  }

  this.graph = function(selection, selectionData, $container) {
    var barChartData = {
        labels: checkLabels(selection, selectionData),
        datasets: [{
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 1',
          backgroundColor: '#716E75',
          data: selectionData.internaltionalData.filter(function(item) {
            return parseFloat(item) > 0
          })
        },{
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 2',
          backgroundColor: '#EC4C6A',
          data: selectionData.waData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 3',
          backgroundColor: '#ED711F',
          data: selectionData.ntData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 4',
          backgroundColor: '#0078BD',
          data: selectionData.saData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 5',
          backgroundColor: '#8154AB',
          data: selectionData.vicData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 6',
          backgroundColor: '#E4002B',
          data: selectionData.nswData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 7',
          backgroundColor: '#FFB200',
          data: selectionData.qldData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 8',
          backgroundColor: '#CB5100',
          data: selectionData.tasData.filter(function(item) {
            return parseFloat(item) > 0
          })
        }, {
          type: 'bar',
          barThickness: 55,
          label: 'Dataset 9',
          backgroundColor: '#2D8659',
          data: selectionData.actData.filter(function(item) {
            return parseFloat(item) > 0
          })
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
          scales: {           
            xAxes: [{
              stacked: true,
              gridLines: {
                display: false,
                color: "#2BC5CA"
              },
              ticks: {
                fontSize: 18,
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#2E2C30",
                autoSkip: false,
                fontColor: "#716E75"
              },
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: false,
                display: false,
                fontColor: "#716E75",
                maxRotation: 90,
                minRotation: 90
              },
              gridLines: {
                display: false,
                color: "#2BC5CA"
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

              ctx.font = '12px "museo_sans", Helvetica, Arial, sans-serif';
              
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              ctx.strokeStyle = "rgba(0, 0, 0, 1)"
              ctx.fillStyle = "rgba(0, 0, 0, 1)"

              this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  
                  var data = dataset.data[index];
                  var y;
                  var x = bar._model.x
                  ctx.fillStyle = "#ffffff";                  
                  ctx.font = '12px "museo_sans", Helvetica, Arial, sans-serif';
                  
                  var barHeight = bar._model.y - bar._model.base;
                  y = bar._model.base + barHeight / 2;   

                  if(i == 6) {
                    ctx.fillStyle = "#000000";  
                  }               

                  if(data >= 4) {
                    ctx.fillText(data+"%", x, y+7);
                  }
                 
                });
              });
            }
          },
        }
      });

    
  }

	this.init();
};
