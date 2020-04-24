let ctxCountryLine = document.getElementById('myCountryChart');
let countryChartData = [];
let countryLabelsDate = [];
let countryChartDataPositive = [];
let countryChartDataNegative = [];
let stateData = [];
let stateLabelsDate = [];
let stateChartDataPositive = [];
let stateChartDataNegative = [];

let ctxDashboardLine = document.getElementById('myDashboardChart');
let legendContainer = document.getElementById('legend-numbers');
let legendtotal = document.getElementById('legend-total');
let legendpositive = document.getElementById('legend-positive');
let legendNegative = document.getElementById('legend-negative');
let legendUpdated = document.getElementById('last-updated-legend');
let dataSet = (chartData, chartDataNegative, chartDataPositive) => {
	return chartData.push(
		{
			label: 'Negative',
			data: chartDataNegative.reverse(),
			backgroundColorHover: '#00ac69',
			backgroundColor: '#3cba9f'
		},
		{
			label: 'Positive',
			data: chartDataPositive.reverse(),
			backgroundColorHover: '#1f2d41',
			backgroundColor: '#324765'
		}
	);
};

fetch('https://covidtracking.com/api/v1/us/daily.json')
	.then((response) => response.json())
	.then((states) => {
		legendtotal.innerText = states[0].totalTestResults.toLocaleString();
		legendpositive.innerText = states[0].positive.toLocaleString();
		legendNegative.innerText = states[0].negative.toLocaleString();
		legendUpdated.innerHTML = `Last updated ${timeDifference(states[0].dateChecked)}`;
		states
			.filter(function(valid) {
				return valid.positive && valid.negative && valid.death;
			})
			.forEach((state) => {
				countryLabelsDate.push(formatYYYYMMDD(state.date));
				countryChartDataPositive.push(state.positive);
				countryChartDataNegative.push(state.negative);
			});
		dataSet(countryChartData, countryChartDataPositive, countryChartDataNegative);

		let myChart = new Chart(ctxCountryLine, {
			type: 'bar',
			data: {
				labels: countryLabelsDate.reverse(),
				datasets: countryChartData
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
							var sum = 0;

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
					}
				},
				scales: {
					xAxes: [
						{
							stacked: true,
							ticks: {
								maxTicksLimit: 20
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
		// Functon when no data label is availabe for the chart
		Chart.plugins.register({
			afterDraw: function(chart) {
				if (chart.data.labels.length === 0) {
					// No data is present
					var ctx = chart.chart.ctx;
					var width = chart.chart.width;
					var height = chart.chart.height;
					chart.clear();
					ctx.save();
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.font = "16px normal 'Nunito'";
					ctx.fillText(
						'No data available for this state at the moment. Please try another state',
						width / 2,
						height / 2
					);
					ctx.restore();
				}
			}
		});

		$('#selectRegion').on('change', function() {
			let value = $(this).val();
			let stateData = [];
			let stateLabelsDate = [];
			let stateChartDataPositive = [];
			let stateChartDataNegative = [];
			if (value === 'usa') {
				legendContainer.classList.remove('d-flex');
				legendContainer.classList.add('d-none');
				myChart.data.datasets = countryChartData;
				myChart.data.labels = countryLabelsDate;
				myChart.update();
			} else {
				fetch('https://covidtracking.com/api/v1/states/' + value + '/daily.json', { cache: 'no-cache' })
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('BAD HTTP');
						}
					})
					.then((data) => {
						legendtotal.innerText = data[0].totalTestResults.toLocaleString();
						legendpositive.innerText = data[0].positive.toLocaleString();
						legendNegative.innerText = data[0].negative.toLocaleString();
						legendUpdated.innerHTML = `Last updated ${timeDifference(states[0].dateChecked)}`;

						data
							.filter(function(valid) {
								return valid.positive && valid.negative && valid.death;
							})
							.forEach((state) => {
								stateLabelsDate.push(formatYYYYMMDD(state.date));
								stateChartDataPositive.push(state.positive);
								stateChartDataNegative.push(state.negative);
							});

						dataSet(stateData, stateChartDataPositive, stateChartDataNegative);
						console.log('stateData', stateData);
						myChart.data.datasets = stateData;
						myChart.data.labels = stateLabelsDate.reverse();
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
	$('#dataTableCountry').DataTable({
		ajax: {
			url: 'https://covid19api.io/api/v1/CasesInAllUSStates',
			type: 'GET',
			cache: false,
			dataSrc: function(json) {
				return json.data[0].table;
			}
		},
		pagingType: 'numbers',
		pageLength: 50,
		ordering: false,
		language: {
			searchPlaceholder: 'e.g. usa'
		},
		columns: [
			{
				title: 'Name',
				data: 'USAState'
			},
			{
				title: 'Cases',
				data: 'TotalCases',
				render: function(data, type, row) {
					if (type === 'type' || type === 'sort') {
						return data;
					}
					return `${data}<p class="text-muted small">${row.NewCases}</p>`;
				}
			},
			{
				title: 'Active Cases',
				data: 'ActiveCases'
			},
			{
				title: 'Deaths',
				data: 'TotalDeaths',
				render: function(data, type, row) {
					if (type === 'type' || type === 'sort') {
						return data;
					}
					return `${data}<p class="text-muted small">${row.NewDeaths}</p>`;
				}
			}
		]
	});
});
