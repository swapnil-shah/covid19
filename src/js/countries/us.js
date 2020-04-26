$(document).ready(function() {
	fetch('https://covid19api.io/api/v1/CasesInAllUSStates').then((response) => response.json()).then(function(states) {
		dataStored(states);
	});
	function dataStored(states) {
		let chartData = [];
		let dataSet = states.data[0].table;

		dataSet
			.filter(function(filterUSA) {
				return filterUSA.USAState !== 'USA Total';
			})
			.forEach(function(state) {
				chartData.push({
					label: [ state.USAState ],
					data: [
						{
							x: parseFloat(state.Tot_Cases_1M_Pop.replace(/,/g, '')) * 100000,
							y: parseFloat(state.Tot_Cases_1M_Pop.replace(/,/g, '')),
							r: 15
						}
					],
					backgroundColor: 'rgba(255,221,50,0.2)',
					borderColor: 'rgba(255,221,50,1)'
				});
			});
		console.log(chartData);
		var bubbleChart = new Chart(document.getElementById('myCountryChart'), {
			type: 'bubble',
			data: {
				labels: 'USA',
				datasets: chartData
			},
			options: {
				title: {
					display: true,
					text: 'Cases per million'
				},
				scales: {
					yAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: 'Cases'
							}
						}
					],
					xAxes: [
						{
							scaleLabel: {
								display: true,
								labelString: 'Per million'
							}
						}
					]
				}
			}
		});
		charts.push(bubbleChart);

		$('#dataTableCountry').DataTable({
			data: dataSet,
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
	}
});
