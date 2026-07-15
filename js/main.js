document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ===== Sticky Header Scroll Effect =====
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== Mobile Menu (Full-screen Overlay) =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  const closeMobileMenu = () => {
    if (!navMenu || !navMenu.classList.contains('active')) return;
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (typeof lucide !== 'undefined' && mobileMenuBtn) {
      mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
      lucide.createIcons();
    }
  };

  const openMobileMenu = () => {
    if (!navMenu || !mobileMenuBtn) return;
    navMenu.classList.add('active');
    document.body.classList.add('menu-open');
    if (typeof lucide !== 'undefined') {
      mobileMenuBtn.innerHTML = `<i data-lucide="x"></i>`;
      lucide.createIcons();
    }
  };

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking a nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMobileMenu());
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Close menu when window resized to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 1024) closeMobileMenu();
      }, 150);
    });
  }

  // ===== Active Nav Link Highlight =====
  const navLinks = document.querySelectorAll('.nav-item a');
  const currentPath = window.location.pathname;
  const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (pageFilename === '' || pageFilename === 'index.html') {
      if (linkHref === 'index.html' || linkHref === '#') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else if (linkHref && linkHref.includes(pageFilename)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ===== Reveal scroll animations =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Stats Counter Animation =====
  const statValues = document.querySelectorAll('[data-counter]');
  if (statValues.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1800;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = prefix + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = prefix + target.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statValues.forEach(el => counterObserver.observe(el));
  }

  // ===== Copy Address Utility (kept for legacy; button removed from index) =====
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = 'Vazhappilly Towers, Kinfra Park P O, Pin-680309, Thrissur District, Kerala, India';
      const copyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        return new Promise((resolve, reject) => {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.cssText = 'position:fixed;left:-999999px;top:-999999px';
          document.body.appendChild(textArea);
          textArea.focus(); textArea.select();
          try { document.execCommand('copy') ? resolve() : reject(); document.body.removeChild(textArea); }
          catch(err) { document.body.removeChild(textArea); reject(err); }
        });
      };
      copyToClipboard(addressText)
        .then(() => { showToast('Address copied to clipboard!'); })
        .catch(() => { showToast('Failed to copy. Please copy manually.'); });
    });
  }

  // ===== Course Combo Slider =====
  const comboSlider = document.getElementById('combo-slider');
  const comboDots = document.getElementById('combo-dots');
  if (comboSlider && comboDots) {
    const cards = comboSlider.querySelectorAll('.combo-card');
    const dots = comboDots.querySelectorAll('.combo-dot');
    let current = 0;
    let autoplayTimer;

    const goTo = (index) => {
      cards[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + cards.length) % cards.length;
      cards[current].classList.add('active');
      dots[current].classList.add('active');
    };

    const startAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), 4000);
    };

    // Initialise first card
    cards[0].classList.add('active');

    // Dot click
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
        startAutoplay();
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    comboSlider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    comboSlider.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAutoplay(); }
    }, { passive: true });

    startAutoplay();
  }

  // ===== Toast notification =====
  function showToast(message) {
    let toast = document.querySelector('.custom-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'custom-toast';
      Object.assign(toast.style, {
        position: 'fixed', bottom: '2rem', right: '2rem',
        padding: '1rem 1.5rem', borderRadius: '14px', color: '#ffffff',
        fontSize: '0.95rem', fontWeight: '500', zIndex: '2000',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        border: '1px solid rgba(255, 180, 0, 0.4)',
        background: 'rgba(10, 15, 31, 0.95)',
        boxShadow: '0 12px 40px rgba(255, 180, 0, 0.25)',
        opacity: '0', transform: 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'
      });
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i data-lucide="info" style="color: #FFB400"></i> <span>${message}</span>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; }, 3000);
  }

  // ===== Smooth scroll for in-page anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });
});