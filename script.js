// Dark mode toggle
const toggle = document.getElementById('mode-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  toggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
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


  // Expand single notice full text
  document.querySelectorAll(".toggle-full").forEach(button => {
    button.addEventListener("click", () => {
      const fullDesc = button.previousElementSibling;
      fullDesc.classList.toggle("hidden");
      button.textContent = fullDesc.classList.contains("hidden") ? "View Full" : "Hide";
    });
  });

  // Show more notices logic
  const allNotices = document.querySelectorAll(".notice-card");
  const showMoreBtn = document.getElementById("show-more-notices");
  let showingAll = false;

  function updateNoticeVisibility() {
    allNotices.forEach((card, index) => {
      if (card.classList.contains("archived")) return;
      card.style.display = (!showingAll && index >= 2) ? "none" : "block";
    });
  }

  showMoreBtn.addEventListener("click", () => {
    showingAll = !showingAll;
    updateNoticeVisibility();
    showMoreBtn.textContent = showingAll ? "Show Less Notices" : "Show More Notices";
  });

  updateNoticeVisibility();

  // Toggle archived
  const archiveBtn = document.getElementById("toggle-archive");
  archiveBtn.addEventListener("click", () => {
    document.querySelectorAll(".notice-card.archived").forEach(card => {
      card.classList.toggle("hidden");
    });
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
