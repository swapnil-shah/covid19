const totalCases = 'https://corona-api.com/timeline';
const countriesUri = 'https://corona-api.com/countries';
const newsUri = 'https://api.smartable.ai/coronavirus/news/global';
const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';
const getDashboardAll = 'https://disease.sh/v2/all';

let dashboardChartData = [];
let dashboardLabelsDate = [];
let dashboardChartDataActive = [];
let dashboardChartDataDeaths = [];
let dashboardChartDataRecovered = [];
let dashboardChartCountryData = [];
let dashboardChartCountryLabels = [];
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

function getNewsResults(data) {
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
}
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
			document.getElementById('card-deck').Text = 'Loadimg..';
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
// add option to dropdown
let addCountriesToDropdown = () => {
	fetch('https://api.covid19api.com/countries', { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((data) => {
			data.forEach(function(item) {
				let regionSelect = document.getElementById('selectRegion');
				let regionNewsSelect = document.getElementById('selectNewsRegion');
				regionNewsSelect.options[regionSelect.options.length] = new Option(item.Country, item.ISO2);
				regionSelect.options[regionSelect.options.length] = new Option(item.Country, item.ISO2);
			});
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
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
fetch(totalCases)
	.then((response) => response.json())
	.then((countries) => {
		countries.data.forEach((country) => {
			dashboardLabelsDate.push(country.date);
			dashboardChartDataActive.push(country.active);
			dashboardChartDataRecovered.push(country.recovered);
			dashboardChartDataDeaths.push(country.deaths);
		});
		dataSet(dashboardChartData, dashboardChartDataDeaths, dashboardChartDataRecovered, dashboardChartDataActive);
		let myChart = new Chart(ctxDashboardLine, {
			type: 'bar',
			data: {
				labels: dashboardLabelsDate.reverse(),
				datasets: dashboardChartData
			},
			options: {
				maintainAspectRatio: false,
				responsive: true,
				title: {
					display: true,
					text: 'Click on the box to show/hide respective graph'
				},
				legend: {
					reverse: true
				},
				tooltips: {
					mode: 'index',
					backgroundColor: 'rgb(255,255,255)',
					titleFontColor: '#858796',
					bodyFontColor: '#858796',
					borderColor: '#dddfeb',
					borderWidth: 1,
					caretPadding: 10,
					xPadding: 10,
					yPadding: 10,
					footerFontStyle: 'normal',
					footerFontColor: '#00000',
					callbacks: {
						footer: function(tooltipItems, data) {
							let sum = 0;

							tooltipItems.forEach(function(tooltipItem) {
								sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							});
							return 'Confirmed: ' + sum.toLocaleString();
						},
						label: function(tooltipItem, data) {
							return (
								data.datasets[tooltipItem.datasetIndex].label +
								': ' +
								tooltipItem.yLabel.toLocaleString()
							);
						}
					},
					itemSort: function(a, b) {
						return b.datasetIndex - a.datasetIndex;
					}
					// Use the footer callback to display the sum of the items showing in the tooltip
				},
				scales: {
					xAxes: [
						{
							parser: 'YYYY-MM-DD',
							stacked: true,
							ticks: {
								autoSkip: true,
								maxTicksLimit: 20,
								min: '2020-02-01',
								callback: function(value) {
									return formatDate(value);
								}
							}
						}
					],
					yAxes: [
						{
							stacked: true,
							ticks: {
								callback: function(value) {
									return populationFormat(value);
								}
							}
						}
					]
				}
			}
		});

		Chart.defaults.global.defaultFontFamily = 'Nunito';
		Chart.plugins.register({
			afterDraw: function(chart) {
				if (myChart.data.datasets.length === 0) {
					// No data is present
					var ctx = myChart.chart.ctx;
					var width = myChart.chart.width;
					var height = myChart.chart.height;
					myChart.clear();
					ctx.save();
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText('No data available. Please select another country', width / 2, height / 2);
					ctx.restore();
				}
			}
		});
		$('#selectRegion').on('change', function() {
			let value = $(this).val();
			dashboardChartCountryData = [];
			dashboardChartCountryLabels = [];
			dashboardChartCountryDataActive = [];
			dashboardChartCountryDataDeaths = [];
			dashboardChartCountryDataRecovered = [];
			if (value === 'worldwide') {
				legendContainer.classList.remove('d-flex');
				legendContainer.classList.add('d-none');
				legendUpdated.innerHTML = 'Worldwide cases is on the cards above';
				myChart.data.datasets = dashboardChartData;
				myChart.data.labels = dashboardLabelsDate;
				myChart.update();
			} else {
				fetch(countriesUri + '/' + value, { cache: 'no-cache' })
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP');
						}
					})
					.then((countryData) => {
						if (countryData.data.timeline.length) {
							legendConfirmed.innerText = countryData.data.timeline[0].confirmed.toLocaleString();
							legendRecovered.innerText = countryData.data.timeline[0].recovered.toLocaleString();
							legendActive.innerText = countryData.data.timeline[0].active.toLocaleString();
							legendDeaths.innerText = countryData.data.timeline[0].deaths.toLocaleString();
							legendUpdated.innerHTML = 'Last Updated ' + timeDifference(countryData.data.updated_at);
							legendContainer.classList.remove('d-none');
							legendContainer.classList.add('d-flex');
							countryData.data.timeline.forEach(function(item) {
								dashboardChartCountryLabels.push(item.date);
								dashboardChartCountryDataActive.push(item.active);
								dashboardChartCountryDataRecovered.push(item.recovered);
								dashboardChartCountryDataDeaths.push(item.deaths);
							});
							dataSet(
								dashboardChartCountryData,
								dashboardChartCountryDataDeaths,
								dashboardChartCountryDataRecovered,
								dashboardChartCountryDataActive
							);
							myChart.data.datasets = dashboardChartCountryData;
							myChart.data.labels = dashboardChartCountryLabels.reverse();
							myChart.update();
						}
						myChart.data.datasets = dashboardChartCountryData;
						myChart.data.labels = dashboardChartCountryLabels.reverse();
						myChart.update();
					})
					.catch((err) => {
						console.log('ERROR:', err.message);
					});
			}
		});
	})
	.catch((error) => console.log('error', error));

$(document).ready(function() {
	// World Timeline Table
	$('#dataTableWorldTimeline').DataTable({
		ajax: {
			url: getDashboardCountries,
			type: 'GET',
			cache: false,
			dataSrc: function(json) {
				return json;
			}
		},
		pagingType: 'numbers',
		pageLength: 25,
		language: {
			searchPlaceholder: 'e.g. usa',
			loadingRecords: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>'
		},
		columns: [
			{
				data: 'country',
				title: 'Country (Tests)',
				render: function(data, type, row) {
					if (type === 'type' || type === 'sort') {
						return data;
					}
					return `${data} <span class="text-gray-600">(${populationFormat(
						row.tests
					)})</span><p class="text-muted mb-0 small">Updated
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
						? `${data.toLocaleString()}<p class="font-weight-600 mb-0"><i class="fas fa-plus fa-sm"></i>${row.todayCases.toLocaleString()}<span class="font-weight-light text-muted small"> (<i class="fas fa-arrow-up fa-sm" style="margin-right:0.1rem;"></i>${percentageChangeTotal(
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
						? `${data.toLocaleString()}<p class="font-weight-600 mb-0"><i class="fas fa-plus fa-sm"></i>${row.todayDeaths.toLocaleString()}<span class="font-weight-light text-muted small"> (<i class="fas fa-arrow-up fa-sm" style="margin-right:0.1rem;"></i>${percentageChangeTotal(
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
	fillNumberOfCases();
	addCountriesToDropdown();
	fillNewsCards();
	fillSituationReports();
	$('#selectNewsRegion').on('change', function() {
		let value = $(this).val();
		document.getElementById('card-deck').innerHTML =
			'<div class="text-center"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></div>';
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
$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
