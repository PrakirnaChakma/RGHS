// Dark mode toggle
const toggle = document.getElementById('mode-toggle');

// Persisted theme on load
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    toggle.textContent = '☀️';
  } else {
    toggle.textContent = '🌙';
  }
} catch (e) {}
toggle.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch(e){}
  toggle.textContent = isLight ? '☀️' : '🌙';
});

// Interactive dot matrix background
const canvas = document.getElementById('dotmatrix');
const ctx = canvas.getContext('2d');
let width, height, dots = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  dots = [];
  for (let x = 0; x < width; x += 30) {
    for (let y = 0; y < height; y += 30) {
      dots.push({ x, y, r: 1 });
    }
  }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousemove', e => {
  for (let dot of dots) {
    const dx = dot.x - e.clientX;
    const dy = dot.y - e.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    dot.r = dist < 100 ? 2 + (100 - dist) / 20 : 1;
  }
});

function draw() {
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color');
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent');
  for (let dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// ========== DYNAMIC NOTICES LOADER ==========
document.addEventListener('DOMContentLoaded', () => {
  const homeContainer = document.getElementById('home-notice-list');   // on index.html
  const allContainer  = document.getElementById('all-notice-list');    // on notices.html

  // If neither page has a notices container, do nothing
  if (!homeContainer && !allContainer) return;

  fetch('data/notices.json')
    .then(r => r.json())
    .then((notices) => {
      // sort newest first
      notices.sort((a,b) => new Date(b.date) - new Date(a.date));

      if (homeContainer) {
        const latest = notices.filter(n => !n.archived).slice(0, 2);
        renderNotices(homeContainer, latest);
      }

      if (allContainer) {
        renderNotices(allContainer, notices);
        setupFilters(notices);
      }
    })
    .catch(err => console.error('Failed to load notices:', err));

  // Render a list of notices into a container
  function renderNotices(container, list) {
    container.innerHTML = list.map(n => `
      <article class="notice-card${n.archived ? ' archived' : ''}">
        <h3>${escapeHTML(n.title)}</h3>
        <p class="short-desc">${n.short}</p>
        <div class="full-desc hidden">${n.full}</div>
        <button class="toggle-full">View Full</button>
        <span class="notice-date">Posted: ${formatDate(n.date)}</span>
      </article>
    `).join('');
  }

  // Event delegation for "View Full" buttons (works for both pages)
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.toggle-full');
    if (!btn) return;
    const full = btn.previousElementSibling;
    full.classList.toggle('hidden');
    btn.textContent = full.classList.contains('hidden') ? 'View Full' : 'Hide';
  });

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  }

  // Filters (only on notices.html)
  function setupFilters(allNotices) {
    const q = document.getElementById('notice-q');
    const archivedToggle = document.getElementById('toggle-archived');

    function apply() {
      const term = (q?.value || '').toLowerCase();
      const showArchived = !!archivedToggle?.checked;

      const filtered = allNotices.filter(n => {
        if (!showArchived && n.archived) return false;
        if (!term) return true;
        const hay = (n.title + ' ' + n.short + ' ' + (n.tags || []).join(' ')).toLowerCase();
        return hay.includes(term);
      });

      renderNotices(document.getElementById('all-notice-list'), filtered);
    }

    q?.addEventListener('input', apply);
    archivedToggle?.addEventListener('change', apply);
  }
});


 
  document.querySelectorAll(".toggle-info").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".contact-card");
      const extra = card.querySelector(".extra-info");
      extra.classList.toggle("hidden");
      button.textContent = extra.classList.contains("hidden") ? "View More" : "Hide Info";
    });
  });

// ========== HAMBURGER MENU FUNCTIONALITY ==========


// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  
  // Create and add hamburger button
  function createHamburgerMenu() {
    // Check if hamburger already exists
    let hamburger = document.querySelector('.hamburger');
    
    if (!hamburger && window.innerWidth <= 768) {
      hamburger = document.createElement('button');
      hamburger.className = 'hamburger';
      hamburger.innerHTML = '☰';
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      
      // Insert hamburger button in nav
      const modeToggle = document.getElementById('mode-toggle');
      nav.insertBefore(hamburger, modeToggle);
      
      // Add click event to hamburger
      hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
      });
    }
  }
  
  // Remove hamburger menu on larger screens
  function removeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.remove();
    }
    navLinks.classList.remove('active');
  }
  
  // Handle window resize
  function handleResize() {
    if (window.innerWidth <= 768) {
      createHamburgerMenu();
    } else {
      removeHamburgerMenu();
    }
  }
  
  // Initialize
  handleResize();
  
  // Listen for window resize
  window.addEventListener('resize', handleResize);
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger && !nav.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '☰';
    }
  });
  
  // Close menu when clicking nav links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      const hamburger = document.querySelector('.hamburger');
      if (hamburger && window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '☰';
      }
    });
  });
  
});

// ========== STARTUP INFO MODAL FUNCTIONALITY ==========
// Add this to your script.js file

// Startup Info Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  
  const startupBtn = document.getElementById('startup-info-btn');
  const modal = document.getElementById('startup-modal');
  const closeBtn = document.querySelector('.close-modal');
  const contactCtaBtn = document.getElementById('contact-cta-btn');
  
  // Function to properly close modal and restore scrolling
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    // Force page refresh of scroll behavior
    setTimeout(() => {
      window.scrollTo(window.scrollX, window.scrollY);
    }, 50);
  }
  
  // Function to properly open modal
  function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  
  // Open modal when button is clicked
  if (startupBtn) {
    startupBtn.addEventListener('click', function() {
      openModal();
    });
  }
  
  // Close modal when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }
  
  // Handle Contact Us Now button
  if (contactCtaBtn) {
    contactCtaBtn.addEventListener('click', function() {
      closeModal();
      
      // Wait for modal to close, then scroll to contacts
      setTimeout(() => {
        const contactsSection = document.getElementById('contacts');
        if (contactsSection) {
          contactsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    });
  }
  
  // Close modal when clicking outside of it
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
  
  // Image gallery click to enlarge (optional feature)
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', function() {
      // Create full-screen image viewer
      const viewer = document.createElement('div');
      viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        cursor: pointer;
      `;
      
      const enlargedImg = document.createElement('img');
      enlargedImg.src = this.src;
      enlargedImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
      `;
      
      viewer.appendChild(enlargedImg);
      document.body.appendChild(viewer);
      
      // Close on click
      viewer.addEventListener('click', function() {
        document.body.removeChild(viewer);
      });
    });
  });
  
  // Smooth scroll animation for internal links in modal
  document.querySelectorAll('.modal a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Close modal first
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Then scroll to target
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }
    });
  });
  
});

