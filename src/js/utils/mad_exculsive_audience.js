var attachMADExculsiveAudience = function(options) {
	
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
    tab: 'National'
  }  

	this.init = function() {
    $pageContainer = $(options.container);
    $selects = $pageContainer.find('[data-m-select]');
    $select = $selects.find('li[data-value]');

    var state = Bridge.Context.get('tab_state' + slide);

    // Start tabs
    if (state) {		
      $selects.attr('data-selected', state.tab);
      $selects.find("h6.input-label").text($selects.find("li[data-value='"+state.tab+"']").text());
      $('[data-select-item]').hide();
      $('#' + state.tab).show();
    }

		$selects.on('dropdown-value-changed', function (e) {
      Bridge.Event.trigger('tab_change--' + slide, {elem: $(this), tab: $(this).attr('data-selected')});
		});

    Bridge.Event.on('tab_change--' + slide, function(e) {
      $('[data-select-item]').hide();
      $('#' + e.tab).show();
      Bridge.Context.set('tab_state' + slide, e);
    })   
  
    this.graph('National', data.nationalData, data.nationalData.reaData, data.nationalData.domainData, document.getElementById('nationalChart'));
    this.graph('VIC', data.vicData, data.vicData.reaData, data.vicData.domainData, document.getElementById('vicChart'));
    this.graph('NSW', data.nswData, data.nswData.reaData, data.nswData.domainData, document.getElementById('nswChart'));
    this.graph('QLD', data.qldData, data.qldData.reaData, data.qldData.domainData, document.getElementById('qldChart'));
    this.graph('WA', data.waData, data.waData.reaData, data.waData.domainData, document.getElementById('waChart'));
    this.graph('SA', data.saData, data.saData.reaData, data.saData.domainData, document.getElementById('saChart'));
    this.graph('ACT', data.actData, data.actData.reaData, data.actData.domainData, document.getElementById('actChart'));
    this.graph('NT', data.ntData, data.ntData.reaData, data.ntData.domainData, document.getElementById('ntChart'));
    this.graph('TAS', data.tasData, data.tasData.reaData, data.tasData.domainData, document.getElementById('tasChart'));
   

    var $reaEx = $pageContainer.find('[data-comparision-rea]'),
        $domainEx =  $pageContainer.find('[data-comparision-domain]');
     
      $reaEx.text(exclusiveAudienceData.reaExclusively ? exclusiveAudienceData.reaExclusively : '');
      $domainEx.text(exclusiveAudienceData.domainExclusively ? exclusiveAudienceData.domainExclusively : '');

	};

  var checkLabels = function(type, data) {    
    var labels = data.labels;       
    var reaDataLength = data.reaData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var domainDataLength = data.domainData.filter(function(item) {
      return parseFloat(item) > 0
    }).length;
    var length = 0;
    length = reaDataLength > length ? reaDataLength : length;
    length = domainDataLength > length ? domainDataLength : length;
    if (length < labels.length) {
      return labels.splice(0, length)
    }
    return data.labels      

  }

  var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  this.graph = function(state, stateData, reaData, domainData, $container) {
    var barChartData = {
        labels: checkLabels(state, stateData),
        datasets: [{
          type: 'bar',
          barThickness: 30,
          label: 'Dataset 1',
          backgroundColor: '#E4002B',
          data: reaData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        },{
          type: 'bar',
          barThickness: 30,
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
          lineWidth: 0,
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            mode: 'index',
            intersect: true
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                display : false
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
                beginAtZero: true,
                display: false,
                fontColor: "#2E2C30",
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                display : false
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
                  var x = x = bar._model.x
                  ctx.fillStyle = "#000000";                  
                  ctx.font = '18px "museo_sans", Helvetica, Arial, sans-serif';
                  y = scales['y-axis-0'].bottom - 40    
                  ctx.save();
                  ctx.translate(x, y)
                  ctx.rotate(-Math.PI / 2);
                  ctx.fillText(numberWithCommas(data), 12, 9);
                  ctx.restore();
                 
                });
              });
            }
          },
        }
      });
  }

	this.init();
};
