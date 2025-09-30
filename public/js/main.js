function toggleFAQ(index) {
    const answer = document.getElementById(`answer-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    const circle = document.getElementById(`circle-${index}`);

    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '0';

    for (let i = 0; i < 9; i++) {
        if (i !== index) {
            const otherAnswer = document.getElementById(`answer-${i}`);
            const otherIcon = document.getElementById(`icon-${i}`);
            const otherCircle = document.getElementById(`circle-${i}`);
            if (otherAnswer && otherIcon) {
                otherAnswer.style.maxHeight = '0';
                otherAnswer.classList.remove('open');
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
        icon.classList.add('open');
        icon.classList.remove('text-white');
        icon.classList.add('text-dark');
        if (circle) {
            circle.classList.remove('bg-ink', 'text-white');
            circle.classList.add('bg-blue', 'text-dark');
        }
    } else {
        answer.style.maxHeight = '0';
        answer.classList.remove('open');
        icon.classList.remove('open', 'text-dark');
        icon.classList.add('text-white');
        if (circle) {
            circle.classList.remove('bg-blue', 'text-dark');
            circle.classList.add('bg-ink', 'text-white');
        }
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
                dots: true,
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
});

// Re-evaluate on resize to toggle slider based on breakpoint
window.addEventListener('resize', function () {
    initClientLogosSlider();
});


