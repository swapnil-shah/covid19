let chartData = [];
fetch('https://covid19-server.chrismichael.now.sh/api/v1/IndiaCasesByStates', { cache: 'no-cache' })
	.then((response) => response.json())
	.then((states) => {
		states.data[0].table
			.filter(function(onlyStates) {
				return onlyStates.statecode !== 'TT';
			})
			.forEach((state) => {
				chartData.push([
					'IN-' + state.statecode,
					state.state,
					parseInt(state.confirmed),
					createCustomHTMLContent(
						parseInt(state.confirmed),
						parseInt(state.active),
						parseInt(state.recovered),
						parseInt(state.deaths)
					)
				]);
			});
		console.log('chartData', chartData);
	})
	.catch((error) => console.log('error', error));

google.charts.load('current', {
	packages: [ 'geochart' ]
});

google.charts.setOnLoadCallback(drawMap);
function createCustomHTMLContent(confirmed, active, recovered, deaths) {
	return (
		'<div>' +
		'<p style="margin-bottom:0.3rem"><b style="font-size:12px">Confirmed</b><br/>' +
		confirmed.toLocaleString() +
		'</p>' +
		'<p style="margin-bottom:0.3rem"><b style="font-size:12px">Confirmed</b><br/>' +
		active.toLocaleString() +
		'</p>' +
		'<p style="margin-bottom:0.3rem"><b style="font-size:12px">Recovered</b><br/>' +
		recovered.toLocaleString() +
		'</p>' +
		'<p style="margin-bottom:0.3rem"><b style="font-size:12px">Deaths</b><br/>' +
		deaths.toLocaleString() +
		'</p>'
	);
	('</div>');
}
// World Map
function drawMap() {
	var mapData = new google.visualization.DataTable();
	mapData.addColumn('string', 'State Code'); // Latitude Value
	mapData.addColumn('string', 'State'); // Longitude Value
	mapData.addColumn('number', 'Confirmed'); //
	mapData.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });
	mapData.addRows(chartData);
	var options = {
		region: 'IN',
		displayMode: 'regions',
		resolution: 'provinces',
		theme: 'maximized',
		focusTarget: 'category',
		tooltip: { isHtml: true },
		chartArea: { width: '100%', height: '100%' },
		colorAxis: { colors: [ '#FFEDA0', '#FEB24C', '#FD8D3C' ] },
		backgroundColor: { fill: '#CAD2D3' },
		datalessRegionColor: '#F0F0EF',
		animation: {
			duration: 1000,
			easing: 'out'
		}
	};
	var chart = new google.visualization.GeoChart(document.getElementById('covidCountryChart'));
	chart.draw(mapData, options);
}
$('#selectRegion').on('change', function() {});
