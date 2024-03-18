var viewsPerListingEvents = function(options) {  
  var {
    figure,
    figure2,
    data,
    data2
  } = options

	this.init = function() {  
    this.valueGraph(data, document.getElementById(figure));
    this.percentageGraph(data2, document.getElementById(figure2));
    console.log('test: ', figure);
	};

  this.valueGraph = function(data, $container) {
    var barChartData = {
      labels: data.state,
      datasets: [{
        type: 'horizontalBar',
        label: 'Dataset 1',
        backgroundColor: ["#2E2C30", "#E4002B", "#E4002B", "#E4002B", "#E4002B", "#E4002B", "#E4002B", "#E4002B", "#E4002B"],
        data: data.views
      }]
    };

    var ctx = $container.getContext('2d');
    window.myBar = new Chart(ctx, {
      data: barChartData,
      type: 'horizontalBar',
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            barPercentage: 0.5,
            barThickness: 40,
            ticks: {
              beginAtZero: true,
              fontSize: 12,
              fontFamily: '"REAPangea", Helvetica, Arial, sans-serif',
              fontStyle: 100,
              fontColor: "#716E75"
            },
            gridLines: {
              display:false
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              display:false
            },
            ticks: {
              fontSize: 22,
              fontFamily: '"REAPangea", Helvetica, Arial, sans-serif',
              fontStyle: 100,
              fontColor: "#2E2C30",
              backdropColor: "#000000"
            }
          }]
        },
        plugins: {
          datalabels: {
            align: 'end',
            anchor: 'end',        
            backgroundColor: function(context) {
              return context.dataset.backgroundColor;
            },
            borderRadius: 4,
            color: 'white',
            formatter: Math.round
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {enabled: false},
        hover: {mode: null},
        animation: {
          onProgress: function() {
            var chartInstance = this.chart;
            ctx = chartInstance.ctx;
            
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                
                var data = dataset.data[index];
                var y, x;
                
                ctx.fillStyle = "#2E2C30";
                ctx.font = '100 18px "REAPangea", Helvetica, Arial, sans-serif';
                x = bar._model.x + 5;
                y = bar._model.y - 8;

                ctx.fillText(data.toLocaleString(), x, y);
              });
            });
          }
        }
      }
    });
  };

  this.percentageGraph = function(data, $container) {
    var barChartData = {
      labels: data.state,
      datasets: [{
        type: 'horizontalBar',
        label: 'Dataset 1',
        backgroundColor: ["#2E2C30", "#055FB4", "#055FB4", "#055FB4", "#055FB4", "#055FB4", "#055FB4", "#055FB4", "#055FB4"], 
        data: data.views
      }]
    };

    var ctx = $container.getContext('2d');
    window.myBar = new Chart(ctx, {
      data: barChartData,
      type: 'horizontalBar',
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            barPercentage: 0.5,
            barThickness: 40,
            ticks: {
              beginAtZero: true,
              stepSize: 15,
              fontSize: 12,
              fontFamily: '"REAPangea", Helvetica, Arial, sans-serif',
              fontStyle: 100,
              fontColor: "#716E75",
              callback: function (value) {
                return (value).toFixed(0) + '%';
              }
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              display: false
            },
            ticks: {
              fontSize: 22,
              fontFamily: '"REAPangea", Helvetica, Arial, sans-serif',
              fontStyle: 100,
              fontColor: "#2E2C30"
            }
          }]
        },
        plugins: {
          datalabels: {
            align: 'end',
            anchor: 'end',        
            backgroundColor: function(context) {
              return context.dataset.backgroundColor;
            },
            borderRadius: 4,
            color: 'white',
            formatter: Math.round
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {enabled: false},
        hover: {mode: null},
        animation: {
          onProgress: function() {
            var chartInstance = this.chart;
            ctx = chartInstance.ctx;
            
            ctx.textBaseline = 'top';

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                
                var data = dataset.data[index];
                var y, x;
                
                ctx.fillStyle = "#2E2C30";
                ctx.font = '100 18px "REAPangea", Helvetica, Arial, sans-serif';
                // x = data > 0 ? bar._model.x :  bar._model.x - 50;

                if (data > 0) {
                  x = bar._model.x + 5;
                  ctx.textAlign = 'left';
                } else {
                  x = bar._model.x - 5;
                  ctx.textAlign = 'right';
                }

                y = bar._model.y - 8;

                ctx.fillText(data + '%', x, y);
              });
            });
          }
        }
      }
    });
  };

	this.init();
};
