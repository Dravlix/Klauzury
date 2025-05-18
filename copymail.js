function copyEmail(email) {
    navigator.clipboard.writeText(email)
        .then(() => alert("Email byl zkopírován do schránky!"))
        .catch(() => alert("Chyba při kopírování."));
}