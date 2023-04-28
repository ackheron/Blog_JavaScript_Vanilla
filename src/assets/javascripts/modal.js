const body = document.querySelector("body");
let modal = document.createElement("div");
let calc = document.createElement("div");
const btnCancel = document.createElement("button");
const btnConfirm = document.createElement("button");

// Définit une fonction "createCalc" qui crée un élément <div> et lui ajoute une classe "calc"
// Ajoute également un écouteur d'événement "click" qui supprime l'élément <div> "calc"
const createCalc = () => {
    calc.classList.add("calc");
};

// Définit une fonction "createModal" qui crée un élément <div> et lui ajoute une classe "modal"
// Ajoute également un élément <p> contenant la question passée en paramètre
// Crée deux boutons "Annuler" et "Confirmer" et les ajoute à l'élément <div> "modal"
const createModal = (question) => {
    modal.classList.add("modal");
    modal.innerHTML = `<p>${question}</p>`;

    btnCancel.classList.add("btn", "btn-secondary");
    btnCancel.innerText = "Annuler";

    btnConfirm.classList.add("btn", "btn-primary");
    btnConfirm.innerText = "Confirmer";

    modal.append(btnCancel, btnConfirm);
};

// Exporte la fonction "openModal" qui prend en paramètre une question
// Appelle les fonctions "createCalc" et "createModal" pour créer les éléments nécessaires
// Ajoute l'élément <div> "modal" à l'élément <div> "calc" et l'ajoute à l'élément <body>
export function openModal(question) {
    createCalc();
    createModal(question);
    calc.append(modal);
    body.append(calc);

    /* La fonction renvoie une Promise. Nous définissons les comportements à appliquer lorsque l'utilisateur clique sur l'un des boutons ou ferme la fenêtre modale. Lorsque l'utilisateur clique sur le fond de l'arrière-plan ou sur le bouton "Annuler", la promesse est résolue avec la valeur false et la fenêtre modale et l'arrière-plan sombre sont supprimés de la page. Lorsque l'utilisateur clique sur le bouton "Confirmer", la promesse est résolue avec la valeur true et la suite du code dans index.js partie `supprimer un article` ext exécuté */
    return new Promise((resolve, reject) => {
        calc.addEventListener("click", () => {
            resolve(false);
            calc.remove();
        });
        btnCancel.addEventListener("click", () => {
            resolve(false);
            calc.remove();
        });
        btnConfirm.addEventListener("click", () => {
            resolve(true);
            calc.remove();
        });
    });
}
