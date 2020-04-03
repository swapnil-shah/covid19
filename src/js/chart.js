const API_URL_SUMMARY = 'https://corona.lmao.ninja/countries';
const API_URL_USA = 'https://corona.lmao.ninja/jhucsse';
const API_URL_USA_STATES = 'https://corona.lmao.ninja/states';

let chartWorldData = [];
let chartUsaData = [];

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
fetch(API_URL_USA).then((response) => response.json()).then((states) => {
	states
		.filter((state) => state.country === 'US' && state.city && state.city.toLowerCase() !== 'unassigned')
		.forEach((state) => {
			console.log(
				parseFloat(state.coordinates.latitude),
				parseFloat(state.coordinates.longitude),
				state.city,
				parseInt(state.stats.confirmed)
			);
			chartUsaData.push([
				parseFloat(state.coordinates.latitude),
				parseFloat(state.coordinates.longitude),
				state.city,
				// state.cases,
				parseInt(state.stats.confirmed)
			]);
		});
});
google.charts.load('current', {
	packages: [ 'geochart' ],
	// Note: you will need to get a mapsApiKey for your project.
	// See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
	mapsApiKey: 'AIzaSyDudvnzx-aqiuCwCXMo0SOnXYANk7OrckA'
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
		colorAxis: { colors: [ '#A8C9FA', '#0061F1' ] }
	};

	dataUsa.addColumn('number', 'Lat'); // Latitude Value
	dataUsa.addColumn('number', 'Lon'); // Longitude Value
	dataUsa.addColumn('string', 'Name'); //
	dataUsa.addColumn('number', 'Total Cases'); //
	dataUsa.addRows(chartUsaData);
	var optionsUsa = {
		region: 'US',
		displayMode: 'markers',
		colorAxis: { colors: [ '#A8C9FA', '#0061F1' ] }
	};

	var chartWorld = new google.visualization.GeoChart(document.getElementById('covidWorldChart'));
	var chartUsa = new google.visualization.GeoChart(document.getElementById('covidUsaChart'));
	chartWorld.draw(dataWorld, optionsWorld);
	chartUsa.draw(dataUsa, optionsUsa);
}
