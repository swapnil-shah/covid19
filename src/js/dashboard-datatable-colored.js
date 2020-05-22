const dasboardDataUri = 'https://corona-api.com/countries?include=timeline';
const totalCases = 'https://corona-api.com/timeline';
const countriesUri = 'https://corona-api.com/countries';
const newsUri = 'https://api.smartable.ai/coronavirus/news/global';
const API_KEY_SMARTTABLE = 'cf8e77731fb345d381334aff5e844f3f';

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

function addCellColor() {
	let newConfirmed = document.querySelectorAll('.new-confirmed');
	let newDeaths = document.querySelectorAll('.new-death');
	let newRecovered = document.querySelectorAll('.new-recovered');
	addClassesToTable(newConfirmed, 'yellow');
	addClassesToTable(newDeaths, 'red');
	addClassesToTable(newRecovered, 'green');
}

function addClassesToDataTable(newCases, oldCases, tableColumn, color) {
	let percentageValue = percentageChangeTotal(newCases, oldCases);
	if (percentageValue >= 2 && percentageValue < 5) {
		$(tableColumn).addClass('bg-' + color + '-200');
	} else if (percentageValue >= 5 && percentageValue < 8) {
		$(tableColumn).addClass('bg-' + color + '-500');
	} else if (percentageValue >= 8) {
		$(tableColumn).addClass('bg-' + color + '-900');
	} else {
		return;
	}
}

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
					<a class="card lift lift-sm p-3 news-card border-top-0 border-bottom-0 border-right-0 border-left-lg border-blue" href="${item.webUrl}" target="_blank">
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
	fetch(totalCases)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((stats) => {
			document.getElementById('last-updated').innerHTML =
				'% difference was calculated approximately between <span class="text-dark">' +
				formatDateToString(stats.data[1].updated_at) +
				'</span> and <span class="text-dark">' +
				formatDateToString(stats.data[0].updated_at) +
				'</span>';
			document.getElementById('number-active').innerText = stats.data[0].active.toLocaleString();
			document.getElementById('number-confirmed').innerText = stats.data[0].confirmed.toLocaleString();
			document.getElementById('number-recovered').innerText = stats.data[0].recovered.toLocaleString();
			document.getElementById('number-deaths').innerText = stats.data[0].deaths.toLocaleString();

			document.getElementById('per-active').innerHTML = `(<i class="${Math.sign(
				percentageChangeTotal(stats.data[0].active, stats.data[1].active)
			) === -1
				? 'fas fa-arrow-down fa-sm'
				: Math.sign(percentageChangeTotal(stats.data[0].active, stats.data[1].active)) === 1
					? 'fas fa-arrow-up fa-sm'
					: ''}" style="margin: 0 2px;"></i>
				${percentageChangeTotal(stats.data[0].active, stats.data[1].active)}
				%)`;
			document.getElementById('per-confirmed').innerHTML = `(<i class="${Math.sign(
				percentageChangeTotal(stats.data[0].confirmed, stats.data[1].confirmed)
			) === -1
				? 'fas fa-arrow-down fa-sm'
				: Math.sign(percentageChangeTotal(stats.data[0].confirmed, stats.data[1].confirmed)) === 1
					? 'fas fa-arrow-up fa-sm'
					: ''}" style="margin: 0 2px;"></i>
				${percentageChangeTotal(stats.data[0].confirmed, stats.data[1].confirmed)}
				%)`;
			document.getElementById('per-recovered').innerHTML = `(<i class="${Math.sign(
				percentageChangeTotal(stats.data[0].recovered, stats.data[1].recovered)
			) === -1
				? 'fas fa-arrow-down fa-sm'
				: Math.sign(percentageChangeTotal(stats.data[0].recovered, stats.data[1].recovered)) === 1
					? 'fas fa-arrow-up fa-sm'
					: ''}" style="margin: 0 2px;"></i>
				${percentageChangeTotal(stats.data[0].recovered, stats.data[1].recovered)}
				%)`;
			document.getElementById('per-deaths').innerHTML = `(<i class="${Math.sign(
				percentageChangeTotal(stats.data[0].deaths, stats.data[1].deaths)
			) === -1
				? 'fas fa-arrow-down fa-sm'
				: Math.sign(percentageChangeTotal(stats.data[0].deaths, stats.data[1].deaths)) === 1
					? 'fas fa-arrow-up fa-sm'
					: ''}" style="margin: 0 2px;"></i>
				${percentageChangeTotal(stats.data[0].deaths, stats.data[1].deaths)}
				%)`;
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
	fetch(dasboardDataUri)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((jsonData) => {
			document.getElementById('last-updated-datatable').innerHTML = timeDifference(jsonData.data[0].updated_at);
			jsonData.data.forEach(function(item) {
				if (item.timeline.length > 0) {
					let regionSelect = document.getElementById('selectRegion');
					let regionNewsSelect = document.getElementById('selectNewsRegion');
					regionNewsSelect.options[regionSelect.options.length] = new Option(item.name, item.code);
					regionSelect.options[regionSelect.options.length] = new Option(item.name, item.code);
				}
			});
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};

let fillSituationReports = () => {
	fetch('https://covid19-server.chrismichael.now.sh/api/v1/SituationReports')
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
				output += `<a class="list-group-item list-group-item-action" target="_blank" href="${report.pdf}"><i class="icon-file-pdf mr-2"></i>${report.report}<span class="float-right small text-muted">${report.date}</span></a>
						`;
			});
			document.getElementById('right-panel-reports').innerHTML = output;
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
				fetch(countriesUri + '/' + value)
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP');
						}
					})
					.then((countryData) => {
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
					})
					.catch((err) => {
						console.log('ERROR:', err.message);
					});
			}
		});
	})
	.catch((error) => console.log('error', error));

// World Timeline Table
$('#dataTableWorldTimeline').DataTable({
	processing: false,
	ajax: {
		url: dasboardDataUri,
		type: 'GET',
		cache: false,
		data: function(json) {
			return json.data;
		}
	},
	pagingType: 'numbers',
	pageLength: 25,
	language: {
		searchPlaceholder: 'e.g. usa'
	},
	columns: [
		{
			data: 'name',
			title: 'Name',
			render: function(data, type, row) {
				if (type === 'type' || type === 'sort') {
					return data;
				}
				return `${data}<p class="text-muted small"><i class="fas fa-users fa-sm" style="margin: 0 3px;"></i>${populationFormat(
					row.population
				)}</p>`;
			}
		},
		{
			data: 'latest_data.confirmed',
			title: 'Confirmed',
			render: function(data, type, row) {
				if (type === 'type' || type === 'sort') {
					return data;
				}
				let output = '';
				if (row.timeline.length > 0) {
					output += row.timeline[0].confirmed.toLocaleString();
					if (row.timeline[0].new_confirmed > 0) {
						output +=
							'<small class="font-weight-light container-percentage">+' +
							row.timeline[0].new_confirmed.toLocaleString() +
							'</small>';
					} else {
						output += '<small class="font-weight-light container-percentage">Update in progress</small>';
					}
					if (Math.sign(percentageChangeTotal(row.timeline[0].confirmed, row.timeline[1].confirmed)) === -1) {
						output +=
							'<small>(<i class="fas fa-arrow-down fa-sm" style="margin: 0 2px;"></i>' +
							percentageChangeTotal(row.timeline[0].confirmed, row.timeline[1].confirmed) +
							'%)</small>';
					}
					if (Math.sign(percentageChangeTotal(row.timeline[0].confirmed, row.timeline[1].confirmed)) === 1) {
						output +=
							'<small>(<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i>' +
							percentageChangeTotal(row.timeline[0].confirmed, row.timeline[1].confirmed) +
							'%)</small>';
					}
				} else {
					output += row.latest_data.confirmed;
				}
				return output;
			},
			createdCell: function(td, cellData, rowData) {
				if (rowData.timeline.length > 0) {
					addClassesToDataTable(rowData.timeline[0].confirmed, rowData.timeline[1].confirmed, td, 'yellow');
				}
			}
		},
		{
			data: 'latest_data.recovered',
			title: 'Recovered',
			render: function(data, type, row) {
				if (type === 'type' || type === 'sort') {
					return data;
				}
				let output = '';
				if (row.timeline.length > 0) {
					output += row.timeline[0].recovered.toLocaleString();
					if (row.timeline[0].new_recovered > 0) {
						output +=
							'<small class="font-weight-light container-percentage">+' +
							row.timeline[0].new_recovered.toLocaleString() +
							'</small>';
					} else {
						output += '<small class="font-weight-light container-percentage">Update in progress</small>';
					}
					if (Math.sign(percentageChangeTotal(row.timeline[0].recovered, row.timeline[1].recovered)) === -1) {
						output +=
							'<small>(<i class="fas fa-arrow-down fa-sm" style="margin: 0 2px;"></i>' +
							percentageChangeTotal(row.timeline[0].recovered, row.timeline[1].recovered) +
							'%)</small>';
					}
					if (Math.sign(percentageChangeTotal(row.timeline[0].recovered, row.timeline[1].recovered)) === 1) {
						output +=
							'<small>(<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i>' +
							percentageChangeTotal(row.timeline[0].recovered, row.timeline[1].recovered) +
							'%)</small>';
					}
				} else {
					output += row.latest_data.recovered;
				}
				return output;
			},
			createdCell: function(td, cellData, rowData) {
				if (rowData.timeline.length > 0) {
					addClassesToDataTable(rowData.timeline[0].recovered, rowData.timeline[1].recovered, td, 'green');
				}
			}
		},
		{
			data: 'latest_data.deaths',
			title: 'Deaths',
			render: function(data, type, row) {
				if (type === 'type' || type === 'sort') {
					return data;
				}
				let output = '';
				if (row.timeline.length > 0) {
					output += row.timeline[0].deaths.toLocaleString();
					if (row.timeline[0].new_deaths > 0) {
						output +=
							'<small class="font-weight-light container-percentage">+' +
							row.timeline[0].new_deaths.toLocaleString() +
							'</small>';
					} else {
						output += '<small class="font-weight-light container-percentage">Update in progress</small>';
					}
					if (Math.sign(percentageChangeTotal(row.timeline[0].deaths, row.timeline[1].deaths)) === -1) {
						output +=
							'<small>(<i class="fas fa-arrow-down fa-sm" style="margin: 0 2px;"></i>' +
							percentageChangeTotal(row.timeline[0].deaths, row.timeline[1].deaths) +
							'%)</small>';
					}
					if (Math.sign(percentageChangeTotal(row.timeline[0].deaths, row.timeline[1].deaths)) === 1) {
						output +=
							'<small>(<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i>' +
							percentageChangeTotal(row.timeline[0].deaths, row.timeline[1].deaths) +
							'%)</small>';
					}
				} else {
					output += row.latest_data.deaths;
				}
				return output;
			},
			createdCell: function(td, cellData, rowData) {
				if (rowData.timeline.length > 1) {
					addClassesToDataTable(rowData.timeline[0].deaths, rowData.timeline[1].deaths, td, 'red');
				}
			}
		}
	],
	order: [ [ 1, 'desc' ] ]
});
$(document).ready(function() {
	fillNumberOfCases();
	addCountriesToDropdown();
	fillNewsCards();
	fillSituationReports();
	$('#selectNewsRegion').on('change', function() {
		let value = $(this).val();
		document.getElementById('card-deck').innerHTML =
			'<div class="text-center"><i class="icon-spinner spinner-animate"></i></div>';
		const newsUri = 'https://api.smartable.ai/coronavirus/news/' + value;

		fetch(newsUri, {
			headers: {
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
