(function($) {
	var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
	$('#layoutSidenav_nav .sidenav a.nav-link').each(function() {
		if (this.href === path) {
			$(this).addClass('active');
		}
	});

	// Toggle the side navigation
	$('#sidebarMenu').on('click', function(e) {
		e.preventDefault();
		$('body').toggleClass('sidenav-toggled');
	});

	$('#sidebarClose').on('click', function(e) {
		e.preventDefault();
		$('body').toggleClass('sidenav-toggled');
	});
	$('.nav-sticky a.nav-link[href*="#"]:not([href="#"])').click(function() {
		if (
			location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
			location.hostname == this.hostname
		) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate(
					{
						scrollTop: target.offset().top - 81
					},
					200
				);
				return false;
			}
		}
	});

	// Click to collapse responsive sidebar
	$('#layoutSidenav_content').click(function() {
		if ($('body').hasClass('sidenav-toggled')) {
			$('body').toggleClass('sidenav-toggled');
		}
	});

	// Init sidebar
	let activatedPath = window.location.pathname.match(/([\w-]+\.html)/, '$1');

	if (activatedPath) {
		activatedPath = activatedPath[0];
	} else {
		activatedPath = 'index.html';
	}

	let targetAnchor = $('[href="' + activatedPath + '"]');
	let collapseAncestors = targetAnchor.parents('.collapse');

	targetAnchor.addClass('active');

	collapseAncestors.each(function() {
		$(this).addClass('show');
		$('[data-target="#' + this.id + '"]').removeClass('collapsed');
	});

	$('.deck-control-right').click(function() {
		$('.news-deck-outer').animate(
			{
				scrollLeft: '+=500px'
			},
			'slow'
		);
	});

	$('.deck-control-left').click(function() {
		$('.news-deck-outer').animate(
			{
				scrollLeft: '-=500px'
			},
			'slow'
		);
	});
})(jQuery);
