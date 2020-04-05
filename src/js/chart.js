const API_URL_WORLD_SUMMARY = 'https://corona.lmao.ninja/all';
const API_URL_COUNTRIES = 'https://corona.lmao.ninja/countries?sort=cases';
const API_URL_USA_SUMMARY = 'https://covidtracking.com/api/us';
const API_URL_USA_STATES = 'https://covidtracking.com/api/states';

let chartWorldData = [];
let chartUsaData = [ [ 'States', 'stats' ] ];
let loader = `<div class="d-flex justify-content-center">
					<div class="spinner-border text-body" role="status">
					<span class="sr-only">Loading...</span>
					</div>
				</div>`;
document.getElementById('worldStatistics').innerHTML = loader;
document.getElementById('usaStatistics').innerHTML = loader;

// Fetch World Data

fetch(API_URL_WORLD_SUMMARY).then((response) => response.json()).then((countries) => {
	let output = '';
	output += `<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Total Cases</div>
					<div class="text-primary font-weight-bold lead">${countries.cases.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Today's Cases</div>
					<div class="text-primary font-weight-bold lead">${countries.todayCases.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Total Deaths</div>
					<div class="text-primary font-weight-bold lead">${countries.deaths.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Today's Deaths</div>
					<div class="text-primary font-weight-bold lead">${countries.cases.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Recovered</div>
					<div class="text-primary font-weight-bold lead">${countries.recovered.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Active</div>
					<div class="text-primary font-weight-bold lead">${countries.active.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Critical</div>
					<div class="text-primary font-weight-bold lead">${countries.critical.toLocaleString()}</div>
				</div>
			
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Affected Countries</div>
					<div class="text-primary font-weight-bold lead">${countries.affectedCountries.toLocaleString()}</div>
				</div>`;
	document.getElementById('worldStatistics').innerHTML = output;
});
fetch(API_URL_USA_SUMMARY).then((response) => response.json()).then((states) => {
	let output = '';
	output += `<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Total Cases</div>
					<div class="text-primary font-weight-bold lead">${states[0].positive.toLocaleString()}</div>
				</div>
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Negative Cases</div>
					<div class="text-primary font-weight-bold lead">${states[0].negative.toLocaleString()}</div>
				</div>
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Deaths</div>
					<div class="text-primary font-weight-bold lead">${states[0].death.toLocaleString()}</div>
				</div>
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Recovered</div>
					<div class="text-primary font-weight-bold lead">${states[0].recovered.toLocaleString()}</div>
				</div>
				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
					<div class="font-weight-bold pr-3">Active</div>
					<div class="text-primary font-weight-bold lead">${states[0].hospitalized.toLocaleString()}</div>
				</div>`;
	document.getElementById('usaStatistics').innerHTML = output;
});

// Fetch World Data
fetch(API_URL_COUNTRIES).then((response) => response.json()).then((countries) => {
	countries
		.slice(0, 5)
		.map((item) => {
			return item;
		})
		.forEach(function(country) {});
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
fetch(API_URL_USA_STATES)
	.then((response) => response.json())
	.then((states) => {
		states.forEach((state) => {
			chartUsaData.push([ state.state, state.positive ]);
		});
	})
	.catch((error) => console.log('error', error));

google.charts.load('current', {
	packages: [ 'geochart' ]
});

// google.charts.load('current', {
// 	packages: [ 'geochart' ]
// });

// google.charts.setOnLoadCallback(drawMap);
// // World Map
// function drawMap() {
// 	var dataWorld = new google.visualization.DataTable();
// 	var dataUsa = new google.visualization.DataTable();
// 	dataWorld.addColumn('number', 'Lat'); // Latitude Value
// 	dataWorld.addColumn('number', 'Lon'); // Longitude Value
// 	dataWorld.addColumn('string', 'Name'); //
// 	dataWorld.addColumn('number', 'Total Cases'); //
// 	dataWorld.addRows(chartWorldData);
// 	var optionsWorld = {
// 		sizeAxis: { minValue: 100 },
// 		displayMode: 'markers',
// 		colorAxis: { colors: [ '#B4D0FF', '#26539B' ] },
// 		chartArea: { width: '100%', height: '100%' },
// 		legend: { position: 'bottom' },
// 		animation: {
// 			duration: 1000,
// 			easing: 'out'
// 		}
// 	};
// 	var dataUsa = google.visualization.arrayToDataTable(chartUsaData);
// 	var optionsUsa = {
// 		region: 'US',
// 		displayMode: 'regions',
// 		resolution: 'provinces',
// 		chartArea: { width: '100%', height: '100%' },
// 		colorAxis: { colors: [ '#B4D0FF', '#26539B' ] },
// 		animation: {
// 			duration: 1000,
// 			easing: 'out'
// 		}
// 	};

// 	var chartWorld = new google.visualization.GeoChart(document.getElementById('covidWorldChart'));
// 	var chartUsa = new google.visualization.GeoChart(document.getElementById('covidUsaChart'));
// 	chartWorld.draw(dataWorld, optionsWorld);
// 	chartUsa.draw(dataUsa, optionsUsa);
// }
