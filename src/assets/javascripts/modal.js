const body = document.querySelector("body");
let calc;
let modal;

// Définit une fonction "createCalc" qui crée un élément <div> et lui ajoute une classe "calc"
// Ajoute également un écouteur d'événement "click" qui supprime l'élément <div> "calc"
const createCalc = () => {
    calc = document.createElement("div");
    calc.classList.add("calc");
    calc.addEventListener("click", () => {
        calc.remove();
    });
};

// Définit une fonction "createModal" qui crée un élément <div> et lui ajoute une classe "modal"
// Ajoute également un élément <p> contenant la question passée en paramètre
// Crée deux boutons "Annuler" et "Confirmer" et les ajoute à l'élément <div> "modal"
const createModal = (question) => {
    modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<p>${question}</p>`;

    const btnCancel = document.createElement("button");
    btnCancel.classList.add("btn", "btn-secondary");
    btnCancel.innerText = "Annuler";

    const btnConfirm = document.createElement("button");
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
}
