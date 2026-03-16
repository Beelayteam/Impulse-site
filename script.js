// Динамическая загрузка CSS для анимаций
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'animations.css';
document.head.appendChild(link);

const downloadBtn = document.getElementById("downloadBtn");
const downloadStatus = document.getElementById("downloadStatus");

// No theme toggle (dark-only)

// Download button (demo)
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    if (downloadStatus) downloadStatus.textContent = "Загрузка началась...";
    setTimeout(() => {
      if (downloadStatus) downloadStatus.textContent = "Файл готов к скачиванию.";
    }, 1200);
  });
}

// Cards animation + interactive hover (JS-driven)
function initCardAnimations() {
  const cards = Array.from(document.querySelectorAll('.card'));
  if (!cards.length) return;

  // initial state
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = 'transform 0.55s cubic-bezier(0.2,0.8,0.2,1), opacity 0.55s ease';
    card.style.willChange = 'transform, opacity';
  });

  // staggered reveal
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 120 + 200);
  });

  // hover parallax + JS-triggered sheen
  cards.forEach(card => {
    const rectDelta = { w: 0, h: 0 };

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      rectDelta.w = rect.width; rectDelta.h = rect.height;
      const x = (e.clientX - rect.left) / rectDelta.w - 0.5;
      const y = (e.clientY - rect.top) / rectDelta.h - 0.5;
      const rx = x * 6; // rotateY
      const ry = y * -6; // rotateX
      card.style.transform = `translateY(-8px) scale(1.02) rotateX(${ry}deg) rotateY(${rx}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
    });

    // sheen effect triggered by JS for consistent behavior
    card.addEventListener('mouseenter', () => {
      card.classList.add('shine');
      // remove class after animation time (match CSS shine duration)
      setTimeout(() => card.classList.remove('shine'), 700);
    });
  });
}

window.addEventListener('load', () => {
  // start in dark theme by default
  initCardAnimations();
});

// Expose for debugging (optional)
window._impulse = { initCardAnimations };
