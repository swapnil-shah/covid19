const API_URL_MOST_AFFECTED = 'https://corona.lmao.ninja/v2/historical/usa,italy,china,spain';
let lineChartData = [];
let lineLabels = [];
let colors = [ '#3B8DC2' ];
let ctxLine = document.getElementById('myLineChart');
let dateSinceHistory = document.querySelectorAll('.date-since-historical');

fetch(API_URL_MOST_AFFECTED)
	.then((response) => response.json())
	.then((countries) => {
		console.log(Object.keys(countries[0].timeline.cases)[0]);
		lineLabels = Object.keys(countries[0].timeline.cases);
		dateSinceHistory.forEach(function(ele, i) {
			dateSinceHistory[i].innerText = Object.keys(countries[0].timeline.cases)[0];
		});
		countries.forEach((country) => {
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
				labels: lineLabels,
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
	})
	.catch((error) => console.log('error', error));

// // Set new default font family and font color to mimic Bootstrap's default styling
// (Chart.defaults.global.defaultFontFamily = 'Metropolis'),
// 	'-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = '#858796';

// // Pie Chart Example
// var ctx = document.getElementById('myPieChart');
// var myPieChart = new Chart(ctx, {
// 	type: 'doughnut',
// 	data: {
// 		labels: [ 'Direct', 'Referral', 'Social' ],
// 		datasets: [
// 			{
// 				data: [ 10, 15 ],
// 				backgroundColor: [ 'rgba(0, 97, 242, 1)', 'rgba(0, 172, 105, 1)', 'rgba(88, 0, 232, 1)' ],
// 				hoverBackgroundColor: [ 'rgba(0, 97, 242, 0.9)', 'rgba(0, 172, 105, 0.9)', 'rgba(88, 0, 232, 0.9)' ],
// 				hoverBorderColor: 'rgba(234, 236, 244, 1)'
// 			}
// 		]
// 	},
// 	options: {
// 		maintainAspectRatio: false,
// 		tooltips: {
// 			backgroundColor: 'rgb(255,255,255)',
// 			bodyFontColor: '#858796',
// 			borderColor: '#dddfeb',
// 			borderWidth: 1,
// 			xPadding: 15,
// 			yPadding: 15,
// 			displayColors: false,
// 			caretPadding: 10
// 		},
// 		cutoutPercentage: 80
// 	}
// });
