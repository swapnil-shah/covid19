$(document).ready(function() {
	//Building pie chart
	// https://covidtracking.com/api/v1/states/ny/current.json
	fetch('https://covidtracking.com/api/v1/us/current.json').then((response) => response.json()).then(function(state) {
		var ctxTotalCases = document.getElementById('pie-chart-total-cases');
		var ctxhospitliazed = document.getElementById('pie-chart-hospitliazed');
		var usaDataTotal = [
			{
				data: [ state[0].positive, state[0].negative ],
				backgroundColor: [ '#3e95cd', '#3cba9f' ]
			}
		];
		var usaDataHospitalize = [
			{
				data: [ state[0].hospitalizedCurrently, state[0].inIcuCurrently, state[0].onVentilatorCurrently ],
				backgroundColor: [ '#FF6385', '#FF9F40', '#FFCD56' ]
			}
		];
		var myPieChartTotalCases = new Chart(ctxTotalCases, {
			type: 'pie',
			data: {
				labels: [ 'Positive', 'Negative' ],
				datasets: usaDataTotal
			},
			options: {
				maintainAspectRatio: false,
				tooltips: {
					backgroundColor: 'rgb(255,255,255)',
					bodyFontColor: '#858796',
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					caretPadding: 10,
					mode: 'label',
					callbacks: {
						label: function(tooltipItem, data) {
							var dataLabel = data.labels[tooltipItem.index];
							var value =
								': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
							if (Chart.helpers.isArray(dataLabel)) {
								dataLabel = dataLabel.slice();
								dataLabel[0] += value;
							} else {
								dataLabel += value;
							}
							return dataLabel;
						}
					}
				},
				animation: {
					duration: 1000
				}
			}
		});
		var myPieChartHospitliazed = new Chart(ctxhospitliazed, {
			type: 'pie',
			data: {
				labels: [ 'Hospitalized Currently', 'In ICU Currently', 'On Ventilator Currently' ],
				datasets: usaDataHospitalize
			},
			options: {
				maintainAspectRatio: false,
				tooltips: {
					backgroundColor: 'rgb(255,255,255)',
					bodyFontColor: '#858796',
					borderColor: '#dddfeb',
					borderWidth: 1,
					xPadding: 15,
					yPadding: 15,
					displayColors: false,
					caretPadding: 10,
					callbacks: {
						label: function(tooltipItem, data) {
							var dataLabel = data.labels[tooltipItem.index];
							var value =
								': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
							if (Chart.helpers.isArray(dataLabel)) {
								dataLabel = dataLabel.slice();
								dataLabel[0] += value;
							} else {
								dataLabel += value;
							}
							return dataLabel;
						}
					},
					animation: {
						duration: 1000
					}
				}
			}
		});
		$('#selectRegion').on('change', function() {
			let value = $(this).val();
			if (value === 'usa') {
				console.log(usaDataTotal);
				myPieChartTotalCases.data.datasets = usaDataTotal;
				myPieChartTotalCases.update();
				myPieChartTotalCases.options.animation.duration = 1000;
				myPieChartHospitliazed.data.datasets = usaDataHospitalize;
				myPieChartHospitliazed.update();
				myPieChartHospitliazed.options.animation.duration = 1000;
			} else {
				fetch('https://covidtracking.com/api/v1/states/' + value + '/current.json', { cache: 'no-cache' })
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP');
						}
					})
					.then((state) => {
						myPieChartTotalCases.data.datasets = [
							{
								data: [ state.positive, state.negative ],
								backgroundColor: [ '#3e95cd', '#3cba9f' ]
							}
						];
						myPieChartTotalCases.update();
						myPieChartTotalCases.options.animation.duration = 1000;
						if (state.hospitalizedCurrently && state.inIcuCurrently && state.onVentilatorCurrently) {
							myPieChartHospitliazed.data.datasets = [
								{
									data: [
										state.hospitalizedCurrently,
										state.inIcuCurrently,
										state.onVentilatorCurrently
									],
									backgroundColor: [ '#FF6385', '#FF9F40', '#FFCD56' ]
								}
							];
						} else {
							myPieChartHospitliazed.data.datasets = [];
						}
						myPieChartHospitliazed.update();
						myPieChartHospitliazed.options.animation.duration = 1000;
					})
					.catch((err) => {
						console.log('ERROR:', err.message);
					});
			}
		});

		// Set new default font family and font color to mimic Bootstrap's default styling
		(Chart.defaults.global.defaultFontFamily = 'Nunito'),
			'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
		Chart.defaults.global.defaultFontColor = '#858796';
		Chart.plugins.register({
			afterDraw: function(chart) {
				if (myPieChartHospitliazed.data.datasets.length === 0) {
					// No data is present
					var ctx = myPieChartHospitliazed.chart.ctx;
					var width = myPieChartHospitliazed.chart.width;
					var height = myPieChartHospitliazed.chart.height;
					myPieChartHospitliazed.clear();
					ctx.save();
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText('No data available.', width / 2, height / 2);
					ctx.restore();
				}
			}
		});
	});
	//Building Datatable

	fetch('https://covidtracking.com/api/v1/states/current.json')
		.then((response) => response.json())
		.then(function(states) {
			states
				.filter(function(posNeg) {
					return posNeg.positive && posNeg.negative;
				})
				.forEach(function(state) {
					let regionSelect = document.getElementById('selectRegion');
					regionSelect.options[regionSelect.options.length] = new Option(
						acronymToFullName(state.state),
						state.state
					);
				});
			$('#dataTableCountry').DataTable({
				data: states,
				pagingType: 'numbers',
				pageLength: 50,
				language: {
					searchPlaceholder: 'e.g. usa'
				},
				columns: [
					{
						title: 'State',
						data: 'state',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return `${acronymToFullName(
								data
							)}<p class="text-muted small"> Last updated ${timeDifference(row.dateChecked)}</p>`;
						}
					},
					{
						title: 'Positive',
						data: 'positive',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return `${data.toLocaleString()}<p class="text-muted small">Total tested: <span class="text-body">${row.totalTestResults.toLocaleString()}</span></p><p class="text-muted small">Negative: <span class="text-body">${row.negative.toLocaleString()}</span></p>`;
						}
					},
					{
						title: 'Recovered',
						data: 'recovered',
						render: $.fn.dataTable.render.number(',')
					},
					{
						title: 'Death',
						data: 'death',
						render: $.fn.dataTable.render.number(',')
					}
				],
				order: [ [ 1, 'desc' ] ]
			});
		});
});
