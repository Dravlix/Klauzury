const toggleButton = document.getElementById('toggleButton');
const closeButton = document.getElementById('closeButton');
const sidenav = document.querySelector('.sidenav');

// Funkce pro zjištění, jestli je orientace portrait
function isPortrait() {
    return window.matchMedia("(orientation: portrait)").matches;
}

toggleButton.addEventListener('click', () => {
    if (!isPortrait()) return; // Pokud není portrait, neprováděj kód

    sidenav.style.top = `${window.scrollY}px`;

    sidenav.classList.remove('animate-close');
    sidenav.classList.add('animate-open');

    toggleButton.style.display = 'none';
    closeButton.style.display = 'block';

    sidenav.style.zIndex = 50;
    document.body.style.overflow = 'hidden';
});

closeButton.addEventListener('click', () => {
    if (!isPortrait()) return; // Taky kontrola při zavírání

    sidenav.classList.remove('animate-open');
    sidenav.classList.add('animate-close');

    closeButton.style.display = 'none';
    toggleButton.style.display = 'block';
    document.body.style.overflow = '';

    setTimeout(() => {
        sidenav.classList.remove('animate-close');
        sidenav.style.zIndex = -10;
        sidenav.style.pointerEvents = "none";
    }, 500);
});
