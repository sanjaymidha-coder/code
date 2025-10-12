// --- Debounced FAQ Toggle ---
function toggleFAQ(index) {
  const answer = document.getElementById(`answer-${index}`);
  const icon = document.getElementById(`icon-${index}`);
  const circle = document.getElementById(`circle-${index}`);
  const button = document.querySelector(`[aria-controls="answer-${index}"]`);
  if (!answer || !icon || !button) return;

  const isOpen = answer.classList.contains('open');

  // Close all others (loop optimized)
  document.querySelectorAll('.faq-answer').forEach((ans, i) => {
    const otherIcon = document.getElementById(`icon-${i}`);
    const otherCircle = document.getElementById(`circle-${i}`);
    ans.style.maxHeight = '0';
    ans.classList.remove('open');
    ans.parentElement?.classList.remove('faq-item-active');
    if (otherIcon) {
      otherIcon.classList.remove('open', 'text-dark');
      otherIcon.classList.add('text-white');
    }
    if (otherCircle) {
      otherCircle.classList.remove('bg-blue', 'text-dark');
      otherCircle.classList.add('bg-ink', 'text-white');
    }
    const btn = document.querySelector(`[aria-controls="answer-${i}"]`);
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    answer.style.maxHeight = `${answer.scrollHeight}px`;
    answer.classList.add('open');
    answer.parentElement?.classList.add('faq-item-active');
    icon.classList.add('open', 'text-dark');
    icon.classList.remove('text-white');
    circle?.classList.replace('bg-ink', 'bg-blue');
    circle?.classList.replace('text-white', 'text-dark');
    button.setAttribute('aria-expanded', 'true');
  } else {
    answer.style.maxHeight = '0';
    answer.classList.remove('open');
    answer.parentElement?.classList.remove('faq-item-active');
    icon.classList.remove('open', 'text-dark');
    icon.classList.add('text-white');
    circle?.classList.replace('bg-blue', 'bg-ink');
    circle?.classList.replace('text-dark', 'text-white');
    button.setAttribute('aria-expanded', 'false');
  }
}

// --- Mobile Logo Slider (optimized for resize) ---
let sliderInit = false;
function initClientLogosSlider() {
  const $slider = window.jQuery?.('.client-logos-slider');
  if (!$slider?.length) return;

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  if (isMobile && !sliderInit) {
    $slider.slick({
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      infinite: true,
      pauseOnHover: false,
      responsive: [
        { breakpoint: 640, settings: { slidesToShow: 3 } },
        { breakpoint: 480, settings: { slidesToShow: 3 } },
      ],
    });
    sliderInit = true;
  } else if (!isMobile && sliderInit) {
    $slider.slick('unslick');
    sliderInit = false;
  }
}

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  initClientLogosSlider();

  // Mobile menu (optimized)
  (() => {
    const openBtn = document.getElementById('mobile-menu-button');
    const closeBtn = document.getElementById('mobile-menu-close');
    const panel = document.getElementById('mobile-offcanvas');
    const backdrop = document.getElementById('mobile-offcanvas-backdrop');
    if (!openBtn || !panel || !backdrop) return;

    const toggleMenu = (open) => {
      panel.classList.toggle('translate-x-full', !open);
      backdrop.classList.toggle('pointer-events-none', !open);
      backdrop.style.opacity = open ? '1' : '0';
      panel.setAttribute('aria-hidden', !open);
      openBtn.setAttribute('aria-expanded', open);
      (open ? closeBtn : openBtn)?.focus({ preventScroll: true });
      document[open ? 'addEventListener' : 'removeEventListener']('keydown', onKeydown);
    };

    const onKeydown = (e) => e.key === 'Escape' && toggleMenu(false);

    openBtn.addEventListener('click', (e) => { e.preventDefault(); toggleMenu(true); });
    closeBtn?.addEventListener('click', (e) => { e.preventDefault(); toggleMenu(false); });
    backdrop.addEventListener('click', () => toggleMenu(false));
  })();

  // Sticky header
  (() => {
    const header = document.getElementById('site-header');
    if (!header) return;
    header.classList.add('site-header');
    const headerHeight = header.offsetHeight || 72;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('is-stuck', y > 10);
      header.classList.toggle('is-hidden', y > headerHeight && y < lastY);
      lastY = y;
    }, { passive: true });
  })();

  // Input field state
  document.querySelectorAll('.input-global, .select-global').forEach((el) => {
    const update = () => el.classList.toggle('filled', !!el.value?.trim());
    update();
    ['input', 'change', 'blur'].forEach((evt) => el.addEventListener(evt, update));
  });

  // Prevent FAQ anchor jumps
  document.querySelectorAll('a[aria-controls^="answer-"]').forEach((el) =>
    el.addEventListener('click', (e) => e.preventDefault())
  );
});

// --- Resize Recheck ---
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initClientLogosSlider, 250);
});

// --- Smooth Scroll Navigation ---
document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 70,
      behavior: 'smooth',
    });
  });
});

// --- Cookie Popup (unchanged except for minor optimizations) ---
(() => {
  const popup = document.getElementById('cookie-popup');
  if (!popup) return;

  const settingsBtn = document.getElementById('cookie-settings-btn');
  const customizeBtn = document.getElementById('cookie-customize');
  const customPanel = document.getElementById('cookie-custom-panel');
  const mainButtons = document.getElementById('cookie-main-buttons');
  const saveBtn = document.getElementById('cookie-save');
  const get = (id) => document.getElementById(id);

  let consentData = null;
  try {
    const stored = localStorage.getItem('cookieConsent');
    if (stored === 'accepted' || stored === 'rejected') {
      consentData = {
        essential: true,
        analytics: stored === 'accepted',
        marketing: stored === 'accepted',
        functional: stored === 'accepted',
      };
      localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    } else {
      consentData = stored ? JSON.parse(stored) : null;
    }
  } catch {
    localStorage.removeItem('cookieConsent');
  }

  const showPopup = (customize = false) => {
    popup.style.display = 'block';
    popup.classList.remove('hidden', 'hide');
    if (!customize) {
      customPanel.classList.add('hidden');
      mainButtons.classList.remove('hidden');
    }
    void popup.offsetWidth;
    popup.classList.add('show');
  };

  const hidePopup = () => {
    popup.classList.remove('show');
    popup.classList.add('hide');
    setTimeout(() => (popup.style.display = 'none'), 400);
  };

  if (consentData) {
    ['analytics', 'marketing', 'functional'].forEach((k) => {
      const el = get(`cookie-${k}`);
      if (el) el.checked = !!consentData[k];
    });
  } else {
    showPopup();
  }

  const saveConsent = (data) => {
    localStorage.setItem('cookieConsent', JSON.stringify(data));
    hidePopup();
    if (data.analytics || data.marketing || data.functional) loadConsentScripts(data);
  };

  get('cookie-accept').addEventListener('click', () =>
    saveConsent({ essential: true, analytics: true, marketing: true, functional: true })
  );

  get('cookie-reject').addEventListener('click', () =>
    saveConsent({ essential: true, analytics: false, marketing: false, functional: false })
  );

  saveBtn.addEventListener('click', () => {
    saveConsent({
      essential: true,
      analytics: get('cookie-analytics').checked,
      marketing: get('cookie-marketing').checked,
      functional: get('cookie-functional').checked,
    });
    setTimeout(() => {
      customPanel.classList.add('hidden');
      mainButtons.classList.remove('hidden');
    }, 400);
  });

  settingsBtn.addEventListener('click', () => showPopup(false));
  customizeBtn.addEventListener('click', () => {
    mainButtons.classList.add('hidden');
    customPanel.classList.remove('hidden');
    customPanel.classList.add('animate-fadeInUp');
  });

  function loadConsentScripts(data) {
    if (data.analytics) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-251J8F95ED';
      gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-251J8F95ED');
      };
      document.head.appendChild(gtagScript);
      const hotjar = document.createElement('script');
      hotjar.async = true;
      hotjar.src = 'https://t.contentsquare.net/uxa/470b0f6ba5ddf.js';
      document.head.appendChild(hotjar);
    }
    if (data.marketing) {
      const fb = document.createElement('script');
      fb.async = true;
      fb.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(fb);
    }
  }

  if (consentData && (consentData.analytics || consentData.marketing || consentData.functional)) {
    loadConsentScripts(consentData);
  }
})();
