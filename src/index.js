import axios from "axios";
import { openModal } from "./assets/javascripts/modal.js";
import "./assets/styles/main.scss";
console.log("hello from index");
// Variable qui stocke la valeur `article.category` pour permettre le filtrage des articles
let filter;
// Variable qui stocke le tableau contenant des articles sous forme d'objets
let articles;
// Variable pour le tri par date, par défaut les articles sont triés du plus récent au plus ancient
let sortBy = "desc";
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

const createArticles = () => {
    const articlesContainerElement = document.querySelector(".articles-container");
    // Crée un fragment de document pour stocker temporairement les éléments créés.
    const fragment = new DocumentFragment();

    // Crée un élément div pour chaque article et l'ajoute au fragment.
    // Nous utilisons un new Date() afin de créer un objet Date JavaScript en lui passant en paramètre article.createdAt qui est la date enregistrer sur le serveur par l'API Rest ensuite on appelle la méthode toLocaleDateString() sur celui-ci.
    for (const article of articles) {
        // Si filter existe et que `article.category` en cour de boucle a une valeur différente de celui ci, alors l'article est ignoré pour ne créer que les articles avec la bonne category
        if (filter && article.category !== filter) {
            // le mot-clé continue est exécuté à l'intérieur d'une boucle, l'exécution de cette boucle est immédiatement interrompue et le contrôle passe à l'itération suivante.
            continue;
        }
        console.log("🚀 ~ file: index.js:6 ~ filter:", filter);
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
        // On ajoute les articles itérer dans le fragment
        fragment.append(singleArticleDOM);
    }

    // Efface le contenu de l'élément HTML sélectionné et ajoute les articles créés dans le fragment en une seule opération.
    articlesContainerElement.innerHTML = "";
    articlesContainerElement.append(fragment);

    /*----------  Supprimer un article  ----------*/

    // Récupère tous les boutons "Supprimer" créés précédemment et stocke-les dans une variable.
    const deleteButtons = articlesContainerElement.querySelectorAll(".btn-danger");

    // Ajoute un écouteur d'événements à chaque bouton "Supprimer".
    for (const button of deleteButtons) {
        button.addEventListener("click", async (event) => {
            const result = await openModal("Êtes vous sur de vouloir supprimer votre article ?");

            if (result === true) {
                // Envoie une requête DELETE à l'API REST pour supprimer l'article correspondant.
                try {
                    // Récupère le bouton cliqué et l'ID de l'article correspondant.
                    // event.target est utilisé pour récupérer l'élément DOM qui a déclenché l'événement et accéder à ses propriétés et attributs associés
                    const target = event.target;
                    // La propriété dataset est utilisée pour accéder aux attributs data-* d'un élément HTML ici pour accéder à la valeur de l'attribut data-id de l'élément HTML qui a déclenché l'événement click.
                    const articleID = target.dataset.id;
                    const response = await axios.delete(`https://restapi.fr/api/ackblog8/${articleID}`);
                    const body = response.data;
                    console.log("🚀 ~ file: index.js ~ line 115 ~ button.addEventListener ~ body", body);

                    // Actualise la liste des articles après la suppression.
                    fetchArticles();
                } catch (error) {
                    console.error(error);
                }
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
=            Affichage des catégories (Hashtag)            =

La fonction displayMenuCategories prend un tableau categoriesArr en entrée, qui est le tableau renvoyé par la fonction createMenuCategories. Elle affiche ensuite les catégories dans une liste HTML.
=============================================*/

const displayMenuCategories = (categoriesArr) => {
    // Récupération de l'élément HTML avec la classe .categories en utilisant la méthode document.querySelector().
    const categoriesContainerElement = document.querySelector(".categories");

    //la méthode map() pour transformer chaque élément du tableau categoriesArr en un élément de liste HTML (<li>).
    const liElements = categoriesArr.map((categoryElem) => {
        const li = document.createElement("li");
        // la propriété innerHTML de l'élément <li> pour ajouter du texte HTML dans chaque élément de la liste. Le texte affiche le nom de la catégorie et le nombre d'articles correspondant.
        li.innerHTML = `${categoryElem[0]} ( <strong>${categoryElem[1]}</strong> )`;
        // Si il existe un filtre, lors de la création et de l'affichage du menu des catégories on lui ajoute alors la classe active
        if (categoryElem[0] === filter) {
            li.classList.add("active");
        }

        li.addEventListener("click", () => {
            if (filter === categoryElem[0]) {
                filter = null;
                li.classList.remove("active");
            } else {
                filter = categoryElem[0];
                liElements.forEach((li) => {
                    li.classList.remove("active");
                });
                li.classList.add("active");
            }
            createArticles();
        });

        return li;
    });
    console.log("🚀 ~ file: index.js:173 ~ liElements ~ liElements:", liElements);

    categoriesContainerElement.innerHTML = "";
    // Ajout des éléments HTML `liElements` en utilisant l'opérateur de décomposition, nous pouvons étaler tous les éléments d'un tableau en une liste d'arguments pour la méthode append()
    categoriesContainerElement.append(...liElements);
};

/*=====  End of Affichage des catégories (Hashtag)  ======*/

/*=============================================
=            Récupération et traitement des catégories            =
=============================================*/

const createMenuCategories = () => {
    // L'accumulateur est initialisé à un objet vide {}, qui sera utilisé pour compter le nombre d'articles dans chaque catégorie. La valeur courante est un objet représentant un article dans le tableau articles.
    const categories = articles.reduce((accumulator, article) => {
        // La fonction de réduction teste si l'objet de l'article courant a une propriété category qui correspond à une catégorie existante dans l'accumulateur. Si c'est le cas, elle incrémente le nombre d'articles dans cette catégorie. Sinon, elle ajoute une nouvelle propriété à l'accumulateur avec le nom de la nouvelle catégorie et une valeur initiale de 1.
        if (accumulator[article.category]) {
            accumulator[article.category]++;
        } else {
            accumulator[article.category] = 1;
        }
        return accumulator;
        // Une fois que la méthode reduce() a terminé, l'objet categories contient une propriété pour chaque catégorie d'articles trouvée dans le tableau articles, avec une valeur correspondant au nombre d'articles dans cette catégorie.
    }, {});
    console.log("🚀 ~ file: index.js:178 ~ categories ~ categories:", categories);

    // la méthode Object.entries() pour transformer l'objet categories en un tableau de tableaux, où chaque sous-tableau contient le nom d'une catégorie et le nombre d'articles correspondant.
    //La fonction de rappel de la méthode map() prend chaque sous-tableau de categoriesArr comme argument, et utilise la méthode replace() pour supprimer les symboles dièse du premier élément de chaque sous-tableau
    // La fonction de rappel de la méthode sort() tri par ordre alphabétique sur la première valeur de chaque sous-tableau
    const categoriesArr = Object.entries(categories)
        .map((category) => {
            const categoryName = category[0];
            const articleCount = category[1];
            return [categoryName, articleCount];
        })
        .sort((a, b) => a[0].localeCompare(b[0]));
    //localeCompare() est une méthode de l'objet String qui permet de trier des chaînes de caractères selon l'ordre alphabétique

    console.log("🚀 ~ file: index.js:241 ~ createMenuCategories ~ categoriesArr:", categoriesArr);
    displayMenuCategories(categoriesArr);
};

/*=====  End of Récupération et traitement des catégories  ======*/

/*=============================================
=            Récupération des articles            =
=============================================*/

// Cette fonction est asynchrone et utilise l'API Axios pour récupérer des données d'un endpoint de l'API REST.
const fetchArticles = async () => {
    try {
        // Récupère les données à partir de l'API REST en utilisant l'API Axios.
        const response = await axios.get(`https://restapi.fr/api/ackblog8?sort=createdAt:${sortBy}`);
        articles = response.data;

        // Si l'objet retourné n'est pas un tableau, transforme-le en tableau.
        if (!Array.isArray(articles)) {
            articles = [articles];
        }

        // Appelle la fonction `createArticles` en lui passant le tableau `articles` pour afficher les articles récupérés sur le serveur dans la page HTML.
        createArticles();
        // Appel de la fonction `createMenuCategories en lui passant le tableau `articles` pour afficher le catégories des articles dans la sidebar de la page HTML.
        createMenuCategories();
    } catch (error) {
        // Si une erreur se produit, affiche-la dans la console.
        console.error(error);
    }
};
// Appelle la fonction `fetchArticles` pour récupérer et afficher les articles.
fetchArticles();

/*=====  End of Récupération des articles  ======*/

/*=============================================
=            Tri par date            =
=============================================*/

const sortByDate = () => {
    const selectElement = document.querySelector("select");
    selectElement.addEventListener("change", () => {
        sortBy = selectElement.value;
        fetchArticles();
    });
};
sortByDate();

/*=====  End of Tri par date  ======*/
