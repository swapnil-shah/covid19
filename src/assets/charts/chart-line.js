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
function selectCases(caseObj) {
	lineChartData[0].data = caseObj[0].data;
	lineChartData[1].data = caseObj[1].data;
	lineChartData[2].data = caseObj[2].data;
	lineChartData[3].data = caseObj[3].data;
	return lineChartData[0].data, lineChartData[1].data, lineChartData[2].data, lineChartData[3].data;
}
let optionsLinear = {
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
	title: {
		display: true,
		text: [
			'COVID-19 CASES OF ' + mostCountryNum + ' MOST AFFECTED COUNTRY',
			'Click on the box toshow/hide respective graph'
		],
		fontSize: 16,
		lineHeight: 1.6
	},
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

let sortedArr = [];
let ddChartCountriesData = [];
function countriesLineData(countries) {
	// add option to dropdown
	// let addCountriesToDropdown = () => {
	let ddChartCountriesSelect = document.getElementById('ddChartCountries');
	let regionNewsSelect = document.getElementById('selectNewsRegion');
	countries
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
	countries
		.slice(mostCountryNum, countries.length)
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
			});
			myChart.update();

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
}
