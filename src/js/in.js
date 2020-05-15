const newsUri = 'https://newsapi.org/v2/top-headlines?q=COVID&country=in&apiKey=7e2e5ed46901476baa79347a66cc2b2c';
const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';
let canvas = document.getElementById('myChart');
let ctx = canvas.getContext('2d');
// let myChart;
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
//Populate numbers to legend on chart
//US cases
function populateNumbers(confirmed, recovered, deaths, text) {
	document.getElementById('total-confirmed').innerHTML = `<span style="color:${borderBlue}">${confirmed}</span>`;
	document.getElementById('total-recovered').innerHTML = `<span style="color:${borderGreen}">${recovered}</span>`;
	document.getElementById('total-deaths').innerHTML = `<span style="color:${borderRed}">${deaths}</span>`;
	document.getElementById('total-date').innerHTML = ` (${text})`;
}
function newsResults() {
	axios
		.get(newsUri)
		.then((response) => {
			document.getElementById('card-deck').text = 'Loading..';
			let newsCards = document.getElementById('card-deck');
			let newsResultsNumber = document.getElementById('news-results-number');
			newsCards.innerHtml = `<div class="spinner-border" role="status">
			<span class="sr-only">Loading...</span>
		</div>`;
			let output = '';
			newsResultsNumber.innerText = `${response.data.totalResults} results found`;
			response.data.articles.forEach(function(item) {
				output += `
						<div class="col-sm-12 my-3 pl-0 pr-1">
							<a class="card lift lift-sm p-3 news-card" href="${item.url}" target="_blank">
								<h3 class="text-dark">${item.title}</h3>
								<p class="text-gray-600 mb-1"">${item.description}</p>
								<p class="text-primary mb-3">View full article</p>
								<p class="mb-0 text-muted small"><i class="far fa-newspaper"></i> Published by <span class="font-weight-600 text-gray-600">${item
									.source.name}</span> ${timeDifference(item.publishedAt)}</p>
								</>
							</a>
						</div>
						`;
			});
			newsCards.innerHTML = output;
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
function notificationsAdvisories() {
	axios
		.get('https://api.rootnet.in/covid19-in/notifications', { cache: 'no-cache' })
		.then((response) => {
			let output = '';
			response.data.data.notifications.forEach(function(report) {
				output += `<a class="list-group-item list-group-item-action" target="_blank" href="${report.link}">${report.title}</a>
						`;
			});
			document.getElementById('right-panel-reports').innerHTML = output;
			document.getElementById('notification-last-updated').innerHTML = `Updated ${timeDifference(
				response.data.lastRefreshed
			)}`;
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
			text: 'Daily Cases',
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
		let filteredArr = [];
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
			} else {
				filteredArr.push(states);
			}
		});

		//Get months/30 days
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
			'since month'
		);
		Chart.defaults.global.defaultFontColor = 'grey';
		Chart.defaults.global.animation.duration = 2500;
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
			pageLength: 10,
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
								).toLocaleString()}<p class="font-weight-600 text-danger mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${parseInt(
									row.deltaconfirmed
								).toLocaleString()}<span class="font-weight-light text-danger small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
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
				generateChart(labelsDate, casesConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
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
				'since beginning'
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
				'since a month'
			);
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
				generateChart(labelsDateMonth, deathsMonth, myChart.config.type, 'Deaths', gradientRed, borderRed);
			}
			myChart.update();
		});
		$('#sinceWeeks').click(function() {
			populateNumbers(
				numbersConfirmedWeeks.toLocaleString(),
				numbersRecoveredWeeks.toLocaleString(),
				numbersDeathsWeeks.toLocaleString(),
				'since 2 weeks'
			);
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
				generateChart(labelsDateWeeks, deathsWeeks, myChart.config.type, 'Deaths', gradientRed, borderRed);
			}
			myChart.update();
		});
		// AJAX to get district data and save in variable
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
	});
}
$(document).ready(function() {
	newsResults();
	notificationsAdvisories();
});
$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});