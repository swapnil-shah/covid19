let lineChartData = [];
let lineLabelsCase = [];
let lineLabelsDeaths = [];
let lineLabelsRecovered = [];
let lineChartDataCase = [];
let lineChartDataDeaths = [];
let lineChartDataRecovered = [];
let ctxLine = document.getElementById('myLineChart');
let dateSinceHistory = document.querySelectorAll('.date-since-historical');
function selectCases(caseObj) {
	lineChartData[0].data = caseObj[0].data;
	lineChartData[1].data = caseObj[1].data;
	lineChartData[2].data = caseObj[2].data;
	lineChartData[3].data = caseObj[3].data;
	return lineChartData[0].data, lineChartData[1].data, lineChartData[2].data, lineChartData[3].data;
}
let optionsLinear = {
	maintainAspectRatio: false,
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
					suggestedMax: 10,
					callback: function(value) {
						return value.toLocaleString();
					}
				}
			}
		]
	}
};
let optionsLog = {
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
						if (value == 500) return value.toLocaleString();
						if (value == 200) return value.toLocaleString();
						if (value == 100) return value.toLocaleString();
						if (value == 50) return value.toLocaleString();
						if (value == 20) return value.toLocaleString();
						if (value == 10) return value.toLocaleString();
						if (value == 5) return value.toLocaleString();
						if (value == 2) return value.toLocaleString();
					}
				}
			}
		]
	}
};
const getDashboardCountries = 'https://disease.sh/v2/countries?yesterday=true&sort=cases';

let sortedArr = [];
fetch('https://disease.sh/v2/countries?yesterday=true&sort=cases', { cache: 'no-cache' })
	.then((response) => response.json())
	.then((countries) => {
		countries.slice(0, 5).map((item, i) => {
			sortedArr.push(item.countryInfo.iso2);
		});
		let query = sortedArr.join();
		const API_URL_MOST_AFFECTED = 'https://disease.sh/v2/historical/' + query + '?lastdays=45';
		function selectCases(caseObj) {
			lineChartData[0].data = caseObj[0].data;
			lineChartData[1].data = caseObj[1].data;
			lineChartData[2].data = caseObj[2].data;
			lineChartData[3].data = caseObj[3].data;
			return lineChartData[0].data, lineChartData[1].data, lineChartData[2].data, lineChartData[3].data;
		}

		fetch(API_URL_MOST_AFFECTED).then((response) => response.json()).then((countries) => {
			lineLabelsCase = Object.keys(countries[0].timeline.cases);
			lineLabelsDeaths = Object.keys(countries[0].timeline.deaths);
			lineLabelsRecovered = Object.keys(countries[0].timeline.recovered);
			dateSinceHistory.forEach(function(ele, i) {
				dateSinceHistory[i].innerText = Object.keys(countries[0].timeline.cases)[0];
			});
			countries.forEach((country) => {
				console.log('Data for 5 countries', country);

				lineChartDataCase.push({ data: Object.values(country.timeline.cases) });
				lineChartDataDeaths.push({ data: Object.values(country.timeline.deaths) });
				lineChartDataRecovered.push({ data: Object.values(country.timeline.recovered) });
				lineChartData.push({
					label: country.country,
					data: Object.values(country.timeline.cases),
					fill: false,
					pointHoverRadius: 0,
					pointBorderWidth: 0,
					...(country.country.toLowerCase() === 'spain' && { borderColor: '#FFCD56' }),
					...(country.country.toLowerCase() === 'usa' && { borderColor: '#3F95CD' }),
					...(country.country.toLowerCase() === 'italy' && { borderColor: '#956AA8' }),
					...(country.country.toLowerCase() === 'uk' && { borderColor: '#61C5B1' }),
					...(country.country.toLowerCase() === 'france' && { borderColor: '#C45851' })
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
			document.getElementById('chartType').addEventListener('change', function() {
				myChart.destroy();
				myChart = new Chart(ctx, {
					type: 'line',
					data: {
						labels: lineLabelsCase,
						datasets: lineChartData
					},
					options: this.value == 'linear' ? optionsLinear : optionsLog
				});
			});
			Chart.defaults.global.defaultFontFamily = 'Nunito';
			$('#chartTests').on('change', function() {
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
	});
