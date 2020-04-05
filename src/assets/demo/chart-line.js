const API_URL_MOST_AFFECTED = 'https://corona.lmao.ninja/v2/historical/usa,italy,china,spain';
let lineChartData = [];
let lineLabelsCase = [];
let lineLabelsDeaths = [];
let lineLabelsRecovered = [];
let lineChartDataCase = [];
let lineChartDataDeaths = [];
let lineChartDataRecovered = [];
let ctxLine = document.getElementById('myLineChart');
let dateSinceHistory = document.querySelectorAll('.date-since-historical');

function selectCases(caseObj, caseLabel) {
	lineChartData[0].data = caseObj[0].data;
	lineChartData[1].data = caseObj[1].data;
	lineChartData[2].data = caseObj[2].data;
	lineChartData[3].data = caseObj[3].data;
	// lineChartData[0].labels = caseLabel;
	return lineChartData[0].data, lineChartData[1].data, lineChartData[2].data, lineChartData[3].data;
}
fetch(API_URL_MOST_AFFECTED)
	.then((response) => response.json())
	.then((countries) => {
		lineLabelsCase = Object.keys(countries[0].timeline.cases);
		lineLabelsDeaths = Object.keys(countries[0].timeline.deaths);
		lineLabelsRecovered = Object.keys(countries[0].timeline.recovered);
		dateSinceHistory.forEach(function(ele, i) {
			dateSinceHistory[i].innerText = Object.keys(countries[0].timeline.cases)[0];
		});
		countries.forEach((country) => {
			lineChartDataCase.push({ data: Object.values(country.timeline.cases) });
			lineChartDataDeaths.push({ data: Object.values(country.timeline.deaths) });
			lineChartDataRecovered.push({ data: Object.values(country.timeline.recovered) });
			lineChartData.push({
				label: country.country,
				data: Object.values(country.timeline.cases),
				fill: false,
				...(country.country.toLowerCase() === 'usa' && { borderColor: '#3F95CD' }),
				...(country.country.toLowerCase() === 'italy' && { borderColor: '#956AA8' }),
				...(country.country.toLowerCase() === 'china' && { borderColor: '#61C5B1' }),
				...(country.country.toLowerCase() === 'spain' && { borderColor: '#C45851' })
			});
		});
		let myChart = new Chart(ctxLine, {
			type: 'line',
			data: {
				labels: lineLabelsCase,
				datasets: lineChartData
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
					xPadding: 10,
					yPadding: 10
					// callbacks: {
					// 	label: function(tooltipItem, data) {
					// 		console.log(tooltipItem, data);
					// 	}
					// }
				},
				cutoutPercentage: 80,
				scales: {
					xAxes: [
						{
							ticks: {
								autoSkip: true,
								maxTicksLimit: 20
							}
						}
					],
					yAxes: [
						{
							ticks: {
								callback: function(value, index, values) {
									return value.toLocaleString();
								}
							}
						}
					]
				}
			}
		});
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
	})
	.catch((error) => console.log('error', error));
