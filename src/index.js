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
    filtrerParAlphabet,
    displayAllLearners
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

    switch (choice) {

        case 1:
            afficherTableauDeBord();
            break;

        case 2:
            displayAllLearners(apprenants);
            break;

        case 3: {
            let nom = prompt("Student's name: ");
            let ville = prompt("Student's city: ");

            console.log(ajouterApprenant(nom, ville));
            break;
        }

        case 4: {
            let id = Number(prompt("Student's ID: "));

            console.log(rechercherApprenant(id));
            break;
        }

        case 5: {
            let id = Number(prompt("Student's ID: "));
            let jour = Number(prompt("Day (1-7): "));
            let exercicesTermines = Number(prompt("Completed exercises: "));
            let totalExercices = Number(prompt("Total exercises: "));
            let challengeTermine = prompt("Challenge completed? (yes/no): ");

            challengeTermine = challengeTermine.toLowerCase() === "yes";

            console.log(
                enregistrerResultat(
                    id,
                    jour,
                    exercicesTermines,
                    totalExercices,
                    challengeTermine
                )
            )

            break
        }

        case 6: {
            let nom = prompt("Student's name: ");

            console.log(rechercherApprenant(undefined, nom));
            break;
        }

        case 7: {
            let niveau = prompt(
                "Level (Solide / En progression / À renforcer): "
            )

            console.log(filtrerParNiveau(niveau));
            break
        }

        case 8:
            console.log(trierParProgression());
            break;

        case 9:
            console.log(filtrerParAlphabet(apprenants));
            break;

        case 0:
            console.log("Goodbye!");
            break

        default:
            console.log("Invalid choice. Please choose a number between 0 and 9.");
    }

} while (choice !== 0)