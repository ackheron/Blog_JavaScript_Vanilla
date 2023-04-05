import axios from "axios";
import "../assets/styles/main.scss";
console.log("Hello from form");

// Selection du formulaire
const form = document.querySelector("form");

// Selection de liste ul pour afficher les erreurs
const errorElement = document.querySelector("#errors");

// Selection du bouton annuler
const btnCancel = document.querySelector(".btn-secondary");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    /*  L'objet FormData est utilisé pour récupérer les données saisies dans un formulaire HTML. L'objet FormData est une interface standard du navigateur web qui permet de créer des paires clé/valeur à partir des champs de formulaire */
    const data = new FormData(form);

    /* la méthode entries() de l'objet formData renverra une liste itérable de paires clé/valeur  */
    const entries = data.entries();

    /* la ligne de code suivante convertit cette liste itérable en un objet JavaScript avec la méthode Object.fromEntries() */
    const formObject = Object.fromEntries(entries);

    // Appel de la fonction formIsValid pour valider saisies dans le formulaire
    // if (formIsValid(formObject)) {
    //     try {
    //         const json = JSON.stringify(formObject);

    //         const response = await fetch("https://restapi.fr/api/ackblog2", {
    //             method: "POST",
    //             headers: { Accept: "application/json", "Content-Type": "application/json" },
    //             body: json,
    //         });

    //         const body = await response.json();
    //         console.log("🚀 ~ file: form.js ~ line 37 ~ form.addEventListener ~ body", body);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    if (formIsValid(formObject)) {
        try {
            const response = await axios.post("https://restapi.fr/api/ackblog8", formObject);
            console.log("🚀 ~ file: form.js ~ line 43 ~ form.addEventListener ~ response", response);

            // Si le statut de la réponse est inférieur à 300, cela signifie qu'il n'y a pas eu d'erreurs renvoyées par le serveur.
            if (response.status < 299) {
                // alors on redirige l’utilisateur vers la page d’accueil
                location.assign("/index.html");
            }
        } catch (error) {
            console.error(error);
        }
    }
});

btnCancel.addEventListener("click", (event) => {
    event.preventDefault();
    // redirection sur la page d'accueil quand l'utilisateur clique sur annuler
    location.assign("./index.html");
});

const formIsValid = (formObject) => {
    // Tableau pour stocker les messages d'erreurs sous forme de chaines de caractères
    let errors = [];

    /* si le champ "author", "category" ou "article" est vide, un message d'erreur est ajouté au tableau errors.
    si la longueur du champ "article" est inférieure à 20 caractères, un autre message d'erreur est ajouté au tableau. */
    if (!formObject.author || !formObject.category || !formObject.article || !formObject.img || !formObject.title) {
        errors.push("Vous devez renseigner tout les champs");
    }
    if (formObject.article.length < 20) {
        errors.push("Le contenu de de votre article est trop court !");
    }
    console.log("🚀 ~ file: form.js ~ line 56 ~ formIsValid ~ errors", errors);

    /* si le tableau errors contient au moins une erreur, la fonction crée une liste HTML (<li>) pour chaque message d'erreur et l'affiche dans l'élément errorElement avec la méthode innerHTML. */
    if (errors.length) {
        let errorHTML = "";
        errors.forEach((element) => {
            errorHTML += `<li>${element}</li>`;
        });
        errorElement.innerHTML = errorHTML;
        return false;
    } else {
        errorElement.innerHTML = "";
        return true;
    }
};
