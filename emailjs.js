let canSend = true; // Anti-spam zámek

function sendEmail() {
    const form = document.querySelector("#contact-form");

    // Získání hodnot
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Kontrola prázdných polí
    if (!name || !email || !message) {
        alert("Prosím vyplňte všechna pole.");
        return;
    }

    // Anti-spam kontrola
    if (!canSend) {
        alert("Počkej 10 sekund mezi odesláními. Chill, spamere.");
        return;
    }

    // Zámek na 10 sekund
    canSend = false;
    setTimeout(() => canSend = true, 10000);

    const templateParams = { name, email, message };

    emailjs.send("service_8rvuzfc", "template_kb9ut4s", templateParams)
        .then(() => {
            alert("Email byl úspěšně odeslán");
            form.reset();
        })
        .catch(() => {
            alert("Chyba, email nebyl odeslán");
            canSend = true; // Odemknout při chybě
        });
}

function copyEmail(email) {
    navigator.clipboard.writeText(email)
        .then(() => alert("Email byl zkopírován do schránky!"))
        .catch(() => alert("Chyba při kopírování."));
}