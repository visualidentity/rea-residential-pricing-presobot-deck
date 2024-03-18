var initTables = function(persistent) {
	var preview = $("body").hasClass("preview");
	var present = $("body").hasClass("present");

	var client = $("body").hasClass("client");
	var master = !client;

	var slideID = currentSlide().replace("#", "");
	var $pageContainer = $(currentSlide());

	var $tables = $(".interactive-table", $pageContainer);

	var persistentVars = persistent || false;

	var getPersistent = function(tableID, cellType) {
		if (persistentVars) {
			if (persistentVars === true) {
				return true;
			} else if (typeof persistentVars === "string") {
				return persistentVars === cellType;
			} else if (
				_.isArray(persistentVars) &&
				persistentVars.indexOf(cellType) >= 0
			) {
				return true;
			} else if (
				_.isObject(persistentVars) &&
				persistentVars[tableID] &&
				persistentVars[tableID].indexOf(cellType) >= 0
			) {
				return true;
			}
		}
		return false;
	};

	var hideCell = function(tableID, cellType, cellID) {
		var tables = getTables();

		// If requested table exists, apply update
		if (
			!_.isEmpty(tables[slideID]) &&
			!_.isEmpty(tables[slideID][tableID])
		) {
			var $pageContainer = $(currentSlide());

			tables[slideID][tableID][cellType][cellID].visible = false;

			Bridge.Event.trigger(
				"master:updateTableDOM",
				tableID,
				tables[slideID][tableID]
			);

			// Set update to Context
			Bridge.Context.set("tables", tables);
		}
	};

	var getTables = function() {
		// Fetch from Context if available
		var tables = Bridge.Context.match(".tables", {});
		var $tables = $pageContainer.find(".interactive-table");

		// If slide record does not yet exist, create new container
		if (_.isEmpty(tables)) {
			tables = {};
		}

		// If slide record does not yet exist, create new container
		if (_.isEmpty(tables[slideID])) {
			tables[slideID] = {};
		}

		var tablesDOM = {};

		_.each($tables, function(table) {
			var $table = $(table);
			var tableID = $table.attr("data-key") || $table.prop("id");

			var hasPersistentColumns = getPersistent(tableID, "columns");
			var hasPersistentRows = getPersistent(tableID, "rows");

			if (tableID) {
				// compile tableDOM, used for comparisons later
				if (_.isEmpty(tablesDOM[tableID])) {
					tablesDOM[tableID] = {};
				}

				var $rows = $(".interactive-table__row", $table);
				var rows = {};
				var columns = {};

				var $rowTriggers = $(".row-trigger", $table);
				var $colTriggers = $(".column-trigger", $table);

				// initialize each table row
				_.each($rowTriggers, function(rowTrigger) {
					var $rowTrigger = $(rowTrigger);
					var rowID = $rowTrigger.prop("id");
					var isVisible = !$rowTrigger.hasClass("hidden");

					// If trigger is a cell within a row, get current visibility of parent
					if ($rowTrigger.hasClass("interactive-table__cell")) {
						isVisible = !$rowTrigger.parent().hasClass("hidden");
					}

					rows[rowID] = { visible: isVisible };
				});

				// initialize each table column
				_.each($colTriggers, function(colTrigger, colTriggerIndex) {
					var $colTrigger = $(colTrigger);
					var colID = $colTrigger.prop("id");

					var isVisible = !$colTrigger.hasClass("hidden");

					columns[colID] = { visible: isVisible };
				});

				if (_.isEmpty(tablesDOM[tableID].rows)) {
					tablesDOM[tableID].rows = rows;
				} else {
					_.extend(tablesDOM[tableID].rows, rows);
				}

				if (_.isEmpty(tablesDOM[tableID].columns)) {
					tablesDOM[tableID].columns = columns;
				} else {
					_.extend(tablesDOM[tableID].columns, columns);
				}
			} else {
				console.warn(
					"WARNING: An interactive table on " +
						slideID +
						" is missing an ID.\nEach interactive table must have an ID in order to be registered.\n\nInteractive table will remain inactive until resolved."
				);
			}
		});

		_.each(tablesDOM, function(tableDOM, tableID) {
			var hasPersistentColumns = getPersistent(tableID, "columns");
			var hasPersistentRows = getPersistent(tableID, "rows");

			// If table does not yet exist, create new table based on DOM
			if (_.isEmpty(tables[slideID][tableID])) {
				tables[slideID][tableID] = tableDOM;
			} else {
				// If no information saved to Context yet on rows and/or columns
				// Populate with latest state read from the DOM

				// Test if number of non-persistent data matches existing
				// If does not match, assume table data has changed and wipe out the old record

				// Do not test persistent data for matches, instead, always add to existing
				// This prevents persistent data from being wiped in the case where data varies between customers

				if (_.isEmpty(tables[slideID][tableID].rows)) {
					tables[slideID][tableID].rows = tableDOM.rows;
				} else {
					// Rows
					if (!hasPersistentRows) {
						// Non-persistent
						// Combine tables to compare number of unique entries
						var tableRowsUnion = _.extend(
							{},
							tableDOM.rows,
							tables[slideID][tableID].rows
						);

						if (_.size(tableRowsUnion) !== _.size(tableDOM.rows)) {
							tables[slideID][tableID].rows = tableDOM.rows;
						}
					} else {
						// Persistent
						_.each(tableDOM.rows, function(row, rowID) {
							if (!tables[slideID][tableID].rows[rowID]) {
								tables[slideID][tableID].rows[rowID] =
									tableDOM.rows[rowID];
							}
						});
					}
				}

				if (_.isEmpty(tables[slideID][tableID].columns)) {
					tables[slideID][tableID].columns = tableDOM.columns;
				} else {
					// Columns
					if (!hasPersistentColumns) {
						// Non-persistent
						// Combine tables to compare number of unique entries
						var tableColumnsUnion = _.extend(
							{},
							tableDOM.columns,
							tables[slideID][tableID].columns
						);

						if (
							_.size(tableColumnsUnion) !==
							_.size(tableDOM.columns)
						) {
							tables[slideID][tableID].columns = tableDOM.columns;
						}
					} else {
						// Persistent
						_.each(tableDOM.columns, function(column, colID) {
							if (!tables[slideID][tableID].columns[colID]) {
								tables[slideID][tableID].columns[colID] =
									tableDOM.columns[colID];
							}
						});
					}
				}
			}
		});

		return tables;
	};

	// Set ids of data-based columns and rows
	_.each($tables, function(table, tableIndex) {
		var $table = $(table);
		var tableKey = $table.attr("data-key");
		var tableID = tableKey || $table.prop("id");

		var hasPersistentColumns = getPersistent(tableID, "columns");
		var hasPersistentRows = getPersistent(tableID, "rows");

		// Set table data-key for later reference
		// Allows for multiple tables to share columns
		if (!tableKey) {
			$table.attr("data-key", tableID);
		}

		var $colTriggers = $(".column-trigger", $table);
		var $rowTriggers = $(".row-trigger", $table);

		_.each($rowTriggers, function(rowTrigger, rowTriggerIndex) {
			var $rowTrigger = $(rowTrigger);
			var rowID = $rowTrigger.prop("id");
			// Set ids of data-based rows
			if (!hasPersistentRows) {
				if ($rowTrigger.prop("id")) {
					console.warn(
						"WARNING: row " +
							rowID +
							" has been supplied with an ID, data-based rows CANNOT be supplied IDs, these must be auto-generated by interactive-table.js"
					);
				} else {
					rowID =
						tableID + "_row_" + tableIndex + "_" + rowTriggerIndex;
					$rowTrigger.attr("id", rowID);
				}
			} else if (!$rowTrigger.prop("id")) {
				rowID = tableID + "_row_" + tableIndex + "_" + rowTriggerIndex;
				$rowTrigger.attr("id", rowID);
				// Persistent rows MUST be supplied an ID in the markup
				console.warn(
					"WARNING: row " +
						rowID +
						" ID has been auto-generated, persistent rows MUST be supplied with IDs in original markup."
				);
			}

			// Add data-row reference to matched row
			// If trigger is a cell within a row, add ref to parent row
			if ($rowTrigger.hasClass("interactive-table__cell")) {
				$rowTrigger.parent().attr("data-row", rowID);
			} else {
				// Add to trigger
				$rowTrigger.attr("data-row", rowID);
			}
		});

		// Set ids of data-based columns & add data-refs of all removable columns
		_.each($colTriggers, function(colTrigger, colTriggerIndex) {
			var $colTrigger = $(colTrigger);
			var colID = $colTrigger.prop("id");

			// Set ids of data-based columns
			if (!hasPersistentColumns) {
				if ($colTrigger.prop("id")) {
					console.warn(
						"WARNING: column " +
							colID +
							" has been supplied with an ID, data-based columns CANNOT be supplied IDs, these must be auto-generated by interactive-table.js"
					);
				} else {
					colID = tableID + "_col_" + colTriggerIndex;
					$colTrigger.attr("id", colID);
				}
			} else if (!$colTrigger.prop("id")) {
				colID = tableID + "_col_" + colTriggerIndex;
				$colTrigger.attr("id", colID);
				// Persistent columns MUST be supplied an ID in the markup
				console.warn(
					"WARNING: column " +
						colID +
						" ID has been auto-generated, persistent columns MUST be supplied with IDs in original markup."
				);
			}

			// Get col index within row
			var parentRow = colTrigger.parentNode;
			var colIndex = Array.prototype.indexOf.call(
				parentRow.children,
				colTrigger
			);

			// Add data-column reference to matched columns
			var $rows = $(".interactive-table__row", $table);
			_.each($rows, function(row) {
				var $columns = $(row).find(".interactive-table__cell");
				$($columns[colIndex]).attr("data-column", colID);
			});
		});
	});

	// Setup Bridge events
	Bridge.Event.on("master:updateTableDOM", function(
		tableID,
		tableObj,
		target
	) {
		var updateTable = true;

		if (target && target === "client" && !$("body").hasClass("client")) {
			updateTable = false;
		}

		if (updateTable) {
			var $tables = $(".interactive-table", $pageContainer);

			_.each($tables, function(table) {
				var $table = $(table);
				var tableKey = $table.attr("data-key");

				// Update table(s) with matching keys
				if (tableKey && tableKey === tableID) {
					var $rows = $(".interactive-table__row", $table);

					var rowCounter = -1;
					var activeColumnCounter = -1;

					var totalRows = $rows.length;
					var totalColumns = 0;

					_.each($rows, function(row) {
						var $row = $(row);
						var rowID = $row.attr("data-row");
						// Remove all row classes
						$row.removeClass(incrementClasses($rows.length, "row"));

						// If row has a removable status
						if (tableObj.rows[rowID]) {
							if (tableObj.rows[rowID].visible) {
								rowCounter += 1;
								$row.removeClass("hidden");
							} else {
								$row.addClass("hidden");
							}
						} else {
							// row is not removable, auto-increment counter
							rowCounter += 1;
						}

						// Add new row class
						$row.addClass(
							"row-" + (rowCounter >= 0 ? rowCounter : 0)
						);

						// Update columns
						var $columns = $(".interactive-table__cell", $row);

						var rowColumnCounter = -1;

						if ($columns.length > totalColumns) {
							totalColumns = $columns.length;
						}

						_.each($columns, function(column) {
							var $column = $(column);
							var colID = $column.attr("data-column");
							// Remove all column classes
							$column.removeClass(
								incrementClasses($columns.length, "col")
							);

							// If column has a removable status
							if (tableObj.columns[colID]) {
								if (tableObj.columns[colID].visible) {
									rowColumnCounter += 1;
									$column.removeClass("hidden");
								} else {
									$column.addClass("hidden");
								}
							} else {
								// column is not removable, increment counter
								rowColumnCounter += 1;
							}

							// Add new column class
							$column.addClass(
								"col-" +
									(rowColumnCounter >= 0
										? rowColumnCounter
										: 0)
							);
						});

						if (activeColumnCounter < rowColumnCounter) {
							activeColumnCounter = rowColumnCounter;
						}
					});

					$table
						.removeClass(incrementClasses(totalColumns, "columns"))
						.addClass("columns-" + (activeColumnCounter + 1));
					$table
						.removeClass(incrementClasses(totalRows.length, "rows"))
						.addClass("rows-" + (rowCounter + 1));

					// Input column width inline if data-width values found in header
					// .interactive-table__row.header
					var $headerRow = $table.find(
						".interactive-table__row.header"
					);
					var $headerColumns = $headerRow.find(
						".interactive-table__cell"
					);

					// If data-width attributes are found on the table element, ALL header columns
					// must include data-width in order for the function to work.
					if (
						_.some($headerColumns, function(col) {
							return !!$(col).attr("data-width");
						})
					) {
						if (
							_.every($headerColumns, function(col) {
								return !!$(col).attr("data-width");
							})
						) {
							// Calculate the required inline width for each column and apply

							// Get total available width based on active columns
							var totalWidth = _.reduce(
								$headerColumns,
								function(total, headerCol) {
									if (!$(headerCol).hasClass("hidden")) {
										var colWidth = parseFloat(
											$(headerCol).attr("data-width")
										);
										total += colWidth;
									}

									return total;
								},
								0
							);

							var leftPerc = 0;

							_.each($headerColumns, function(
								headerCol,
								colIndex
							) {
								var colWidth = parseFloat(
									$(headerCol).attr("data-width")
								);
								var colPerc = (colWidth / totalWidth) * 100;

								_.each($rows, function(row) {
									var $rowCells = $(row).find(
										".interactive-table__cell"
									);
									$($rowCells[colIndex])
										.css("width", colPerc + "%")
										.css("left", leftPerc + "%");
								});

								if (!$(headerCol).hasClass("hidden")) {
									leftPerc += colPerc;
								}
							});
						} else {
							console.warn(
								"WARNING: all header columns must include a data-width for the functionality to work"
							);
						}
					}
				}
			});

			// // Turn off whole table if enough rows and columns are off
			// var $columnTriggers = $table.find(".column-trigger");
			// var $rowTriggers = $table.find(".row-trigger");

			// var $allTriggers = _.extend($columnTriggers, $rowTriggers);
			// debugger;
		}
	});

	// master only functions
	if (master) {
		// Get tables from slide
		var $tables = $pageContainer.find(".interactive-table");
		// Fetch latest tables from Context, or the DOM if no Context record
		var tables = getTables();

		// Initialise each table
		_.each($tables, function(table) {
			var tableID = $(table).attr("data-key") || $(table).prop("id");

			if (tableID) {
				// Update table DOM with latest Bridge data
				Bridge.Event.trigger(
					"master:updateTableDOM",
					tableID,
					tables[slideID][tableID]
				);

				// Register column triggers
				var $columnTriggers = $(table).find(".column-trigger");

				_.each($columnTriggers, function(columnTrigger) {
					var colID = $(columnTrigger).prop("id");
					$(columnTrigger).on("click", function() {
						// Only active when in prep/preview OR present mode
						if (preview || present) {
							// Hide all relevant columns
							hideCell(tableID, "columns", colID);
						}
					});
				});

				// Register row triggers
				var $rowTriggers = $(table).find(".row-trigger");

				_.each($rowTriggers, function(rowTrigger) {
					var rowID = $(rowTrigger).prop("id");

					$(rowTrigger).on("click", function() {
						// Only active when in prep/preview OR present mode
						if (preview || present) {
							// Hide all relevant columns
							hideCell(tableID, "rows", rowID);
						}
					});
				});

				// Register reset buttons
				var $resetButtons = $(table).find(".interactive-table__reset");

				_.each($resetButtons, function(reset) {
					$(reset).on("click", function() {
						// Only active when in prep/preview OR present mode
						if (preview || present) {
							// Fetch latest tables from Context
							var tables = getTables();

							if (
								!_.isEmpty(tables) &&
								!_.isEmpty(tables[slideID]) &&
								!_.isEmpty(tables[slideID][tableID])
							) {
								// Find relevant slide in table object
								_.each(
									tables[slideID][tableID].columns,
									function(col, colID) {
										col.visible = true;
									}
								);

								_.each(tables[slideID][tableID].rows, function(
									row,
									rowID
								) {
									row.visible = true;
								});

								Bridge.Event.trigger(
									"master:updateTableDOM",
									tableID,
									tables[slideID][tableID]
								);

								// Set table to Context
								Bridge.Context.set("tables", tables);
							}
						}
					});
				});
			} else {
				console.warn(
					"WARNING: An interactive table on " +
						slideID +
						" is missing an ID.\nEach interactive table must have an ID in order to be registered.\n\nInteractive table will remain inactive until resolved."
				);
			}
		});

		// Receive client's request for latest table data
		Bridge.Event.on("client:fetchTableState", function() {
			var tables = getTables();

			_.each(tables[slideID], function(table, tableID) {
				Bridge.Event.trigger(
					"master:updateTableDOM",
					tableID,
					table,
					"client"
				);
			});
		});

		// Client only functions
	} else {
		// Ensure master has completed setup before client requests state
		setTimeout(function() {
			Bridge.Event.trigger("client:fetchTableState");
		}, 0);
	}
};
