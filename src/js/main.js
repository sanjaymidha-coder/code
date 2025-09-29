// Plain JS bootstrap for file:// and http(s)
(function () {
	function initLenis() {
		var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (typeof window.Lenis === 'undefined') return;

		var isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

		var lenis = new window.Lenis({
			smoothWheel: prefersReduced ? false : true,
			smoothTouch: prefersReduced ? false : true,
			wheelMultiplier: prefersReduced ? 1.0 : (isTouch ? 0.9 : 0.8),
			touchMultiplier: 0.95,
			duration: prefersReduced ? 0.8 : (isTouch ? 0.55 : 0.55),
			easing: prefersReduced ? function (t) { return t; } : function (t) { return 1 - Math.pow(1 - t, 3); }
		});

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		document.addEventListener('click', function (event) {
			var link = event.target && event.target.closest && event.target.closest('a[href^="#"]');
			if (!link) return;
			var href = link.getAttribute('href');
			if (!href || href.length <= 1) return;
			var target = document.querySelector(href);
			if (!target) return;
			event.preventDefault();
			lenis.scrollTo(target, { offset: 0, duration: 0.9, lock: false });
		});
	}

	function toggleFAQ(index) {
		var answer = document.getElementById('answer-' + index);
		var icon = document.getElementById('icon-' + index);
		var circle = document.getElementById('circle-' + index);

		var isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '0';

		for (var i = 0; i < 9; i++) {
			if (i !== index) {
				var otherAnswer = document.getElementById('answer-' + i);
				var otherIcon = document.getElementById('icon-' + i);
				var otherCircle = document.getElementById('circle-' + i);
				if (otherAnswer && otherIcon) {
					otherAnswer.style.maxHeight = '0';
					otherIcon.classList.remove('open', 'text-dark');
					otherIcon.classList.add('text-white');
					if (otherCircle) {
						otherCircle.classList.remove('bg-blue', 'text-dark');
						otherCircle.classList.add('bg-ink', 'text-white');
					}
				}
			}
		}

		if (!isOpen) {
			answer.style.maxHeight = answer.scrollHeight + 'px';
			icon.classList.add('open');
			icon.classList.remove('text-white');
			icon.classList.add('text-dark');
			if (circle) {
				circle.classList.remove('bg-ink', 'text-white');
				circle.classList.add('bg-blue', 'text-dark');
			}
		} else {
			answer.style.maxHeight = '0';
			icon.classList.remove('open', 'text-dark');
			icon.classList.add('text-white');
			if (circle) {
				circle.classList.remove('bg-blue', 'text-dark');
				circle.classList.add('bg-ink', 'text-white');
			}
		}
	}

	// Expose for inline onclick compatibility
	window.toggleFAQ = toggleFAQ;

	// Boot
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initLenis);
	} else {
		initLenis();
	}
})();


