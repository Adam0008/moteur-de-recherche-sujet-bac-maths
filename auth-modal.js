(function () {
  const navConnexion = document.getElementById("nav-connexion");
  const modal = document.getElementById("auth-modal");
  const titre = document.getElementById("auth-modal-titre");
  const formConnexion = document.getElementById("auth-form-connexion");
  const formInscription = document.getElementById("auth-form-inscription");
  const goInscription = document.getElementById("auth-go-inscription");
  const goConnexion = document.getElementById("auth-go-connexion");
  const closeBtn = modal ? modal.querySelector(".auth-modal-close") : null;
  const overlay = modal ? modal.querySelector(".auth-modal-overlay") : null;

  if (!modal) return;

  function ouvrirConnexion() {
    titre.textContent = "Connexion";
    formConnexion.classList.remove("auth-form-hidden");
    formInscription.classList.add("auth-form-hidden");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("auth-email").focus();
  }

  function ouvrirInscription() {
    titre.textContent = "Créer un compte";
    formConnexion.classList.add("auth-form-hidden");
    formInscription.classList.remove("auth-form-hidden");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("auth-nom").focus();
  }

  function fermer() {
    modal.setAttribute("aria-hidden", "true");
  }

  if (navConnexion) {
    navConnexion.addEventListener("click", function (e) {
      e.preventDefault();
      ouvrirConnexion();
    });
  }

  if (goInscription) {
    goInscription.addEventListener("click", ouvrirInscription);
  }

  if (goConnexion) {
    goConnexion.addEventListener("click", ouvrirConnexion);
  }

  if (closeBtn) closeBtn.addEventListener("click", fermer);
  if (overlay) overlay.addEventListener("click", fermer);

  formConnexion.addEventListener("submit", function (e) {
    e.preventDefault();
    fermer();
  });

  formInscription.addEventListener("submit", function (e) {
    e.preventDefault();
    var p1 = document.getElementById("auth-password-inscription").value;
    var p2 = document.getElementById("auth-password-confirm").value;
    if (p1 !== p2) {
      var confirmEl = document.getElementById("auth-password-confirm");
      confirmEl.setCustomValidity("Les mots de passe ne correspondent pas.");
      confirmEl.reportValidity();
      return;
    }
    document.getElementById("auth-password-confirm").setCustomValidity("");
    fermer();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      fermer();
    }
  });

  var showConnexion = document.getElementById("auth-show-password-connexion");
  var passConnexion = document.getElementById("auth-password");
  if (showConnexion && passConnexion) {
    showConnexion.addEventListener("change", function () {
      passConnexion.type = showConnexion.checked ? "text" : "password";
    });
  }

  var showInscription = document.getElementById("auth-show-password-inscription");
  var passInscription = document.getElementById("auth-password-inscription");
  var passConfirm = document.getElementById("auth-password-confirm");
  if (showInscription && passInscription && passConfirm) {
    showInscription.addEventListener("change", function () {
      var visible = showInscription.checked;
      passInscription.type = visible ? "text" : "password";
      passConfirm.type = visible ? "text" : "password";
    });
  }
})();
