document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Sticky Header Scroll Effect
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check immediately on load

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('active');
      navMenu.classList.toggle('active');
      
      // Update menu icon (Menu vs X)
      if (typeof lucide !== 'undefined') {
        const iconName = isOpen ? 'menu' : 'x';
        mobileMenuBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons({
          attrs: {
            class: 'lucide-icon'
          },
          nameAttr: 'data-lucide'
        });
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (typeof lucide !== 'undefined') {
          mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
          lucide.createIcons();
        }
      }
    });
  }

  // Active Nav Link Highlight based on current page url
  const navLinks = document.querySelectorAll('.nav-item a');
  const currentPath = window.location.pathname;
  const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    // Normalize links
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

  // Reveal scroll animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Animates only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Copy Address Utility
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = 'Vazhappilly Towers, Kinfra Park P O, Pin-680309, Thrissur District, Kerala, India';
      
      const copyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
          return navigator.clipboard.writeText(text);
        } else {
          // Fallback method
          return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              const successful = document.execCommand('copy');
              document.body.removeChild(textArea);
              if (successful) {
                resolve();
              } else {
                reject(new Error('execCommand copy failed'));
              }
            } catch (err) {
              document.body.removeChild(textArea);
              reject(err);
            }
          });
        }
      };

      copyToClipboard(addressText)
        .then(() => {
          // Show visual confirmation on the button
          const originalHTML = copyAddressBtn.innerHTML;
          copyAddressBtn.innerHTML = `<i data-lucide="check"></i> Copied!`;
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }

          // Show a temporary snackbar/toast
          showToast('Address copied to clipboard!');

          setTimeout(() => {
            copyAddressBtn.innerHTML = originalHTML;
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy address: ', err);
          showToast('Failed to copy. Please highlight and copy manually.');
        });
    });
  }

  // Toast notification helper
  function showToast(message) {
    let toast = document.querySelector('.custom-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'custom-toast glass';
      // Style toast dynamically
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '0.95rem',
        zIndex: '2000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '1px solid var(--accent-cyan)',
        background: 'rgba(3, 7, 18, 0.85)',
        boxShadow: '0 8px 32px 0 rgba(0, 210, 255, 0.15)',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
      });
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i data-lucide="info" style="color: var(--accent-cyan)"></i> <span>${message}</span>`;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, 3000);
  }
});
