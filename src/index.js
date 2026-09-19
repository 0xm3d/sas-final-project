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
    console.log("\n" + "=".repeat(40));
    console.log("SAS PROGRESS CONSOLE");
    console.log("=".repeat(40));
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
    console.log("=".repeat(40));

    choice = Number(prompt("What is your choice? "));
    console.log("=".repeat(40));

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

            ajouterApprenant(nom, ville);
            break;
        }

        case 4: {
            let id = Number(prompt("Student's ID: "));

            let result = rechercherApprenant(id);
            if (result.success) {
                afficherApprenant(result.apprenant);
            }
            break;
        }

        case 5: {
            let id = Number(prompt("Student's ID: "));
            let jour = Number(prompt("Day (1-7): "));
            let exercicesTermines = Number(prompt("Completed exercises: "));
            let totalExercices = Number(prompt("Total exercises: "));
            let challengeTermine = prompt("Challenge completed? (yes/no): ");

            challengeTermine = challengeTermine.toLowerCase() === "yes";

            enregistrerResultat(
                id,
                jour,
                exercicesTermines,
                totalExercices,
                challengeTermine
            );

            break
        }

        case 6: {
            let nom = prompt("Student's name: ");

            let result = rechercherApprenant(undefined, nom);
            if (result.success) {
                displayAllLearners(result.apprenants);
            }
            break;
        }

        case 7: {
    console.log("-".repeat(40));
    console.log(
        `Choose a level:
1. Solid
2. In progress
3. Needs reinforcement
0. Return to main menu`
    )
    console.log("-".repeat(40));

    let choiceTwo = Number(prompt("What is your choice? "));
    let level

    switch (choiceTwo) {
        case 1:
            level = "Solide"
            break
        case 2:
            level = "En progression"
            break
        case 3:
            level = "À renforcer"
            break
        case 0:
            break
        default:
            console.log("Invalid choice")
            break
    }

    if (choiceTwo === 0) {
        break
    }

    if (level) {
        console.log(filtrerParNiveau(level).join(", "))
    }

    break
}

        case 8: 
        displayAllLearners(trierParProgression());
        break;
    
        case 9:
        console.log(filtrerParAlphabet(apprenants).join(", "));
        break;

        case 0:
        console.log("Goodbye!");
        break

        default:
        console.log("Invalid choice. Please choose a number between 0 and 9.");
    }

    console.log("=".repeat(40));

} while (choice !== 0)