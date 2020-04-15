const dasboardTableUri = 'https://corona-api.com/countries?include=timeline';
const totalCases = 'https://corona-api.com/timeline';
const countriesUri = 'https://corona-api.com/countries/';

let dashboardChartData = [];
let dashboardLabelsDate = [];
let dashboardChartDataActive = [];
let dashboardChartDataConfirmed = [];
let dashboardChartDataDeaths = [];
let dashboardChartDataRecovered = [];
let dashboardChartCountryData = [];
let dashboardChartCountryLabels = [];
let dashboardChartCountryDataActive = [];
let dashboardChartCountryDataConfirmed = [];
let dashboardChartCountryDataDeaths = [];
let dashboardChartCountryDataRecovered = [];
let ctxDashboardLine = document.getElementById('myDashboardChart');
let legendContainer = document.getElementById('legend-numbers');
let legendConfirmed = document.getElementById('legend-confirmed');
let legendRecovered = document.getElementById('legend-recovered');
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

function addClassesToTable(newCases, color) {
	for (let i = 0; i < newCases.length; i++) {
		let percentageValue = parseFloat(newCases[i].getAttribute('data-percentage'));
		if (percentageValue >= 2 && percentageValue < 5) {
			newCases[i].classList.add('bg-' + color + '-200');
		}
		if (percentageValue >= 5 && percentageValue < 8) {
			newCases[i].classList.add('bg-' + color + '-500');
		}
		if (percentageValue >= 8) {
			newCases[i].classList.add('bg-' + color + '-900');
		}
	}
}

//Dasboard cases
let fillNumberOfCases = () => {
	fetch(totalCases, { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((stats) => {
			document.getElementById('last-updated').innerHTML =
				'% difference is calculated approximate between <span class="text-gray-600">' +
				formatDateToString(stats.data[0].updated_at) +
				' and ' +
				formatDateToString(stats.data[1].updated_at) +
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
		},
		{
			label: 'Confirmed',
			data: chartDataConfirmed.reverse(),
			backgroundColorHover: '#6900c7',
			backgroundColor: '#8e5ea2'
		}
	);
};

//World Timeline Table
let fillWorldTimelineTable = () => {
	fetch(dasboardTableUri, { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((jsonData) => {
			let output = '';
			let regionSelect = document.getElementById('selectRegion');
			let $dasboardTableRows = $('#dataTableWorldTimeline');
			jsonData.data.forEach(function(item) {
				if (item.timeline.length > 0) {
					output += `
                                    <tr>
                                        <td>${item.name}<br/><small class="text-muted">${populationFormat(
						item.population
					)}</small></td>
                                        <td>${item.timeline[0].confirmed.toLocaleString()}</td>
                                        <td class="new-confirmed" data-percentage="${percentageChangeTable(
											item.timeline[0].confirmed,
											item.timeline[0].new_confirmed
										)}">${item.timeline[0].new_confirmed.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
						item.timeline[0].confirmed,
						item.timeline[0].new_confirmed
					)}%)</small>
                        </td>
                                        <td>${item.timeline[0].deaths.toLocaleString()}</td>
                                        <td class="new-death" data-percentage="${percentageChangeTable(
											item.timeline[0].deaths,
											item.timeline[0].new_deaths
										)}">${item.timeline[0].new_deaths.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
						item.timeline[0].deaths,
						item.timeline[0].new_deaths
					)}%)</small></td>
                                        <td>${item.timeline[0].recovered.toLocaleString()}</td>
                                        <td class="new-recovered" data-percentage="${percentageChangeTable(
											item.timeline[0].recovered,
											item.timeline[0].new_recovered
										)}">${item.timeline[0].new_recovered.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
						item.timeline[0].recovered,
						item.timeline[0].new_recovered
					)}%)</small></td>
                                    </tr>
								`;
					regionSelect.options[regionSelect.options.length] = new Option(item.name, item.code);
				} else {
					output += `
                        <tr>
                            <td>${item.name}<br/><small class="text-muted">${item.population
						? populationFormat(item.population)
						: ''}</small></td>
                            <td>${item.latest_data.confirmed ? item.latest_data.confirmed.toLocaleString() : ''}</td>
                            <td>${item.today.confirmed ? item.latest_data.confirmed.toLocaleString() : ''}</td>
                            <td>${item.latest_data.deaths ? item.latest_data.deaths.toLocaleString() : ''}</td>
                            <td>${item.today.deaths ? item.today.deaths.toLocaleString() : ''}</td>
                            <td>${item.latest_data.recovered ? item.latest_data.recovered.toLocaleString() : ''}</td>
                            <td>${item.latest_data.recovered ? item.latest_data.recovered.toLocaleString() : ''}</td>
                        </tr>`;
				}
			});
			// $dasboardTableRows.children('tbody').html(output);
			$dasboardTableRows.DataTable({
				pageLength: 50,
				language: {
					searchPlaceholder: 'e.g. usa'
				},
				order: [ [ 1, 'desc' ] ],
				columnDefs: [
					{ orderable: false, targets: [ 2 ] },
					{ orderable: false, targets: [ 4 ] },
					{ orderable: false, targets: [ 6 ] }
				]
			});
			addCellColor();
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
			dashboardChartDataConfirmed.push(country.confirmed);
			dashboardChartDataActive.push(country.active);
			dashboardChartDataRecovered.push(country.recovered);
			dashboardChartDataDeaths.push(country.deaths);
		});
		dataSet(
			dashboardChartData,
			dashboardChartDataDeaths,
			dashboardChartDataRecovered,
			dashboardChartDataActive,
			dashboardChartDataConfirmed
		);
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
					callbacks: {
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
			dashboardChartCountryDataConfirmed = [];
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
				fetch(countriesUri + value, { cache: 'no-cache' })
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP');
						}
					})
					.then((countryData) => {
						legendConfirmed.innerText = countryData.data.latest_data.confirmed.toLocaleString();
						legendRecovered.innerText = countryData.data.latest_data.recovered.toLocaleString();
						legendDeaths.innerText = countryData.data.latest_data.deaths.toLocaleString();
						legendUpdated.innerHTML = 'Last Updated ' + timeDifference(countryData.data.updated_at);
						legendContainer.classList.remove('d-none');
						legendContainer.classList.add('d-flex');
						countryData.data.timeline.forEach(function(item) {
							dashboardChartCountryLabels.push(item.date);
							dashboardChartCountryDataConfirmed.push(item.confirmed);
							dashboardChartCountryDataActive.push(item.active);
							dashboardChartCountryDataRecovered.push(item.recovered);
							dashboardChartCountryDataDeaths.push(item.deaths);
						});
						dataSet(
							dashboardChartCountryData,
							dashboardChartCountryDataDeaths,
							dashboardChartCountryDataRecovered,
							dashboardChartCountryDataActive,
							dashboardChartCountryDataConfirmed
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

$(document).ready(function() {
	formatDateToString();
	fillNumberOfCases();
	fillWorldTimelineTable();
});
