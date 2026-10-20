// ---------- Réglages ----------
const NOMBRE_MIN_AUTORISE = 1;
const NOMBRE_MAX_AUTORISE = 20;
const CHANCE_IMAGE_RARE = 0.05;   // 5 % de chances pour chacune des deux images rares (-1.png et 0.png)
const MARGE_SANS_MAX = 60;        // si "max" est vide (infini) : max = min + 60

// ---------- Variables ----------
let dernierNombre = null;
let dernierTemps = null;
let intervalleTimer = null;

// valeurs figées au moment du clic sur DÉMARRER
let maxNombre = NOMBRE_MAX_AUTORISE;
let minTemps = 1;
let maxTemps = 1 + MARGE_SANS_MAX;

// ---------- Outils ----------
function entierAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// renvoie -1 (5 %), 0 (5 %) ou null (90 %) : même probabilité pour nombre et temps
function tirerImageRare() {
    const r = Math.random();
    if (r < CHANCE_IMAGE_RARE) return -1;
    if (r < 2 * CHANCE_IMAGE_RARE) return 0;
    return null;
}

// ---------- Choix du mode ----------
function choixNombre(){
    const div_choix = document.querySelector('#choix');
    const div_nombre = document.querySelector('#nombre');

    div_choix.style.display = "none";
    div_nombre.style.display = "block";
}

function choixTemps(){
    const div_choix = document.querySelector('#choix');
    const div_temps = document.querySelector('#temps');

    div_choix.style.display = "none";
    div_temps.style.display = "block";
}

function retour() {
    const div_choix = document.querySelector('#choix');
    const div_temps = document.querySelector('#temps');
    const div_nombre = document.querySelector('#nombre');

    // on arrête le timer et on remet les zones à zéro
    clearInterval(intervalleTimer);
    document.querySelector('#jeu_nombre').style.visibility = "hidden";
    document.querySelector('#jeu_temps').style.visibility = "hidden";
    document.querySelector('#img_nombre').removeAttribute('src');
    document.querySelector('#img_temps').style.visibility = "hidden";
    document.querySelector('#affichage_timer').textContent = "";

    div_choix.style.display = "block";
    div_temps.style.display = "none";
    div_nombre.style.display = "none";
}

// ---------- Partie NOMBRE ----------
function demarrerNombre(){
    const max = parseInt(document.querySelector('#max_nombre').value);

    if (isNaN(max) || max < NOMBRE_MIN_AUTORISE || max > NOMBRE_MAX_AUTORISE) {
        alert("Choisis un max entre " + NOMBRE_MIN_AUTORISE + " et " + NOMBRE_MAX_AUTORISE + ".");
        return;
    }

    maxNombre = max;
    dernierNombre = null;
    document.querySelector('#jeu_nombre').style.visibility = "visible";
    suivantNombre();
}

function suivantNombre(){
    let image;

    // on tire jusqu'à obtenir une image différente de la précédente
    do {
        const rare = tirerImageRare();
        image = (rare !== null) ? rare : entierAleatoire(NOMBRE_MIN_AUTORISE, maxNombre);
    } while (image === dernierNombre);

    dernierNombre = image;
    document.querySelector('#img_nombre').src = "img/" + image + ".png";
}

// ---------- Partie TEMPS ----------
function demarrerTemps(){
    const min = parseInt(document.querySelector('#min_temps').value);
    const champMax = document.querySelector('#max_temps').value.trim();
    const max = champMax === "" ? min + MARGE_SANS_MAX : parseInt(champMax);

    if (isNaN(min) || isNaN(max) || min < 1 || min > max) {
        alert("Choisis un min d'au moins 1 seconde et un max supérieur ou égal au min (ou laisse le max vide).");
        return;
    }

    minTemps = min;
    maxTemps = max;
    dernierTemps = null;
    document.querySelector('#jeu_temps').style.visibility = "visible";
    suivantTemps();
}

function suivantTemps(){
    const affichage = document.querySelector('#affichage_timer');
    const img = document.querySelector('#img_temps');

    // on arrête le timer précédent
    clearInterval(intervalleTimer);

    // rarement : une image (-1.png ou 0.png) à la place du timer
    const rare = tirerImageRare();
    if (rare !== null) {
        img.src = "img/" + rare + ".png";
        img.style.visibility = "visible";
        affichage.textContent = "";
        return;
    }

    // sinon : un timer aléatoire différent du précédent (possible seulement si min < max)
    img.style.visibility = "hidden";

    let secondes = entierAleatoire(minTemps, maxTemps);
    if (maxTemps > minTemps) {
        while (secondes === dernierTemps) {
            secondes = entierAleatoire(minTemps, maxTemps);
        }
    }
    dernierTemps = secondes;

    let restant = secondes;
    affichage.textContent = restant + " s";

    intervalleTimer = setInterval(function () {
        restant--;
        affichage.textContent = restant + " s";
        if (restant <= 0) {
            clearInterval(intervalleTimer);
        }
    }, 1000);
}