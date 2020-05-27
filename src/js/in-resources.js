$(document).ready(function() {
	getResourcesDataSet().then((data) => {
		resourcesDataSet(data);
	});
});

function getResourcesDataSet() {
	return axios
		.get('https://api.covid19india.org/resources/resources.json')
		.then((response) => {
			console.log('getResourcesDataSet -> response', response.data.resources);
			var flags = [],
				output = [],
				l = response.data.resources.length,
				i;
			for (i = 0; i < l; i++) {
				if (flags[response.data.resources[i].category]) continue;
				flags[response.data.resources[i].category] = true;
				output.push(response.data.resources[i].category);
			}
			console.log(output);
			return response.data;
		})
		.catch((error) => {
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);
				console.log('Error Data: ', error.response.data);
				console.log('Error Status: ', error.response.status);
				console.log('Error Headers: ', error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received. `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log('Error Request: ', error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error Message: ', error.message);
			}
			console.log('Error config: ', error.config);
		});
}

function resourcesDataSet(data) {
	let emergencies = data.resources.filter(function(emergency) {
		return (
			emergency.category === 'Ambulance' ||
			emergency.category === 'Fire Brigade' ||
			emergency.category === 'Government Helpline' ||
			emergency.category === 'Helpline for Cyclone Amphan' ||
			emergency.category === 'Hospitals and Centers' ||
			emergency.category === 'Police'
		);
	});
	let related = data.resources.filter(function(item) {
		return item.category === 'CoVID-19 Testing Lab' || item.category === 'Quarantine Facility';
	});
	let supports = data.resources.filter(function(supoort) {
		return (
			supoort.category === 'Accommodation and Shelter Homes' ||
			supoort.category === 'Community Kitchen' ||
			supoort.category === 'Delivery [Vegetables, Fruits, Groceries, Medicines, etc.]' ||
			supoort.category === 'Free Food' ||
			supoort.category === 'Fundraisers' ||
			supoort.category === 'Mental well being and Emotional Support' ||
			supoort.category === 'Senior Citizen Support' ||
			supoort.category === 'Transportation' ||
			supoort.category === 'Other'
		);
	});

	$('#dataTableEmergency')
		.on('init.dt', function() {
			$('#loaderEmergency').hide();
		})
		.DataTable({
			data: emergencies,
			pagingType: 'numbers',
			pageLength: 10,
			processing: true,
			language: {
				searchPlaceholder: 'e.g. helpline',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					title: 'Category',
					data: 'category',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}`;
					},
					width: '30%'
				},
				{
					title: 'City',
					data: 'city',
					render: function(data, type, row) {
						return data
							? `${data}<div class="text-muted mb-0">${row.state}</div>`
							: `<div class="text-muted mb-0">${row.state}</div>`;
					},
					width: '10%'
				},
				{
					title: 'Service Provided',
					data: 'descriptionandorserviceprovided',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}`;
					},
					width: '40%'
				},
				{
					title: 'Contact',
					data: 'contact',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return row.phonenumber
							? `<div class="pt-1"><span class="icon-sphere mr-2"></span><a href="${data}" target="_blank">Website</a></div><div class="pt-1"><span class="icon-phone mr-2"></span>${row.phonenumber
									.split(',')
									.shift()}`
							: `<div class="pt-1"><span class="icon-sphere mr-2"></span><a href="${data}" target="_blank">Website</div></div>`;
					},
					width: '20%'
				}
			],
			order: [ [ 0, 'asc' ] ]
		});
	$('#dataTableRelated')
		.on('init.dt', function() {
			$('#loaderRelated').hide();
		})
		.DataTable({
			data: related,
			pagingType: 'numbers',
			pageLength: 10,
			language: {
				searchPlaceholder: 'e.g. testing',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					title: 'Category',
					data: 'category',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}`;
					},
					width: '30%'
				},
				{
					title: 'City',
					data: 'city',
					render: function(data, type, row) {
						return data
							? `${data}<div class="text-muted mb-0">${row.state}</div>`
							: `<div class="text-muted mb-0">${row.state}</div>`;
					},
					width: '10%'
				},
				{
					title: 'Service Provided',
					data: 'descriptionandorserviceprovided',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}`;
					},
					width: '40%'
				},
				{
					title: 'Contact',
					data: 'contact',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return row.phonenumber
							? `<div class="pt-1"><span class="icon-sphere mr-2"></span><a href="${data}" target="_blank">Website</a></div><div class="pt-1"><span class="icon-phone mr-2"></span>${row.phonenumber
									.split(',')
									.shift()}`
							: `<div class="pt-1"><span class="icon-sphere mr-2"></span><a href="${data}" target="_blank">Website</div></div>`;
					},
					width: '20%'
				}
			],
			order: [ [ 0, 'asc' ] ]
		});
	$('#dataTableSupport')
		.on('init.dt', function() {
			$('#loaderSupport').hide();
		})
		.DataTable({
			data: supports,
			pagingType: 'numbers',
			pageLength: 10,
			language: {
				searchPlaceholder: 'e.g. food or senior citizen',
				loadingRecords: '<i class="icon-spinner spinner-animate"></i>'
			},
			columns: [
				{
					title: 'Category',
					data: 'category',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}`;
					},
					width: '30%'
				},
				{
					title: 'City',
					data: 'city',
					render: function(data, type, row) {
						return data
							? `${data}<div class="text-muted mb-0">${row.state}</div>`
							: `<div class="text-muted mb-0">${row.state}</div>`;
					},
					width: '10%'
				},
				{
					title: 'Service Provided',
					data: 'descriptionandorserviceprovided',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return `${data}`;
					},
					width: '40%'
				},
				{
					title: 'Contact',
					data: 'contact',
					render: function(data, type, row) {
						if (type === 'type' || type === 'sort') {
							return data;
						}
						return row.phonenumber
							? `<div class="pt-1"><span class="icon-sphere mr-2"></span><a href="${data}" target="_blank">Website</a></div><div class="pt-1"><span class="icon-phone mr-2"></span>${row.phonenumber
									.split(',')
									.shift()}`
							: `<div class="pt-1"><span class="icon-sphere mr-2"></span><a href="${data}" target="_blank">Website</div></div>`;
					},
					width: '20%'
				}
			],
			order: [ [ 0, 'asc' ] ]
		});
}

$(window).on('load', function() {
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
