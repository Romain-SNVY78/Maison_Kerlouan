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

  let allImages = [];
  let currentIndex = 0;

  function buildAllImages() {
    allImages = [];
    const allFigs = document.querySelectorAll('.card-gallery');
    
    allFigs.forEach(fig => {
      const images = fig.dataset.images ? fig.dataset.images.split('|') : [fig.querySelector('img').src];
      const caption = fig.querySelector('figcaption')?.textContent || '';
      
      images.forEach(imgSrc => {
        allImages.push({
          src: imgSrc,
          caption: caption
        });
      });
    });
  }

  function openGallery(startIndex = 0) {
    buildAllImages();
    currentIndex = startIndex;
    overlay.classList.add('show');
    showImage();
  }

  function showImage() {
    if (!allImages.length) return;
    const img = allImages[currentIndex];
    imgEl.src = img.src;
    captionEl.textContent = img.caption;
  }

  function closeGallery() {
    overlay.classList.remove('show');
    imgEl.src = '';
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % allImages.length;
    showImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    showImage();
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
  document.querySelectorAll('.card-gallery').forEach((fig, figIndex) => {
    fig.style.cursor = 'zoom-in';
    fig.addEventListener('click', e => {
      e.preventDefault();
      buildAllImages();
      
      // Trouve l'index de la première image de cette galerie
      let imageIndex = 0;
      let count = 0;
      const allFigs = document.querySelectorAll('.card-gallery');
      
      for (let i = 0; i < allFigs.length; i++) {
        if (allFigs[i] === fig) {
          imageIndex = count;
          break;
        }
        const images = allFigs[i].dataset.images ? allFigs[i].dataset.images.split('|') : [allFigs[i].querySelector('img').src];
        count += images.length;
      }
      
      openGallery(imageIndex);
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

// ——— 5. Calculateur de tarifs
const checkInInput = document.getElementById('checkIn');
const priceDisplay = document.getElementById('priceDisplay');

if (checkInInput) {
  // Définir la date d'aujourd'hui par défaut
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  checkInInput.value = `${year}-${month}-${day}`;

  // Tarifs par saison
  const seasons = {
    'basse': { name: 'Basse saison', price: 590, months: [0, 1, 2, 10, 11] }, // Jan, Fev, Mars, Nov, Dec
    'moyenne': { name: 'Moyenne saison', price: 730, months: [3, 4, 5, 8, 9] }, // Avr, Mai, Juin, Sept, Oct
    'haute': { name: 'Haute saison', price: 950, months: [6, 7] } // Juil, Aout
  };

  function updatePrice() {
    const dateValue = checkInInput.value;
    if (!dateValue) return;

    const date = new Date(dateValue);
    const month = date.getMonth();

    // Trouver la saison
    let currentSeason = null;
    for (let season in seasons) {
      if (seasons[season].months.includes(month)) {
        currentSeason = seasons[season];
        break;
      }
    }

    if (currentSeason) {
      const seasonNameEl = priceDisplay.querySelector('.season-name');
      const seasonPriceEl = priceDisplay.querySelector('.season-price');
      
      seasonNameEl.textContent = currentSeason.name;
      seasonPriceEl.textContent = currentSeason.price;
    }
  }

  // Mettre à jour les prix au changement de date
  checkInInput.addEventListener('change', updatePrice);
  
  // Initialiser au chargement
  updatePrice();
}

console.log("✅ Ty Pierrot – JS chargé avec succès");
