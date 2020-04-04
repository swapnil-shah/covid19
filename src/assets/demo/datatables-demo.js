// Fetch World Data
// fetch('https://corona.lmao.ninja/countries').then((response) => response.json()).then((countries) => {
// 	countries.forEach((country) => {
// 		dataTableWorld.push([ country.country, country.cases, country.deaths, country.recovered, country.active ]);
// 	});
// });

$(document).ready(function() {
	$('#dataTableWorld').DataTable({
		ajax: {
			url: 'https://corona.lmao.ninja/countries',
			type: 'GET',
			dataSrc: function(json) {
				console.log(json);
				return json;
			}
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
	// $('#dataTableActivity').DataTable({
	// 	order: [ [ 0, 'desc' ] ]
	// });
});
