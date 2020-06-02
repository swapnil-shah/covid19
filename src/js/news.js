//Dasboad Table
function fillNewsCards() {
	const news_key = 'apiKey=7e2e5ed46901476baa79347a66cc2b2c';
	const news_keyword = 'q=covid19%20and%20';
	const news_language = 'language=en';
	const news_sort = 'sortBy=publishedAt';
	const globalNews = `https://newsapi.org/v2/top-headlines?q=covid&${news_key}&${news_sort}&${news_language}`;
	axios
		.get(globalNews)
		.then((response) => {
			getNewsResults(response.data);
		})
		.catch((error) => {
			document.getElementById('news-results-number').innerHTML =
				'Failed to fetch the data.<br>Error Message: ' + error.message;
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
function getNewsResults(data) {
	let output = '';
	let newsCards = document.getElementById('card-deck');
	data.articles.forEach(function(item) {
		output += `
		<a class="card h-100 lift mx-md-3 ml-0 mr-3" href="${item.url}" target="_blank">
			<img class="card-img-top img-fluid lazy" data-src="${item.urlToImage}" alt=""  onerror="this.src='../assets/img/news_image_placeholder_128x128.png';this.style='object-fit: none;background:#F5F5F5'" style="background:#F5F5F5">
			<div class="card-body">
				<h5 class="card-title mb-2">${item.title}</h5>
				<p class="text-muted small pb-0 mb-4"><span class="font-weight-600 text-gray-600"><span class="icon-newspaper mr-1"></span>${item
					.source.name}</span> ${timeDifference(item.publishedAt)}</p>
				<p class="card-text mb-1">${item.description}</p>
			</div>
			<div class="card-footer">
				<p class="text-primary text-center mb-0">View full article<span class="icon-new-tab ml-1"></span></p>
			</div>
		</a>`;
	});
	if (newsCards) newsCards.innerHTML = newsCards.innerHTML + output;
}

$(document).ready(function() {
	fillNewsCards();
});
