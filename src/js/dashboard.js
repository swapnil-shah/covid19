// const totalCases = 'https://corona-api.com/timeline';
const newsUri = 'https://api.smartable.ai/coronavirus/news/global';
const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';
const getDashboardAll = 'https://disease.sh/v2/all';

let dashboardChartData = [];
let dashboardChartCountryData = [];
let dashboardChartCountryDataActive = [];
let dashboardChartCountryDataDeaths = [];
let dashboardChartCountryDataRecovered = [];
let ctxDashboardLine = document.getElementById('myDashboardChart');
let legendContainer = document.getElementById('legend-numbers');
let legendConfirmed = document.getElementById('legend-confirmed');
let legendRecovered = document.getElementById('legend-recovered');
let legendActive = document.getElementById('legend-active');
let legendDeaths = document.getElementById('legend-deaths');
let legendUpdated = document.getElementById('last-updated-legend');
let lineChartData = [];
let lineLabelsCase = [];
let lineLabelsDeaths = [];
let lineLabelsRecovered = [];
let lineChartDataCase = [];
let lineChartDataDeaths = [];
let lineChartDataRecovered = [];
let ctxLine = document.getElementById('myLineChart');
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
const daysNum = 45;
const mostCountryNum = 5;
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
	fetch(newsUri, {
		headers: {
			'Cache-Control': 'no-cache',
			'Subscription-Key': API_KEY_SMARTTABLE
		}
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((jsonData) => {
			document.getElementById('card-deck').Text = 'Loading..';
			getNewsResults(jsonData);
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};

//Dasboard cases
let fillNumberOfCases = () => {
	fetch(getDashboardAll, { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((stats) => {
			document.getElementById('last-updated').innerHTML =
				'Last updated <span class="text-gray-800">' + timeDifference(stats.updated) + '</span>';
			document.getElementById('number-active').innerText = stats.active.toLocaleString();
			document.getElementById('number-confirmed').innerText = stats.cases.toLocaleString();
			document.getElementById('number-recovered').innerText = stats.recovered.toLocaleString();
			document.getElementById('number-deaths').innerText = stats.deaths.toLocaleString();
			document.getElementById('today-confirmed').innerText = '+' + stats.todayCases.toLocaleString();
			document.getElementById('today-deaths').innerText = '+' + stats.todayDeaths.toLocaleString();
			document.getElementById('per-active').innerHTML = '';
			document.getElementById('per-recovered').innerHTML = '';
			document.getElementById('per-confirmed').innerHTML =
				Math.sign(percentageChangeTotal(stats.cases, stats.todayCases)) === 1
					? `(<i class="fas fa-arrow-up fa-sm mr-1"></i>${percentageChangeTotal(
							stats.cases,
							stats.todayCases
						)}%)`
					: '';
			document.getElementById('per-deaths').innerHTML =
				Math.sign(percentageChangeTotal(stats.deaths, stats.todayDeaths)) === 1
					? `(<i class="fas fa-arrow-up fa-sm mr-1"></i>${percentageChangeTotal(
							stats.deaths,
							stats.todayDeaths
						)}%)`
					: '';
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};

//Dataset object
let dataSet = (chartData, chartDataDeaths, chartDataRecovered, chartDataActive, chartDataConfirmed) => {
	return chartData.push(
		{
			label: 'Deaths',
			data: chartDataDeaths.reverse(),
			backgroundColorHover: '#dc3545',
			backgroundColor: '#c45850'
		},
		{
			label: 'Recovered',
			data: chartDataRecovered.reverse(),
			backgroundColorHover: '#00ac69',
			backgroundColor: '#3cba9f'
		},
		{
			label: 'Active',
			data: chartDataActive.reverse(),
			backgroundColorHover: '#1f2d41',
			backgroundColor: '#324765'
		}
	);
};

let fillSituationReports = () => {
	fetch('https://covid19-server.chrismichael.now.sh/api/v1/SituationReports', { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((response) => {
			let output = '';
			response.reports.forEach(function(report) {
				output += `<a class="list-group-item list-group-item-action" target="_blank" href="${report.pdf}"><i class="far fa-file-pdf fa-fw text-blue mr-2"></i>${report.report}<span class="float-right small text-muted">${report.date}</span></a>
						`;
			});
			document.getElementById('left-panel-reports').innerHTML = output;
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};
function countriesDatatableChart(data) {
	$(document).ready(function() {
		fillNumberOfCases();
		$('#dataTableWorldTimeline').DataTable({
			data: data,
			pagingType: 'numbers',
			pageLength: 25,
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
						return `${data} <span class="text-gray-600"><small class="text-dark font-weight-600">(${populationFormat(
							row.tests
						)})</small></span><p class="text-muted mb-0 small">Updated
					${timeDifference(row.updated)}</p>`;
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
							? `${data.toLocaleString()}<p class="font-weight-600 mb-0"><i data-icon="&#xea0a;" class="icon-plus"></i> ${row.todayCases.toLocaleString()}<span class="font-weight-light text-muted small"> (<i data-icon="&#xea3a;" class="icon-arrow-up2"></i> ${percentageChangeTotal(
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
				}
			],
			order: [ [ 1, 'desc' ] ]
		});
		fillNewsCards();
		fillSituationReports();
		$('#selectNewsRegion').on('change', function() {
			let value = $(this).val();
			document.getElementById('card-deck').innerHTML =
				'<div class="text-center"><i class="icon-spinner spinner-animate"></i></div>';
			const newsUri = 'https://api.smartable.ai/coronavirus/news/' + value;

			fetch(newsUri, {
				headers: {
					'Cache-Control': 'no-cache',
					'Subscription-Key': API_KEY_SMARTTABLE
				}
			})
				.then((response) => {
					if (response.ok) {
						return response.json();
					} else {
						document.getElementById(
							'card-deck'
						).innerHTML = `<div class="col-sm-12 p-4 mx-auto text-muted">Sorry, something went wrong. Please try again later.</div>`;
						throw new Error('BAD HTTP');
					}
				})
				.then((jsonData) => {
					getNewsResults(jsonData);
				})
				.catch((err) => {
					console.log('ERROR:', err.message);
				});
		});
	});
	let optionsLinear = {
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: [
				'COVID-19 CASES OF ' + mostCountryNum + ' MOST AFFECTED COUNTRY',
				'Click on the box toshow/hide respective graph'
			],
			fontSize: 16,
			lineHeight: 1.6
		},
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
			xAxes: [
				{
					ticks: {
						scaleLabel: {
							display: true,
							labelString: 'hello'
						},
						autoSkip: true
					}
				}
			],
			yAxes: [
				{
					type: 'linear',
					ticks: {
						autoSkip: true,
						source: 'auto',
						suggestedMin: 0,
						suggestedMax: 1000000,
						stepSize: 50000,
						callback: function(value) {
							return value.toLocaleString();
						}
					}
				}
			]
		}
	};
	let optionsLog = {
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: [
				'COVID-19 CASES OF ' + mostCountryNum + ' MOST AFFECTED COUNTRY',
				'Click on the box toshow/hide respective graph'
			],
			fontSize: 16,
			lineHeight: 1.6
		},
		tooltips: {
			backgroundColor: 'rgb(255,255,255)',
			titleFontColor: '#858796',
			bodyFontColor: '#858796',
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
			xAxes: [
				{
					ticks: {
						autoSkip: true
					}
				}
			],
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
							if (value == 500000) return value.toLocaleString();
							if (value == 200000) return value.toLocaleString();
							if (value == 100000) return value.toLocaleString();
							if (value == 50000) return value.toLocaleString();
							if (value == 20000) return value.toLocaleString();
							if (value == 10000) return value.toLocaleString();
							if (value == 5000) return value.toLocaleString();
							if (value == 2000) return value.toLocaleString();
							if (value == 1000) return value.toLocaleString();
							if (value == 500) return value;
							if (value == 200) return value;
							if (value == 100) return value;
							if (value == 50) return value;
							if (value == 20) return value;
							if (value == 10) return value;
							if (value == 5) return value;
							if (value == 2) return value;
						}
					}
				}
			]
		}
	};

	let sortedArr = [];
	let ddChartCountriesData = [];
	let ddChartCountriesSelect = document.getElementById('ddChartCountries');
	let regionNewsSelect = document.getElementById('selectNewsRegion');
	data
		.slice(0, mostCountryNum)
		.map((countries) => {
			return countries;
		})
		.forEach(function(country) {
			sortedArr.push(country.countryInfo.iso2);
			regionNewsSelect.options[regionNewsSelect.options.length] = new Option(
				country.country,
				country.countryInfo.iso2
			);
		});
	data
		.slice(mostCountryNum, data.length)
		.map((item) => {
			return item;
		})
		.forEach(function(country) {
			ddChartCountriesSelect.options[ddChartCountriesSelect.options.length] = new Option(
				country.country,
				country.countryInfo.iso2
			);
			regionNewsSelect.options[regionNewsSelect.options.length] = new Option(
				country.country,
				country.countryInfo.iso2
			);
		});
	function selectCases(caseObj) {
		lineChartData[0].data = caseObj[0].data;
		lineChartData[1].data = caseObj[1].data;
		lineChartData[2].data = caseObj[2].data;
		lineChartData[3].data = caseObj[3].data;
		return lineChartData[0].data, lineChartData[1].data, lineChartData[2].data, lineChartData[3].data;
	}
	let query = sortedArr.join();
	function getCountries(countryQueries) {
		lineChartData = [];
		const API_URL_MOST_AFFECTED = 'https://disease.sh/v2/historical/' + countryQueries + '?lastdays=' + daysNum;
		fetch(API_URL_MOST_AFFECTED).then((response) => response.json()).then((countries) => {
			lineLabelsCase = Object.keys(countries[0].timeline.cases);
			lineLabelsDeaths = Object.keys(countries[0].timeline.deaths);
			lineLabelsRecovered = Object.keys(countries[0].timeline.recovered);
			countries.forEach((country) => {
				lineChartDataCase.push({ data: Object.values(country.timeline.cases) });
				lineChartDataDeaths.push({ data: Object.values(country.timeline.deaths) });
				lineChartDataRecovered.push({ data: Object.values(country.timeline.recovered) });
				lineChartData.push({
					label: country.country,
					data: Object.values(country.timeline.cases),
					fill: false,
					pointHoverRadius: 0,
					pointBorderWidth: 0
				});
			});
			var ctx = document.getElementById('myChart').getContext('2d');

			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: lineLabelsCase,
					datasets: lineChartData
				},
				options: optionsLinear
			});

			// Function runs on chart type select update
			$('#ddChartType').on('change', function() {
				myChart.destroy();
				myChart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: lineLabelsCase,
						datasets: lineChartData
					},
					options: this.value == 'linear' ? optionsLinear : optionsLog
				});
				myChart.update();
			});

			myChart.data.datasets.forEach(function(set, index) {
				set.borderColor = colors[index];
			});
			myChart.update();
			Chart.defaults.global.defaultFontFamily = 'Nunito';
			Chart.defaults.global.defaultFontColor = 'white';

			$('#ddChartTests').on('change', function() {
				if (this.value === 'death') {
					selectCases(lineChartDataDeaths);
					myChart.update();
				} else if (this.value === 'recovered') {
					selectCases(lineChartDataRecovered);
					myChart.update();
				} else {
					selectCases(lineChartDataCase);
					myChart.update();
				}
			});
		});
	}
	getCountries(query);
	$('#ddChartCountries').on('change', function() {
		let value = $(this).val();
		getCountries(query + ',' + value);
		$('#ddChartType').val('linear');
		$('#ddChartTests').val('cases'); //v
	});
	//Line Chart
}
$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
