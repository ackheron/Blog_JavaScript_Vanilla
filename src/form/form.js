import axios from "axios";
import { openModal } from "../assets/javascripts/modal.js";
import "../assets/styles/main.scss";
console.log("Hello from form");

// Selection du formulaire
const form = document.querySelector("form");
// Selection de liste ul pour afficher les erreurs
const errorElement = document.querySelector("#errors");

// Selection du bouton annuler
const btnCancel = document.querySelector(".btn-secondary");

// Variable pour stocker l'id de l'url en cas de modification de l'article
let articleId;

// Variable qui stocke les données du formulaire en cours de modification
let getArticle;

/*=============================================
=            initForm            =

La fonction initForm utilise l'API URL pour récupérer les paramètres de la requête HTTP. Elle extrait la valeur du paramètre id en utilisant la méthode searchParams.get(), et stocke cette valeur dans la variable articleId.
=============================================*/

const initForm = async () => {
    const params = new URL(location.href);
    articleId = params.searchParams.get("id");
    /* Si la variable articleId est définie, la fonction utilise Axios pour effectuer une requête HTTP GET à l'URL https://restapi.fr/api/ackblog8/${articleId}. Si la réponse HTTP a un statut inférieur à 300, ce qui signifie que la requête a réussi, la fonction récupère les données de l'article à partir de la propriété data de la réponse, et appelle la fonction fillForm en passant ces données en paramètre. */
    if (articleId) {
        const response = await axios.get(`https://restapi.fr/api/ackblog8/${articleId}`);
        if (response.status < 300) {
            getArticle = response.data;
            console.log("🚀 ~ file: form.js:23 ~ initForm ~ article:", getArticle);
            fillForm(getArticle);
        }
    }
};

initForm();

/*=====  End of initForm  ======*/

/*=============================================
=            fillForm            =

La fonction fillForm récupère les éléments HTML correspondant aux différents champs du formulaire (nom de l'auteur, image, catégorie, titre et contenu), et définit leur valeur en fonction des propriétés de l'article passées en paramètre. Si une propriété n'est pas définie dans l'article, elle est remplacée par une chaîne de caractères vide.
=============================================*/

const fillForm = (article) => {
    const author = document.querySelector('input[name="author"]');
    const img = document.querySelector('input[name="img"]');
    const category = document.querySelector('input[name="category"]');
    const title = document.querySelector('input[name="title"]');
    const content = document.querySelector('textarea[name="content"]');
    author.value = article.author || "";
    img.value = article.img || "";
    category.value = article.category || "";
    title.value = article.title || "";
    content.value = article.content || "";
};

/*=====  End of fillForm  ======*/

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    /*  L'objet FormData est utilisé pour récupérer les données saisies dans un formulaire HTML. L'objet FormData est une interface standard du navigateur web qui permet de créer des paires clé/valeur à partir des champs de formulaire */
    const data = new FormData(form);

    /* la méthode entries() de l'objet formData renverra une liste itérable de paires clé/valeur  */
    const entries = data.entries();

    /* la ligne de code suivante convertit cette liste itérable en un objet JavaScript avec la méthode Object.fromEntries() */
    const formObject = Object.fromEntries(entries);

    /* MÉTHODE A AVEC FETCH
//    Appel de la fonction formIsValid pour valider saisies dans le formulaire
    if (formIsValid(formObject)) {
        try {
            const json = JSON.stringify(formObject);

            const response = await fetch("https://restapi.fr/api/ackblog2", {
                method: "POST",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
                body: json,
            });

            const body = await response.json();
            console.log("🚀 ~ file: form.js ~ line 37 ~ form.addEventListener ~ body", body);
        } catch (error) {
            console.error(error);
        }
    }
 */
    /*MÉTHODE AVEC AXIOS */
    if (formIsValid(formObject)) {
        try {
            let response;
            // Si la variable de 'articleId' est définie alors nous sommes en mode édition d'article et on utilise la méthode patch() pour mettre à jour.
            if (articleId) {
                // Nous voulons garder la date d'origine d'un article modifié, nous attribuons à la clé createdAt de formObject la valeur de createdAt de getArticle qui stocke la date originelle.
                formObject.createdAt = getArticle.createdAt;
                response = await axios.patch(`https://restapi.fr/api/ackblog8/${articleId}`, formObject);
            } else {
                // Sinon nous sommes en mode création et on utilise la méthode post()
                response = await axios.post("https://restapi.fr/api/ackblog8", formObject);
            }
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

btnCancel.addEventListener("click", async () => {
    const result = await openModal("Si vous quittez la page, vous allez perdre votre article");
    // redirection sur la page d'accueil quand l'utilisateur clique sur annuler
    if (result === true) {
        location.assign("./index.html");
    }
});

/*=============================================
=            formIsValid            =

Fonction de traitement de l'objet formObject
=============================================*/

const formIsValid = (formObject) => {
    // Tableau pour stocker les messages d'erreurs sous forme de chaines de caractères
    let errors = [];

    /* si le champ "author", "category" ou "content" est vide, un message d'erreur est ajouté au tableau errors.
    si la longueur du champ "content" est inférieure à 20 caractères, un autre message d'erreur est ajouté au tableau. */
    if (!formObject.author || !formObject.category || !formObject.content || !formObject.img || !formObject.title) {
        errors.push("Vous devez renseigner tout les champs");
    }
    if (formObject.content.length < 20) {
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

/*=====  End of formIsValid  ======*/
