$('#selectRegion').on('change', function() {});
$(document).ready(function() {
	$('#dataTableCountry').DataTable({
		ajax: {
			url: 'https://covid19api.io/api/v1/CasesInAllUSStates',
			type: 'GET',
			cache: false,
			dataSrc: function(json) {
				console.log('json.data[0].table', json.data[0].table);
				return json.data[0].table;
			}
		},
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
});
