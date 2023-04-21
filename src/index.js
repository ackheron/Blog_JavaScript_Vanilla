import axios from "axios";
import "./assets/styles/main.scss";

console.log("hello from index");
/*=============================================
=            PREMIERE VERSION AVEC MÉTHODE .MAP()          =
=============================================*/

// // Sélectionne l'élément HTML qui a une classe de `articles-container` et le stocke dans une variable `articlesContainerElement`.
// const articlesContainerElement = document.querySelector(".articles-container");

// // Cette fonction prend un tableau d'articles en paramètre et crée un élément HTML pour chaque article.
// const createArticles = (articles) => {
//     // Crée un tableau contenant tous les éléments div créés pour chaque article.

//     const articlesDOM = articles.map((article) => {
//         // Crée un nouveau div pour chaque article.
//         const singleArticleDOM = document.createElement("div");
//         // Ajoute une classe `article` au div créé.
//         singleArticleDOM.classList.add("article");
//         // Définit le contenu HTML de la div créé en utilisant les propriétés de l'objet article passé en paramètre.
//         singleArticleDOM.innerHTML = `
//                         <img class="article-profile" src="${article.img}" alt="profile" />
//                         <h2 class="article-title">${article.title}</h2>
//                         <p class="article-author">${article.author}</p>
//                         <p class="article-content">
//                         ${article.article}
//                         </p>
//                         <div class="article-actions">
//                             <button class="btn btn-danger data-id=${article._id}">Supprimer</button>
//                             <button class="btn btn-primary">Modifier</button>
//                         </div>
//        `;
//         // Retourne la div créé.
//         return singleArticleDOM;
//     });
//     // Efface le contenu de l'élément HTML sélectionné.
//     articlesContainerElement.innerHTML = "";
//     // Ajoute les éléments div créés dans l'élément HTML sélectionné.
//     articlesContainerElement.append(...articlesDOM);
// };

// // Cette fonction est asynchrone et utilise l'API Fetch pour récupérer des données d'un endpoint de l'API REST.
// const fetchArticles = async () => {
//     try {
//         // Récupère les données à partir de l'API REST en utilisant l'API Fetch.
//         const response = await fetch("https://restapi.fr/api/ackblog");
//         // Convertit les données retournées en objet JavaScript.
//         let articles = await response.json();

//         // Restapi retourne un objet s'il n'y a qu'un seul article
//         // nous devons donc le transformer en tableau :
//         if (!Array.isArray(articles)) {
//             articles = [articles];
// console.log("🚀 ~ file: index.js ~ line 15 ~ fetchArticles ~ articles", articles);
//         }
//         // Appelle la fonction `createArticles` pour afficher les articles récupérés dans la page HTML.
//         createArticles(articles);
// console.log("🚀 ~ file: index.js ~ line 41 ~ fetchArticles ~ articles", articles);
//     } catch (error) {
//         console.error(error);
//     }
// };

// fetchArticles();

// ********************************************************************************************

/*=============================================
=            SECONDE VERSION AVEC DOCUMENTFRAGMENT ET BOUCLE FOR OF           =
=============================================*/
// Les améliorations apportées incluent l'utilisation d'un DocumentFragment pour stocker temporairement les éléments créés avant de les ajouter à la page, ainsi que l'utilisation d'une boucle for...of pour itérer sur le tableau d'articles plutôt que map. La boucle for...of est généralement plus performante pour l'itération sur les tableaux car elle évite de créer un nouveau tableau.

/*=============================================
=            Création, suppression et modification des articles            =
=============================================*/

// Cette fonction prend un tableau d'articles en paramètre et crée un élément HTML pour chaque article.
const createArticles = (articles) => {
    const articlesContainerElement = document.querySelector(".articles-container");
    // Crée un fragment de document pour stocker temporairement les éléments créés.
    const fragment = new DocumentFragment();

    // Crée un élément div pour chaque article et l'ajoute au fragment.
    // Nous utilisons un new Date() afin de créer un objet Date JavaScript en lui passant en paramètre article.createdAt qui est la date enregistrer sur le serveur par l'API Rest ensuite on appelle la méthode toLocaleDateString() sur celui-ci.
    for (const article of articles) {
        const singleArticleDOM = document.createElement("div");
        singleArticleDOM.classList.add("article");
        singleArticleDOM.innerHTML = `
        <img class="article-profile" src="${article.img}" alt="profile" />
      <h2 class="article-title">${article.title}</h2>
      <p class="article-author">${article.author}</p>
      <p class="article-category">${new Date(article.createdAt).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
      })}</p>
      <p class="article-content">
      ${article.content}
      </p>
      <div class="article-actions">
      <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
      <button class="btn btn-primary" data-id=${article._id}>Modifier</button>
      </div>
      `;
        fragment.prepend(singleArticleDOM);
        // prepend au lieu de append ajoute les éléments dans l'ordre inverse de l'itération de la boucle et donc d'avoir les articles les plus récents en haut de page.
    }

    // Efface le contenu de l'élément HTML sélectionné et ajoute les éléments créés en une seule opération.
    articlesContainerElement.innerHTML = "";
    articlesContainerElement.append(fragment);

    /*----------  Supprimer un article  ----------*/

    // Récupère tous les boutons "Supprimer" créés précédemment et stocke-les dans une variable.
    const deleteButtons = articlesContainerElement.querySelectorAll(".btn-danger");

    // Ajoute un écouteur d'événements à chaque bouton "Supprimer".
    for (const button of deleteButtons) {
        button.addEventListener("click", async (event) => {
            // Récupère le bouton cliqué et l'ID de l'article correspondant.
            // event.target est utilisé pour récupérer l'élément DOM qui a déclenché l'événement et accéder à ses propriétés et attributs associés
            const target = event.target;
            // La propriété dataset est utilisée pour accéder aux attributs data-* d'un élément HTML ici pour accéder à la valeur de l'attribut data-id de l'élément HTML qui a déclenché l'événement click.
            const articleID = target.dataset.id;

            // Envoie une requête DELETE à l'API REST pour supprimer l'article correspondant.
            try {
                const response = await axios.delete(`https://restapi.fr/api/ackblog8/${articleID}`);
                const body = response.data;
                console.log("🚀 ~ file: index.js ~ line 115 ~ button.addEventListener ~ body", body);

                // Actualise la liste des articles après la suppression.
                fetchArticles();
            } catch (error) {
                console.error(error);
            }
        });
    }

    /*----------  Modifier un article  ----------*/

    // Récupère tous les boutons "Modifier" créés précédemment et stocke-les dans une variable
    const editButtons = articlesContainerElement.querySelectorAll(".btn-primary");

    // Ajoute un écouteur d'événements à chaque bouton "Modifier"
    for (const button of editButtons) {
        button.addEventListener("click", (event) => {
            // Récupère le bouton cliqué et l'ID de l'article correspondant.
            // event.target est utilisé pour récupérer l'élément DOM qui a déclenché l'événement et accéder à ses propriétés et attributs associés
            const target = event.target;
            // La propriété dataset est utilisée pour accéder aux attributs data-* d'un élément HTML ici pour accéder à la valeur de l'attribut data-id de l'élément HTML qui a déclenché l'événement click.
            const articleId = target.dataset.id;
            // Redirection vers le formulaire avec la valeurs `articleId` de l'article a modifier
            location.assign(`/form.html?id=${articleId}`);
        });
    }
};
/*=====  End of Création, suppression et modification des articles  ======*/

/*=============================================
=            Récupération des articles            =
=============================================*/

// Cette fonction est asynchrone et utilise l'API Fetch pour récupérer des données d'un endpoint de l'API REST.
const fetchArticles = async () => {
    try {
        // Récupère les données à partir de l'API REST en utilisant l'API Fetch.
        const response = await axios.get("https://restapi.fr/api/ackblog8");
        let articles = response.data;

        // Si l'objet retourné n'est pas un tableau, transforme-le en tableau.
        if (!Array.isArray(articles)) {
            articles = [articles];
        }

        // Appelle la fonction `createArticles` pour afficher les articles récupérés dans la page HTML.
        createArticles(articles);
    } catch (error) {
        // Si une erreur se produit, affiche-la dans la console.
        console.error(error);
    }
};

/*=====  End of Récupération des articles  ======*/

// Appelle la fonction `fetchArticles` pour récupérer et afficher les articles.
fetchArticles();
