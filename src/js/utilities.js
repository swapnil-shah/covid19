//Reformat a date from YYYY-MM-DD to MM/DD/YYYY
function formatDate(date) {
	const dateObj = new Date(date + 'T00:00:00');
	return new Intl.DateTimeFormat('en-US').format(dateObj);
}

function formatYYYYMMDD(date) {
	let year = date.toString().substring(0, 4);
	let month = date.toString().substring(4, 6);
	let day = date.toString().substring(6, 8);
	return `${month}/${day}/${year}`;
}
let formatDateToString = (function() {
	return function(str) {
		let daysNames = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
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

function timeDifference(date) {
	let currenDate = new Date();
	let msPerMinute = 60 * 1000;
	let msPerHour = msPerMinute * 60;
	let msPerDay = msPerHour * 24;
	let msPerMonth = msPerDay * 30;
	let msPerYear = msPerDay * 365;
	let previousDate = new Date(date);

	let elapsed = currenDate - previousDate;

	if (elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + ' seconds ago';
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + ' minutes ago';
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) === 1
			? Math.round(elapsed / msPerHour) + ' hour ago'
			: Math.round(elapsed / msPerHour) + ' hours ago';
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) === 1
			? 'approximately ' + Math.round(elapsed / msPerDay) + ' day ago'
			: 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) === 1
			? 'approximately ' + Math.round(elapsed / msPerMonth) + ' month ago'
			: 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
	} else {
		return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
	}
}

function percentageChangeTable(cases, newCases) {
	return newCases !== 0 && cases !== 0 && cases !== newCases ? (newCases * 100 / (cases - newCases)).toFixed(2) : 0;
}

function percentageChangeTotal(newCases, oldCases) {
	return newCases !== 0 && oldCases !== 0 && newCases !== oldCases
		? ((newCases - oldCases) / newCases * 100).toFixed(2)
		: 0;
}

function populationFormat(labelValue) {
	// Nine Zeroes for Billions
	return Math.abs(Number(labelValue)) >= 1.0e9
		? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
		: // Six Zeroes for Millions
			Math.abs(Number(labelValue)) >= 1.0e6
			? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
			: // Three Zeroes for Thousands
				Math.abs(Number(labelValue)) >= 1.0e3
				? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
				: Math.abs(Number(labelValue));
}
function acronymToFullName(acronym) {
	state = {
		AZ: 'Arizona',
		AL: 'Alabama',
		AK: 'Alaska',
		AR: 'Arkansas',
		CA: 'California',
		CO: 'Colorado',
		CT: 'Connecticut',
		DC: 'District of Columbia',
		DE: 'Delaware',
		FL: 'Florida',
		GA: 'Georgia',
		HI: 'Hawaii',
		ID: 'Idaho',
		IL: 'Illinois',
		IN: 'Indiana',
		IA: 'Iowa',
		KS: 'Kansas',
		KY: 'Kentucky',
		LA: 'Louisiana',
		ME: 'Maine',
		MD: 'Maryland',
		MA: 'Massachusetts',
		MI: 'Michigan',
		MN: 'Minnesota',
		MS: 'Mississippi',
		MO: 'Missouri',
		MT: 'Montana',
		NE: 'Nebraska',
		NV: 'Nevada',
		NH: 'New Hampshire',
		NJ: 'New Jersey',
		NM: 'New Mexico',
		NY: 'New York',
		NC: 'North Carolina',
		ND: 'North Dakota',
		OH: 'Ohio',
		OK: 'Oklahoma',
		OR: 'Oregon',
		PA: 'Pennsylvania',
		RI: 'Rhode Island',
		SC: 'South Carolina',
		SD: 'South Dakota',
		TN: 'Tennessee',
		TX: 'Texas',
		UT: 'Utah',
		VT: 'Vermont',
		VA: 'Virginia',
		WA: 'Washington',
		WV: 'West Virginia',
		WI: 'Wisconsin',
		WY: 'Wyoming',
		AS: 'American Samoa',
		GU: 'Guam',
		MP: 'Northern Mariana Islands',
		PR: 'Puerto Rico',
		VI: 'U.S. Virgin Islands',
		UM: 'U.S. Minor Outlying Islands'
	};
	if (state[acronym] != null) {
		return state[acronym];
	}
	return acronym;
}
