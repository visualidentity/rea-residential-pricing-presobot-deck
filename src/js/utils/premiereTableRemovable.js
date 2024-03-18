var premiereTableRemovable = function(options) {
	
		var $pageContainer;
		$pageContainer = options.slide;
		var storePath = 'listing-premiere-plus';

		var client = $('body').hasClass('client') ? true : false;
		var preview = $('body').hasClass('preview') ? true : false;

		if (client) {
			_bindClientEvents();
		}
		
		if (preview) {
			_initRemovables();
		}

		// Context
		var contextStore = {
			rows: [{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			}],
			columns: [{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			},{
				visible: true,
			}]
		};

		

		// Initiate prep mode removables
		function _initRemovables() {
			
			var $removableColumn = $pageContainer.find('.removable-sub');
			var $removableRow = $pageContainer.find('.removable-row');
			var $ref = $pageContainer.find('.removable-refresh-btn');
			
			$removableColumn.click(function() {
				var index = $(this).attr('val');
				var newColumns = contextStore.columns
				newColumns[index].visible = false;
				_.assign(contextStore.columns, newColumns);
				Bridge.Context.set(storePath, contextStore);
				
				_initRemovablesRender();
				Bridge.Event.trigger('master:listing-premiere-plus-context', {column: index});
			});

			$removableRow.click(function() {
				var index = $(this).attr('val');
				var newRows = contextStore.rows
				newRows[index].visible = false;				
				if ($pageContainer.attr('id') == 'premiere_plus_buy_matrix') {
					if(index == 1) {
						newRows[2].visible = false;
						newRows[3].visible = false;
						newRows[4].visible = false;
					}
					if(index == 5) {
						newRows[6].visible = false;
						newRows[7].visible = false;
						newRows[8].visible = false;
						newRows[9].visible = false;
						newRows[10].visible = false;
						newRows[11].visible = false;
						newRows[12].visible = false;
						newRows[13].visible = false;
						newRows[14].visible = false;
						newRows[15].visible = false;
						newRows[16].visible = false;
					}
					if(index == 17) {
						newRows[18].visible = false;
						newRows[19].visible = false;
					}
					if(index == 20) {
						newRows[21].visible = false;
						newRows[22].visible = false;
						newRows[23].visible = false;
					}
				}

				if ($pageContainer.attr('id') == 'premiere_plus_rural_land') {
					if(index == 1) {
						newRows[2].visible = false;
						newRows[3].visible = false;
						newRows[4].visible = false;
					}
					if(index == 5) {
						newRows[6].visible = false;
						newRows[7].visible = false;
						newRows[8].visible = false;
						newRows[9].visible = false;
						newRows[10].visible = false;
						newRows[11].visible = false;
						newRows[12].visible = false;
						newRows[13].visible = false;
						newRows[14].visible = false;
						newRows[15].visible = false;
					}
					if(index == 16) {
						newRows[17].visible = false;
						newRows[18].visible = false;
					}
					if(index == 19) {
						newRows[20].visible = false;
						newRows[21].visible = false;
						newRows[22].visible = false;
					}
				}
				_.assign(contextStore.rows, newRows);
				Bridge.Context.set(storePath, contextStore);
				_initRemovablesRender();
				Bridge.Event.trigger('master:listing-premiere-plus-context', {row: index});
			});

			// Table refresh
			$ref.click(function() {
				var tableRef = contextStore;

				$.each( tableRef.rows, function( index, row ) {
					row.visible = true;
				});
				$.each( tableRef.columns, function( index, column ) {
					column.visible = true;
				});
				_.assign(contextStore.tile, tableRef);
				Bridge.Context.set(storePath, contextStore);

				_initRemovablesRender();
				Bridge.Event.trigger('master:listing-premiere-plus-context', {refresh: true});
			});

			Bridge.Event.on('client:fetch-listing-premiere-plus-context', function() {
				Bridge.Event.trigger('master:listing-premiere-plus-context');
			});
		}

		_initRemovablesRender();

		function _initRemovablesRender() {
			var $context = Bridge.Context.match('.' + storePath, contextStore);

			$.each( $context.rows, function( index, value ){
				value.visible != true ? $pageContainer.find('tr[val="'+ index + '"]').hide() : $pageContainer.find('tr[val="'+ index + '"]').show();
			});

			$.each( $context.columns, function( index, value ) {
				var inc = index;
				value.visible != true ? (
					$pageContainer.find('th[val="'+ index + '"]').hide(),
					$pageContainer.find('td[val="'+ inc + '"]').hide()
				) : (
					$pageContainer.find('th[val="'+ index + '"]').show(),
					$pageContainer.find('td[val="'+ inc + '"]').show()
				);
			});
		}

		// Executing clients
		function _bindClientEvents() {
			Bridge.Event.trigger('client:fetch-listing-premiere-plus-context');
			Bridge.Event.on('master:listing-premiere-plus-context', function (data) {
				if (data.row) {
					var newRows = contextStore.rows
					newRows[data.row].visible = false;
					_.assign(contextStore.rows, newRows);
					Bridge.Context.set(storePath, contextStore);
					
					_initRemovablesRender();
				} else if (data.column) {
					var newColumns = contextStore.columns
					newColumns[data.column].visible = false;
					_.assign(contextStore.columns, newColumns);
					Bridge.Context.set(storePath, contextStore);
					
					_initRemovablesRender();
				} else if (data.refresh) {
					var tableRef = contextStore;

					$.each( tableRef.rows, function( index, row ) {
						row.visible = true;
					});
					$.each( tableRef.columns, function( index, column ) {
						column.visible = true;
					});
					_.assign(contextStore.tile, tableRef);
					Bridge.Context.set(storePath, contextStore);

					_initRemovablesRender();
				}
			});
		}
};