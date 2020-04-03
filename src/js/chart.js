const API_URL_SUMMARY = 'https://corona.lmao.ninja/countries';
const API_URL_USA = 'https://corona.lmao.ninja/jhucsse';
const API_URL_USA_STATES = 'https://covidtracking.com/api/states';

let chartWorldData = [];
let chartUsaData = [ [ 'States', 'stats' ] ];

// Fetch World Data
fetch(API_URL_SUMMARY).then((response) => response.json()).then((countries) => {
	countries.forEach((country) => {
		chartWorldData.push([
			country.countryInfo.lat,
			country.countryInfo.long,
			country.country,
			// country.cases,
			country.cases
		]);
	});
});

// Fetch USA Data
fetch(API_URL_USA_STATES).then((response) => response.json()).then((states) => {
	states.forEach((state) => {
		console.log(state.state, state.cases);
		chartUsaData.push([ state.state, state.positive ]);
	});
	console.log(chartUsaData);
});
google.charts.load('current', {
	packages: [ 'geochart' ],
	mapsApiKey: 'AIzaSyAAmTLGFKBl8rS9lpy-EfC6XkOzuz4OpYE'
});

google.charts.setOnLoadCallback(drawMap);

// World Map
function drawMap() {
	var dataWorld = new google.visualization.DataTable();
	var dataUsa = new google.visualization.DataTable();

	dataWorld.addColumn('number', 'Lat'); // Latitude Value
	dataWorld.addColumn('number', 'Lon'); // Longitude Value
	dataWorld.addColumn('string', 'Name'); //
	dataWorld.addColumn('number', 'Total Cases'); //
	dataWorld.addRows(chartWorldData);
	var optionsWorld = {
		sizeAxis: { minValue: 100 },
		displayMode: 'markers',
		colorAxis: { colors: [ '#B4D0FF', '#26539B' ] }
	};

	// dataUsa.addColumn('string', 'Name'); //
	// dataUsa.addColumn('number', 'Total Cases'); //
	// dataUsa.addRows(chartUsaData);
	// var optionsUsa = {
	// 	region: 'US',
	// 	displayMode: 'markers',
	// 	colorAxis: { colors: [ '#A8C9FA', '#0061F1' ] }
	// };
	var dataUsa = google.visualization.arrayToDataTable(chartUsaData);
	var optionsUsa = {
		region: 'US', // Africa,
		displayMode: 'regions',
		resolution: 'provinces',
		colorAxis: { colors: [ '#B4D0FF', '#26539B' ] }
	};

	var chartWorld = new google.visualization.GeoChart(document.getElementById('covidWorldChart'));
	var chartUsa = new google.visualization.GeoChart(document.getElementById('covidUsaChart'));
	chartWorld.draw(dataWorld, optionsWorld);
	chartUsa.draw(dataUsa, optionsUsa);
}
