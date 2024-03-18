var attachTopBrandsEvents = function(options) {
	
	var $pageContainer;
  
  var {
    slide,
    data,
    container
  } = options

  var contextStore = {}  

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
    $pageContainer = $(container);
    disclaimers('visits');
    this.graphs();
	};

  this.graphs = function(data) {

    const yAxesLabels = _.sortBy(data.lineGraphDataSet.map(item => {
      return {
        position: item.data.slice(-1)[0],
        label: item.label
      }
    }), (item) => {
      return item.position
    }).reverse();

    const barChart = new Chart(document.getElementById("uniqueAudience"), {
      type: 'horizontalBar',
      data: {
        labels: topDigitalBrandsData.brands.map(item => item.uniqueAudience), //['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          axis: 'y',
          label: null,
          data: topDigitalBrandsData.brands.map(item => item.uniqueAudience), //[65, 59, 80, 81, 56, 55, 40],
          fill: false,
          color: data.lineGraphDataSet.map(item => item.color),
          backgroundColor: data.lineGraphDataSet.map(item => item.borderColor),
          borderWidth: 0
        }]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,   
        defaultFontFamily: "'museo_sans', Arial, sans-serif",
        maintainAspectRatio: false,
        layout: {
          width: 360,
          height: 225,
          padding: {
            top: 20,
            right: 60
          },
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              color: "#D0D0D0"
            },
            ticks: {
              display: false //this will remove only the label
            }
          }],
          yAxes: [{
            gridLines: {
              display: false,
              color: "#D0D0D0"
            },
            ticks: {
              display: false //this will remove only the label
            },
            position: 'right',
          }]
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
                var x = x = bar._model.x + 60;
                
                ctx.fillStyle = "#5C6069";      
                ctx.font = '18px "museo_sans", Helvetica, Arial, sans-serif';
                y = bar._model.y + 9

                ctx.fillText(data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), x, y);
                
              });
            });
          }
        }
      }
    })

    const lineChart = new Chart(document.getElementById("topChart"), {
      type: 'line',
      data: {
        labels: topDigitalBrandsData.dates,
        datasets: data.lineGraphDataSet,
      },
      options: {     
        responsive: true,   
        defaultFontFamily: "'museo_sans', Arial, sans-serif",
        maintainAspectRatio: true,
        lineWidth: 2,
        tooltips: {
          mode: 'index',
          intersect: true
        },
        layout: {
          padding: {
            top: 40
          },
          width: 1250
        },
        scales: {
          bezierCurve: false, 
          xAxes: [{
            gridLines: {
              display: false,
              color: "#D0D0D0"
            },
            ticks: {
              fontSize: 18,
              fontFamily: "'museo_sans', Arial, sans-serif",
              autoSkip: false,
              padding: 80,
              // fontColor:['rgba(44,44,44,1)','rgba(44,44,44,0.2)','rgba(44,44,44,0.8)','rgba(178,31,31,1)','rgba(44,44,44,0.8)','rgba(44,44,44,0.8)','rgba(44,44,44,0.8)','rgba(44,44,44,0.8)', 'rgba(44,44,44,0.8)', 'rgba(44,44,44,0.8)'],
            },
          }],
          yAxes: [{
            position: 'right',
            ticks: {
              fontSize: 18,
              fontFamily: "'museo_sans', Arial, sans-serif",
              autoSkip: false,
              padding: 80,
              fontColor: data.lineGraphDataSet.map(item => item.color), // refactoredData.lineGraphDataSet.map(i => i.label === 'realestate.com.au' ? '#E4002B' : '#5C6069'),
              callback: function(value, index, ticks) {
                return yAxesLabels[index].label;
              }
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
          }],
        },
        elements: {
          point: {
            radius: 10,
            borderWidth: 20,
            hoverRadius: 10,
            hoverBorderWidth: 20
          },
          line: {
            tension: 0
          }
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
                
                var dataSet = dataset.data[index];
                var y;
                var x = x = bar._model.x;
                
                ctx.fillStyle = "#ffffff";      
                ctx.font = '18px "museo_sans", Helvetica, Arial, sans-serif';
                y = bar._model.y + 9

                ctx.fillText((data.lineGraphDataSet.length + 1) - dataSet, x, y);
                
              });
            });
          }
        },
      }
    });
  }

	this.init();
};
