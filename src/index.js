import { learners } from "./data.js";

import {
    displayLearner,
    normalizeName,
    validateResult,
    addLearner,
    saveResult,
    searchLearner,
    calculateProgression,
    filterByLevel,
    sortByProgression,
    displayDashboard,
    sortAlphabetically,
    displayAllLearners
} from "./functions.js"

import promptSync from "prompt-sync";

const prompt = promptSync();

let choice;

do {
    console.log("\n" + "=".repeat(40));
    console.log("SAS PROGRESS CONSOLE");
    console.log("=".repeat(40));
    console.log("1. Show the dashboard");
    console.log("2. Show the list of learners");
    console.log("3. Add a learner");
    console.log("4. Look up a learner by ID");
    console.log("5. Add or update a day's result");
    console.log("6. Search for a learner by name");
    console.log("7. Filter learners by level");
    console.log("8. Sort learners by descending progression");
    console.log("9. Sort learners alphabetically");
    console.log("0. Quit");
    console.log("=".repeat(40));

    choice = Number(prompt("What is your choice? "));
    console.log("=".repeat(40));

    switch (choice) {

        case 1:
            displayDashboard();
            break;

        case 2:
            displayAllLearners(learners);
            break;

        case 3: {
            let name = prompt("Student's name: ");
            let city = prompt("Student's city: ");

            addLearner(name, city);
            break;
        }

        case 4: {
            let id = Number(prompt("Student's ID: "));

            let result = searchLearner(id);
            if (result.success) {
                displayLearner(result.learner);
            }
            break;
        }

        case 5: {
            let id = Number(prompt("Student's ID: "));
            let day = Number(prompt("Day (1-7): "));
            let completedExercises = Number(prompt("Completed exercises: "));
            let totalExercises = Number(prompt("Total exercises: "));
            let challengeCompleted = prompt("Challenge completed? (yes/no): ");

            challengeCompleted = challengeCompleted.toLowerCase() === "yes";

            saveResult(
                id,
                day,
                completedExercises,
                totalExercises,
                challengeCompleted
            );

            break
        }

        case 6: {
            let name = prompt("Student's name: ");

            let result = searchLearner(undefined, name);
            if (result.success) {
                displayAllLearners(result.learners);
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
            level = "Solid"
            break
        case 2:
            level = "In progress"
            break
        case 3:
            level = "Needs reinforcement"
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
        console.log(filterByLevel(level).join(", "))
    }

    break
}

        case 8: 
        displayAllLearners(sortByProgression());
        break;
    
        case 9:
        console.log(sortAlphabetically(learners).join(", "));
        break;

        case 0:
        console.log("Goodbye!");
        break

        default:
        console.log("Invalid choice. Please choose a number between 0 and 9.");
    }

    console.log("=".repeat(40));

} while (choice !== 0)