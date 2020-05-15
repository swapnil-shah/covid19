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
	let optionsLinear = {
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: [
				'COVID-19 CUMMULATIVE CASES OF ' + mostCountryNum + ' MOST AFFECTED COUNTRIES',
				'Click on the box to show/hide respective graph'
			],
			fontSize: 16,
			lineHeight: 1.6
		},
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
		console.log('https://disease.sh/v2/historical/' + countryQueries + '?lastdays=' + daysNum);
		lineChartData = [];
		const API_URL_MOST_AFFECTED = 'https://disease.sh/v2/historical/' + countryQueries + '?lastdays=' + daysNum;
		axios
			.get(API_URL_MOST_AFFECTED)
			.then((response) => {
				lineLabelsCase = Object.keys(response.data[0].timeline.cases);
				lineLabelsDeaths = Object.keys(response.data[0].timeline.deaths);
				lineLabelsRecovered = Object.keys(response.data[0].timeline.recovered);
				response.data.forEach((country) => {
					lineChartDataCase.push({ data: Object.values(country.timeline.cases) });
					lineChartDataDeaths.push({ data: Object.values(country.timeline.deaths) });
					lineChartDataRecovered.push({ data: Object.values(country.timeline.recovered) });
					lineChartData.push({
						label: country.country,
						data: Object.values(country.timeline.cases),
						// fill: false,
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
					set.backgroundColor = colorsOpacity[index];
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
