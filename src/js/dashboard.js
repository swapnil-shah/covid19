const totalCases = 'https://corona-api.com/timeline';
const countriesUri = 'https://corona-api.com/countries';
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
function countriesDatatable(data) {
	$(document).ready(function() {
		fillNumberOfCases();
		$('#dataTableWorldTimeline').DataTable({
			data: data,
			pagingType: 'numbers',
			pageLength: 25,
			language: {
				searchPlaceholder: 'e.g. usa',
				loadingRecords: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>'
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
}
$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
