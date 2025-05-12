const dovscrl = document.getElementById("dovscrl");
let scrollTimer;
let autoScrollEnabled = true;
const autoScrollDelay = 3000;
const pauseDuration = 20000;

// na klonování)
let baseImages = [...dovscrl.children];

// sirka obrazku)
const getImageWidth = () => {
  const img = dovscrl.querySelector("img");
  return img ? img.offsetWidth + 50 : 450;
};

// klonovani nakonec
function cloneImages() {
  baseImages.forEach(img => {
    const clone = img.cloneNode(true);
    dovscrl.appendChild(clone);  
    observer.observe(clone);     // Sledujeme nový obrázek
  });
}

// klonovani na zacatek
function cloneImagesAtStart() {
  const images = [...dovscrl.children];
  const newImages = images.slice(-baseImages.length);
  newImages.reverse().forEach(img => {
    const clone = img.cloneNode(true);
    dovscrl.insertBefore(clone, dovscrl.firstChild); 
    observer.observe(clone);     // Sledujeme nový obrázek
  });
}

// automatic scrooling
function scrollNext() {
  if (!autoScrollEnabled) return;

  const imageWidth = getImageWidth();
  dovscrl.scrollBy({ left: imageWidth, behavior: "smooth" });

  // pridava obrazky, kdyz blicko kraji
  if (dovscrl.scrollLeft + dovscrl.offsetWidth >= dovscrl.scrollWidth - imageWidth * 2) {
    cloneImages(); 
  }

  setTimeout(scrollNext, autoScrollDelay);
}

// zastaveni automatic scrooling
function pauseAutoScroll() {
  autoScrollEnabled = false;
  clearTimeout(scrollTimer);

  scrollTimer = setTimeout(() => {
    autoScrollEnabled = true;
    scrollNext();
  }, pauseDuration);
}

// pousuje
["wheel", "touchstart", "mousedown"].forEach(evt =>
  dovscrl.addEventListener(evt, pauseAutoScroll)
);

// pridavani obrazku
dovscrl.addEventListener("scroll", function () {
  const imageWidth = getImageWidth();

  // konec
  if (dovscrl.scrollLeft + dovscrl.offsetWidth >= dovscrl.scrollWidth - imageWidth * 2) {
    cloneImages();
  }

  // zacatek
  if (dovscrl.scrollLeft <= imageWidth) {
    cloneImagesAtStart();
    dovscrl.scrollBy({ left: imageWidth, behavior: "smooth" });
  }
});


// ZOBRAZENÍ TEXTU K OBRAZKOM


// hidden text
function hideAllText() {
  document.querySelectorAll('[id$="tx"]').forEach(div => {
    div.classList.remove('visible');
    div.classList.add('hidden');
  });
}

// který obrazek je vydet
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
      const imgId = entry.target.id;
      if (!imgId) return;
      const textDiv = document.getElementById(imgId + "tx");
      if (textDiv) {
        hideAllText();
        textDiv.classList.remove('hidden');
        textDiv.classList.add('visible');
      }
    }
  });
}, {
  root: dovscrl,
  threshold: 0.6
});

// da do observeru default obrazky
baseImages.forEach(img => observer.observe(img));



// spusteni
window.addEventListener("load", () => {
  baseImages = [...dovscrl.children];
  setTimeout(scrollNext, autoScrollDelay);
});
