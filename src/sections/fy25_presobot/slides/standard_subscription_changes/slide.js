new Slide({
	onReady: function () {
		const data = Bridge.Feed.get('subscriptionChanges').raw();
		var removeableData = Bridge.Context.match('.standard_subscription_changes_removeables', []);

		var $pageContainer = this.$pageContainer;
		var $removeable = $pageContainer.find('[data-removeable]');
		var $buy = $pageContainer.find('[data-buy]');
		var $rent = $pageContainer.find('[data-rent]');
		var $text = $pageContainer.find('[data-text]');
		var $table = $pageContainer.find('[data-table]');
		var $amount = $pageContainer.find('[data-amount]');
		var $month = $pageContainer.find('[data-month]');
		var $refresh = $pageContainer.find('[data-refresh-header]')

		if (data) {
			$amount.text('$' + data.subAmount);
			$month.text(data.Month);

			if (data.doNotIncludePriceFlag) {
				$table.hide();
			}
		}

		function _handleRemoveable() {
			if (removeableData.length > 0) {
				$.each(removeableData, function (index, value) {
					$pageContainer.find(`[data-removeable="${value}"]`).hide();
				});

				if ((removeableData.indexOf("0") > -1) && (removeableData.indexOf("1") > -1)) {
					$buy.hide();
				}

				if ((removeableData.indexOf("2") > -1) && (removeableData.indexOf("3") > -1)) {
					$rent.hide();
				}
			} else {
				$buy.show();
				$rent.show();
				$pageContainer.find('[data-removeable]').show();
			}
		}

		if ($('body').hasClass('preview')) {
			$removeable.on('click', function () {
				removeableData.push($(this).attr('data-removeable'));
				Bridge.Context.set('standard_subscription_changes_removeables', removeableData);
				_handleRemoveable();
			});

			$refresh.on('click', function () {
				removeableData = [];
				Bridge.Context.set('standard_subscription_changes_removeables', removeableData);
				_handleRemoveable();
			});
		}

		if (removeableData.length > 0) {
			_handleRemoveable();
		}
	},
});
