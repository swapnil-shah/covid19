$(document).ready(function() {
	getStatsDataSet().then((data) => {
		cardStats(data);
		countryDataSet(data);
	});
	newsResults();
});

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
let casesConfirmed = [];
let casesDeaths = [];
let casesRecovered = [];
let labelsDate = [];
let numbersConfirmed = 0;
let numbersDeceased = 0;
let numbersRecovered = 0;
let confirmedMonth = [];
let deathsMonth = [];
let recoveredMonth = [];
let labelsDateMonth = [];
let numbersConfirmedMonth = 0;
let numbersDeathsMonth = 0;
let numbersRecoveredMonth = 0;
let confirmedWeeks = [];
let deathsWeeks = [];
let recoveredWeeks = [];
let labelsDateWeeks = [];
let numbersConfirmedWeeks = 0;
let numbersDeathsWeeks = 0;
let numbersRecoveredWeeks = 0;

function getStatsDataSet() {
	return axios
		.get('https://api.covid19india.org/data.json')
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);
				console.log('Error Data: ', error.response.data);
				console.log('Error Status: ', error.response.status);
				console.log('Error Headers: ', error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received. `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log('Error Request: ', error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error Message: ', error.message);
			}
			console.log('Error config: ', error.config);
		});
}
function cardStats(data) {
	data.statewise.forEach(function(states) {
		if (states.statecode === 'TT') {
			document.getElementById('last-updated').innerHTML =
				'Last updated <span class="text-gray-800">' + states.lastupdatedtime + '</span>';
			document.getElementById('number-active').innerText = parseInt(states.active).toLocaleString();
			document.getElementById('number-confirmed').innerText = parseInt(states.confirmed).toLocaleString();
			document.getElementById('number-recovered').innerText = parseInt(states.recovered).toLocaleString();
			document.getElementById('number-deaths').innerText = parseInt(states.deaths).toLocaleString();
			parseInt(states.deltaconfirmed)
				? (document.getElementById('today-confirmed').innerText =
						'+' + parseInt(states.deltaconfirmed).toLocaleString())
				: (document.getElementById('today-confirmed').innerText = '');
			parseInt(states.deltadeaths)
				? (document.getElementById('today-deaths').innerText =
						'+' + parseInt(states.deltadeaths).toLocaleString())
				: (document.getElementById('today-deaths').innerText = '');
			parseInt(states.deltarecovered)
				? (document.getElementById('today-recovered').innerText =
						'+' + parseInt(states.deltarecovered).toLocaleString())
				: (document.getElementById('today-recovered').innerText = '');
			document.getElementById('per-active').innerHTML = '';
			document.getElementById('per-confirmed').innerHTML =
				Math.sign(percentageChangeTotal(parseInt(states.confirmed), parseInt(states.deltaconfirmed))) === 1
					? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(
							parseInt(states.confirmed),
							parseInt(states.deltaconfirmed)
						)}%)`
					: (document.getElementById('today-deaths').innerText = '');
			document.getElementById('per-recovered').innerHTML =
				Math.sign(percentageChangeTotal(parseInt(states.recovered), parseInt(states.deltarecovered))) === 1
					? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(
							parseInt(states.recovered),
							parseInt(states.deltarecovered)
						)}%)`
					: '';
			document.getElementById('per-deaths').innerHTML =
				Math.sign(percentageChangeTotal(parseInt(states.deaths), parseInt(states.deltadeaths))) === 1
					? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(
							parseInt(states.deaths),
							parseInt(states.deltadeaths)
						)}%)`
					: '';
		}
	});
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
		title: {
			display: true,
			text: 'Tap/hover on the bar or point to see cases for that day'
		},
		tooltips: {
			backgroundColor: 'rgb(255,255,255)',
			bodyFontColor: '#6e707e',
			titleMarginBottom: 5,
			titleFontColor: '#485260',
			titleFontSize: 12,
			borderColor: '#dddfeb',
			borderWidth: 1,
			caretPadding: 5,
			displayColors: false,
			xPadding: 10,
			yPadding: 10,
			callbacks: {
				label: function(tooltipItem, data) {
					return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
				}
			}
		},
		title: {
			display: true,
			text: 'Tap/hover on the bar or point to see cases for that day'
		},
		scales: {
			yAxes: [
				{
					type: $('#linearRadio').is(':checked') ? 'linear' : 'logarithmic',
					ticks: {
						autoSkip: true,
						beginAtZero: true,
						callback: function(value) {
							return value.toLocaleString();
						}
					}
				}
			]
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
				title: {
					display: true,
					text: 'Tap/hover on the bar or point to see cases for that day'
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
				title: {
					display: true,
					text: 'Tap/hover on the bar or point to see cases for that day'
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
			type: myChart.config.type === 'bar' ? 'bar' : 'line',
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
				title: {
					display: true,
					text: 'Tap/hover on the bar or point to see cases for that day'
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
			type: myChart.config.type === 'bar' ? 'bar' : 'line',
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
				title: {
					display: true,
					text: 'Tap/hover on the bar or point to see cases for that day'
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
function countryDataSet(data) {
	let filteredArr = [];
	data.statewise.forEach(function(states) {
		if (states.statecode !== 'TT') {
			filteredArr.push(states);
		}
	});
	let lastArrTested = data.tested[data.tested.length - 1];
	let firstArrTimeSeries = data.cases_time_series[0];
	let lastArrTimeSeries = data.cases_time_series[data.cases_time_series.length - 1];
	let asOfDate = `${firstArrTimeSeries.date} to ${lastArrTimeSeries.date}`;
	numbersConfirmed = parseInt(lastArrTimeSeries.totalconfirmed).toLocaleString();
	numbersDeceased = parseInt(lastArrTimeSeries.totaldeceased).toLocaleString();
	numbersRecovered = parseInt(lastArrTimeSeries.totalrecovered).toLocaleString();
	//Get months/30 days

	$('#icmrReport').html(
		`A total of <span class="text-dark">${parseInt(
			lastArrTested.totalsamplestested
		).toLocaleString()}</span> samples have been tested as of ${lastArrTested.updatetimestamp}. View official report by ICMR <a href="${lastArrTested.source}" target="_blank">here</a>`
	);
	data.cases_time_series.slice(Math.max(data.cases_time_series.length - 30, 1)).forEach(function(daily) {
		confirmedMonth.push(daily.dailyconfirmed);
		numbersConfirmedMonth += parseInt(daily.dailyconfirmed);
		deathsMonth.push(daily.dailydeceased);
		numbersDeathsMonth += parseInt(daily.dailydeceased);
		recoveredMonth.push(daily.dailyrecovered);
		numbersRecoveredMonth += parseInt(daily.dailyrecovered);
		labelsDateMonth.push(daily.date);
	});

	//Get 14 days
	data.cases_time_series.slice(Math.max(data.cases_time_series.length - 14, 1)).forEach(function(daily) {
		confirmedWeeks.push(daily.dailyconfirmed);
		numbersConfirmedWeeks += parseInt(daily.dailyconfirmed);
		deathsWeeks.push(daily.dailydeceased);
		numbersDeathsWeeks += parseInt(daily.dailydeceased);
		recoveredWeeks.push(daily.dailyrecovered);
		numbersRecoveredWeeks += parseInt(daily.dailyrecovered);
		labelsDateWeeks.push(daily.date);
	});

	//Get since beginning
	data.cases_time_series.forEach(function(daily) {
		casesConfirmed.push(daily.dailyconfirmed);
		casesDeaths.push(daily.dailydeceased);
		casesRecovered.push(daily.dailyrecovered);
		labelsDate.push(daily.date);
	});

	//Default Chart
	generateChart(labelsDateMonth, confirmedMonth, null, 'Confirmed', gradientBlue, borderBlue);

	//Default legend numbers
	populateNumbers(
		numbersConfirmedMonth.toLocaleString(),
		numbersRecoveredMonth.toLocaleString(),
		numbersDeathsMonth.toLocaleString(),
		'Recent Month'
	);
	Chart.defaults.global.defaultFontColor = '#dddfeb';
	Chart.defaults.global.defaultFontFamily = 'Nunito,-apple-system,Roboto,Helvetica Neue,Arial,sans-serif';
	Chart.defaults.global.animation.duration = 2000;

	//States Datatable
	let table = $('#dataTableCountry')
		.on('init.dt', function() {
			$('#loader').hide();
		})
		.DataTable({
			data: filteredArr,
			pagingType: 'numbers',
			pageLength: 10,
			language: {
				searchPlaceholder: 'e.g. maharashtra',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					title: 'State <span class="text-muted small">(Last updated)</span>',
					data: 'state',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}<div class="text-muted mb-0 small">
						(${row.lastupdatedtime})</div><p class="mb-0"><span class="small text-primary border-top-0 border-bottom border-right-0 border-left-0 border-blue">See Districts</span></p>`;
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
								).toLocaleString()}<span class="font-weight-light small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
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
								).toLocaleString()}<p class="font-weight-600 text-success mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.deltarecovered
								).toLocaleString()}<span class="font-weight-light text-success small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
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
								).toLocaleString()}<p class="font-weight-600 text-danger mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.deltadeaths
								).toLocaleString()}<span class="font-weight-light text-danger small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
									parseInt(row.deaths),
									parseInt(row.deltadeaths)
								)}%)</span></p>`
							: parseInt(data).toLocaleString();
					}
				}
			],
			order: [ [ 1, 'desc' ] ]
		});
	subDataTable(table);

	$('#confirmedRadio').click(function() {
		myChart.destroy();
		if ($('#sinceBeginning').is(':checked')) {
			generateChart(labelsDate, casesConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#sinceMonth').is(':checked')) {
			generateChart(labelsDateMonth, confirmedMonth, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(labelsDateWeeks, confirmedWeeks, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		myChart.update();
	});
	$('#recoveredRadio').click(function() {
		myChart.destroy();
		console.log('After destroy', myChart.config.type);
		if ($('#sinceBeginning').is(':checked')) {
			generateChart(labelsDate, casesRecovered, myChart.config.type, 'Recovered', gradientGreen, borderGreen);
		}
		if ($('#sinceMonth').is(':checked')) {
			generateChart(
				labelsDateMonth,
				recoveredMonth,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(
				labelsDateWeeks,
				recoveredWeeks,
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
			generateChart(labelsDate, casesDeaths, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		if ($('#sinceMonth').is(':checked')) {
			generateChart(labelsDateMonth, deathsMonth, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(labelsDateWeeks, deathsWeeks, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
	$('#sinceBeginning').click(function() {
		populateNumbers(
			numbersConfirmed.toLocaleString(),
			numbersRecovered.toLocaleString(),
			numbersDeceased.toLocaleString(),
			`From the Beginning <span class="small">(${asOfDate})</span>`
		);
		$('[data-toggle="tooltip"]').tooltip();
		myChart.destroy();
		if ($('#confirmedRadio').is(':checked')) {
			generateChart(labelsDate, casesConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#recoveredRadio').is(':checked')) {
			generateChart(labelsDate, casesRecovered, myChart.config.type, 'Recovered', gradientGreen, borderGreen);
		}
		if ($('#deathsRadio').is(':checked')) {
			generateChart(labelsDate, casesDeaths, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
	$('#sinceMonth').click(function() {
		populateNumbers(
			numbersConfirmedMonth.toLocaleString(),
			numbersRecoveredMonth.toLocaleString(),
			numbersDeathsMonth.toLocaleString(),
			'Recent Month'
		);
		myChart.destroy();
		if ($('#confirmedRadio').is(':checked')) {
			generateChart(labelsDateMonth, confirmedMonth, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#recoveredRadio').is(':checked')) {
			generateChart(
				labelsDateMonth,
				recoveredMonth,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		if ($('#deathsRadio').is(':checked')) {
			generateChart(labelsDateMonth, deathsMonth, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
	$('#sinceWeeks').click(function() {
		populateNumbers(
			numbersConfirmedWeeks.toLocaleString(),
			numbersRecoveredWeeks.toLocaleString(),
			numbersDeathsWeeks.toLocaleString(),
			'Recent 2 Weeks'
		);
		myChart.destroy();
		if ($('#confirmedRadio').is(':checked')) {
			generateChart(labelsDateWeeks, confirmedWeeks, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#recoveredRadio').is(':checked')) {
			generateChart(
				labelsDateWeeks,
				recoveredWeeks,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		if ($('#deathsRadio').is(':checked')) {
			generateChart(labelsDateWeeks, deathsWeeks, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
}

function subDataTable(table) {
	statesData = $.parseJSON(
		$.ajax({
			type: 'GET',
			url: 'https://api.covid19india.org/v2/state_district_wise.json',
			async: false,
			beforeSend: function(xhr) {},
			dataType: 'json',
			success: function(data) {
				statesData = data.responseText;
			},
			error: function(xhr, status, error) {
				if (xhr.status == 404) {
					$('#dataTableState').html(
						'<div class="text-center text-dark py-4">Sorry, no state data is available for this state.</div>'
					);
				} else {
					$('#dataTableState').html(
						'<div class="text-center text-dark py-4">Sorry, something went wrong. Please try again later.</div>'
					);
				}
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
			pageLength: 10,
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
								).toLocaleString()}<p class="font-weight-600 text-danger mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.delta.confirmed
								).toLocaleString()}<span class="font-weight-light text-danger small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
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
								).toLocaleString()}<p class="font-weight-600 text-success mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.delta.recovered
								).toLocaleString()}<span class="font-weight-light text-success small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
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
}
function populateNumbers(confirmed, recovered, deaths, text) {
	document.getElementById('total-confirmed').innerHTML = `<span style="color:${borderBlue}">${confirmed}</span>`;
	document.getElementById('total-recovered').innerHTML = `<span style="color:${borderGreen}">${recovered}</span>`;
	document.getElementById('total-deaths').innerHTML = `<span style="color:${borderRed}">${deaths}</span>`;
	document.getElementById('total-date').innerHTML = `${text}`;
}
function newsResults() {
	newsUri =
		'https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?q=COVID&country=in&apiKey=7e2e5ed46901476baa79347a66cc2b2c';
	axios
		.get(newsUri, { mode: 'cors' })
		.then((response) => {
			document.getElementById('card-deck').text = 'Loading..';
			let newsCards = document.getElementById('card-deck');
			let newsResultsNumber = document.getElementById('news-results-number');
			newsCards.innerHtml = `<div class="spinner-border" role="status">
			<span class="sr-only">Loading...</span>
		</div>`;
			let output = '';
			newsResultsNumber.innerText = `Showing ${response.data.totalResults} articles`;
			response.data.articles.forEach(function(item) {
				output += `
							<a class="card h-100 lift mx-md-3 ml-0 mr-3" href="${item.url}" target="_blank">
								<img class="card-img-top img-fluid" src="${item.urlToImage}" alt=""  onerror="this.src='../assets/img/news_image_placeholder_128x128.png';this.style='object-fit: none;background:#F5F5F5'" style="background:#F5F5F5">
								<div class="card-body">
									<h5 class="card-title mb-2">${item.title}</h5>
									<p class="text-muted small pb-0 mb-4"><span class="font-weight-600 text-gray-600"><span class="icon-newspaper mr-1"></span>${item
										.source.name}</span> ${timeDifference(item.publishedAt)}</p>
									<p class="card-text mb-1">${item.description}</p>
								</div>
								<div class="card-footer">
									<p class="text-primary text-center mb-0">View full article<span class="icon-new-tab ml-1"></span></p>
								</div>
							</a>
						`;
			});
			newsCards.innerHTML = output;
		})
		.catch((error) => {
			newsCards.innerHTML = 'Failed to fetch the data.<br>Error Message: ' + error.message;
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);
				console.log('Error Data: ', error.response.data);
				console.log('Error Status: ', error.response.status);
				console.log('Error Headers: ', error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received. `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log('Error Request: ', error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error Message: ', error.message);
			}
			console.log('Error config: ', error.config);
		});
}

$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
