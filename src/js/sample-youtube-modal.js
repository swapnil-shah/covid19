function youtubeVideos() {
	axios
		.get(
			'https://www.googleapis.com/youtube/v3/search?q="covid"&part=snippet&channelId=UCGn6a5SI8SNlj7WylmPD6GQ&maxResults=10&order=date&type=video&key=AIzaSyAC-i30TOP9Q-B5dTobFcre4iQm9eG6Qds'
		)
		.then((response) => {
			document.getElementById('video-results-number').innerHTML = `Showing recent ${response.data.pageInfo
				.resultsPerPage}`;
			let output = '';
			response.data.items.forEach(function(item) {
				output += `<div class="card my-3 shadow-sm lift lift-sm border-bottom-sm border-right-0 border-top-0 border-left-0" data-video="https://www.youtube.com/embed/${item
					.id
					.videoId}" style="cursor:pointer;border-color: rgba(255, 0, 0, 0.8);" data-target="#videoModal" data-toggle="modal">
								<div class="row no-gutters align-items-center py-2">
									<div class="col-sm-4">
											<img class="img-fluid text-center mx-auto px-2" src="${item.snippet.thumbnails.medium.url}" alt="...">
									</div>
									<div class="col-sm-8">
										<div class="card-body p-2 text-center text-md-left">
											<h6 class="card-title">${item.snippet.title}</h6>
											<p class="mb-0 d-flex flex-column flex-md-row justify-content-between align-items-center">
												<span class="text-muted small">${timeDifference(item.snippet.publishTime)}</span>
												<span class="text-blue mb-sm-2"><span class="icon-play mr-2"></span>Play Video</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						`;
			});
			document.getElementById('right-panel-reports').innerHTML = output;
		})
		.catch((error) => {
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
// .card-deck-container.px-2
//                                         .text-gray-600.small#video-results-number.pt-1.pl-3
//                                         #right-panel-reports
//                                     p.small.pt-2.pr-2.mb-0.text-right
//                                         em Data derived from&nbsp;
//                                             a.w-100.pt-2(href="https://www.youtube.com/pibindia/" target="_blank") PIB India YouTube
//                                                 i.icon-new-tab.ml-1
//         #videoModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='youtubeVideo', aria-hidden='true')
//             .modal-dialog.modal-dialog-centered.modal-xl(role='document')
//                 .modal-content
//                     .modal-header.bg-dark.border-dark
//                         h5.modal-title
//                         button.close.text-white(type='button', data-dismiss='modal') &times;
//                     .modal-body
//                         .embed-responsive.embed-responsive-16by9
//                             iframe.embed-responsive-item(allowfullscreen='')
//                 //- Extra large modal
//         .modal.fade#stateModal(tabindex='-1', role='dialog', aria-labelledby='stateModal', aria-hidden='true')
//             .modal-dialog.modal-xl(role='document')
//                 .modal-content
//                     .modal-header.bg-dark
//                         h3.display-5.modal-title.text-white-75#stateName
//                         button.close(type='button', data-dismiss='modal', aria-label='Close')
//                             span.text-white-75.icon-cross(aria-hidden='true')
//                     .modal-body
//                         .datatable.table-responsive.pb-3
//                             table#dataTableState.table.table-bordered.table-hover(width='100%', cellspacing='0')
//                     .modal-footer
//                         button.btn.btn-primary(type='button', data-dismiss='modal') Close
