import { apprenants } from "./data.js";

import {
    afficherApprenant,
    normaliserNom,
    validerResultat,
    ajouterApprenant,
    enregistrerResultat,
    rechercherApprenant,
    calculerProgression,
    filtrerParNiveau,
    trierParProgression,
    afficherTableauDeBord,
    filtrerParAlphabet
} from "./functions.js"

import promptSync from "prompt-sync";

const prompt = promptSync();

let choice;

do {
    console.log("\nSAS PROGRESS CONSOLE");
    console.log("1. Afficher le tableau de bord");
    console.log("2. Afficher la liste des apprenants");
    console.log("3. Ajouter un apprenant");
    console.log("4. Consulter un apprenant par identifiant");
    console.log("5. Ajouter ou modifier le résultat d'une journée");
    console.log("6. Rechercher un apprenant par nom");
    console.log("7. Filtrer les apprenants par niveau");
    console.log("8. Trier les apprenants par progression décroissante");
    console.log("9. Trier les apprenants par ordre alphabétique");
    console.log("0. Quitter");

    choice = Number(prompt("What is your choice? "));

    

} while (choice !== 0)