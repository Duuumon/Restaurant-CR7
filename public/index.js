
function showSelection(id) {
    const sekce = document.getElementById(id);
    if (sekce) {
        sekce.scrollIntoView({ behavior: 'smooth' });
    }
}