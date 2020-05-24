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
	let numbersConfirmedMonth = 0;
	let numbersDeceasedMonth = 0;
	let numbersRecoveredMonth = 0;
	let dailyConfirmedWeeks = [];
	let dailyDeceasedWeeks = [];
	let dailyRecoveredWeeks = [];
	let labelsDateWeeks = [];
	let numbersConfirmedWeeks = 0;
	let numbersDeceasedWeeks = 0;
	let numbersRecoveredWeeks = 0;
	let lastArr = data.cases_time_series[data.cases_time_series.length - 1];
	let numbersConfirmed = parseInt(lastArr.totalconfirmed).toLocaleString();
	let numbersDeceased = parseInt(lastArr.totaldeceased).toLocaleString();
	let numbersRecovered = parseInt(lastArr.totalrecovered).toLocaleString();
	function populateNumbers(confirmed, recovered, deaths, text) {
		document.getElementById('total-confirmed').innerHTML = `<span style="color:${borderBlue}">${confirmed}</span>`;
		document.getElementById('total-recovered').innerHTML = `<span style="color:${borderGreen}">${recovered}</span>`;
		document.getElementById('total-deaths').innerHTML = `<span style="color:${borderRed}">${deaths}</span>`;
		document.getElementById('total-date').innerHTML = ` (${text})`;
	}

	//Get months/30 days
	data.cases_time_series.slice(Math.max(data.cases_time_series.length - 30, 1)).forEach(function(daily) {
		dailyConfirmedMonth.push(daily.dailyconfirmed);
		numbersConfirmedMonth += parseInt(daily.dailyconfirmed);
		dailyDeceasedMonth.push(daily.dailydeceased);
		numbersDeceasedMonth += parseInt(daily.dailydeceased);
		dailyRecoveredMonth.push(daily.dailyrecovered);
		numbersRecoveredMonth += parseInt(daily.dailyrecovered);
		labelsDateMonth.push(daily.date);
	});

	//Get 14 days
	data.cases_time_series.slice(Math.max(data.cases_time_series.length - 14, 1)).forEach(function(daily) {
		dailyConfirmedWeeks.push(daily.dailyconfirmed);
		numbersConfirmedWeeks += parseInt(daily.dailyconfirmed);
		dailyDeceasedWeeks.push(daily.dailydeceased);
		numbersDeceasedWeeks += parseInt(daily.dailydeceased);
		dailyRecoveredWeeks.push(daily.dailyrecovered);
		numbersRecoveredWeeks += parseInt(daily.dailyrecovered);
		labelsDateWeeks.push(daily.date);
	});
	data.cases_time_series.forEach(function(daily) {
		dailyConfirmed.push(daily.dailyconfirmed);
		dailyDeceased.push(daily.dailydeceased);
		dailyRecovered.push(daily.dailyrecovered);
		labelsDate.push(daily.date);
	});

	Chart.defaults.global.defaultFontColor = '#dddfeb';
	Chart.defaults.global.defaultFontFamily = 'Nunito,-apple-system,Roboto,Helvetica Neue,Arial,sans-serif';
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
				caretPadding: 5,
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
						// ticks: {
						// 	display: false
						// }
					}
				]
			},
			title: {
				display: true,
				text: 'Daily Cases',
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
					},
					scales: {
						yAxes: [
							{
								ticks: {
									callback: function(value) {
										return value.toLocaleString();
									}
								}
							}
						]
					}
				}
			});
			myChart.update();
		});
		$(
			'input:radio[name="chartTypeRadio"], input:radio[name="timeframe"], input:radio[name="caseTypeRadio"]'
		).change(function() {
			if ($('#lineRadio').is(':checked')) {
				$('#linearRadio,  #logarithmicRadio').removeAttr('disabled');
			} else {
				$('#linearRadio').attr('checked');
				$('#logarithmicRadio').removeAttr('checked');
				$('#linearRadio, #logarithmicRadio').attr('disabled', '');
			}
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
					},
					scales: {
						yAxes: [
							{
								type: $('#linearRadio').is(':checked') ? 'linear' : 'logarithmic',
								ticks: {
									callback: function(value) {
										return value.toLocaleString();
									}
								}
							}
						]
					}
				}
			});
			myChart.update();
		});
		$('#linearRadio').click(function() {
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
					},
					scales: {
						yAxes: [
							{
								type: 'linear',
								ticks: {
									callback: function(value) {
										return value.toLocaleString();
									}
								}
							}
						]
					}
				}
			});
			myChart.update();
		});
		$('#logarithmicRadio').click(function() {
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
					},
					scales: {
						yAxes: [
							{
								type: 'logarithmic',
								ticks: {
									autoSkip: true,
									source: 'auto',
									suggestedMax: 10,
									callback: function(value) {
										if (value == 5000) return value.toLocaleString();
										if (value == 4000) return value.toLocaleString();
										if (value == 3000) return value.toLocaleString();
										if (value == 2000) return value.toLocaleString();
										if (value == 1000) return value.toLocaleString();
										if (value == 900) return value;
										if (value == 800) return value;
										if (value == 700) return value;
										if (value == 600) return value;
										if (value == 500) return value;
										if (value == 400) return value;
										if (value == 300) return value;
										if (value == 200) return value;
										if (value == 100) return value;
										if (value == 90) return value;
										if (value == 80) return value;
										if (value == 70) return value;
										if (value == 60) return value;
										if (value == 50) return value;
										if (value == 40) return value;
										if (value == 30) return value;
										if (value == 20) return value;
										if (value == 10) return value;
									}
								}
							}
						]
					}
				}
			});
			myChart.update();
		});
	}
	generateChart(labelsDateMonth, dailyConfirmedMonth, null, 'Confirmed', gradientBlue, borderBlue);
	populateNumbers(
		numbersConfirmedMonth.toLocaleString(),
		numbersRecoveredMonth.toLocaleString(),
		numbersDeceasedMonth.toLocaleString(),
		'since month'
	);

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
			generateChart(labelsDateMonth, dailyDeceasedMonth, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		if ($('#sinceWeeks').is(':checked')) {
			generateChart(labelsDateWeeks, dailyDeceasedWeeks, myChart.config.type, 'Deaths', gradientRed, borderRed);
		}
		myChart.update();
	});
	$('#sinceBeginning').click(function() {
		populateNumbers(
			numbersConfirmed.toLocaleString(),
			numbersRecovered.toLocaleString(),
			numbersDeceased.toLocaleString(),
			'since beginning'
		);
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
		populateNumbers(
			numbersConfirmedMonth.toLocaleString(),
			numbersRecoveredMonth.toLocaleString(),
			numbersDeceasedMonth.toLocaleString(),
			'since a month'
		);
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
	});
	$('#sinceWeeks').click(function() {
		populateNumbers(
			numbersConfirmedWeeks.toLocaleString(),
			numbersRecoveredWeeks.toLocaleString(),
			numbersDeceasedWeeks.toLocaleString(),
			'since 2 weeks'
		);
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
	});
}
