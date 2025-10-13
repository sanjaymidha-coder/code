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
    // Prevent default jump for FAQ toggle anchors (href="#")
    document.querySelectorAll('a[aria-controls^="answer-"]').forEach(function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); });
    });
    
});

// Re-evaluate on resize to toggle slider based on breakpoint
window.addEventListener('resize', function () {
    initClientLogosSlider();
});


// Scroll to section on click
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // Ignore bare '#' which can conflict with JS-only toggles
      if (!href || href === '#') { return; }
      // Only handle if target exists on page
      const target = document.querySelector(href);
      if (!target) { return; }
      e.preventDefault();
      const offset = -70; // adjust for your sticky header
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
});


// ======================================================
// ✅ PRODUCTION COOKIE CONSENT (PER-CATEGORY + ALWAYS REOPENABLE ICON + FIXED POPUP VIEW)
// ======================================================

const popup = document.getElementById("cookie-popup");
const settingsBtn = document.getElementById("cookie-settings-btn");
const customizeBtn = document.getElementById("cookie-customize");
const customPanel = document.getElementById("cookie-custom-panel");
const mainButtons = document.getElementById("cookie-main-buttons");
const saveBtn = document.getElementById("cookie-save");

// --- Safe JSON parse (prevents crashes from invalid or old data) ---
let consentData = null;
try {
  const stored = localStorage.getItem("cookieConsent");
  // Handle legacy values like "accepted" / "rejected"
  if (stored === "accepted") {
    consentData = { essential: true, analytics: true, marketing: true, functional: true };
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
  } else if (stored === "rejected") {
    consentData = { essential: true, analytics: false, marketing: false, functional: false };
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
  } else {
    consentData = stored ? JSON.parse(stored) : null;
  }
} catch (e) {
  console.warn("Invalid cookieConsent data detected — resetting.", e);
  localStorage.removeItem("cookieConsent");
  consentData = null;
}

// --- Animation helpers ---
function showPopupSmoothly(showCustomize = false) {
  popup.style.display = "block";
  popup.classList.remove("hidden", "hide", "show");

  // always start with main view unless specified
  if (!showCustomize) {
    customPanel.classList.add("hidden");
    mainButtons.classList.remove("hidden");
  }

  void popup.offsetWidth; // force reflow (Firefox fix)
  setTimeout(() => popup.classList.add("show"), 20);
}

function hidePopupSmoothly() {
  popup.classList.remove("show");
  popup.classList.add("hide");
  setTimeout(() => {
    popup.classList.add("hidden");
    popup.style.display = "none";
  }, 400);
}

// --- Restore preferences (if any) ---
if (consentData) {
  const { analytics, marketing, functional } = consentData;
  document.getElementById("cookie-analytics").checked = !!analytics;
  document.getElementById("cookie-marketing").checked = !!marketing;
  document.getElementById("cookie-functional").checked = !!functional;
}

// --- Show popup automatically only if no consent ---
if (!consentData) {
  showPopupSmoothly();
}

// --- Accept All ---
document.getElementById("cookie-accept").addEventListener("click", () => {
  const data = {
    essential: true,
    analytics: true,
    marketing: true,
    functional: true,
  };
  localStorage.setItem("cookieConsent", JSON.stringify(data));
  hidePopupSmoothly();
  loadConsentScripts(data);
});

// --- Reject All ---
document.getElementById("cookie-reject").addEventListener("click", () => {
  const data = {
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  };
  localStorage.setItem("cookieConsent", JSON.stringify(data));
  hidePopupSmoothly();
});

// --- Save Preferences ---
saveBtn.addEventListener("click", () => {
  const analytics = document.getElementById("cookie-analytics").checked;
  const marketing = document.getElementById("cookie-marketing").checked;
  const functional = document.getElementById("cookie-functional").checked;

  const data = { essential: true, analytics, marketing, functional };
  localStorage.setItem("cookieConsent", JSON.stringify(data));
  hidePopupSmoothly();

  if (analytics || marketing || functional) {
    loadConsentScripts(data);
  }

  // ✅ reset to main view for next open
  setTimeout(() => {
    customPanel.classList.add("hidden");
    mainButtons.classList.remove("hidden");
  }, 400);
});

// --- Settings Button (always opens popup manually) ---
settingsBtn.addEventListener("click", () => showPopupSmoothly(false));

// --- Customize panel toggle ---
customizeBtn.addEventListener("click", () => {
  mainButtons.classList.add("hidden");
  customPanel.classList.remove("hidden");
  customPanel.classList.add("animate-fadeInUp");
});

// --- Load scripts based on consent ---
function loadConsentScripts(data) {
  // ✅ Analytics (Google Tag + Hotjar)
  if (data.analytics) {
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-251J8F95ED";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", "G-251J8F95ED");
    };

    const hotjarScript = document.createElement("script");
    hotjarScript.src = "https://t.contentsquare.net/uxa/470b0f6ba5ddf.js";
    document.head.appendChild(hotjarScript);
  }

  // ✅ Marketing (Facebook Pixel / Google Ads)
  if (data.marketing) {
    const fbScript = document.createElement("script");
    fbScript.src = "https://connect.facebook.net/en_US/fbevents.js";
    fbScript.async = true;
    document.head.appendChild(fbScript);
  }

  // ✅ Functional (if needed later)
  if (data.functional) {
    // Add personalization or preference scripts here if any
  }
}

// --- Auto-load scripts on revisit (if user already accepted) ---
if (consentData && (consentData.analytics || consentData.marketing || consentData.functional)) {
  loadConsentScripts(consentData);
}
