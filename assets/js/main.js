document.addEventListener('DOMContentLoaded', () => {
  // Tahun di footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // =====================================
  // Menambahkan Gambar Proyek
  // =====================================
  (function initProjectGrid() {
    const projects = [
      { img: 'assets/projects/istana_garuda.jpg', title: 'Istana Garuda (IKN)' },
      { img: 'assets/projects/juanda_int_airport.jpg', title: 'Bandara Juanda' },
      { img: 'assets/projects/lrt_pasar_pramuka_jakarta.jpg', title: 'LRT Pasar Pramuka, Jakarta' },
      { img: 'assets/projects/masjid_negara_ikn.jpg', title: 'Masjid Negara IKN' },
      { img: 'assets/projects/mic_medan_-_lafaz_tower.jpg', title: 'Lafaz Tower, Medan' },
      { img: 'assets/projects/new_yogyakarta_int_airport.jpg', title: 'NYIA – Yogyakarta' },
      { img: 'assets/projects/ngurah_rai_int_airport.jpg', title: 'Bandara Ngurah Rai' },
      { img: 'assets/projects/pltu_takalar_sulawesi.jpg', title: 'PLTU Takalar, Sulawesi' },
      { img: 'assets/projects/pltu_teluk_balikpapan.jpg', title: 'PLTU Teluk Balikpapan' },
      { img: 'assets/projects/pltu_timor_1_kupang.jpg', title: 'PLTU Timor 1, Kupang' },
      { img: 'assets/projects/sky_bridge_upn_surabaya.jpg', title: 'Sky Bridge UPN, Surabaya' },
      { img: 'assets/projects/tube_conveyor.jpg', title: 'Tube Conveyor' },
    ];

    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    grid.innerHTML = projects.map(p => `
      <article class="project-card" data-aos="fade-up">
        <figure class="project-thumb">
          <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.style.opacity=0.2">
        </figure>
        <div class="project-meta">
          <h3 class="project-title">${p.title}</h3>
        </div>
      </article>
    `).join('');
  })();

  // =====================================
  // HERO SLIDER (bagian paling atas)
  // =====================================
  (function initHeroSlider() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const slides = hero.querySelectorAll('.slide');
    if (slides.length === 0) return;

    // Cari slide yang sudah is-active dari HTML, default ke index 0
    let i = Array.from(slides).findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;
    slides[i].classList.add('is-active');

    const prevBtn = hero.querySelector('.slider-controls .prev');
    const nextBtn = hero.querySelector('.slider-controls .next');

    const show = (idx) => {
      slides[i].classList.remove('is-active');
      i = (idx + slides.length) % slides.length;
      slides[i].classList.add('is-active');
    };

    // Tombol prev/next
    prevBtn && prevBtn.addEventListener('click', () => {
      show(i - 1);
      reset();
    });

    nextBtn && nextBtn.addEventListener('click', () => {
      show(i + 1);
      reset();
    });

    // Autoplay
    let timer = setInterval(() => show(i + 1), 5000);
    const reset = () => {
      clearInterval(timer);
      timer = setInterval(() => show(i + 1), 5000);
    };

    // Swipe di layar sentuh - JANGAN block link <a>
    let startX = null;
    let startY = null;

    hero.addEventListener('touchstart', (e) => {
      // Kalau yang disentuh link / tombol, biarkan browser tangani (untuk klik)
      if (e.target.tagName === 'A' || e.target.closest('a')) return;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      // Kalau yang disentuh link / tombol, jangan proses swipe
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      if (startX === null || startY === null) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Hanya proses jika swipe horizontal dan jaraknya cukup
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // geser kiri → slide berikutnya
          show(i + 1);
        } else {
          // geser kanan → slide sebelumnya
          show(i - 1);
        }
        reset();
      }

      startX = null;
      startY = null;
    }, { passive: true });
  })();

  // =====================================
  // =====================================
  // CTA ROTATING BUTTONS (hero home)
  // =====================================
  (function initRotatingCta() {
    const container = document.querySelector('.page-header-home .page-actions.rotating-cta');
    if (!container) return;

    const items = Array.from(container.querySelectorAll('.rotating-cta-item'));
    if (items.length <= 1) return;

    let index = 0;
    const interval = 4000; // 4 detik

    function show(idx) {
      items.forEach((btn, i) => {
        btn.classList.toggle('is-active', i === idx);
      });
    }

    show(index);

    setInterval(() => {
      index = (index + 1) % items.length;
      show(index);
    }, interval);
  })();

  // FACILITIES SLIDER (section Fasilitas)
  // =====================================
  (function initFacilitiesSlider() {
    const root = document.querySelector('.facilities-slider');
    if (!root) return;

    const slides = root.querySelectorAll('.facility-slide');
    const dots   = root.querySelectorAll('.facilities-dots .dot');
    const prev   = root.querySelector('.fac-prev');
    const next   = root.querySelector('.fac-next');

    if (slides.length === 0) return;

    let i = Array.from(slides).findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;
    activate(i);

    function activate(idx) {
      slides.forEach(s => s.classList.remove('is-active'));
      dots.forEach(d => d.classList.remove('is-active'));

      i = (idx + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      if (dots[i]) dots[i].classList.add('is-active');
    }

    prev && prev.addEventListener('click', () => activate(i - 1));
    next && next.addEventListener('click', () => activate(i + 1));
    dots.forEach((d, idx) => d.addEventListener('click', () => activate(idx)));

    // Swipe kiri/kanan di area slider fasilitas
    let startX = null;

    root.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    root.addEventListener('touchend', (e) => {
      if (startX === null) return;

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        // geser kiri → next, geser kanan → prev
        activate(diff > 0 ? i + 1 : i - 1);
      }

      startX = null;
    }, { passive: true });
  })();
});
