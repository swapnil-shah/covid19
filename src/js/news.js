require('dotenv').config();
const newsUri = 'https://api.smartable.ai/coronavirus/news/US'; //https://api.smartable.ai/coronavirus/news/:location
let header = new Headers();
header.append('Accept', 'application/json');

let newsReq = new Request(newsUri, {
	method: 'GET',
	headers: header,
	mode: 'cors'
});
//Dasboad Table
let fillNewsCards = () => {
	fetch(newsReq, {
		headers: {
			'Cache-Control': 'no-cache',
			'Subscription-Key': process.env.API_KET_SMARTTABLE
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
                        <div class="ml-2">${formatDateToString(
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
	fillNewsCards();
});
