var attachValueExclusiveAudienceEvents = function(options) {
    
    var $pageContainer;
    var __this;
    var $chartTooltip = document.getElementById('chartTooltip');
    var $state = Bridge.Context.match(".customer .state", "");
    var panelRegion;

    var {
      slide,
      data
    } = options

    var regionDropdown = function(_data, region, registerClick) {

      var data;

      if (_data) {
        data = _data
      }

      var $regionValue = 'Region';

      if (region) {
        $regionValue = region
      } else {
         Bridge.Context.set('panel_stat_region' + slide, null);
      }

      if (data.cityExclusive.length > 0) {
        $pageContainer.find('#region_dd').show();
      } else {
        $pageContainer.find('#region_dd').hide();
      }

      var $dropdownName = $pageContainer.find('#region_dd .input-label');
      
      $dropdownName.text($regionValue);
      var $dropdown = $pageContainer.find('#region_dd .input--dropdown');

      var listHtml = ''
      
      data.cityExclusive.forEach(function(item) {
        listHtml += '<li data-value="'+item.city+'" data-dropdown>'+item.city+'</li>'
      })

      $pageContainer.find('#region_dd #dropdown_group').html(
        '<div class="dropdown-icon"></div>' +
        '<ul>' +
          listHtml +
        '</ul>'
      );

      if (registerClick !== false && $('body').hasClass('master')) {
        $dropdownName.click(function() {
          $dropdown.toggleClass('dropdown--open');
        });
      }

      var $dropdownListing = $pageContainer.find('#region_dd [data-dropdown]');

      $dropdownListing.click(function() {
        $regionValue = $(this).closest('li').attr('data-value');
        $dropdown.removeClass('dropdown--open');
        Bridge.Event.trigger('master:' + $pageContainer + '-update-region', {instance: $regionValue});
      });      

    }

    this.init = function() {
      $pageContainer = $(options.container);
      this.graph();
      var panelState = Bridge.Context.get('panel_stat_state' + slide);
      panelRegion = Bridge.Context.get('panel_stat_region' + slide);

      // Easy dropdown
      var $value;
      var stateData;

      if ($state) {
        stateData = data.exclusiveAudiencePercentage.find(function(item) {
          return item.state.toLowerCase() === $state.toLowerCase()
        });
      }

      if (panelRegion) {
        var state
        if (panelState) {
          $value = panelState.state;
          state = panelState;
        } else if ($state) {
          $value = $state.toUpperCase();
          state = stateData;
        } else {
          $value = data.exclusiveAudiencePercentage[0].state;
          state = data.exclusiveAudiencePercentage[0]
        }

        if (panelRegion['realestate.com.au'] === 'N/A') {
          $('.panel__item').hide();
        } else {
          $('.panel__item').show();
          $('[data-panel-stat-rea]').html(panelRegion['realestate.com.au']);
        }
        
        $('[data-panel-stat-domain]').html(panelRegion['domain']);

        regionDropdown(state, panelRegion.city);
      } else {
        if (panelState) {
          $value = panelState.state;
          $('[data-panel-stat-rea]').html(panelState['realestate.com.au']);
          $('[data-panel-stat-domain]').html(panelState['domain']);
          regionDropdown(panelState);
        } else if ($state && stateData) {
          $value = $state.toUpperCase();
          $('[data-panel-stat-rea]').html(stateData['realestate.com.au']);
          $('[data-panel-stat-domain]').html(stateData['domain']);
          
          Bridge.Event.trigger('master:' + $pageContainer + '-update-state', {instance: $state.toUpperCase()});
          regionDropdown(stateData);
        } else {
          $value = data.exclusiveAudiencePercentage[0].state;
          $('[data-panel-stat-rea]').html(data.exclusiveAudiencePercentage[0]['realestate.com.au']);
          $('[data-panel-stat-domain]').html(data.exclusiveAudiencePercentage[0]['domain']);
          regionDropdown(data.exclusiveAudiencePercentage[0]);
        }
      }

      $('[data-panel-stat-rea]').html(data.exclusiveAudiencePercentage.realestate.com.au);
      $('[data-panel-stat-domain]').html(data.exclusiveAudiencePercentage.domain);

      var $dropdownName = $pageContainer.find('#state_dd .input-label');
      $dropdownName.text($value);
      var $dropdown = $pageContainer.find('#state_dd .input--dropdown');

      var listHtml = ''
      
      data.exclusiveAudiencePercentage.forEach(function(item) {
        listHtml += '<li data-value="'+item.state+'" data-dropdown>'+item.state+'</li>'
      })

      $pageContainer.find('#state_dd #dropdown_group').html(
        '<div class="dropdown-icon"></div>' +
        '<ul>' +
          listHtml +
        '</ul>'
      );

      if ($('body').hasClass('master')) {
        $dropdownName.click(function() {
          $dropdown.toggleClass('dropdown--open');
        });
      }

      var $dropdownListing = $pageContainer.find('#state_dd [data-dropdown]');
      
      $dropdownListing.click(function() {
        $value = $(this).closest('li').attr('data-value');
        $dropdown.removeClass('dropdown--open');
        // $dropdownName.text($value);
        Bridge.Event.trigger('master:' + $pageContainer + '-update-state', {instance: $value});
      });
      

      // Bridging events for client (state)
      Bridge.Event.on('client:fetch-' + $pageContainer + '-state', function() {
        Bridge.Event.trigger('master:' + $pageContainer + '-update-state', {instance: $value});
      });

      Bridge.Event.on('master:' + $pageContainer + '-update-state', function (state) {
        var stateData = data.exclusiveAudiencePercentage.find(function(item) {
          return item.state === state.instance
        })
        $('[data-panel-stat-rea]').html(stateData['realestate.com.au']);

        if (stateData['domain'] === 'N/A') {
          $('[data-panel-stat-domain]').closest('.panel__item').hide();
        } else {
          $('[data-panel-stat-domain]').closest('.panel__item').show();
          $('[data-panel-stat-domain]').html(stateData['domain']);
        }
        
        regionDropdown(stateData, null, false)
        Bridge.Context.set('panel_stat_state' + slide, stateData);

        var $dropdownName = $pageContainer.find('#state_dd .input-label');
        $dropdownName.text(state.instance);
      });

      // Bridging events for client (region)
      Bridge.Event.on('client:fetch-' + $pageContainer + '-region', function() {
        Bridge.Event.trigger('master:' + $pageContainer + '-update-region', {instance: $value});
      });

      Bridge.Event.on('master:' + $pageContainer + '-update-region', function (state) {

        var panelState;
        var regionData;
        
        if(Bridge.Context.get('panel_stat_state' + slide)) {
          panelState = Bridge.Context.get('panel_stat_state' + slide)
          regionData = panelState.cityExclusive.find(function(item) {
            return item.city === state.instance
          })
        } else {
          
          if ($state) {
            panelState = data.exclusiveAudiencePercentage.find(function(item) {
              return item.state === $state.toUpperCase();
            });
            regionData = panelState.cityExclusive.find(function(item) {
              return item.city === state.instance
            })

          } else {
            // National anyway which doesn't have cityExclusive
          }

        }

        if (regionData) {
          $('[data-panel-stat-rea]').html(regionData['realestate.com.au']);
          $('[data-panel-stat-domain]').html(regionData['domain']);
          Bridge.Context.set('panel_stat_region' + slide, regionData);
        } else {
          Bridge.Context.set('panel_stat_region' + slide, null);
        }

        var $dropdownName = $pageContainer.find('#region_dd .input-label');
        $dropdownName.text(state.instance);
      });

    };

    this.graph = function() {

        var barChartData = {
        labels: data.exclusiveAudienceData.labels,
        datasets: [{
          type: 'line',
          label: 'Multiplier',
          backgroundColor: 'transparent',
          borderColor: '#E4002B',
          pointBackgroundColor: '#E4002B',
          pointBorderColor: '#E4002B',
          pointBorderWidth: '10',
          pointHoverBorderWidth: '12',
          borderWidth: '6',
          data: data.exclusiveAudienceData.reaData
        },{
          type: 'line',
          label: 'Multiplier',
          backgroundColor: 'transparent',
          borderColor: '#37BC72',
          pointBackgroundColor: '#37BC72',
          pointBorderColor: '#37BC72',
          pointBorderWidth: '10',
          pointHoverBorderWidth: '12',
          borderWidth: '6',
          data: data.exclusiveAudienceData.domainData
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
  
        var label = []
  
        __this.data.datasets.forEach(function(dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function(bar, index) {
            var data = dataset.data[index];
            var y;
            var x = x = bar._model.x;
  
            ctx.fillStyle = "#ffffff";
            ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
            y = bar._model.y + 35
  
            if (i < 2 && activePoint && activePoint._index === index) {

              label.push({
                data, x, y
              })
            }
          });
        });

        Bridge.Event.trigger('master:labelHover', label);
      }

      Bridge.Event.on('master:labelHover', function(e) {
        $($chartTooltip).empty();
        if (e) {
          e.forEach(function(item) {
            $chartTooltip.insertAdjacentHTML('beforeend', '<span style="position: absolute; top: '+item.y + 'px; left: '+item.x + 'px;">' + item.data +' Million</span>')
          });
        }
      })
      
      var ctx = document.getElementById('exclusiveChart').getContext('2d');
      window.myBar2 = new Chart(ctx, {
        data: barChartData,
        type: 'bar',
        options: {
          defaultFontFamily: "'museo_sans', Arial, sans-serif",
          aspectRatio: 2.22,
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
                fontSize: 22,
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#2E2C30",
                autoSkip: false
              },
            }],
            yAxes: [{
              ticks: {
                padding: 20,
                beginAtZero: true,
                fontSize: 22,
                fontFamily: "'museo_sans', Arial, sans-serif",
                fontColor: "#2E2C30",
                display: true,
                callback: function(value, index, values) {
                    if (value.toString() === '0') {
                      return '0'
                    } else {
                      return value + 'M'
                    }
                }
              },
              gridLines: {
                drawBorder: false,
                color: "#D0D0D0" 
              },
              scaleLabel: {
                display: false,
                labelString: '',
                fontSize: 18,
                color:"#2E2C30"
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
            __this = this;
            showLabel({
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
                  if (i < 2) {
                    ctx.fillStyle = "#ffffff";
                    ctx.font = 'bold 17px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y + 35
                  } else {
                    ctx.fillStyle = "#000000";
                    ctx.font = 'bold 22px "museo_sans", Helvetica, Arial, sans-serif';
                    y = bar._model.y - 10
                  }

                  if (i === 3) {
                    x = bar._model.x + 7
                  }

                  if (i > 1) {
                    ctx.fillText(data, x, y);
                  }
                });
              });
            }
          },
        }
      });

      console.log('window.myBar2.options', window.myBar2);

    }

    this.init();
  };
