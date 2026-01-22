/* =======================================================
   main.js — version finale corrigée pour Ty Pierrot
   ======================================================= */

// ——— 1. Menu burger (responsive)
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

if (burger && menu) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ——— 2. Année du footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ——— 3. Lightbox galerie améliorée
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Fermer">×</button>
    <button class="lb-prev" aria-label="Précédent">‹</button>
    <img class="lb-img" alt="">
    <button class="lb-next" aria-label="Suivant">›</button>
    <div class="lb-caption"></div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lb-img');
  const captionEl = overlay.querySelector('.lb-caption');
  const prevBtn = overlay.querySelector('.lb-prev');
  const nextBtn = overlay.querySelector('.lb-next');
  const closeBtn = overlay.querySelector('.lb-close');

  let galleryImages = [];
  let currentIndex = 0;

  function openGallery(images, caption, startIndex = 0) {
    galleryImages = images;
    currentIndex = startIndex;
    overlay.classList.add('show');
    showImage();
  }

  function showImage() {
    if (!galleryImages.length) return;
    imgEl.src = galleryImages[currentIndex];
    captionEl.textContent = captionEl.dataset.caption || '';
  }

  function closeGallery() {
    overlay.classList.remove('show');
    imgEl.src = '';
  }

  // Navigation
  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    imgEl.src = galleryImages[currentIndex];
  }
  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    imgEl.src = galleryImages[currentIndex];
  }

  prevBtn.addEventListener('click', e => { e.stopPropagation(); prevImage(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); nextImage(); });
  closeBtn.addEventListener('click', closeGallery);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeGallery(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('show')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Activation sur clic d’une figure
  document.querySelectorAll('.card-gallery').forEach(fig => {
    fig.style.cursor = 'zoom-in';
    fig.addEventListener('click', e => {
      e.preventDefault();
      const images = fig.dataset.images ? fig.dataset.images.split('|') : [fig.querySelector('img').src];
      const caption = fig.querySelector('figcaption')?.textContent || '';
      captionEl.dataset.caption = caption;
      openGallery(images, caption, 0);
    });
  });
})();

// ——— 4. Formulaires mailto (inchangé)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nom = document.getElementById('nom')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const msg = document.getElementById('msg')?.value || '';
    const body = encodeURIComponent(`Nom : ${nom}\nEmail : ${email}\n\n${msg}`);
    const mailto = `mailto:contact@ty-pierrot.fr?subject=Contact via site&body=${body}`;
    window.location.href = mailto;
  });
}

const bookForm = document.getElementById('book');
if (bookForm) {
  bookForm.addEventListener('submit', e => {
    e.preventDefault();
    const a = document.getElementById('arrivee')?.value;
    const d = document.getElementById('depart')?.value;
    if (a && d && a >= d) {
      alert("La date de départ doit être postérieure à la date d'arrivée.");
      return;
    }

    const adultes = document.getElementById('adultes')?.value || '';
    const enfants = document.getElementById('enfants')?.value || '';
    const message = document.getElementById('message')?.value || '';

    const body = encodeURIComponent(
      `Bonjour,\n\nJe souhaite réserver Ty Pierrot :\n- Arrivée : ${a}\n- Départ : ${d}\n- Adultes : ${adultes}\n- Enfants : ${enfants}\n\n${message}`
    );
    const subject = encodeURIComponent('Demande de disponibilité – Ty Pierrot');
    window.location.href = `mailto:contact@ty-pierrot.fr?subject=${subject}&body=${body}`;
  });
}

console.log("✅ Ty Pierrot – JS chargé avec succès (lightbox corrigée)");
