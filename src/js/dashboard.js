const dasboardTableUri = 'https://corona-api.com/countries?include=timeline';
const totalCases = 'https://corona-api.com/timeline';

let lineDashboardChartData = [];
let lineDashboardLabelsDate = [];
let lineDashboardChartDataActive = [];
let lineDashboardChartDataConfirmed = [];
let lineDashboardChartDataDeaths = [];
let lineDashboardChartDataRecovered = [];
let ctxDashboardLine = document.getElementById('myDashboardChart');

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
			if (typeof stats.data[0].is_in_progress === 'undefined') {
				let formattedDate = timeDifference(stats.data[0].updated_at.toString());
				document.getElementById('number-active').innerText = stats.data[0].active.toLocaleString();
				document.getElementById('number-confirmed').innerText = stats.data[0].confirmed.toLocaleString();
				document.getElementById('number-recovered').innerText = stats.data[0].recovered.toLocaleString();
				document.getElementById('number-deaths').innerText = stats.data[0].deaths.toLocaleString();
				document.getElementById('last-updated').innerHTML =
					'Last Updated <span class="text-gray-600">' + formattedDate + '</span>';
				document.getElementById('per-active').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTotal(stats.data[0].active, stats.data[1].active) +
					'%)';
				document.getElementById('per-confirmed').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTable(stats.data[0].confirmed, stats.data[0].new_confirmed) +
					'%)';
				document.getElementById('per-recovered').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTable(stats.data[0].recovered, stats.data[0].new_recovered) +
					'%)';
				document.getElementById('per-deaths').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTable(stats.data[0].deaths, stats.data[0].new_deaths) +
					'%)';
			} else {
				let formattedDate = timeDifference(stats.data[1].updated_at.toString());
				document.getElementById('number-active').innerText = stats.data[1].active.toLocaleString();
				document.getElementById('number-confirmed').innerText = stats.data[1].confirmed.toLocaleString();
				document.getElementById('number-recovered').innerText = stats.data[1].recovered.toLocaleString();
				document.getElementById('number-deaths').innerText = stats.data[1].deaths.toLocaleString();
				document.getElementById('last-updated').innerHTML =
					'Last Updated <span class="text-gray-600">' + formattedDate + '</span>';
				document.getElementById('per-active').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTotal(stats.data[1].active, stats.data[0].active) +
					'%)';
				document.getElementById('per-confirmed').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTable(stats.data[1].confirmed, stats.data[1].new_confirmed) +
					'%)';
				document.getElementById('per-recovered').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTable(stats.data[1].recovered, stats.data[1].new_recovered) +
					'%)';
				document.getElementById('per-deaths').innerHTML =
					' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
					percentageChangeTable(stats.data[1].deaths, stats.data[1].new_deaths) +
					'%)';
			}
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
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
			let $dasboardTableRows = $('#dataTableWorldTimeline');
			jsonData.data.forEach(function(item) {
				if (item.timeline.length > 0) {
					if (typeof item.timeline[0].is_in_progress === 'undefined') {
						output += `
                                    <tr data-toggle="tooltip" title="Last updated on ${getDateFormatted(
										item.timeline[0].updated_at
									)}">
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
					} else {
						output += `
                                <tr data-toggle="tooltip" title="Last updated on ${getDateFormatted(
									item.timeline[1].updated_at
								)}">
                                    <td>${item.name}<br/><small class="text-muted">${populationFormat(
							item.population
						)}</small></td>
                                    <td>${item.timeline[1].confirmed.toLocaleString()}</td>
                                    <td class="new-confirmed" data-percentage="${percentageChangeTable(
										item.timeline[1].confirmed,
										item.timeline[1].new_confirmed
									)}" >${item.timeline[1].new_confirmed.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[1].confirmed,
							item.timeline[1].new_confirmed
						)}%)</small></td>
                                    <td>${item.timeline[1].deaths.toLocaleString()}</td>
                                    <td class="new-death" data-percentage="${percentageChangeTable(
										item.timeline[1].deaths,
										item.timeline[1].new_deaths
									)}">${item.timeline[1].new_deaths.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[1].deaths,
							item.timeline[1].new_deaths
						)}%)</small></td>
                                    <td>${item.timeline[1].recovered.toLocaleString()}</td>
                                    <td class="new-recovered" data-percentage="${percentageChangeTable(
										item.timeline[1].recovered,
										item.timeline[1].new_recovered
									)}">${item.timeline[1].new_recovered.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[1].recovered,
							item.timeline[1].new_recovered
						)}%)</small></td>
                                </tr>
                            `;
					}
				} else {
					output += `
                        <tr data-toggle="tooltip" title="Last updated on ${getDateFormatted(item.updated_at)}">
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
			$dasboardTableRows.children('tbody').html(output);
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
			$('[data-toggle="tooltip"]').tooltip({ placement: 'bottom' });
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};

fetch(totalCases)
	.then((response) => response.json())
	.then((countries) => {
		countries.data.forEach((country) => {
			// console.log('country', country.date);
			lineDashboardLabelsDate.push(country.date);
			lineDashboardChartDataConfirmed.push(country.confirmed);
			lineDashboardChartDataActive.push(country.active);
			lineDashboardChartDataRecovered.push(country.recovered);
			lineDashboardChartDataDeaths.push(country.deaths);
		});

		lineDashboardChartData.push(
			{
				label: 'Confirmed',
				data: lineDashboardChartDataConfirmed.reverse(),
				borderColor: '#6900c7',
				fill: false,
				type: 'line'
			},
			{
				label: 'Active',
				data: lineDashboardChartDataActive.reverse(),
				borderColor: '#1f2d41',
				fill: false,
				type: 'line'
			},
			{
				label: 'Recovered',
				data: lineDashboardChartDataRecovered.reverse(),
				borderColor: '#00AC68',
				backgroundColor: '#00AC68'
			},
			{
				label: 'Deaths',
				data: lineDashboardChartDataDeaths.reverse(),
				borderColor: '#dc3545',
				backgroundColor: '#dc3545'
			}
		);
		var dragOptions = {
			animationDuration: 1000
		};

		let myChart = new Chart(ctxDashboardLine, {
			type: 'bar',
			data: {
				labels: lineDashboardLabelsDate.reverse(),
				datasets: lineDashboardChartData
			},
			options: {
				maintainAspectRatio: false,
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
							return (
								data.datasets[tooltipItem.datasetIndex].label +
								': ' +
								tooltipItem.yLabel.toLocaleString()
							);
						}
					}
				},
				scales: {
					xAxes: [
						{
							ticks: {
								autoSkip: true,
								maxTicksLimit: 30
							}
						}
					],
					yAxes: [
						{
							ticks: {
								callback: function(value) {
									return value.toLocaleString();
								}
							}
						}
					]
				},
				plugins: {
					zoom: {
						pan: {
							enabled: true,
							mode: 'xy'
						},
						zoom: {
							enabled: true,
							mode: 'xy'
						}
					}
				}
			}
		});
		Chart.defaults.global.defaultFontFamily = 'Nunito';
		$('#chartType').on('change', function() {
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

		$('#resetDashboardZoom').on('click', function() {
			myChart.resetZoom();
		});
	})
	.catch((error) => console.log('error', error));

$(document).ready(function() {
	getDateFormatted();
	fillNumberOfCases();
	fillWorldTimelineTable();
});
