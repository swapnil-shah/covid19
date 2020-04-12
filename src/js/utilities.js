let getDateFormatted = (function() {
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

// Convert yyyy-mm-dd to mm/dd/yyyy
function format(inputDate) {
	var date = new Date(inputDate);
	if (!isNaN(date.getTime())) {
		// Months use 0 index.
		return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
	}
}
let date = new Date().toISOString().split('T')[0];
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

function percentageChangeTotal(total, newTotal) {
	return total !== 0 && newTotal !== 0 && total !== newTotal ? ((total - newTotal) / total * 100).toFixed(2) : 0;
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
