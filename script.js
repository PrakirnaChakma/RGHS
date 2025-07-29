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

