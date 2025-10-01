function toggleFAQ(index) {
    const answer = document.getElementById(`answer-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    const circle = document.getElementById(`circle-${index}`);
    const button = document.querySelector(`[aria-controls="answer-${index}"]`);

    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '0';

    for (let i = 0; i < 9; i++) {
        if (i !== index) {
            const otherAnswer = document.getElementById(`answer-${i}`);
            const otherIcon = document.getElementById(`icon-${i}`);
            const otherCircle = document.getElementById(`circle-${i}`);
            if (otherAnswer && otherIcon) {
                otherAnswer.style.maxHeight = '0';
                otherAnswer.classList.remove('open');
                if (otherAnswer.parentElement) {
                    otherAnswer.parentElement.classList.remove('faq-item-active');
                }
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
        answer.classList.add('open');
        if (answer.parentElement) {
            answer.parentElement.classList.add('faq-item-active');
        }
        icon.classList.add('open');
        icon.classList.remove('text-white');
        icon.classList.add('text-dark');
        if (circle) {
            circle.classList.remove('bg-ink', 'text-white');
            circle.classList.add('bg-blue', 'text-dark');
        }
        if (button) { button.setAttribute('aria-expanded', 'true'); }
    } else {
        answer.style.maxHeight = '0';
        answer.classList.remove('open');
        if (answer.parentElement) {
            answer.parentElement.classList.remove('faq-item-active');
        }
        icon.classList.remove('open', 'text-dark');
        icon.classList.add('text-white');
        if (circle) {
            circle.classList.remove('bg-blue', 'text-dark');
            circle.classList.add('bg-ink', 'text-white');
        }
        if (button) { button.setAttribute('aria-expanded', 'false'); }
    }
}

// Initialize mobile-only slider for client logos
function initClientLogosSlider() {
    const sliderSelector = '.client-logos-slider';
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const $slider = window.jQuery ? window.jQuery(sliderSelector) : null;

    if (!$slider) return;

    if (isMobile) {
        if (!$slider.hasClass('slick-initialized')) {
            $slider.slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows: false,
                dots: false,
                infinite: true,
                centerMode: false,
                pauseOnHover: false,
                responsive: [
                    { breakpoint: 640, settings: { slidesToShow: 3 } },
                    { breakpoint: 480, settings: { slidesToShow: 3 } }
                ]
            });
        }
    } else {
        if ($slider.hasClass('slick-initialized')) {
            $slider.slick('unslick');
        }
    }
}

// Wait for DOM and third-party scripts
document.addEventListener('DOMContentLoaded', function () {
    // Try to initialize once loaded
    initClientLogosSlider();
    // Mobile offcanvas menu
    (function initMobileMenu(){
        const openBtn = document.getElementById('mobile-menu-button');
        const closeBtn = document.getElementById('mobile-menu-close');
        const panel = document.getElementById('mobile-offcanvas');
        const backdrop = document.getElementById('mobile-offcanvas-backdrop');
        if (!openBtn || !panel || !backdrop) return;

        function openMenu(){
            panel.classList.remove('translate-x-full');
            backdrop.classList.remove('pointer-events-none');
            requestAnimationFrame(()=>{ backdrop.style.opacity = '1'; });
            panel.setAttribute('aria-hidden','false');
            openBtn.setAttribute('aria-expanded','true');
            (closeBtn || panel).focus({ preventScroll: true });
            document.addEventListener('keydown', onKeydown);
        }

        function closeMenu(){
            panel.classList.add('translate-x-full');
            backdrop.style.opacity = '0';
            backdrop.classList.add('pointer-events-none');
            panel.setAttribute('aria-hidden','true');
            openBtn.setAttribute('aria-expanded','false');
            openBtn.focus({ preventScroll: true });
            document.removeEventListener('keydown', onKeydown);
        }

        function onKeydown(e){ if (e.key === 'Escape') closeMenu(); }

        openBtn.addEventListener('click', function(e){ e.preventDefault(); openMenu(); });
        if (closeBtn) closeBtn.addEventListener('click', function(e){ e.preventDefault(); closeMenu(); });
        backdrop.addEventListener('click', function(){ closeMenu(); });
    })();
    // Sticky header behavior
    (function initStickyHeader(){
        const header = document.getElementById('site-header');
        if (!header) return;
        // Enhance class list for styling without changing HTML structure
        header.classList.add('site-header');
        const headerHeight = header.offsetHeight || 72;
        document.documentElement.style.setProperty('--header-height', headerHeight + 'px');

        let lastY = window.scrollY;
        let ticking = false;

        function onScroll(){
            const y = window.scrollY;
            const goingDown = y > lastY;
            if (y > 10) {
                header.classList.add('is-stuck');
            } else {
                header.classList.remove('is-stuck');
            }
            if (y > headerHeight) {
                // Show when scrolling down, hide when scrolling up
                header.classList.toggle('is-hidden', !goingDown);
            } else {
                header.classList.remove('is-hidden');
            }
            lastY = y;
            ticking = false;
        }

        window.addEventListener('scroll', function(){
            if (!ticking){
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
    })();
    // Toggle filled state for inputs, textareas and selects
    function updateFilled(el) {
        const tag = el.tagName;
        const hasValue = tag === 'SELECT' ? (el.value !== '' && el.value != null) : (el.value && el.value.trim() !== '');
        if (hasValue) { el.classList.add('filled'); } else { el.classList.remove('filled'); }
    }
    document.querySelectorAll('.input-global, .select-global').forEach(function (el) {
        updateFilled(el);
        ['input','change','blur'].forEach(function (evt) {
            el.addEventListener(evt, function () { updateFilled(el); });
        });
    });
});

// Re-evaluate on resize to toggle slider based on breakpoint
window.addEventListener('resize', function () {
    initClientLogosSlider();
});


// Scroll to section on click
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = -70; // adjust for your sticky header
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition + offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
