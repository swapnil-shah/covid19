const newsUri = 'https://api.smartable.ai/coronavirus/news/US';
const dasboardTableUri = 'https://corona-api.com/countries?include=timeline';
const totalCases = 'https://corona-api.com/timeline';
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
		minutes < 10 ? parseInt((minutes = '0' + minutes)) : minutes;

		return hours > 12
			? dayName + ' ' + month + ' ' + day + ' ' + (hours - 12) + ':' + minutes + ' PM'
			: dayName + ' ' + month + ' ' + day + ' ' + hours + ':' + minutes + ' AM';
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

//Dasboard cases
fillNumberOfCases = () => {
	fetch(totalCases, { cache: 'no-cache' })
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('BAD HTTP');
			}
		})
		.then((stats) => {
			let formattedDate = getDateFormatted(stats.data[0].updated_at.toString());
			console.log('fillNumberOfCases -> stats.data[0].updated_at', stats.data[0].updated_at);
			document.getElementById('number-active').innerText = stats.data[0].active.toLocaleString();
			document.getElementById('number-confirmed').innerText = stats.data[0].confirmed.toLocaleString();
			document.getElementById('number-recovered').innerText = stats.data[0].recovered.toLocaleString();
			document.getElementById('number-deaths').innerText = stats.data[0].deaths.toLocaleString();
			document.getElementById('last-updated').innerText = formattedDate;
			document.getElementById('per-active').innerHTML =
				' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
				percentageChangeTotal(stats.data[0].active, stats.data[1].active) +
				'%)';
			document.getElementById('per-confirmed').innerHTML =
				' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
				percentageChangeTable(stats.data[0].confirmed, stats.data[0].new_confirmed) +
				'%)';
			document.getElementById('per-recovered').innerHTML =
				' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
				percentageChangeTable(stats.data[0].recovered, stats.data[0].new_recovered) +
				'%)';
			document.getElementById('per-deaths').innerHTML =
				' (<i class="fas fa-arrow-up fa-sm" style="margin: 0 2px;"></i> ' +
				percentageChangeTable(stats.data[0].deaths, stats.data[0].new_deaths) +
				'%)';
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
                                        <td class="new-confirmed" data-percentage="${percentageChangeTable(
											item.timeline[0].confirmed,
											item.timeline[0].new_confirmed
										)}" >${item.timeline[0].new_confirmed.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[0].confirmed,
							item.timeline[0].new_confirmed
						)}%)</small></td>
                                        <td>${item.timeline[0].deaths.toLocaleString()}</td>
                                        <td class="new-death" data-percentage="${percentageChangeTable(
											item.timeline[0].deaths,
											item.timeline[0].new_deaths
										)}">${item.timeline[0].new_deaths.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[0].deaths,
							item.timeline[0].new_deaths
						)}%)</small></td>
                                        <td>${item.timeline[0].recovered.toLocaleString()}</td>
                                        <td class="new-recovered" data-percentage="${percentageChangeTable(
											item.timeline[0].recovered,
											item.timeline[0].new_recovered
										)}">${item.timeline[0].new_recovered.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
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
                                    <td class="new-confirmed" data-percentage="${percentageChangeTable(
										item.timeline[1].confirmed,
										item.timeline[1].new_confirmed
									)}" >${item.timeline[1].new_confirmed.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[1].confirmed,
							item.timeline[1].new_confirmed
						)}%)</small></td>
                                    <td>${item.timeline[1].deaths.toLocaleString()}</td>
                                    <td class="new-death" data-percentage="${percentageChangeTable(
										item.timeline[1].deaths,
										item.timeline[1].new_deaths
									)}">${item.timeline[1].new_deaths.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
							item.timeline[1].deaths,
							item.timeline[1].new_deaths
						)}%)</small></td>
                                    <td>${item.timeline[1].recovered.toLocaleString()}</td>
                                    <td class="new-recovered" data-percentage="${percentageChangeTable(
										item.timeline[1].recovered,
										item.timeline[1].new_recovered
									)}">${item.timeline[1].new_recovered.toLocaleString()} <small class="font-weight-light container-percentage">(<i class="fas fa-arrow-up fa-xs" style="margin: 0 2px;"></i>${percentageChangeTable(
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
		})
		.catch((err) => {
			console.log('ERROR:', err.message);
		});
};

function percentageChangeTable(cases, newCases) {
	return newCases !== 0 && cases !== 0 && cases !== newCases ? (newCases * 100 / (cases - newCases)).toFixed(2) : 0;
}

function percentageChangeTotal(total, newTotal) {
	return total !== 0 && newTotal !== 0 && total !== newTotal ? ((total - newTotal) / total * 100).toFixed(2) : 0;
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
	getDateFormatted();
	fillNumberOfCases();
	fillWorldTimelineTable();
	fillNewsCards();
});
