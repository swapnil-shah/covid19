$(document).ready(function() {
	getStatsDataSet().then((data) => {
		cardStats(data);
		dataSet(data);
	});

	let table = $('#dataTableCountry').DataTable({
		ajax: {
			url: 'https://disease.sh/v2/states?sort=cases&yesterday=true',
			type: 'GET',
			cache: false,
			dataSrc: function(json) {
				return json;
			}
		},
		pagingType: 'numbers',
		pageLength: 10,
		stateSave: true,
		language: {
			searchPlaceholder: 'e.g. new jersey',
			loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
		},
		columns: [
			{
				title: 'State <small class="text-dark font-weight-600">(# Tested)</small>',
				data: 'state',
				render: function(data, type, row) {
					return `${data} <span class="text-gray-600"><small class="text-dark font-weight-600">(${populationFormat(
						row.tests
					)})</small></span><p class="mb-0"><span class="small text-primary border-top-0 border-bottom border-right-0 border-left-0 border-blue">See Counties</span></p>`;
				}
			},
			{
				title: 'Confirmed',
				data: 'cases',
				render: function(data, type, row) {
					if (type === 'type' || type === 'sort') {
						return data;
					}
					return row.todayCases
						? `${data.toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${row.todayCases.toLocaleString()}<span class="font-weight-light small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
								row.cases,
								row.todayCases
							)}%)</span></p>`
						: `${data ? data.toLocaleString() : ''}`;
				}
			},
			{
				title: 'Active',
				data: 'active',
				render: function(data, type, row) {
					if (type === 'type' || type === 'sort') {
						return data;
					}
					return `${data.toLocaleString()}`;
				}
			},
			{
				title: 'Deaths',
				data: 'deaths',
				render: function(data, type, row) {
					if (type === 'type' || type === 'sort') {
						return data;
					}
					return row.todayDeaths
						? `${data.toLocaleString()}<p class="font-weight-600 text-danger mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${row.todayDeaths.toLocaleString()}<span class="font-weight-light text-danger small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
								row.deaths,
								row.todayDeaths
							)}%)</span></p>`
						: `${data ? data.toLocaleString() : ''}`;
				}
			}
		],
		order: [ [ 1, 'desc' ] ]
	});
	// District datatable on click
	$('#dataTableCountry tbody').on('click', 'tr', function() {
		let stateName = table.row(this).data().state;
		$('#dataTableState').html('');
		$('#stateModal').modal();
		$('#stateName').text(stateName);
		$('#dataTableState').DataTable({
			destroy: true,
			ajax: {
				url: 'https://disease.sh/v2/historical/usacounties/' + stateName.toLowerCase() + '?lastdays=1',
				type: 'GET',
				dataSrc: function(data) {
					return data;
				},
				error: function(xhr) {
					if (xhr.status == 404) {
						$('#dataTableState').html(
							'<div class="text-center text-dark py-4">Sorry, no county data is available for this state.</div>'
						);
					} else {
						$('#dataTableState').html(
							'<div class="text-center text-dark py-4">Sorry, something went wrong. Please try again later.</div>'
						);
					}
				}
			},
			pagingType: 'numbers',
			pageLength: 10,
			language: {
				searchPlaceholder: 'search district',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					title: 'District',
					data: 'county'
				},
				{
					title: 'Confirmed',
					data: 'timeline.cases',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return Object.values(row.timeline.cases);
						}
						return Object.values(row.timeline.cases).toLocaleString();
					}
				},
				{
					title: 'Deaths',
					data: 'timeline.deaths',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return Object.values(row.timeline.deaths);
						}
						return Object.values(row.timeline.deaths).toLocaleString();
					}
				}
			],
			order: [ [ 1, 'desc' ] ]
		});
	});
	fillNewsCards();
	addStates();
	$('#selectNewsRegion').on('change', function() {
		let value = $(this).val();
		document.getElementById('card-deck').innerHTML =
			'<div class="text-center"><i class="icon-spinner spinner-animate"></i></div>';
		const newsUri = 'https://api.smartable.ai/coronavirus/news/' + value;
		axios
			.get(newsUri, {
				headers: {
					'Subscription-Key': API_KEY_SMARTTABLE
				}
			})
			.then((response) => {
				getNewsResults(response.data);
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
	});
});
const newsUri = 'https://api.smartable.ai/coronavirus/news/US';
const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';
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
let numbersConfirmedBeginning = 0;
let numbersDeathsBeginning = 0;
let numbersRecoveredBeginning = 0;
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
//US cases
function getStatsDataSet() {
	return axios
		.get('https://corona-api.com/countries/us?include=timeline')
		.then((response) => {
			return response.data.data;
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
function cardStats(dataSet) {
	let data = dataSet.timeline.slice(1);
	document.getElementById('last-updated').innerHTML =
		'As of <span class="text-gray-800">' + formatDate(data[0].updated_at) + '</span>';
	document.getElementById('number-active').innerText = data[0].active.toLocaleString();
	document.getElementById('number-confirmed').innerText = data[0].confirmed.toLocaleString();
	document.getElementById('number-recovered').innerText = data[0].recovered.toLocaleString();
	document.getElementById('number-deaths').innerText = data[0].deaths.toLocaleString();
	if (data[0].new_confirmed) {
		document.getElementById('today-confirmed').innerText = '+' + data[0].new_confirmed.toLocaleString();
		document.getElementById('per-confirmed').innerHTML =
			Math.sign(percentageChangeTotal(data[0].confirmed, data[0].new_confirmed)) === 1
				? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(data[0].confirmed, data[0].new_confirmed)}%)`
				: '';
	}
	if (data[0].new_recovered) {
		document.getElementById('today-recovered').innerText = '+' + data[0].new_recovered.toLocaleString();
		document.getElementById('per-recovered').innerHTML =
			Math.sign(percentageChangeTotal(data[0].confirmed, data[0].new_recovered)) === 1
				? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(data[0].confirmed, data[0].new_recovered)}%)`
				: '';
	}
	if (data[0].new_deaths) {
		document.getElementById('today-deaths').innerText = '+' + data[0].new_deaths.toLocaleString();
		document.getElementById('per-deaths').innerHTML =
			Math.sign(percentageChangeTotal(data[0].deaths, data[0].new_deaths)) === 1
				? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(data[0].deaths, data[0].new_deaths)}%)`
				: '';
	}
	document.getElementById('per-active').innerHTML = '';
}

let fillNewsCards = () => {
	axios
		.get(newsUri, {
			headers: {
				'Subscription-Key': API_KEY_SMARTTABLE
			}
		})
		.then((response) => {
			getNewsResults(response.data);
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
};
let addStates = () => {
	axios
		.get('https://covidtracking.com/api/v1/states/current.json')
		.then(function(response) {
			response.data.forEach(function(state) {
				let regionNewsSelect = document.getElementById('selectNewsRegion');
				regionNewsSelect.options[regionNewsSelect.options.length] = new Option(
					acronymToFullName(state.state),
					'US-' + state.state
				);
			});
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
};

function populateNumbers(confirmed, recovered, deaths, text) {
	document.getElementById('total-confirmed').innerHTML = `<span style="color:${borderBlue}">${confirmed}</span>`;
	document.getElementById('total-recovered').innerHTML = `<span style="color:${borderGreen}">${recovered}</span>`;
	document.getElementById('total-deaths').innerHTML = `<span style="color:${borderRed}">${deaths}</span>`;
	document.getElementById('total-date').innerHTML = ` ${text}`;
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
			backgroundColor: 'rgb(255,255,255)',
			bodyFontColor: '#858796',
			titleMarginBottom: 10,
			titleFontColor: '#6e707e',
			titleFontSize: 16,
			borderColor: '#dddfeb',
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
									if (value == 2000000) return value.toLocaleString();
									if (value == 1000000) return value.toLocaleString();
									if (value == 900000) return value.toLocaleString();
									if (value == 800000) return value.toLocaleString();
									if (value == 700000) return value.toLocaleString();
									if (value == 600000) return value.toLocaleString();
									if (value == 500000) return value.toLocaleString();
									if (value == 400000) return value.toLocaleString();
									if (value == 300000) return value.toLocaleString();
									if (value == 200000) return value.toLocaleString();
									if (value == 100000) return value.toLocaleString();
									if (value == 90000) return value.toLocaleString();
									if (value == 80000) return value.toLocaleString();
									if (value == 70000) return value.toLocaleString();
									if (value == 60000) return value.toLocaleString();
									if (value == 50000) return value.toLocaleString();
									if (value == 40000) return value.toLocaleString();
									if (value == 30000) return value.toLocaleString();
									if (value == 20000) return value.toLocaleString();
									if (value == 10000) return value.toLocaleString();
									if (value == 9000) return value.toLocaleString();
									if (value == 8000) return value.toLocaleString();
									if (value == 7000) return value.toLocaleString();
									if (value == 6000) return value.toLocaleString();
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
function dataSet(data) {
	let filteredArr = data.timeline.slice(1);
	let asOfDate = '';
	document.getElementById('sinceBeginningDate').innerHTML = `Until ${formatDate(filteredArr[0].updated_at)}`;
	let numbersConfirmed = filteredArr[0].confirmed;
	let numbersDeceased = filteredArr[0].deaths;
	let numbersRecovered = filteredArr[0].recovered;
	//Get months/30 days
	filteredArr.slice(0, 30).forEach(function(daily) {
		confirmedMonth.push(daily.new_confirmed);
		deathsMonth.push(daily.new_deaths);
		recoveredMonth.push(daily.new_recovered);
		numbersConfirmedMonth += daily.new_confirmed;
		numbersDeathsMonth += daily.new_deaths;
		numbersRecoveredMonth += daily.new_recovered;
		labelsDateMonth.push(formatDate(daily.date));
	});

	//Get 14 days
	filteredArr.slice(0, 14).forEach(function(daily) {
		confirmedWeeks.push(daily.new_confirmed);
		deathsWeeks.push(daily.new_deaths);
		recoveredWeeks.push(daily.new_recovered);
		numbersConfirmedWeeks += daily.new_confirmed;
		numbersDeathsWeeks += daily.new_deaths;
		numbersRecoveredWeeks += daily.new_recovered;
		labelsDateWeeks.push(formatDate(daily.date));
	});

	//Get since beginning
	filteredArr.forEach(function(daily) {
		casesConfirmed.push(daily.new_confirmed);
		casesDeaths.push(daily.new_deaths);
		casesRecovered.push(daily.new_recovered);
		labelsDate.push(formatDate(daily.date));
	});
	confirmedMonth.reverse();
	deathsMonth.reverse();
	recoveredMonth.reverse();
	labelsDateMonth.reverse();
	confirmedWeeks.reverse();
	deathsWeeks.reverse();
	recoveredWeeks.reverse();
	labelsDateWeeks.reverse();
	casesConfirmed.reverse();
	casesDeaths.reverse();
	casesRecovered.reverse();
	labelsDate.reverse();
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
	Chart.defaults.global.animation.duration = 2500;
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
			asOfDate
		);
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
function getNewsResults(data) {
	let newsCards = document.getElementById('card-deck');
	let newsResultsNumber = document.getElementById('news-results-number');
	let optionName = $('#selectNewsRegion option:selected').text();
	let output = '';

	if (data.news) {
		newsResultsNumber.innerText = `${data.news.length} results found for ${optionName}`;
		data.news.forEach(function(item) {
			output += `
				<div class="col-sm-12 my-3 pl-0 pr-1">
					<a class="card lift lift-sm p-3 news-card border-bottom-lg" href="${item.webUrl}" target="_blank" style="border-color: rgba(31, 45, 65, 0.5) !important;">
						<div class="row no-gutters align-items-center py-2">
							<h5 class="card-title">${item.title}</h5>
							<p class="text-gray-600 mb-1">${item.excerpt}</p>
							<p class="mb-0 text-muted small mb-3"><i class="far fa-newspaper"></i> Published by <span class="font-weight-600 text-gray-600">${item
								.provider.name}</span> ${timeDifference(item.publishedDateTime)}
								</p>
							<p class="text-primary">View full article</p>
						</div>
					</a>
				</div>
				`;
		});
	} else {
		output += `<div class="col-sm-12 p-4 mx-auto text-muted">No data available for this region. Please selet another option.</div>`;
	}
	newsCards.innerHTML = output;
}
$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
