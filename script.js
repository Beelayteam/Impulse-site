// Динамическая загрузка CSS для анимаций
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'animations.css';
document.head.appendChild(link);

const downloadBtn = document.getElementById("downloadBtn");
const downloadStatus = document.getElementById("downloadStatus");

// No theme toggle (dark-only)

// Download button — fetch file from URL (needs CORS enabled on host)
async function downloadFileFromUrl(url, suggestedName, redirectAfter = '/') {
  if (!url) return;
  try {
    if (downloadStatus) downloadStatus.textContent = 'Starting download...';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');

    const blob = await res.blob();
    // try to get filename from headers if not provided
    let filename = suggestedName;
    const cd = res.headers.get('content-disposition');
    if (!filename && cd) {
      const m = /filename\*=UTF-8''(.+)$/.exec(cd) || /filename="?([^\";]+)"?/.exec(cd);
      if (m) filename = decodeURIComponent(m[1]);
    }
    if (!filename) filename = 'download.bin';

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // revoke after a short delay to ensure download started
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);

    if (downloadStatus) downloadStatus.textContent = 'Download started';

    // Redirect back to site (user requested immediate redirect once install/download starts)
    if (redirectAfter) {
      try {
        // slight delay to let browser start saving
        setTimeout(() => { window.location.href = redirectAfter; }, 600);
      } catch (e) {
        console.warn('Redirect failed', e);
      }
    }
  } catch (err) {
    console.error(err);
    if (downloadStatus) downloadStatus.textContent = 'Download failed';
  }
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    const url = downloadBtn.getAttribute('data-file-url');
    const name = downloadBtn.getAttribute('data-file-name');
    const redirect = downloadBtn.getAttribute('data-redirect') || '/';
    // If you prefer a direct link (no JS) you can set <a href> to the file URL instead.
    // Try fetch/download first. If fetch fails (CORS/401), fallback to opening raw link in new tab.
    downloadFileFromUrl(url, name, redirect).catch(() => {
      // fallback: open raw link and redirect immediately
      window.open(url, '_blank');
      window.location.href = redirect;
    });
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
