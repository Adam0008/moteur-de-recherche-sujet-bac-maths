let data = {};

const chapitres = {
  "📘 ANALYSE – Fonctions": [
    "calcul de dérivée", "nombre dérivé", "dérivée", "dérivée seconde",
    "fonction croissante", "variations de fonction", "extremum", "maximum", "minimum",
    "point d'inflexion", "convexité", "fonction exponentielle", "fonction logarithme népérien",
    "signe d'une fonction", "position relative courbe–tangente", "équation de tangente",
    "lecture graphique", "valeur moyenne d'une fonction", "asymptote"
  ],
  "📗 LIMITES – CONTINUITÉ": [
    "calcul de limite", "limite de fonction", "limite de suite",
    "théorème des valeurs intermédiaires", "fonction bornée"
  ],
  "📙 INTÉGRATION": [
    "intégrale", "calcul d'intégrale", "primitive", "intégration par parties"
  ],
  "📕 ÉQUATIONS – INÉQUATIONS": [
    "équation du second degré", "équation différentielle", "équation différentielle homogène", "inéquation"
  ],
  "📐 GÉOMÉTRIE PLANE": [
    "aire de triangle", "calcul d'aire", "triangle rectangle", "calcul d'angle",
    "mesure d'angle", "coefficient directeur de droite", "équation de droite",
    "intersection de droites", "droites parallèles", "droites perpendiculaires",
    "droites sécantes", "points alignés", "points non alignés"
  ],
  "📦 GÉOMÉTRIE DANS L'ESPACE": [
    "géométrie dans l'espace", "équation de plan", "représentation paramétrique de droite",
    "droites non coplanaires", "droite et plan parallèles", "droite et plan orthogonaux",
    "plans parallèles", "plans perpendiculaires", "plans orthogonaux", "plans sécants",
    "distance d'un point à une droite", "distance point-plan", "projeté orthogonal",
    "vecteur normal", "vecteur et plan orthogonaux", "vecteurs colinéaires",
    "produit scalaire", "points coplanaires", "sphère", "volume de pyramide", "volume de tétraèdre"
  ],
  "🎲 PROBABILITÉS – STATISTIQUES": [
    "probabilités", "probabilité conditionnelle", "évènements indépendants",
    "loi binomiale", "espérance", "variance", "moyenne", "somme de variables aléatoires",
    "variable aléatoire", "inégalité de Bienaymé-Tchebychev", "inégalité de concentration",
    "arbre pondéré", "Bienaymé-Tchebychev"
  ],
  "🔢 SUITES": [
    "suite", "suite convergente", "suite divergente", "suite croissante",
    "suite décroissante", "suite géométrique"
  ],
  "🧮 DÉNOMBREMENT – COMBINATOIRE": [
    "combinatoire", "arrangements et combinaisons", "n-uplets"
  ],
  "🧠 RAISONNEMENTS – MÉTHODES": [
    "démonstration par récurrence", "raisonnement par l'absurde"
  ],
  "💻 ALGORITHMIQUE": [
    "Python"
  ]
};

// Groupes de thèmes incompatibles
const themesIncompatibles = [
  ["géométrie dans l'espace", "analyse"],
  ["probabilités", "géométrie dans l'espace"]
];

const themesAExclureParDefaut = ["Q. C. M.", "Vrai–Faux"];

const selectAnnee = document.getElementById("annee");
const obligatoiresDiv = document.getElementById("chapitres-obligatoires");
const exclusDiv = document.getElementById("chapitres-exclus");
const resultatsUl = document.getElementById("resultats");
const lienApmep = document.getElementById("lien-apmep");

const urlsApmep = {
  "2025": "https://www.apmep.fr/Annee-2025",
  "2024": "https://www.apmep.fr/Annee-2024",
  "2023": "https://www.apmep.fr/Annee-2023"
};

// Chargement du JSON
fetch("data/index.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    chargerAnnees();
  });

function chargerAnnees() {
  for (let annee in data) {
    const option = document.createElement("option");
    option.value = annee;
    option.textContent = annee;
    selectAnnee.appendChild(option);
  }
  chargerThemes();
  mettreAJourLienApmep();
}

selectAnnee.addEventListener("change", () => {
  chargerThemes();
  mettreAJourLienApmep();
});

function chargerThemes() {
  obligatoiresDiv.innerHTML = "";
  exclusDiv.innerHTML = "";

  const annee = selectAnnee.value;
  const tousLesThemes = new Set();

  // Gérer les deux formats possibles de données
  const donnees = Array.isArray(data[annee]) ? data[annee] : extrairePagesDonnees(data[annee]);

  donnees.forEach(item => {
    item.themes.forEach(t => tousLesThemes.add(t));
  });

  for (let chapitre in chapitres) {
    obligatoiresDiv.appendChild(creerChapitre(chapitre, chapitres[chapitre], "obligatoire", tousLesThemes));
  }

  const themesDisponiblesExclus = themesAExclureParDefaut.filter(t => tousLesThemes.has(t));
  themesDisponiblesExclus.forEach(theme => {
    exclusDiv.appendChild(creerCheckbox(theme, "exclu"));
  });
}

function extrairePagesDonnees(sujets) {
  const pages = [];
  for (let sujet in sujets) {
    sujets[sujet].forEach(exercice => {
      exercice.pages.forEach(page => {
        if (!pages.find(p => p.page === page)) {
          pages.push({ page, themes: exercice.themes });
        }
      });
    });
  }
  return pages;
}

function mettreAJourLienApmep() {
  const annee = selectAnnee.value;
  const url = urlsApmep[annee];
  if (url) {
    lienApmep.href = url;
    lienApmep.style.display = "inline";
  } else {
    lienApmep.style.display = "none";
  }
}

function creerChapitre(titre, themes, type, themesDisponibles) {
  const div = document.createElement("div");
  div.className = "chapitre";

  const titreLi = document.createElement("div");
  titreLi.className = "chapitre-titre";
  titreLi.innerHTML = `
    <span>${titre}</span>
    <span class="chapitre-toggle">▼</span>
  `;
  titreLi.addEventListener("click", () => {
    themesDiv.classList.toggle("collapsed");
    titreLi.querySelector(".chapitre-toggle").textContent = themesDiv.classList.contains("collapsed") ? "▶" : "▼";
  });

  const themesDiv = document.createElement("div");
  themesDiv.className = "chapitre-themes";

  themes.forEach(theme => {
    if (themesDisponibles.has(theme)) {
      themesDiv.appendChild(creerCheckbox(theme, type));
    }
  });

  div.appendChild(titreLi);
  div.appendChild(themesDiv);
  return div;
}

function creerCheckbox(theme, type) {
  const label = document.createElement("label");
  const input = document.createElement("input");

  input.type = "checkbox";
  input.value = theme;
  input.dataset.type = type;

  label.appendChild(input);
  label.append(" " + theme);
  return label;
}

document.getElementById("btn-recherche").addEventListener("click", rechercher);

function rechercher() {
  const annee = selectAnnee.value;
  const obligatoires = [...document.querySelectorAll("input[data-type='obligatoire']:checked")].map(i => i.value);
  const exclus = [...document.querySelectorAll("input[data-type='exclu']:checked")].map(i => i.value);

  const donnees = Array.isArray(data[annee]) ? data[annee] : extrairePagesDonnees(data[annee]);

  let resultats = donnees.filter(sujet =>
    obligatoires.every(t => sujet.themes.includes(t)) &&
    exclus.every(t => !sujet.themes.includes(t))
  );

  if (resultats.length === 0 && obligatoires.length > 0) {
    // Retirer automatiquement les thèmes incompatibles
    let themesFiltres = [...obligatoires];
    themesIncompatibles.forEach(groupe => {
      if (groupe.every(t => themesFiltres.includes(t))) {
        // On supprime le premier thème du groupe
        themesFiltres = themesFiltres.filter(t => !groupe.includes(t)[0]);
      }
    });

    // Approximation
    resultats = donnees.map(sujet => {
      const themesIgnorés = themesFiltres.filter(t => !sujet.themes.includes(t));
      const score = themesFiltres.length - themesIgnorés.length;
      return { ...sujet, score, themesIgnorés };
    }).filter(s => s.score > 0);

    resultats.sort((a, b) => b.score - a.score || a.page - b.page);
    afficher(resultats, annee, true);
  } else {
    afficher(resultats, annee, false);
  }
}

function afficher(resultats, annee, proche) {
  resultatsUl.innerHTML = "";

  if (resultats.length === 0) {
    resultatsUl.innerHTML = "<li>❌ Aucun sujet correspondant à votre recherche.</li>";
    return;
  }

  resultats.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>📖 Année ${annee} – Page ${s.page}</strong><br>
      Thèmes : ${s.themes.join(", ")}
      ${proche && s.themesIgnorés.length > 0 ? `<br><em>Thèmes ignorés pour ce résultat : ${s.themesIgnorés.join(", ")}</em>` : ""}
    `;
    resultatsUl.appendChild(li);
  });

  if (proche) {
    const info = document.createElement("li");
    info.innerHTML = "⚠️ Aucun sujet ne correspondait exactement à tous vos thèmes. Voici les sujets les plus proches (thèmes incompatibles ignorés).";
    info.style.fontStyle = "italic";
    resultatsUl.prepend(info);
  }
}
