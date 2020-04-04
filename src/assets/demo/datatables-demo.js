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
console.log(dateConvert('2020-04-03T20:00:00Z'));

$(document).ready(function() {
	$('#dataTableWorld').DataTable({
		ajax: {
			url: 'https://corona.lmao.ninja/countries',
			type: 'GET',
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
