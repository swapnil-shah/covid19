// const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';

let canvas = document.getElementById('myChart');
let ctx = canvas.getContext('2d');
let myChart;
let statesData;
let gradientBlue = ctx.createLinearGradient(0, 0, 0, 450);
let gradientGreen = ctx.createLinearGradient(0, 0, 0, 450);
let gradientRed = ctx.createLinearGradient(0, 0, 0, 450);
let borderBlue = 'rgba(0, 97, 242, 0.75)';
let borderGreen = 'rgba(42, 157, 143, 0.75)';
let borderRed = 'rgba(230, 57, 70, 0.75)';
gradientBlue.addColorStop(0, 'rgba(0, 97,242, 0.75)');
gradientBlue.addColorStop(0.5, 'rgba(0, 97,242, 0.55)');
gradientBlue.addColorStop(1, 'rgba(0, 97,242,0.10)');
gradientGreen.addColorStop(0, 'rgba(42,157,143, 0.75)');
gradientGreen.addColorStop(0.5, 'rgba(42,157,143, 0.55)');
gradientGreen.addColorStop(1, 'rgba(42,157,143,0.10)');
gradientRed.addColorStop(0, 'rgba(230,57,70,  0.75)');
gradientRed.addColorStop(0.5, 'rgba(230,57,70,  0.55)');
gradientRed.addColorStop(1, 'rgba(230,57,70, 0.10)');
// letchartType = 'Line';
let dailyConfirmed = [];
let dailyDeceased = [];
let dailyRecovered = [];
let labelsDate = [];
let dailyConfirmedMonth = [];
let dailyDeceasedMonth = [];
let dailyRecoveredMonth = [];
let labelsDateMonth = [];
let numbersConfirmedMonth = 0;
let numbersDeceasedMonth = 0;
let numbersRecoveredMonth = 0;
let dailyConfirmedWeeks = [];
let dailyDeceasedWeeks = [];
let dailyRecoveredWeeks = [];
let labelsDateWeeks = [];
let numbersConfirmedWeeks = 0;
let numbersDeceasedWeeks = 0;
let numbersRecoveredWeeks = 0;
//Populate numbers to legend on chart
function populateNumbers(confirmed, recovered, deaths, text) {
	document.getElementById('total-confirmed').innerHTML = `<span style="color:${borderBlue}">${confirmed}</span>`;
	document.getElementById('total-recovered').innerHTML = `<span style="color:${borderGreen}">${recovered}</span>`;
	document.getElementById('total-deaths').innerHTML = `<span style="color:${borderRed}">${deaths}</span>`;
	document.getElementById('total-date').innerHTML = ` (${text})`;
}
function generateChart(labelset, dataset, chartType, chartLabel, gradient, gradientBorder) {
	var data = {
		labels: labelset,
		datasets: [
			{
				label: chartLabel,
				data: dataset,
				backgroundColor: gradient,
				borderColor: gradientBorder,
				borderWidth: 1, // The main line color
				pointBorderWidth: 0
			}
		]
	};
	var options = {
		responsive: true,
		maintainAspectRatio: false,
		tooltips: {
			borderWidth: 1,
			caretPadding: 10,
			displayColors: false,
			xPadding: 10,
			yPadding: 10,
			callbacks: {
				label: function(tooltipItem, data) {
					return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
				}
			}
		},
		scales: {
			yAxes: [
				{
					ticks: {
						autoSkip: true,
						beginAtZero: true,
						callback: function(value) {
							return value.toLocaleString();
						}
					}
				}
			],
			xAxes: [
				{
					// ticks: {
					// 	display: false
					// }
				}
			]
		},
		title: {
			display: true,
			text: 'Overall Country Data',
			position: 'bottom'
		}
	};
	myChart = new Chart(ctx, {
		type: chartType ? chartType : 'bar',
		data: data,
		options: options
	});

	$('#barRadio').click(function() {
		myChart.destroy();
		myChart = new Chart(ctx, {
			type: 'bar',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							return (
								data.datasets[tooltipItem.datasetIndex].label +
								': ' +
								tooltipItem.yLabel.toLocaleString()
							);
						}
					}
				},
				scales: {
					yAxes: [
						{
							ticks: {
								callback: function(value) {
									return value.toLocaleString();
								}
							}
						}
					]
				}
			}
		});
		myChart.update();
	});
	$(
		'input:radio[name="chartTypeRadio"], input:radio[name="timeframe"], input:radio[name="caseTypeRadio"]'
	).change(function() {
		if ($('#lineRadio').is(':checked')) {
			$('#linearRadio,  #logarithmicRadio').removeAttr('disabled');
		} else {
			$('#linearRadio').attr('checked');
			$('#logarithmicRadio').removeAttr('checked');
			$('#linearRadio, #logarithmicRadio').attr('disabled', '');
		}
	});
	$('#lineRadio').click(function() {
		myChart.destroy();
		myChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							return (
								data.datasets[tooltipItem.datasetIndex].label +
								': ' +
								tooltipItem.yLabel.toLocaleString()
							);
						}
					}
				},
				scales: {
					yAxes: [
						{
							type: $('#linearRadio').is(':checked') ? 'linear' : 'logarithmic',
							ticks: {
								callback: function(value) {
									return value.toLocaleString();
								}
							}
						}
					]
				}
			}
		});
		myChart.update();
	});
	$('#linearRadio').click(function() {
		myChart.destroy();
		myChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							return (
								data.datasets[tooltipItem.datasetIndex].label +
								': ' +
								tooltipItem.yLabel.toLocaleString()
							);
						}
					}
				},
				scales: {
					yAxes: [
						{
							type: 'linear',
							ticks: {
								callback: function(value) {
									return value.toLocaleString();
								}
							}
						}
					]
				}
			}
		});
		myChart.update();
	});
	$('#logarithmicRadio').click(function() {
		myChart.destroy();
		myChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							return (
								data.datasets[tooltipItem.datasetIndex].label +
								': ' +
								tooltipItem.yLabel.toLocaleString()
							);
						}
					}
				},
				scales: {
					yAxes: [
						{
							type: 'logarithmic',
							ticks: {
								autoSkip: true,
								source: 'auto',
								suggestedMax: 10,
								callback: function(value) {
									if (value == 5000) return value.toLocaleString();
									if (value == 4000) return value.toLocaleString();
									if (value == 3000) return value.toLocaleString();
									if (value == 2000) return value.toLocaleString();
									if (value == 1000) return value.toLocaleString();
									if (value == 900) return value;
									if (value == 800) return value;
									if (value == 700) return value;
									if (value == 600) return value;
									if (value == 500) return value;
									if (value == 400) return value;
									if (value == 300) return value;
									if (value == 200) return value;
									if (value == 100) return value;
									if (value == 90) return value;
									if (value == 80) return value;
									if (value == 70) return value;
									if (value == 60) return value;
									if (value == 50) return value;
									if (value == 40) return value;
									if (value == 30) return value;
									if (value == 20) return value;
									if (value == 10) return value;
								}
							}
						}
					]
				}
			}
		});
		myChart.update();
	});
}
function countryDataTable(data) {
	$(document).ready(function() {
		let lastArrTested = data.tested[data.tested.length - 1];
		let lastArrTimeSeries = data.cases_time_series[data.cases_time_series.length - 1];
		let numbersConfirmed = parseInt(lastArrTimeSeries.totalconfirmed).toLocaleString();
		let numbersDeceased = parseInt(lastArrTimeSeries.totaldeceased).toLocaleString();
		let numbersRecovered = parseInt(lastArrTimeSeries.totalrecovered).toLocaleString();
		let filteredArr = data.statewise.filter(function(states) {
			return states.statecode !== 'TT';
		});
		//Get months/30 days
		data.cases_time_series.slice(Math.max(data.cases_time_series.length - 30, 1)).forEach(function(daily) {
			dailyConfirmedMonth.push(daily.dailyconfirmed);
			numbersConfirmedMonth += parseInt(daily.dailyconfirmed);
			dailyDeceasedMonth.push(daily.dailydeceased);
			numbersDeceasedMonth += parseInt(daily.dailydeceased);
			dailyRecoveredMonth.push(daily.dailyrecovered);
			numbersRecoveredMonth += parseInt(daily.dailyrecovered);
			labelsDateMonth.push(daily.date);
		});

		//Get 14 days
		data.cases_time_series.slice(Math.max(data.cases_time_series.length - 14, 1)).forEach(function(daily) {
			dailyConfirmedWeeks.push(daily.dailyconfirmed);
			numbersConfirmedWeeks += parseInt(daily.dailyconfirmed);
			dailyDeceasedWeeks.push(daily.dailydeceased);
			numbersDeceasedWeeks += parseInt(daily.dailydeceased);
			dailyRecoveredWeeks.push(daily.dailyrecovered);
			numbersRecoveredWeeks += parseInt(daily.dailyrecovered);
			labelsDateWeeks.push(daily.date);
		});

		//Get since beginning
		data.cases_time_series.forEach(function(daily) {
			dailyConfirmed.push(daily.dailyconfirmed);
			dailyDeceased.push(daily.dailydeceased);
			dailyRecovered.push(daily.dailyrecovered);
			labelsDate.push(daily.date);
		});

		//Default Chart
		generateChart(labelsDateMonth, dailyConfirmedMonth, null, 'Confirmed', gradientBlue, borderBlue);

		//Default legend numbers
		populateNumbers(
			numbersConfirmedMonth.toLocaleString(),
			numbersRecoveredMonth.toLocaleString(),
			numbersDeceasedMonth.toLocaleString(),
			'since month'
		);
		Chart.defaults.global.defaultFontColor = 'grey';
		//ICMR report in datatable
		$('#icmrReport').html(
			`A total of <span class="text-dark">${parseInt(
				lastArrTested.totalsamplestested
			).toLocaleString()}</span> samples have been tested as of ${lastArrTested.updatetimestamp}. View official report by ICMR <a href="${lastArrTested.source}" target="_blank">here</a>`
		);

		//States Datatable
		let table = $('#dataTableCountry').DataTable({
			data: filteredArr,
			pagingType: 'numbers',
			pageLength: 25,
			language: {
				searchPlaceholder: 'e.g. maharashtra',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					title: 'State <p class="small">Last updated DD/MM/YYYY</p>',
					data: 'state',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}<span class="text-muted mb-0 small">
						(${row.lastupdatedtime})</span><p class="mb-0"><span class="small text-primary border-top-0 border-bottom border-right-0 border-left-0 border-blue">See Districts</span></p>`;
					}
				},
				{
					title: 'Confirmed',
					data: 'confirmed',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return parseInt(row.deltaconfirmed)
							? `${parseInt(
									data
								).toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.deltaconfirmed
								).toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
									parseInt(row.confirmed),
									parseInt(row.deltaconfirmed)
								)}%)</span></p>`
							: parseInt(data).toLocaleString();
					}
				},
				{
					title: 'Active',
					data: 'active',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${parseInt(data).toLocaleString()}`;
					}
				},
				{
					title: 'Recovered',
					data: 'recovered',
					data: 'confirmed',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return parseInt(row.deltarecovered)
							? `${parseInt(
									data
								).toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.deltarecovered
								).toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
									parseInt(row.recovered),
									parseInt(row.deltarecovered)
								)}%)</span></p>`
							: parseInt(data).toLocaleString();
					}
				},
				{
					title: 'Deaths',
					data: 'deaths',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return parseInt(row.deltadeaths)
							? `${parseInt(
									data
								).toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.deltadeaths
								).toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
									parseInt(row.deaths),
									parseInt(row.deltadeaths)
								)}%)</span></p>`
							: parseInt(data).toLocaleString();
					}
				}
			],
			order: [ [ 1, 'desc' ] ]
		});
		$('#confirmedRadio').click(function() {
			myChart.destroy();
			if ($('#sinceBeginning').is(':checked')) {
				generateChart(labelsDate, dailyConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
			}
			if ($('#sinceMonth').is(':checked')) {
				generateChart(
					labelsDateMonth,
					dailyConfirmedMonth,
					myChart.config.type,
					'Confirmed',
					gradientBlue,
					borderBlue
				);
			}
			if ($('#sinceWeeks').is(':checked')) {
				generateChart(
					labelsDateWeeks,
					dailyConfirmedWeeks,
					myChart.config.type,
					'Confirmed',
					gradientBlue,
					borderBlue
				);
			}
			myChart.update();
		});
		$('#recoveredRadio').click(function() {
			myChart.destroy();
			if ($('#sinceBeginning').is(':checked')) {
				generateChart(labelsDate, dailyRecovered, myChart.config.type, 'Recovered', gradientGreen, borderGreen);
			}
			if ($('#sinceMonth').is(':checked')) {
				generateChart(
					labelsDateMonth,
					dailyRecoveredMonth,
					myChart.config.type,
					'Recovered',
					gradientGreen,
					borderGreen
				);
			}
			if ($('#sinceWeeks').is(':checked')) {
				generateChart(
					labelsDateWeeks,
					dailyRecoveredWeeks,
					myChart.config.type,
					'Recovered',
					gradientGreen,
					borderGreen
				);
			}
			myChart.update();
		});
		$('#deathsRadio').click(function() {
			myChart.destroy();
			if ($('#sinceBeginning').is(':checked')) {
				generateChart(labelsDate, dailyDeceased, myChart.config.type, 'Deaths', gradientRed, borderRed);
			}
			if ($('#sinceMonth').is(':checked')) {
				generateChart(
					labelsDateMonth,
					dailyDeceasedMonth,
					myChart.config.type,
					'Deaths',
					gradientRed,
					borderRed
				);
			}
			if ($('#sinceWeeks').is(':checked')) {
				generateChart(
					labelsDateWeeks,
					dailyDeceasedWeeks,
					myChart.config.type,
					'Deaths',
					gradientRed,
					borderRed
				);
			}
			myChart.update();
		});
		$('#sinceBeginning').click(function() {
			populateNumbers(
				numbersConfirmed.toLocaleString(),
				numbersRecovered.toLocaleString(),
				numbersDeceased.toLocaleString(),
				'since beginning'
			);
			myChart.destroy();
			if ($('#confirmedRadio').is(':checked')) {
				generateChart(labelsDate, dailyConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
			}
			if ($('#recoveredRadio').is(':checked')) {
				generateChart(labelsDate, dailyRecovered, myChart.config.type, 'Recovered', gradientGreen, borderGreen);
			}
			if ($('#deathsRadio').is(':checked')) {
				generateChart(labelsDate, dailyDeceased, myChart.config.type, 'Deaths', gradientRed, borderRed);
			}
			myChart.update();
		});
		$('#sinceMonth').click(function() {
			populateNumbers(
				numbersConfirmedMonth.toLocaleString(),
				numbersRecoveredMonth.toLocaleString(),
				numbersDeceasedMonth.toLocaleString(),
				'since a month'
			);
			myChart.destroy();
			if ($('#confirmedRadio').is(':checked')) {
				generateChart(
					labelsDateMonth,
					dailyConfirmedMonth,
					myChart.config.type,
					'Confirmed',
					gradientBlue,
					borderBlue
				);
			}
			if ($('#recoveredRadio').is(':checked')) {
				generateChart(
					labelsDateMonth,
					dailyRecoveredMonth,
					myChart.config.type,
					'Recovered',
					gradientGreen,
					borderGreen
				);
			}
			if ($('#deathsRadio').is(':checked')) {
				generateChart(
					labelsDateMonth,
					dailyDeceasedMonth,
					myChart.config.type,
					'Deaths',
					gradientRed,
					borderRed
				);
			}
			myChart.update();
		});
		$('#sinceWeeks').click(function() {
			populateNumbers(
				numbersConfirmedWeeks.toLocaleString(),
				numbersRecoveredWeeks.toLocaleString(),
				numbersDeceasedWeeks.toLocaleString(),
				'since 2 weeks'
			);
			myChart.destroy();
			if ($('#confirmedRadio').is(':checked')) {
				generateChart(
					labelsDateWeeks,
					dailyConfirmedWeeks,
					myChart.config.type,
					'Confirmed',
					gradientBlue,
					borderBlue
				);
			}
			if ($('#recoveredRadio').is(':checked')) {
				generateChart(
					labelsDateWeeks,
					dailyRecoveredWeeks,
					myChart.config.type,
					'Recovered',
					gradientGreen,
					borderGreen
				);
			}
			if ($('#deathsRadio').is(':checked')) {
				generateChart(
					labelsDateWeeks,
					dailyDeceasedWeeks,
					myChart.config.type,
					'Deaths',
					gradientRed,
					borderRed
				);
			}
			myChart.update();
		});
		// AJAX to get district data and save in variable
		statesData = $.parseJSON(
			$.ajax({
				type: 'GET',
				url: 'https://api.covid19india.org/v2/state_district_wise.json',
				data: filteredArr,
				async: false,
				beforeSend: function(xhr) {
					console.log('beforeSend');
				},
				dataType: 'json',
				success: function(data) {
					statesData = data.responseText;
				}
			}).responseText
		);

		// District datatable on click
		$('#dataTableCountry tbody').on('click', 'tr', function() {
			let stateCode = table.row(this).data().statecode;
			$('#stateName').text(table.row(this).data().state);
			let filterState = statesData.filter(function(state) {
				return state.statecode === stateCode;
			});

			$('#stateModal').modal();
			$('#dataTableState').DataTable({
				destroy: true,
				data: filterState[0].districtData,
				pagingType: 'numbers',
				pageLength: 25,
				language: {
					searchPlaceholder: 'search district',
					loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
				},
				columns: [
					{
						title: 'District',
						data: 'district'
					},
					{
						title: 'Confirmed',
						data: 'confirmed',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return parseInt(row.delta.confirmed)
								? `${parseInt(
										data
									).toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
										row.delta.confirmed
									).toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
										parseInt(row.confirmed),
										parseInt(row.delta.confirmed)
									)}%)</span></p>`
								: parseInt(data).toLocaleString();
						}
					},
					{
						title: 'Active',
						data: 'active',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return `${parseInt(data).toLocaleString()}`;
						}
					},
					{
						title: 'Recovered',
						data: 'recovered',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return parseInt(row.delta.recovered)
								? `${parseInt(
										data
									).toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
										row.delta.recovered
									).toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
										parseInt(row.recovered),
										parseInt(row.delta.recovered)
									)}%)</span></p>`
								: parseInt(data).toLocaleString();
						}
					},
					{
						title: 'Deaths',
						data: 'deceased',
						render: function(data, type, row) {
							if (type === 'type' || type === 'sort') {
								return data;
							}
							return parseInt(row.delta.deceased)
								? `${parseInt(
										data
									).toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
										row.delta.deceased
									).toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
										parseInt(row.deceased),
										parseInt(row.delta.deceased)
									)}%)</span></p>`
								: parseInt(data).toLocaleString();
						}
					}
				],
				order: [ [ 1, 'desc' ] ]
			});
		});
	});
}
