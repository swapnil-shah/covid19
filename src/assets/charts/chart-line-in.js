fetch('https://api.covid19india.org/data.json', { cache: 'no-cache' })
	.then((response) => response.json())
	.then((data) => {
		countryLineData(data);
	});
function countryLineData(data) {
	var canvas = document.getElementById('myChart');
	var ctx = canvas.getContext('2d');
	var myChart;
	let gradientBlue = ctx.createLinearGradient(0, 0, 0, 450);
	let gradientGreen = ctx.createLinearGradient(0, 0, 0, 450);
	let gradientRed = ctx.createLinearGradient(0, 0, 0, 450);
	let borderBlue = 'rgba(0, 97, 242, 0.75)';
	let borderGreen = 'rgba(42, 157, 143, 0.75)';
	let borderRed = 'rgba(230, 57, 70, 0.75)';
	gradientBlue.addColorStop(0, 'rgba(0, 97,242, 0.75)');
	gradientBlue.addColorStop(0.5, 'rgba(0, 97,242, 0.55)');
	gradientBlue.addColorStop(1, 'rgba(0, 97,242,0.10)');
	gradientGreen.addColorStop(0, 'rgba(42,157,143, 0.75)');
	gradientGreen.addColorStop(0.5, 'rgba(42,157,143, 0.55)');
	gradientGreen.addColorStop(1, 'rgba(42,157,143,0.10)');
	gradientRed.addColorStop(0, 'rgba(230,57,70,  0.75)');
	gradientRed.addColorStop(0.5, 'rgba(230,57,70,  0.55)');
	gradientRed.addColorStop(1, 'rgba(230,57,70, 0.10)');

	// var chartType = 'bar';
	let dailyConfirmed = [];
	let dailyDeceased = [];
	let dailyRecovered = [];
	let labelsDate = [];
	let dailyConfirmedMonth = [];
	let dailyDeceasedMonth = [];
	let dailyRecoveredMonth = [];
	let labelsDateMonth = [];
	let dailyConfirmedWeeks = [];
	let dailyDeceasedWeeks = [];
	let dailyRecoveredWeeks = [];
	let labelsDateWeeks = [];
	let lastArr = data.cases_time_series[data.cases_time_series.length - 1];
	document.getElementById('total-confirmed').innerHTML = `<span style="color:${borderBlue}">${parseInt(
		lastArr.totalconfirmed
	).toLocaleString()}</span>`;
	document.getElementById('total-recovered').innerHTML = `<span style="color:${borderGreen}">${parseInt(
		lastArr.totalrecovered
	).toLocaleString()}</span>`;
	document.getElementById('total-deaths').innerHTML = `<span style="color:${borderRed}">${parseInt(
		lastArr.totaldeceased
	).toLocaleString()}</span>`;
	document.getElementById('total-date').innerHTML = `As of ${lastArr.date}`;

	//Get months/30 days
	data.cases_time_series.slice(Math.max(data.cases_time_series.length - 30, 1)).forEach(function(daily) {
		dailyConfirmedMonth.push(daily.dailyconfirmed);
		dailyDeceasedMonth.push(daily.dailydeceased);
		dailyRecoveredMonth.push(daily.dailyrecovered);
		labelsDateMonth.push(daily.date);
	});
	//Get 14 days
	data.cases_time_series.slice(Math.max(data.cases_time_series.length - 14, 1)).forEach(function(daily) {
		dailyConfirmedWeeks.push(daily.dailyconfirmed);
		dailyDeceasedWeeks.push(daily.dailydeceased);
		dailyRecoveredWeeks.push(daily.dailyrecovered);
		labelsDateWeeks.push(daily.date);
	});
	data.cases_time_series.forEach(function(daily) {
		dailyConfirmed.push(daily.dailyconfirmed);
		dailyDeceased.push(daily.dailydeceased);
		dailyRecovered.push(daily.dailyrecovered);
		labelsDate.push(daily.date);
	});

	Chart.defaults.global.defaultFontColor = 'grey';
	function generateChart(labelset, dataset, chartType, chartLabel, gradient, gradientBorder) {
		var data = {
			labels: labelset,
			datasets: [
				{
					label: chartLabel,
					data: dataset,
					backgroundColor: gradient,
					borderColor: gradientBorder,
					borderWidth: 1, // The main line color
					pointBorderWidth: 0
				}
			]
		};
		var options = {
			responsive: true,
			maintainAspectRatio: false,
			tooltips: {
				borderWidth: 1,
				caretPadding: 10,
				displayColors: false,
				xPadding: 10,
				yPadding: 10,
				callbacks: {
					label: function(tooltipItem, data) {
						return (
							data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString()
						);
					}
				}
			},
			scales: {
				yAxes: [
					{
						ticks: {
							autoSkip: true,
							beginAtZero: true,
							callback: function(value) {
								return value.toLocaleString();
							}
						}
					}
				],
				xAxes: [
					{
						ticks: {
							display: false
						}
					}
				]
			},
			title: {
				display: true,
				text: 'Overall Country Data',
				position: 'bottom'
			}
		};
		myChart = new Chart(ctx, {
			type: chartType ? chartType : 'bar',
			data: data,
			options: options
		});
		$('#barRadio').click(function() {
			myChart.destroy();
			myChart = new Chart(ctx, {
				type: 'bar',
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					tooltips: {
						callbacks: {
							label: function(tooltipItem, data) {
								return (
									data.datasets[tooltipItem.datasetIndex].label +
									': ' +
									tooltipItem.yLabel.toLocaleString()
								);
							}
						}
					}
				}
			});
			myChart.update();
		});
		$('#lineRadio').click(function() {
			myChart.destroy();
			myChart = new Chart(ctx, {
				type: 'line',
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					tooltips: {
						callbacks: {
							label: function(tooltipItem, data) {
								return (
									data.datasets[tooltipItem.datasetIndex].label +
									': ' +
									tooltipItem.yLabel.toLocaleString()
								);
							}
						}
					}
				}
			});
			myChart.update();
		});
	}
	generateChart(labelsDateMonth, dailyConfirmedMonth, null, 'Confirmed', gradientBlue, borderBlue);

	$('#confirmedRadio').click(function() {
		myChart.destroy();
		if ($('#sinceBeginning').is(':checked')) {
			generateChart(labelsDate, dailyConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#sinceMonth').is(':checked')) {
			generateChart(
				labelsDateMonth,
				dailyConfirmedMonth,
				myChart.config.type,
				'Confirmed',
				gradientBlue,
				borderBlue
			);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(
				labelsDateWeeks,
				dailyConfirmedWeeks,
				myChart.config.type,
				'Confirmed',
				gradientBlue,
				borderBlue
			);
		}
		myChart.update();
	});
	$('#recoveredRadio').click(function() {
		myChart.destroy();
		if ($('#sinceBeginning').is(':checked')) {
			generateChart(labelsDate, dailyRecovered, myChart.config.type, 'Recovered', gradientGreen, borderGreen);
		}
		if ($('#sinceMonth').is(':checked')) {
			generateChart(
				labelsDateMonth,
				dailyRecoveredMonth,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(
				labelsDateWeeks,
				dailyRecoveredWeeks,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		myChart.update();
	});
	$('#deathsRadio').click(function() {
		myChart.destroy();
		if ($('#sinceBeginning').is(':checked')) {
			generateChart(labelsDate, dailyDeceased, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		if ($('#sinceMonth').is(':checked')) {
			generateChart(labelsDateMonth, dailyDeceasedMonth, myChart.config.type, 'Deceased', gradientRed, borderRed);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(labelsDateWeeks, dailyDeceasedWeeks, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
	$('#sinceBeginning').click(function() {
		myChart.destroy();
		if ($('#confirmedRadio').is(':checked')) {
			generateChart(labelsDate, dailyConfirmed, myChart.config.type, 'Confirmed', gradientBlue, borderBlue);
		}
		if ($('#recoveredRadio').is(':checked')) {
			generateChart(labelsDate, dailyRecovered, myChart.config.type, 'Recovered', gradientGreen, borderGreen);
		}
		if ($('#deathsRadio').is(':checked')) {
			generateChart(labelsDate, dailyDeceased, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
	$('#sinceMonth').click(function() {
		myChart.destroy();
		if ($('#confirmedRadio').is(':checked')) {
			generateChart(
				labelsDateMonth,
				dailyConfirmedMonth,
				myChart.config.type,
				'Confirmed',
				gradientBlue,
				borderBlue
			);
		}
		if ($('#recoveredRadio').is(':checked')) {
			generateChart(
				labelsDateMonth,
				dailyRecoveredMonth,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		if ($('#deathsRadio').is(':checked')) {
			generateChart(labelsDateMonth, dailyDeceasedMonth, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
		myChart.update();
	});
	$('#sinceWeeks').click(function() {
		myChart.destroy();
		myChart.destroy();
		if ($('#confirmedRadio').is(':checked')) {
			generateChart(
				labelsDateWeeks,
				dailyConfirmedWeeks,
				myChart.config.type,
				'Confirmed',
				gradientBlue,
				borderBlue
			);
		}
		if ($('#recoveredRadio').is(':checked')) {
			generateChart(
				labelsDateWeeks,
				dailyRecoveredWeeks,
				myChart.config.type,
				'Recovered',
				gradientGreen,
				borderGreen
			);
		}
		if ($('#deathsRadio').is(':checked')) {
			generateChart(labelsDateWeeks, dailyDeceasedWeeks, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
		myChart.update();
	});
}
