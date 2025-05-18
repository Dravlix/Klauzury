const dovscrl = document.getElementById("dovscrl");
let baseImages = [...dovscrl.children];

// ....vrací šířku obrázku včetně mezery (odhad defaultně 200 + 60 pokud neexistuje žádný obrázek)....
const getImageWidth = () => (dovscrl.querySelector("img")?.offsetWidth || 200) + 60;

function cloneImages() {
  baseImages.forEach(img => {
    const clone = img.cloneNode(true);
    dovscrl.appendChild(clone);
    observer.observe(clone);
  });
}

function cloneImagesAtStart() {
  const newImages = [...dovscrl.children].slice(-baseImages.length).reverse();
  newImages.forEach(img => {
    const clone = img.cloneNode(true);
    dovscrl.insertBefore(clone, dovscrl.firstChild);
    observer.observe(clone);
  });
}

// ....skryje všechny textové bloky....
function hideAllText() {
  document.querySelectorAll('[id$="tx"]').forEach(div => {
    div.classList.remove('visible');
    div.classList.add('hidden');
  });
}

// ....používá se hlavně kvůli lazy-loadu, ale popisky už neřeší....
const observer = new IntersectionObserver(() => {}, {
  root: dovscrl,
  threshold: 0.6
});

let autoScrollEnabled = false;
let scrollTimer;
const autoScrollDelay = 3000;
const pauseDuration = 5000;

function scrollNext() {
  if (!autoScrollEnabled) return;

  const imageWidth = getImageWidth();
  dovscrl.scrollBy({ left: imageWidth, behavior: "smooth" });

  if (dovscrl.scrollLeft + dovscrl.offsetWidth >= dovscrl.scrollWidth - imageWidth * 2) {
    cloneImages();
  }

  scrollTimer = setTimeout(scrollNext, autoScrollDelay);
}

function pauseAutoScroll() {
  autoScrollEnabled = false;
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    autoScrollEnabled = true;
    scrollNext();
  }, pauseDuration);
}

function scrollLeft() {
  pauseAutoScroll();
  const imageWidth = getImageWidth();

  if (dovscrl.scrollLeft <= imageWidth + 5) {
    const prevScrollWidth = dovscrl.scrollWidth;
    const prevScrollLeft = dovscrl.scrollLeft;

    cloneImagesAtStart();

    requestAnimationFrame(() => {
      const delta = dovscrl.scrollWidth - prevScrollWidth;
      dovscrl.scrollLeft = prevScrollLeft + delta;
      dovscrl.scrollBy({ left: -imageWidth, behavior: "smooth" });
    });
  } else {
    dovscrl.scrollBy({ left: -imageWidth, behavior: "smooth" });
  }
}

function scrollRight() {
  pauseAutoScroll();
  const imageWidth = getImageWidth();

  if (dovscrl.scrollLeft + dovscrl.offsetWidth >= dovscrl.scrollWidth - imageWidth * 2) {
    cloneImages();
  }

  dovscrl.scrollBy({ left: imageWidth, behavior: "smooth" });
}

// ....najde obrázek nejblíže středu a zobrazí k němu popisek....
function updateCenteredImage() {
  const containerRect = dovscrl.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  let closestImg = null;
  let closestDistance = Infinity;

  [...dovscrl.children].forEach(img => {
    const imgRect = img.getBoundingClientRect();
    const imgCenter = imgRect.left + imgRect.width / 2;
    const distance = Math.abs(containerCenter - imgCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestImg = img;
    }
  });

  if (closestImg) {
    const imgId = closestImg.id;
    const textDiv = document.getElementById(imgId + "tx");
    if (textDiv) {
      hideAllText();
      textDiv.classList.remove("hidden");
      textDiv.classList.add("visible");
    }
  }
}

// ....při každém scrollu zkontroluj co je uprostřed....
dovscrl.addEventListener("scroll", updateCenteredImage);

// ....přidej funkci pro klikání na šipky vlevo a vpravo....
document.querySelectorAll(".toleft").forEach(btn => btn.onclick = scrollLeft);
document.querySelectorAll(".toright").forEach(btn => btn.onclick = scrollRight);

// ....zaregistruj původní obrázky do IntersectionObserveru....
baseImages.forEach(img => observer.observe(img));

// ....při načtení stránky zarovnej první obrázek doprostřed a spusť autoscroll....
window.addEventListener("load", () => {
  baseImages = [...dovscrl.children];

  const firstImg = dovscrl.querySelector("img");
  if (firstImg) {
    const scrollTo = firstImg.offsetLeft - (dovscrl.offsetWidth - firstImg.offsetWidth) / 2;
    dovscrl.scrollLeft = scrollTo;
  }

  updateCenteredImage();

  setTimeout(() => {
    autoScrollEnabled = true;
    scrollNext();
  }, 2000);
});
