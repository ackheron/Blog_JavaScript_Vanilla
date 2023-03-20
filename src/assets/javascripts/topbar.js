console.log("hello from topbar");

/* Nous créons les références pour l'icône de menu et le menu */
const iconMobile = document.querySelector(".header-menu-icon");
const headerMenu = document.querySelector("header");

// Variable pour déterminer si le menu est ouvert ou fermé, initialement le menu est fermé
let isOpenMenu = false;

// Variable pour déterminer si le menu mobile est crée
let mobileMenuDOM;

// Un clic sur l'icône va ouvrir ou fermer le menu et empêcher la propagation à window
iconMobile.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMobileMenu();
    console.log(event);
});

/*=============================================
=            Ouverture ou fermeture du menu mobile            =
=============================================*/
const toggleMobileMenu = (event) => {
    if (isOpenMenu) {
        // Si le menu est ouvert on appelle la fonction closeMenu
        closeMenu();
    } else {
        // Si le menu est fermé on appelle la fonction openMenu
        openMenu();
    }
    // On met à jour la variable en inversant son état
    isOpenMenu = !isOpenMenu;
};
/*=====  End of Ouverture ou fermeture du menu mobile  ======*/

/*=============================================
=            Ouverture du menu mobile            =
=============================================*/
const openMenu = () => {
    //  Si le menu n'est pas crée nous le créons
    if (!mobileMenuDOM) {
        createMobileMenu();
    }
    // A l’ouverture nous lui ajoutons la classe open
    mobileMenuDOM.classList.add("open");
};
/*=====  End of Ouverture du menu mobile  ======*/

/*=============================================
=            Création et intégration du menu mobile dans le DOM            =
=============================================*/
const createMobileMenu = () => {
    mobileMenuDOM = document.createElement("div");
    mobileMenuDOM.classList.add("header-menu-mobile");
    // On empêche la fermeture du menu mobile lorsque on clique à l'intérieur
    mobileMenuDOM.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    // on copie la liste des liens du menu principal dans le menu mobile en clonant l'élément ul
    mobileMenuDOM.append(headerMenu.querySelector("ul").cloneNode(true));
    // On ajoute le nœud mobileMenuDOM dans le nœud headerMenu
    headerMenu.append(mobileMenuDOM);
};
/*=====  End of Création et intégration du menu mobile dans le DOM  ======*/

/*=============================================
=            Fermeture du menu mobile            =
=============================================*/
const closeMenu = () => {
    // Pour fermer le menu mobile il suffit de supprimer la classe open sur celui-ci
    mobileMenuDOM.classList.remove("open");
};
/*=====  End of Fermeture du menu mobile  ======*/

// Nous récupérons les clicks sur window pour fermer le menu
window.addEventListener("click", (event) => {
    if (isOpenMenu) {
        toggleMobileMenu();
    }
});

// SI la fenêtre est agrandie et qu'elle dépasse 480px de largeur alors nous fermons le menu si il est ouvert
window.addEventListener("resize", (event) => {
    if (window.innerWidth > 480 && isOpenMenu) {
        toggleMobileMenu();
    }
});
