

var attachValueEngagedAudienceEvents = function(options) {
	
	var $pageContainer;
  var $selects;
  var $select;
  var __this;
  var $totalChartLabels = document.getElementById('totalChartLabels');

  var {
    slide,
    data
  } = options

  var contextStore = {
    tab: 'unique'
  }

  var disclaimers = function(tab) {
    var $disclaimers = $pageContainer.find("[data-footer-disclaimer-copy]");
    var disclaimerCopy;
    if (tab === 'total') {
      disclaimerCopy = data.totalVisitsData.disclaimer
    } else {
      disclaimerCopy = data.uniqueAudienceData.disclaimer
    }
    if (disclaimerCopy) { 
      $disclaimers.html(disclaimerCopy.replace('SOURCE:', ''))
    }
  }

	this.init = function() {
    $pageContainer = $(options.container);
    $selects = $pageContainer.find('[data-m-select]');
    $select = $selects.find('li[data-value]');
    disclaimers('unique');

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
    // End tabs

    this.graph4();
    this.graph3();
    this.graph2();
    this.graph();

	};

  var checkLabels = function(type, data) {


    if (type === 'unique') {
      var labels = data.uniqueAudienceData.labels;
      var multiplierDataLength = data.uniqueAudienceData.multiplierData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var reaDataLength = data.uniqueAudienceData.reaData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var domainDataLength = data.uniqueAudienceData.domainData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var length = 0;
      length = multiplierDataLength > length ? multiplierDataLength : length;
      length = reaDataLength > length ? reaDataLength : length;
      length = domainDataLength > length ? domainDataLength : length;
      if (length < labels.length) {
        return labels.splice(0, length)
      }
      return data.uniqueAudienceData.labels
    } 

    if (type === 'total') {
      var labels = data.totalVisitsData.labels;

      var reaDataLength = data.totalVisitsData.reaData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var reaDataPerPersonLength = data.totalVisitsData.reaDataPerPerson.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var domainDataLength = data.totalVisitsData.domainData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var domainDataPerPersonLength = data.totalVisitsData.domainDataPerPerson.filter(function(item) {
        return parseFloat(item) > 0
      }).length;


      var length = 0;
      length = reaDataLength > length ? reaDataLength : length;
      length = reaDataPerPersonLength > length ? reaDataPerPersonLength : length;
      length = domainDataLength > length ? domainDataLength : length;
      length = domainDataPerPersonLength > length ? domainDataPerPersonLength : length;

      if (length < labels.length) {
        return labels.splice(0, length)
      }
      return data.totalVisitsData.labels
    }

    if (type === 'engagement') {
      var labels = data.engagementData.labels;
      var multiplierDataLength = data.engagementData.multiplierData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var reaDataLength = data.engagementData.reaData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var domainDataLength = data.engagementData.domainData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var length = 0;
      length = multiplierDataLength > length ? multiplierDataLength : length;
      length = reaDataLength > length ? reaDataLength : length;
      length = domainDataLength > length ? domainDataLength : length;
      if (length < labels.length) {
        return labels.splice(0, length)
      }
      return data.engagementData.labels
    }

    if (type === 'app') {
      var labels = data.appData.labels;
      var multiplierDataLength = data.appData.multiplierData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var reaDataLength = data.appData.reaData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var domainDataLength = data.appData.domainData.filter(function(item) {
        return parseFloat(item) > 0
      }).length;
      var length = 0;
      length = multiplierDataLength > length ? multiplierDataLength : length;
      length = reaDataLength > length ? reaDataLength : length;
      length = domainDataLength > length ? domainDataLength : length;
      if (length < labels.length) {
        return labels.splice(0, length)
      }
      return data.appData.labels
    }

  }

  this.graph = function() {
    var barChartData = {
        labels: checkLabels('unique', data),
        datasets: [{
          type: 'line',
          label: 'Multiplier',
          backgroundColor: 'transparent',
          borderColor: '#333F48',
          pointBackgroundColor: '#333F48',
          pointBorderColor: '#333F48',
          pointBorderWidth: '10',
          borderWidth: '4',
          data: data.uniqueAudienceData.multiplierData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }, {
          type: 'bar',
          barThickness: 22,
          label: 'Dataset 1',
          backgroundColor: '#E4002B',
          data: data.uniqueAudienceData.reaData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        },{
          type: 'bar',
          barThickness: 22,
          label: 'Dataset 2',
          backgroundColor: '#37BC72',
          data: data.uniqueAudienceData.domainData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }]
      };

      var ctx = document.getElementById('uniqueChart').getContext('2d');
      window.myBar = new Chart(ctx, {
        data: barChartData,
        type: 'bar',
        options: {
          defaultFontFamily: "'museo_sans', Arial, sans-serif",
          aspectRatio: 2.8,
          lineWidth: 0,
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
                fontSize: 16,
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
                color: "rgba(0, 0, 0, 0)"
              },
              scaleLabel: {
                display: true,
                labelString: 'Unique Audience (Millions)',
                fontSize: 18,
                fontFamily: "'museo_sans', Arial, sans-serif",
              }
            }]
          },
          legend: {
            "display": false,
            "position": 'bottom'
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
              ctx = chartInstance.ctx;

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
                  if (i === 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y + 35
                  } else {
                    ctx.fillStyle = "#000000";
                    ctx.font = 'bold 22px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y - 10
                  }

                  if (i === 2) {
                    x = bar._model.x + 7
                  }

                  ctx.fillText(data, x, y);
                });
              });
            }
          },
        }
      });
  }

  this.graph2 = function() {

    var barChartData = {
      labels: checkLabels('total', data),
      datasets: [{
        type: 'bar',
        barThickness: 22,
        label: 'Dataset 1',
        backgroundColor: '#E4002B',
        data: data.totalVisitsData.reaData.filter(function(item) {
          return parseFloat(item) > 0
        }),
        yAxisID: 'B'
      },{
        type: 'bar',
        barThickness: 22,
        label: 'Dataset 2',
        backgroundColor: '#37BC72',
        data: data.totalVisitsData.domainData.filter(function(item) {
          return parseFloat(item) > 0
        }),
        yAxisID: 'B'
      },{
        type: 'line',
        label: 'Multiplier',
        backgroundColor: 'transparent',
        borderColor: '#E4002B',
        pointBackgroundColor: '#E4002B',
        pointBorderColor: '#E4002B',
        pointBorderWidth: '0',
        borderWidth: '4',
        borderDash: [10,5],
        data: data.totalVisitsData.reaDataPerPerson.filter(function(item) {
          return parseFloat(item) > 0
        }),
        yAxisID: 'A'
      },{
        type: 'line',
        label: 'Multiplier',
        backgroundColor: 'transparent',
        borderColor: '#37BC72',
        pointBackgroundColor: '#37BC72',
        pointBorderColor: '#37BC72',
        pointBorderWidth: '0',
        borderWidth: '4',
        borderDash: [10,5],
        data: data.totalVisitsData.domainDataPerPerson.filter(function(item) {
          return parseFloat(item) > 0
        }),
        yAxisID: 'A'
      }]
    };

    var showLabel = function({evt, ctx}) {

      var obj = {evt, ctx}

      Bridge.Context.set('label_state' + slide, obj);

      var activePoint = window.myBar2.getElementAtEvent(evt)[0];
      var chartInstance = __this.chart,

      ctx = chartInstance.ctx;
      ctx.font = '22px "museo_sans", Helvetica, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeStyle = "rgba(0, 0, 0, 1)"
      ctx.fillStyle = "rgba(0, 0, 0, 1)"

      var arr = [];
      var heightInst = [];

      __this.data.datasets.forEach(function(dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);

        meta.data.forEach(function(bar, index) {
          var data = dataset.data[index];
          var y;
          var x = x = bar._model.x;
          var height;
          var invertSpan;

          if (i === 0) {
            heightInst.push(dataset.data[index]);
          }

          height = heightInst[index] / 10;

          if ((i === 2) && (height > data)) {
            y = bar._model.y + 120;
            invertSpan = true;
          } else {
            y = bar._model.y + 35;
            invertSpan = false;
          }

          ctx.fillStyle = "#ffffff";
          ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
          // y = bar._model.y + 35;

          if (i > 1 && activePoint && activePoint._index === index) {
            arr.push({
              data, x, y, invertSpan
            })
          }
        });
      });
      Bridge.Event.trigger('master:labelClick', arr);
    }

    Bridge.Event.on('master:labelClick', function(e) {
      $($totalChartLabels).empty();

      e.forEach(function(item) {
        $totalChartLabels.insertAdjacentHTML('beforeend', '<span class="' + ((item.invertSpan === true) && 'inverted-span') + '" style="position: absolute; top: ' + item.y + 'px; left: ' + item.x + 'px;">' + (item.data) + '</span>')
      });
      
    })
    
    // Bridge.Event.trigger('labelClick-' + slide, {evt, this: this, ctx});

    var ctx = document.getElementById('totalChart').getContext('2d');

    window.myBar2 = new Chart(ctx, {
      data: barChartData,
      type: 'bar',
      options: {
        defaultFontFamily: "'museo_sans', Arial, sans-serif",
        aspectRatio: 2.8,
        lineWidth: 0,
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
              fontSize: 16,
              fontFamily: "'museo_sans', Arial, sans-serif",
              fontColor: "#2E2C30",
              autoSkip: false
            },
          }],
          yAxes: [{
            id: 'A',
            scalePositionLeft: true,
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)"
            },
            scaleLabel: {
              display: true,
              labelString: 'Total Visits (Millions)',
              fontSize: 18,
              fontFamily: "'museo_sans', Arial, sans-serif"
            }
          },{
            id: 'B',
            position: 'right',
            scalePositionLeft: false,
            ticks: {
              beginAtZero: true,
              fontColor: "#2E2C30",
              display: false,
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)"
            },
            scaleLabel: {
              display: true,
              labelString: '',
              fontSize: 18,
              fontFamily: "'museo_sans', Arial, sans-serif"
            }
          }]
        },
        legend: {
          "display": false,
          "position": 'bottom'
        },
        tooltips: {
          "enabled": false
        },
        "hover": {
          "animationDuration": 0
        },
        "onHover": function(evt) {
          // console.log('dataset', this.data.datasets);
          __this = this;
          // var activePoint = window.myBar2.getElementAtEvent(evt)[0];
          // Bridge.Event.trigger('master:labelClick', {evt, ctx});

          showLabel({
            // activePoint: activePoint,
            _this: __this,
            evt: evt,
            ctx: ctx
          })

        },
        "animation": {
          "onComplete": function() {
            var chartInstance = this.chart,
            ctx = chartInstance.ctx;
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
                if (i > 1) {
                  ctx.fillStyle = "#ffffff";
                  ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
                  y = bar._model.y + 35
                } else {
                  ctx.fillStyle = "#000000";
                  ctx.font = 'bold 22px "museo_sans", Helvetica, Arial, sans-serif';
                  y = bar._model.y - 10
                }

                if (i === 2) {
                  x = bar._model.x + 7
                }

                if (i < 2) {
                  ctx.fillText(data, x, y);
                }
              });
            });
          }
        },
      }
    });

  }

  this.graph3 = function() {
    var barChartData = {
        labels: checkLabels('engagement', data),
        datasets: [{
          type: 'line',
          label: 'Multiplier',
          backgroundColor: 'transparent',
          borderColor: '#333F48',
          pointBackgroundColor: '#333F48',
          pointBorderColor: '#333F48',
          pointBorderWidth: '10',
          borderWidth: '4',
          data: data.engagementData.multiplierData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }, {
          type: 'bar',
          barThickness: 22,
          label: 'Dataset 1',
          backgroundColor: '#E4002B',
          data: data.engagementData.reaData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        },{
          type: 'bar',
          barThickness: 22,
          label: 'Dataset 2',
          backgroundColor: '#37BC72',
          data: data.engagementData.domainData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }]
      };

      var ctx = document.getElementById('engagementChart').getContext('2d');
      window.myBar = new Chart(ctx, {
        data: barChartData,
        type: 'bar',
        options: {
          defaultFontFamily: "'museo_sans', Arial, sans-serif",
          aspectRatio: 2.8,
          lineWidth: 0,
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
                fontSize: 16,
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
                color: "rgba(0, 0, 0, 0)"
              },
              scaleLabel: {
                display: true,
                labelString: 'Time spent on site per person (Minutes)',
                fontSize: 18,
                fontFamily: "'museo_sans', Arial, sans-serif",
              }
            }]
          },
          legend: {
            "display": false,
            "position": 'bottom'
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
              ctx = chartInstance.ctx;

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
                  if (i === 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y + 35
                  } else {
                    ctx.fillStyle = "#000000";
                    ctx.font = 'bold 22px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y - 10
                  }

                  if (i === 2) {
                    x = bar._model.x + 7
                  }

                  ctx.fillText(data, x, y);
                });
              });
            }
          },
        }
      });
  }

  this.graph4 = function() {
    var barChartData = {
        labels: checkLabels('app', data),
        datasets: [{
          type: 'line',
          label: 'Multiplier',
          backgroundColor: 'transparent',
          borderColor: '#333F48',
          pointBackgroundColor: '#333F48',
          pointBorderColor: '#333F48',
          pointBorderWidth: '10',
          borderWidth: '4',
          data: data.appData.multiplierData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }, {
          type: 'bar',
          barThickness: 22,
          label: 'Dataset 1',
          backgroundColor: '#E4002B',
          data: data.appData.reaData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        },{
          type: 'bar',
          barThickness: 22,
          label: 'Dataset 2',
          backgroundColor: '#37BC72',
          data: data.appData.domainData.filter(function(item) {
            return parseFloat(item) > 0
          }),
        }]
      };

      var ctx = document.getElementById('appChart').getContext('2d');
      window.myBar = new Chart(ctx, {
        data: barChartData,
        type: 'bar',
        options: {
          defaultFontFamily: "'museo_sans', Arial, sans-serif",
          aspectRatio: 2.8,
          lineWidth: 0,
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
                fontSize: 16,
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
                color: "rgba(0, 0, 0, 0)"
              },
              scaleLabel: {
                display: true,
                labelString: 'App launches',
                fontSize: 18,
                fontFamily: "'museo_sans', Arial, sans-serif",
              }
            }]
          },
          legend: {
            "display": false,
            "position": 'bottom'
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
              ctx = chartInstance.ctx;

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
                  if (i === 0) {
                    ctx.fillStyle = "#ffffff";
                    ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y + 35
                  } else {
                    ctx.fillStyle = "#000000";
                    ctx.font = 'bold 22px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y - 10
                  }

                  if (i === 2) {
                    x = bar._model.x + 7
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
