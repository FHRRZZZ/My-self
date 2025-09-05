// Inisialisasi ikon Lucide
lucide.createIcons();

// Toggle sidebar untuk mobile
function toggleSidebar() {
  const sidebar = document.querySelector('aside');
  sidebar.classList.toggle('active');
  // Sesuaikan canvas saat sidebar berubah
  resizeCanvas();
  console.log("Sidebar toggled, resizing canvas");
}

// Fade-in animation on scroll menggunakan Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeEls.forEach((el) => observer.observe(el));
});

// Efek komet jatuh
const canvas = document.getElementById('comet-bg');
const comets = []; // Deklarasi comets di luar fungsi agar global
if (canvas) {
  function resizeCanvas() {
    const sidebar = document.querySelector('aside');
    const isSidebarActive = sidebar.classList.contains('active');
    const sidebarWidth = window.innerWidth <= 768 && !isSidebarActive ? 0 : 256; // 256px = 16rem
    canvas.width = window.innerWidth - sidebarWidth;
    canvas.height = window.innerHeight;
    canvas.style.left = `${sidebarWidth}px`;
    canvas.style.width = `calc(100vw - ${sidebarWidth}px)`;
    console.log("Canvas resized:", canvas.width, canvas.height); // Debug ukuran
    // Reset posisi komet saat canvas diubah ukurannya
    comets.length = 0; // Sekarang comets terdefinisi
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const ctx = canvas.getContext('2d');
  if (ctx) {
    function spawnComet() {
      // Tambahkan hingga 3 komet sekaligus
      for (let i = 0; i < 3; i++) {
        comets.push({
          x: Math.random() * canvas.width,
          y: -20,
          len: 80 + Math.random() * 40,
          speed: 4 + Math.random() * 2,
          angle: Math.PI / 4 + Math.random() * 0.2,
          alpha: 1
        });
      }
    }
    setInterval(spawnComet, 300); // Interval lebih pendek untuk komet lebih sering

    function drawComets() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let comet of comets) {
        ctx.save();
        ctx.globalAlpha = comet.alpha;
        ctx.strokeStyle = 'rgba(180, 220, 255, 0.95)';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(120, 200, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(comet.x - Math.cos(comet.angle) * comet.len, comet.y - Math.sin(comet.angle) * comet.len);
        ctx.stroke();
        ctx.restore();
        comet.x += Math.cos(comet.angle) * comet.speed;
        comet.y += Math.sin(comet.angle) * comet.speed;
        comet.alpha -= 0.008;
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        if (comets[i].y > canvas.height || comets[i].alpha <= 0) comets.splice(i, 1);
      }
      requestAnimationFrame(drawComets);
    }
    drawComets();
    console.log("Comet animation started"); // Debug apakah animasi berjalan
  } else {
    console.error("Canvas context not available");
  }
} else {
  console.error("Canvas element not found");
}