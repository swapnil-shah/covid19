const newsUri = 'https://api.smartable.ai/coronavirus/news/US';
const dasboardTableUri = 'https://corona-api.com/countries?include=timeline';
let header = new Headers();
header.append('Accept', 'application/json');

let newsReq = new Request(newsUri, {
	method: 'GET',
	headers: header,
	mode: 'cors'
});

var getDateFormatted = (function() {
	return function(str) {
		var daysNames = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
			monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ],
			d = new Date(str),
			day = d.getDate(),
			month = monthNames[d.getMonth()],
			year = d.getFullYear().toString().substr(2, 2),
			hours = d.getHours(),
			minutes = d.getMinutes(),
			dayName = daysNames[d.getDay()];
		// minutes < 10 ? parseInt((minutes = '0' + minutes)) : minutes;

		return hours > 12
			? // ? dayName + ' ' + month + ' ' + day + ' ' + (hours - 12) + ':' + minutes + ' PM'
				// : dayName + ' ' + month + ' ' + day + ' ' + hours + ':' + minutes + ' AM';
				dayName + ' ' + month + ' ' + day
			: dayName + ' ' + month + ' ' + day;
	};
})();

//Dasboad Table
fillNewsCards = () => {
	fetch(newsReq, {
		headers: {
			'Cache-Control': 'no-cache',
			'Subscription-Key': config.API_KET_SMARTTABLE
		}
	})
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((jsonData) => {
			getNewsResults(jsonData);
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};

//World Timeline Table
fillWorldTimelineTable = () => {
	fetch(dasboardTableUri, { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((jsonData) => {
			let output = '';
			let $dasboardTableRows = $('#dataTableWorldTimeline');
			jsonData.data.forEach(function(item) {
				if (item.timeline.length > 0) {
					if (typeof item.timeline[0].is_in_progress === 'undefined') {
						output += `
                                    <tr>
                                        <td>${item.name}<br/><small class="text-muted">${item.population.toLocaleString()}</small></td>
                                        <td>${item.timeline[0].confirmed.toLocaleString()}</td>
                                        <td class="new-confirmed" data-percentage="${getPercentageChange(
											item.timeline[0].confirmed,
											item.timeline[0].new_confirmed
										)}" >${item.timeline[0].new_confirmed.toLocaleString()} <small class="font-weight-light">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i><small>${getPercentageChange(
							item.timeline[0].confirmed,
							item.timeline[0].new_confirmed
						)}%)</small></td>
                                        <td>${item.timeline[0].deaths.toLocaleString()}</td>
                                        <td class="new-death" data-percentage="${getPercentageChange(
											item.timeline[0].deaths,
											item.timeline[0].new_deaths
										)}">${item.timeline[0].new_deaths.toLocaleString()} <small class="font-weight-light">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i><small>${getPercentageChange(
							item.timeline[0].deaths,
							item.timeline[0].new_deaths
						)}%)</small></td>
                                        <td>${item.timeline[0].recovered.toLocaleString()}</td>
                                        <td class="new-recovered" data-percentage="${getPercentageChange(
											item.timeline[0].recovered,
											item.timeline[0].new_recovered
										)}">${item.timeline[0].new_recovered.toLocaleString()} <small class="font-weight-light">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i><small>${getPercentageChange(
							item.timeline[0].recovered,
							item.timeline[0].new_recovered
						)}%)</small></td>
                                    </tr>
                                `;
					} else {
						output += `
                                <tr>
                                    <td>${item.name}<br/><small class="text-muted">${item.population.toLocaleString()}</small></td>
                                    <td>${item.timeline[1].confirmed.toLocaleString()}</td>
                                    <td class="new-confirmed" data-percentage="${getPercentageChange(
										item.timeline[1].confirmed,
										item.timeline[1].new_confirmed
									)}" >${item.timeline[1].new_confirmed.toLocaleString()} <small class="font-weight-light">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i><small>${getPercentageChange(
							item.timeline[1].confirmed,
							item.timeline[1].new_confirmed
						)}%)</small></td>
                                    <td>${item.timeline[1].deaths.toLocaleString()}</td>
                                    <td class="new-death" data-percentage="${getPercentageChange(
										item.timeline[1].deaths,
										item.timeline[1].new_deaths
									)}">${item.timeline[1].new_deaths.toLocaleString()} <small class="font-weight-light">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i><small>${getPercentageChange(
							item.timeline[1].deaths,
							item.timeline[1].new_deaths
						)}%)</small></td>
                                    <td>${item.timeline[1].recovered.toLocaleString()}</td>
                                    <td class="new-recovered" data-percentage="${getPercentageChange(
										item.timeline[1].recovered,
										item.timeline[1].new_recovered
									)}">${item.timeline[1].new_recovered.toLocaleString()} <small class="font-weight-light">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i><small>${getPercentageChange(
							item.timeline[1].recovered,
							item.timeline[1].new_recovered
						)}%)</small></td>
                                </tr>
                            `;
					}
				} else {
					output += `
                        <tr>
                            <td>${item.name}<br/><small class="text-muted">${item.population
						? item.population.toLocaleString()
						: ''}</small></td>
                            <td>${item.latest_data.confirmed ? item.latest_data.confirmed.toLocaleString() : ''}</td>
                            <td>${item.today.confirmed ? item.latest_data.confirmed.toLocaleString() : ''}</td>
                            <td>${item.latest_data.deaths ? item.latest_data.deaths.toLocaleString() : ''}</td>
                            <td>${item.today.deaths ? item.today.deaths.toLocaleString() : ''}</td>
                            <td>${item.latest_data.recovered ? item.latest_data.recovered.toLocaleString() : ''}</td>
                            <td>${item.latest_data.recovered ? item.latest_data.recovered.toLocaleString() : ''}</td>
                        </tr>`;
				}
			});
			$dasboardTableRows.children('tbody').html(output);
			$dasboardTableRows.DataTable({
				pageLength: 50,
				language: {
					searchPlaceholder: 'e.g. usa'
				},
				order: [ [ 1, 'desc' ] ],
				columnDefs: [
					{ orderable: false, targets: [ 2 ] },
					{ orderable: false, targets: [ 4 ] },
					{ orderable: false, targets: [ 6 ] }
				]
			});
			addCellColor();
		});
};
function getPercentageChange(cases, newCases) {
	return newCases !== 0 && cases !== 0 && cases !== newCases ? (newCases * 100 / (cases - newCases)).toFixed(2) : 0;
}

function addCellColor() {
	var newConfirmed = document.querySelectorAll('.new-confirmed');
	var newDeaths = document.querySelectorAll('.new-death');
	var newRecovered = document.querySelectorAll('.new-recovered');
	addClassesToTable(newConfirmed, 'yellow');
	addClassesToTable(newDeaths, 'red');
	addClassesToTable(newRecovered, 'green');
}

function addClassesToTable(newCases, color) {
	for (var i = 0; i < newCases.length; i++) {
		let percentageValue = parseFloat(newCases[i].getAttribute('data-percentage'));
		if (percentageValue >= 2 && percentageValue < 5) {
			newCases[i].classList.add('bg-' + color + '-200');
		}
		if (percentageValue >= 5 && percentageValue < 8) {
			newCases[i].classList.add('bg-' + color + '-500');
		}
		if (percentageValue >= 8) {
			newCases[i].classList.add('bg-' + color + '-900');
		}
	}
}

function getNewsResults(data) {
	let output = '';
	let newsCards = document.getElementById('cards-news');
	data.news.forEach(function(item) {
		output += `
        <div class="col-sm-12 mb-3">
            <div class="card card-collapsable border-top-0 border-bottom-0 border-right-0 border-left-lg border-blue h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="font-weight-bold text-blue mb-1">${item.title}</div>
                            <div class="h5">${item.excerpt}</div>
                        </div>
                        <div class="ml-2">${getDateFormatted(
							item.publishedDateTime
						)}<i class="fas fa-dollar-sign fa-2x text-gray-200"></i></div>
                    </div>
                </div>
            </div>
        </div>`;
	});
	if (newsCards) newsCards.innerHTML = newsCards.innerHTML + output;
}

$(document).ready(function() {
	fillWorldTimelineTable();
	fillNewsCards();
});
