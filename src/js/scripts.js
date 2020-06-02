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
	$(window).scroll(function() {
		if ($(this).scrollTop() >= 1000) {
			$('#return-to-top').fadeIn(200);
		} else {
			$('#return-to-top').fadeOut(200);
		}
	});
	$('#return-to-top').click(function() {
		$('html, body').animate({ scrollTop: 0 }, 600);
		return false;
	});
})(jQuery);
function lazyLoad() {
	var lazyloadImages;
	if ('IntersectionObserver' in window) {
		lazyloadImages = document.querySelectorAll('.lazy');
		var imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var image = entry.target;
					image.src = image.dataset.src;
					image.classList.remove('lazy');
					imageObserver.unobserve(image);
				}
			});
		});

		lazyloadImages.forEach(function(image) {
			imageObserver.observe(image);
		});
	} else {
		var lazyloadThrottleTimeout;
		lazyloadImages = document.querySelectorAll('.lazy');

		function lazyload() {
			if (lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}

			lazyloadThrottleTimeout = setTimeout(function() {
				var scrollTop = window.pageYOffset;
				lazyloadImages.forEach(function(img) {
					if (img.offsetTop < window.innerHeight + scrollTop) {
						img.src = img.dataset.src;
						img.classList.remove('lazy');
					}
				});
				if (lazyloadImages.length == 0) {
					document.removeEventListener('scroll', lazyload);
					window.removeEventListener('resize', lazyload);
					window.removeEventListener('orientationChange', lazyload);
				}
			}, 20);
		}

		document.addEventListener('scroll', lazyload);
		window.addEventListener('resize', lazyload);
		window.addEventListener('orientationChange', lazyload);
	}
}
$(window).on('load', function() {
	lazyLoad();
	let $logo = $('#brand-logo');
	$logo.removeClass('rotating');
	$logo.hover(function() {
		$(this).addClass('rotating'), $(this).removeClass('rotating');
	});
});
