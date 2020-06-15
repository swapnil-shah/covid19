const API_URL_WORLD_SUMMARY = 'https://corona.lmao.ninja/all';
const API_URL_COUNTRIES = 'https://corona.lmao.ninja/countries?sort=cases';
const API_URL_USA_SUMMARY = 'https://covidtracking.com/api/us';
const API_URL_USA_STATES = 'https://covidtracking.com/api/states';

let chartWorldData = [];
let chartUsaData = [ [ 'States', 'stats' ] ];
let loader = `<div class="d-flex justify-content-center">
					<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
					<span class="sr-only">Loading...</span>
					</div>
				</div>`;
document.getElementById('worldStatistics').innerHTML = loader;
document.getElementById('usaStatistics').innerHTML = loader;

// Fetch World Data

// fetch(API_URL_WORLD_SUMMARY).then((response) => response.json()).then((countries) => {
// 	let output = '';
// 	output += `<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Total Cases</div>
// 					<div class="text-primary font-weight-bold lead">${countries.cases.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Today's Cases</div>
// 					<div class="text-primary font-weight-bold lead">${countries.todayCases.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Total Deaths</div>
// 					<div class="text-primary font-weight-bold lead">${countries.deaths.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Today's Deaths</div>
// 					<div class="text-primary font-weight-bold lead">${countries.cases.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Recovered</div>
// 					<div class="text-primary font-weight-bold lead">${countries.recovered.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Active</div>
// 					<div class="text-primary font-weight-bold lead">${countries.active.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Critical</div>
// 					<div class="text-primary font-weight-bold lead">${countries.critical.toLocaleString()}</div>
// 				</div>

// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Affected Countries</div>
// 					<div class="text-primary font-weight-bold lead">${countries.affectedCountries.toLocaleString()}</div>
// 				</div>`;
// 	document.getElementById('worldStatistics').innerHTML = output;
// });
// fetch(API_URL_USA_SUMMARY).then((response) => response.json()).then((states) => {
// 	let output = '';
// 	output += `<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Total Cases</div>
// 					<div class="text-primary font-weight-bold lead">${states[0].positive.toLocaleString()}</div>
// 				</div>
// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Negative Cases</div>
// 					<div class="text-primary font-weight-bold lead">${states[0].negative.toLocaleString()}</div>
// 				</div>
// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Deaths</div>
// 					<div class="text-primary font-weight-bold lead">${states[0].death.toLocaleString()}</div>
// 				</div>
// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Recovered</div>
// 					<div class="text-primary font-weight-bold lead">${states[0].recovered.toLocaleString()}</div>
// 				</div>
// 				<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
// 					<div class="font-weight-bold pr-3">Active</div>
// 					<div class="text-primary font-weight-bold lead">${states[0].hospitalized.toLocaleString()}</div>
// 				</div>`;
// 	document.getElementById('usaStatistics').innerHTML = output;
// });

// Fetch World Data
// fetch(API_URL_COUNTRIES).then((response) => response.json()).then((countries) => {
// 	countries.slice(0, 5).map((item) => {
// 		return item;
// 	});
// 	countries.forEach((country) => {
// 		chartWorldData.push([
// 			country.countryInfo.lat,
// 			country.countryInfo.long,
// 			country.country,
// 			// country.cases,
// 			country.cases
// 		]);
// 	});
// });
// Fetch USA Data
fetch(API_URL_USA_STATES)
	.then((response) => response.json())
	.then((states) => {
		console.log('states', states);

		states.forEach((state) => {
			chartUsaData.push([ state.state, state.positive ]);
		});
	})
	.catch((error) => console.log('error', error));

google.charts.load('current', {
	packages: [ 'geochart' ]
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
		backgroundColor: '#D1DDDD',
		defaultColor: '#f5f5f5',
		sizeAxis: { minValue: 100 },
		displayMode: 'markers',
		colorAxis: { colors: [ '#EFD177', '#BF3D58' ] },
		chartArea: { width: '100%', height: '100%' },
		legend: { position: 'bottom' },
		animation: {
			duration: 1000,
			easing: 'out'
		}
	};
	var dataUsa = google.visualization.arrayToDataTable(chartUsaData);
	var optionsUsa = {
		region: 'US',
		displayMode: 'regions',
		resolution: 'provinces',
		chartArea: { width: '100%', height: '100%' },
		colorAxis: { colors: [ '#FAF2AE', '#B44620' ] },
		animation: {
			duration: 1000,
			easing: 'out'
		}
	};

	var chartWorld = new google.visualization.GeoChart(document.getElementById('covidWorldMap'));
	var chartUsa = new google.visualization.GeoChart(document.getElementById('covidUsaChart'));
	chartWorld.draw(dataWorld, optionsWorld);
	chartUsa.draw(dataUsa, optionsUsa);
}
const dateConvert = (date) => {
	let dateToConvert = new Date(date);
	year = dateToConvert.getFullYear();
	month = dateToConvert.getMonth() + 1;
	dt = dateToConvert.getDate();

	if (dt < 10) {
		dt = '0' + dt;
	}
	if (month < 10) {
		month = '0' + month;
	}
	return month + '/' + dt + '/' + year;
};

$(document).ready(function() {
	$('#dataTableWorld').DataTable({
		ajax: {
			url: 'https://corona.lmao.ninja/countries?sort=cases',
			type: 'GET',
			cache: false,
			dataSrc: ''
		},
		columns: [
			{ data: 'country', title: 'country' },
			{ data: 'cases', title: 'cases', render: $.fn.dataTable.render.number(',') },
			{ data: 'deaths', title: 'deaths', render: $.fn.dataTable.render.number(',') },
			{ data: 'recovered', title: 'recovered', render: $.fn.dataTable.render.number(',') },
			{ data: 'active', title: 'active', render: $.fn.dataTable.render.number(',') }
		],
		order: []
	});
	$('#dataTableUsa').DataTable({
		ajax: {
			url: 'https://covidtracking.com/api/states',
			processing: true,
			cache: false,
			type: 'POST',
			dataSrc: ''
		},
		columns: [
			{ data: 'state', title: 'State' },
			{ data: 'positive', title: 'Positive', render: $.fn.dataTable.render.number(',') }, //render: $.fn.dataTable.render.number(',') converting to comma separated number
			{ data: 'death', title: 'Death', render: $.fn.dataTable.render.number(',') },
			{ data: 'recovered', title: 'Recovered', render: $.fn.dataTable.render.number(',') }, //defaultContent: '0' default value 0 when null
			{ data: 'lastUpdateEt', title: 'Last Updated' }
		],
		order: [ [ 1, 'desc' ] ] //order by column number
	});
});

[
	{
		title: 'About this Project',
		id: 'Us',
		content: [
			{
				question: 'Are you official?',
				answer: '<p>No</p>'
			},
			{
				question: 'What are your sources? How is the data gathered for this project?',
				answer:
					'<p>We use a variety of sources to gather the data. Each section on this website has a "Data Source" link at the the right bottom. Few of them is listed below.</p><ul><li><a href="https://corona.lmao.ninja/" target="_blank">Novel COVID API</a></li><li><a href="https://github.com/mathdroid/covid-19target="_blank">covid-19-api by Mathdroid</a></li><li><a href="https://api.covid19india.org/" target="_blank">COVID19-Indiaa></li><li><a href="https://covid19-docs.chrismichael.now.sh/" target="_blank">coby ChrisMichaelPerezSantiago</a></li><li><a href="https://smartable.ai/" target="_blank">Smartable AI</a></li><li><a href="https://about-corona.net/" target="_blank">about-corona</a></li><li><a href="https://covidtracking.com/api" target="_blank">COVID TraProject</a></li><li><a href="https://github.com/amodm/api-covid1target="_blank">api-covid19-in</a></li><li><a href="https://github.com/postmanlabs/covid-19-apis/tree/develocomponents/TestingSites" target="_blank">postmanlabs covid-19-apis</a></li></ul>'
			},
			{
				question: 'What is the purpose of your project?',
				answer:
					'<p>Like most of you out there, when it all started I was afraid of the Coronavirus while trying to adjust to the big shift in my mostly outdoorsy lifestyle. Being locked up inside, following the numbers day in and out and being glued to the news didnt help much. Although information was plentiful, not all of it was available in one place which is what sparked me to build this website.</p>'
			},
			{
				question: 'How can I buy you coffee?',
				answer:
					'<p>Ummm, well for starters, I am loyal to tea. As much as I appreciate your thoughtfulness, it would really make my day if you could use the same money to help someone in need during these unprecedented times. Any kind of help/deed, big or small could go a long way.</p>'
			},
			{
				question: 'How can I contact you?',
				answer:
					'<p>My Contact Number is: 1**-***-***0. In case you couldn\'t crack that, here is my email:&nbsp;<a href="mailto:c19.information@gmail.com">c19.information@gmail.com</a></p>'
			}
		],
		name: 'Person1',
		position: 'Software Eng'
	}
];

[
	{
		title: 'About this Project',
		id: 'faqUs',
		content: [
			{ question: 'Are you official?', answer: '<p>No</p>' },
			{
				question: 'What are your sources? How is the data gathered for this project?',
				answer:
					'<p>We use a variety of sources to gather the data. Each section on this website has a "Data Source" link at the the right bottom. Few of them is listed below.</p><ul><li><a href="https://corona.lmao.ninja/" target="_blank">Novel COVID API</a></li><li><a href="https://github.com/mathdroid/covid-19" target="_blank">covid-19-api by Mathdroid</a></li><li><a href="https://api.covid19india.org/" target="_blank">COVID19-India</a></li><li><a href="https://covid19-docs.chrismichael.now.sh/" target="_blank">coby ChrisMichaelPerezSantiago</a></li><li><a href="https://smartable.ai/" target="_blank">Smartable AI</a></li><li><a href="https://about-corona.net/" target="_blank">about-corona</a></li><li><a href="https://covidtracking.com/api" target="_blank">COVID TraProject</a></li><li><a href="https://github.com/amodm/api-covid1" target="_blank">api-covid19-in</a></li><li><a href="https://github.com/postmanlabs/covid-19-apis/tree/develocomponents/TestingSites" target="_blank">postmanlabs covid-19-apis</a></li></ul>'
			},
			{
				question: 'What is the purpose of your project?',
				answer:
					'<p>Like most of you out there, when it all started I was afraid of the Coronavirus while trying to adjust to the big shift in my mostly outdoorsy lifestyle. Being locked up inside, following the numbers day in and out and being glued to the news didnt help much. Although information was plentiful, not all of it was available in one place which is what sparked me to build this website.</p>'
			},
			{
				question: 'How can I buy you coffee?',
				answer:
					'<p>Ummm, well for starters, I am loyal to tea. As much as I appreciate your thoughtfulness, it would really make my day if you could use the same money to help someone in need during these unprecedented times. Any kind of help/deed, big or small could go a long way.</p>'
			},
			{
				question: 'How can I contact you?',
				answer:
					'<p>My Contact Number is: 1**-***-***0. In case you couldn\'t crack that, here is my email:&nbsp;<a href="mailto:c19.information@gmail.com">c19.information@gmail.com</a></p>'
			}
		]
	}
];

$(document).ready(function() {
	$(
		'#accordion-covid, #accordion-us',
		'#accordion-know-more',
		'#accordion-be-safe'
	).on('hide.bs.collapse show.bs.collapse', (e) => {
		$(e.target).prev().find('i:last-child').toggleClass('icon-circle-up');
	});
});
$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
