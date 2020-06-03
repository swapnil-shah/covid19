$(document).ready(function() {
	addTestingCards();
	$('#selectState').on('change', function() {
		const stateUrl = $(this).val();
		const stateName = $(this).find('option:selected').text();
		addTestingCards(stateUrl, stateName);
	});
});
function addTestingCards(stateUrl = 'new-york', stateName = 'New York') {
	$('#testing-locations').html(
		'<div class="text-center"><i class="icon-spinner spinner-animate" style="font-size:2rem"></i></div>'
	);
	axios
		.get(`https://covid-19-testing.github.io/locations/${stateUrl}/complete.json`)
		.then((response) => {
			console.log('addTestingCards -> response', response);
			$('#testing-locations').empty();
			$('#showingResults').html(
				`Testing Locations in <span class="text-dark border-bottom border-dark">${stateName}</span>`
			);
			response.data.forEach(function(testingLocation) {
				let output = '';
				output += `<div class="card mb-4 shadow-sm ml-1 mr-1">
                <div class="card-header bg-dark d-block"><h5 class="mb-0 text-white">${testingLocation.name}</h5></div>
                <div class="card-body">
                    <p class="card-text">${testingLocation.description}</p>
                    <div class="row">
                        <div class="col-md-5 col-sm-12">
                            <h5 class="text-dark-75 bg-light p-2 my-3">Contact Details</h5>
                            <div class="d-flex justify-content-start">
                                <div class="mr-1 mt-1"><i class="icon-location" style="font-size:1rem"></i></div>
                                <div class="ml-1">
                                ${testingLocation.physical_address.length
									? `<p class="text-gray-700 mb-0">${testingLocation.physical_address[0]
											.address_1},<br>${testingLocation.physical_address[0].city}, ${testingLocation
											.physical_address[0].city} ${testingLocation.physical_address[0]
											.postal_code}</p><p><a class="small" href="http://maps.google.com/?q=${testingLocation
											.physical_address[0].address_1} ${testingLocation.physical_address[0]
											.city} ${testingLocation.physical_address[0]
											.postal_code}" target="_blank">&nbsp;View on Google map</a></p>`
									: 'Address Unavailable'}
                                </div>
                            </div>
                            <div class="d-flex justify-content-start d-flex justify-content-start">
                                <div class="mr-1"><i class="icon-phone" style="font-size:1rem"></i></div>
                                <div class="ml-1">
                                ${testingLocation.phones.length
									? `<a href="tel:${testingLocation.phones[0].number}">${testingLocation.phones[0]
											.number}</a>`
									: 'Number Unavailable'}
                                    ${testingLocation.phones.length
										? `<p class="small text-muted">Language: ${testingLocation.phones[0]
												.language}</a>`
										: ''}
                                </div>
                            </div>
                        </div>
                        ${testingLocation.regular_schedule.length
							? `<div class="col-md-7 col-sm-12">
                            <h5 class="text-dark-75 bg-light p-2 my-3">Schedule</h5>
                            <div class="row row-cols-2 pl-2">
                                ${testingLocation.regular_schedule
									.map(function(schedule) {
										let scheduleOutput = '';
										scheduleOutput += `<div class="col col-md-4 mb-3">
                                        <p class="text-gray-700 mb-0">${days(schedule.weekday)}</p>
                                        <p class="mb-0 pl-1">${schedule.opens_at}</p>
                                        <p class="mb-0 pl-1 border-bottom">${schedule.closes_at}</p>
                                    </div>`;
										return scheduleOutput;
									})
									.join('')}
                            </div>
                        </div>`
							: ''}
                    </div>
                </div>
                <div class="card-footer small text-muted text-right">Last updated ${timeDifference(
					testingLocation.updated
				)}</div>
            </div>`;
				$('#testing-locations').append(output);
				output = '';
			});
		})
		.catch((error) => {
			$('#testing-locations').empty();
			if (error.response.status == 404) {
				$('#showingResults').html(
					`Sorry, currently no data is available for <span class="text-dark border-bottom border-dark">${stateName}.</span>`
				);
			} else {
				$('#showingResults').html(`Failed to fetch the data.<br>Error Message: ${error.message}`);
			}
			if (error.response) {
				console.log(
					'The request was made and the server responded with a status code that falls out of the range of 2xx'
				);

				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				console.log(
					'The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js'
				);
				console.log(error.request);
			} else {
				console.log('Something happened in setting up the request that triggered an Error');
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
}

function days(dayOfTheWeek) {
	var weekday = new Array(7);
	weekday[1] = 'Monday';
	weekday[2] = 'Tuesday';
	weekday[3] = 'Wednesday';
	weekday[4] = 'Thursday';
	weekday[5] = 'Friday';
	weekday[6] = 'Saturday';
	weekday[7] = 'Sunday';

	var n = weekday[dayOfTheWeek];
	return n;
}
