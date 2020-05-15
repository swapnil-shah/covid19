// const totalCases = 'https://corona-api.com/timeline';
const newsUri = 'https://api.smartable.ai/coronavirus/news/global';
const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';
const getDashboardAll = 'https://disease.sh/v2/all';
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
let colors = [
	'#facd60',
	'#1ac0c6',
	'#58b368',
	'#555577',
	'#ff70a6',
	'#fb7756',
	'#c6ceb6',
	'#f9b4ab',
	'#efeeb4',
	'#f27421',
	'#fff385',
	'#84d2ff',
	'#85ffd0',
	'#f5caab',
	'#ff85f3',
	'#446699'
];
let colorsOpacity = [
	'rgba(250,205,96,0.1)',
	'rgba(26,192,198,0.1)',
	'rgba(88,179,104,0.1)',
	'rgba(85,85,119,0.1)',
	'rgba(255,112,166,0.1)',
	'rgba(251,119,86,0.1)',
	'rgba(198,206,182,0.1)',
	'rgba(249,180,171,0.1)',
	'rgba(239,238,180,0.1)',
	'rgba(242,116,33,0.1)',
	'rgba(255,243,133,0.1)',
	'rgba(132,210,255,0.1)',
	'rgba(133,255,208,0.1)'
];
const daysNum = 45;
const mostCountryNum = 5;

// Populate chart numbers
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
			backgroundColor: 'rgb(255,255,255)',
			bodyFontColor: '#858796',
			titleMarginBottom: 10,
			titleFontColor: '#6e707e',
			titleFontSize: 14,
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
		},
		title: {
			display: true,
			text: 'Global Daily Cases',
			position: 'bottom'
		}
	};
	if (myChart) {
		myChart.destroy();
	}

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
let getNewsResults = (data) => {
	let newsCards = document.getElementById('card-deck');
	let newsResultsNumber = document.getElementById('news-results-number');
	let optionName = $('#selectNewsRegion option:selected').text();
	let output = '';
	if (data.news.length > 0) {
		newsResultsNumber.innerText = `${data.news.length} results found for ${optionName}`;
		data.news.forEach(function(item) {
			output += `
				<div class="col-sm-12 my-3 pl-0 pr-1">
					<a class="card lift lift-sm p-3 news-card" href="${item.webUrl}" target="_blank">
						<h3 class="text-dark">${item.title}</h3>
						<p class="text-gray-600 mb-1"">${item.excerpt}</p>
						<p class="text-primary mb-3">View full article</p>
						<p class="mb-0 text-muted small"><i class="far fa-newspaper"></i> Published by <span class="font-weight-600 text-gray-600">${item
							.provider.name}</span> ${timeDifference(item.publishedDateTime)}</p>
						</>
					</a>
				</div>
				`;
		});
	} else {
		newsResultsNumber.innerText = '';
		output += `<div class="col-sm-12 p-4 mx-auto text-muted">No data available for this region. Please selet another option.</div>`;
	}
	newsCards.innerHTML = output;
};
let fillNewsCards = () => {
	axios
		.get(newsUri, {
			headers: {
				'Cache-Control': 'no-cache',
				'Subscription-Key': API_KEY_SMARTTABLE
			}
		})
		.then((response) => {
			document.getElementById('card-deck').innerText = 'Loading..';
			getNewsResults(response.data);
		})
		.catch((error) => {
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log(error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
};

//Dasboard cases
let fillNumberOfCases = () => {
	axios
		.get(getDashboardAll, { cache: 'no-cache' })
		.then((response) => {
			document.getElementById('last-updated').innerHTML =
				'Last updated <span class="text-gray-800">' + timeDifference(response.data.updated) + '</span>';
			document.getElementById('number-active').innerText = response.data.active.toLocaleString();
			document.getElementById('number-confirmed').innerText = response.data.cases.toLocaleString();
			document.getElementById('number-recovered').innerText = response.data.recovered.toLocaleString();
			document.getElementById('number-deaths').innerText = response.data.deaths.toLocaleString();
			document.getElementById('today-confirmed').innerText = '+' + response.data.todayCases.toLocaleString();
			document.getElementById('today-deaths').innerText = '+' + response.data.todayDeaths.toLocaleString();
			document.getElementById('per-active').innerHTML = '';
			document.getElementById('per-recovered').innerHTML = '';
			document.getElementById('per-confirmed').innerHTML =
				Math.sign(percentageChangeTotal(response.data.cases, response.data.todayCases)) === 1
					? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(
							response.data.cases,
							response.data.todayCases
						)}%)`
					: '';
			document.getElementById('per-deaths').innerHTML =
				Math.sign(percentageChangeTotal(response.data.deaths, response.data.todayDeaths)) === 1
					? `(<i class="icon-arrow-up2"></i>${percentageChangeTotal(
							response.data.deaths,
							response.data.todayDeaths
						)}%)`
					: '';
		})
		.catch((error) => {
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log(error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
};

let fillSituationReports = () => {
	axios
		.get('https://covid19-server.chrismichael.now.sh/api/v1/SituationReports', { cache: 'no-cache' })
		.then((response) => {
			let output = '';
			response.data.reports.forEach(function(report) {
				output += `<a class="list-group-item list-group-item-action" target="_blank" href="${report.pdf}"><i class="icon-file-pdf mr-2"></i>${report.report}<span class="float-right small text-muted">${report.date}</span></a>
						`;
			});
			document.getElementById('right-panel-reports').innerHTML = output;
		})
		.catch((error) => {
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log(error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
};
$(document).ready(function() {
	function getCountries(url) {
		axios
			.get(url, { cache: 'no-cache' })
			.then((reponse) => {
				let filteredArr = [];
				confirmedMonth = [];
				deathsMonth = [];
				recoveredMonth = [];
				labelsDateMonth = [];
				confirmedWeeks = [];
				deathsWeeks = [];
				recoveredWeeks = [];
				labelsDateWeeks = [];
				casesConfirmed = [];
				casesDeaths = [];
				casesRecovered = [];
				labelsDate = [];
				// console.log('getCountries -> reponse', reponse);
				if (Array.isArray(reponse.data.data)) {
					filteredArr = reponse.data.data.filter(function(daily) {
						return !daily.is_in_progress;
					});
				} else {
					filteredArr = reponse.data.data.timeline.filter(function(daily) {
						return !daily.is_in_progress;
					});
				}
				//Get months/30 days
				filteredArr.slice(0, 30).forEach(function(daily) {
					confirmedMonth.push(daily.new_confirmed);
					deathsMonth.push(daily.new_deaths);
					recoveredMonth.push(daily.new_recovered);
					labelsDateMonth.push(formatDate(daily.date));
				});

				//Get 14 days
				filteredArr.slice(0, 14).forEach(function(daily) {
					confirmedWeeks.push(daily.new_confirmed);
					deathsWeeks.push(daily.new_deaths);
					recoveredWeeks.push(daily.new_recovered);
					labelsDateWeeks.push(formatDate(daily.date));
				});
				// console.log('getCountries -> confirmedWeeks', confirmedWeeks);

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
				console.log(labelsDateWeeks);
				console.log(confirmedWeeks);
				//Default Chart
				generateChart(labelsDateMonth, confirmedMonth, null, 'Confirmed', gradientBlue, borderBlue);
				Chart.defaults.global.defaultFontColor = 'grey';
				Chart.defaults.global.animation.duration = 2500;
				$('#confirmedRadio').click(function() {
					myChart.destroy();
					if ($('#sinceBeginning').is(':checked')) {
						generateChart(
							labelsDate,
							casesConfirmed,
							myChart.config.type,
							'Confirmed',
							gradientBlue,
							borderBlue
						);
					}
					if ($('#sinceMonth').is(':checked')) {
						generateChart(
							labelsDateMonth,
							confirmedMonth,
							myChart.config.type,
							'Confirmed',
							gradientBlue,
							borderBlue
						);
					}
					if ($('#sinceWeeks').is(':checked')) {
						generateChart(
							labelsDateWeeks,
							confirmedWeeks,
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
						generateChart(
							labelsDate,
							casesRecovered,
							myChart.config.type,
							'Recovered',
							gradientGreen,
							borderGreen
						);
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
						generateChart(
							labelsDateMonth,
							deathsMonth,
							myChart.config.type,
							'Deaths',
							gradientRed,
							borderRed
						);
					}
					if ($('#sinceWeeks').is(':checked')) {
						generateChart(
							labelsDateWeeks,
							deathsWeeks,
							myChart.config.type,
							'Deaths',
							gradientRed,
							borderRed
						);
					}
					myChart.update();
				});
				$('#sinceBeginning').click(function() {
					myChart.destroy();
					if ($('#confirmedRadio').is(':checked')) {
						generateChart(
							labelsDate,
							casesConfirmed,
							myChart.config.type,
							'Confirmed',
							gradientBlue,
							borderBlue
						);
					}
					if ($('#recoveredRadio').is(':checked')) {
						generateChart(
							labelsDate,
							casesRecovered,
							myChart.config.type,
							'Recovered',
							gradientGreen,
							borderGreen
						);
					}
					if ($('#deathsRadio').is(':checked')) {
						generateChart(labelsDate, casesDeaths, myChart.config.type, 'Deaths', gradientRed, borderRed);
					}
					myChart.update();
				});
				$('#sinceMonth').click(function() {
					myChart.destroy();
					if ($('#confirmedRadio').is(':checked')) {
						generateChart(
							labelsDateMonth,
							confirmedMonth,
							myChart.config.type,
							'Confirmed',
							gradientBlue,
							borderBlue
						);
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
						generateChart(
							labelsDateMonth,
							deathsMonth,
							myChart.config.type,
							'Deaths',
							gradientRed,
							borderRed
						);
					}
					myChart.update();
				});
				$('#sinceWeeks').click(function() {
					// populateNumbers(
					// 	numbersConfirmedWeeks.toLocaleString(),
					// 	numbersRecoveredWeeks.toLocaleString(),
					// 	numbersDeathsWeeks.toLocaleString(),
					// 	'since 2 weeks'
					// );
					myChart.destroy();
					if ($('#confirmedRadio').is(':checked')) {
						generateChart(
							labelsDateWeeks,
							confirmedWeeks,
							myChart.config.type,
							'Confirmed',
							gradientBlue,
							borderBlue
						);
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
						generateChart(
							labelsDateWeeks,
							deathsWeeks,
							myChart.config.type,
							'Deaths',
							gradientRed,
							borderRed
						);
					}
					myChart.update();
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
	}

	getCountries('https://corona-api.com/timeline');
	$('#ddChartCountries').on('change', function() {
		let value = $(this).val();
		if (value == 'global') {
			getCountries('https://corona-api.com/timeline');
		} else {
			getCountries('https://corona-api.com/countries/' + value.toLowerCase() + '?include=timeline');
		}
	});
});
//Line Chart
function countriesDatatableChart(data) {
	$(document).ready(function() {
		fillNumberOfCases();
		$('#dataTableWorldTimeline').DataTable({
			data: data,
			pagingType: 'numbers',
			pageLength: 10,
			stateSave: true,
			language: {
				searchPlaceholder: 'e.g. usa',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					data: 'country',
					title: 'Country <small class="text-dark font-weight-600">(Tests)</small>',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `<div class="d-inline-block">${data} <span class="text-gray-600"><small class="text-dark font-weight-600">(${populationFormat(
							row.tests
						)})</small></span><p class="text-muted mb-0 small">Updated
					${timeDifference(row.updated)}</p></div>`;
					}
				},
				{
					data: 'cases',
					title: 'Cases',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}

						return row.todayCases
							? `${data.toLocaleString()}<p class="font-weight-600 text-danger mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${row.todayCases.toLocaleString()}<span class="font-weight-light text-danger small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
									row.cases,
									row.todayCases
								)}%)</span></p>`
							: data.toLocaleString();
					}
				},
				{
					data: 'active',
					title: 'Active',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data.toLocaleString()}`;
					}
				},
				{
					data: 'recovered',
					title: 'Recovered',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data.toLocaleString()}`;
					}
				},
				{
					data: 'deaths',
					title: 'Deaths',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return row.todayDeaths
							? `${data.toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${row.todayDeaths.toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
									row.deaths,
									row.todayDeaths
								)}%)</span></p>`
							: data.toLocaleString();
					}
				}
			],
			order: [ [ 1, 'desc' ] ],
			fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				//Lazy load images
				if (aData.countryInfo.iso2) {
					$('td:eq(0)', nRow).prepend(
						`<img src="https://www.countryflags.io/${aData.countryInfo.iso2.toLocaleLowerCase()}/shiny/24.png" style="vertical-align:top; margin-right:10px;" onerror="this.src='../assets/img/flag_placeholder_20x20.png'"/>`
					);
				}
			}
		});
		fillNewsCards();
		fillSituationReports();
		$('#selectNewsRegion').on('change', function() {
			let value = $(this).val();
			document.getElementById('card-deck').innerHTML =
				'<div class="text-center"><i class="icon-spinner spinner-animate"></i></div>';
			const newsUri = 'https://api.smartable.ai/coronavirus/news/' + value;

			axios
				.get(newsUri, {
					headers: {
						'Cache-Control': 'no-cache',
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
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else if (error.request) {
						console.log(
							'The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
						);
						console.log(error.request);
					} else {
						console.log('Something happened in setting up the request that triggered an Error');
						console.log('Error', error.message);
					}
					console.log(error.config);
				});
		});
	});
}

$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
