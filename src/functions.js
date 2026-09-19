import { apprenants } from "./data.js";

// clean name with all the white spaces in start, end, and middle and make the name in lowercase
export function normaliserNom(name) {
  let cleanName = name.trim();
  cleanName = cleanName.replace(/\s+/g, " ");
  cleanName = cleanName.toLowerCase();
  return cleanName;
}


// checks if days number is valid and  compares the comEx with the offeredEx
export function validerResultat(day, completedEx, offeredEx) {

  if (day < 1 || day > 7) {
    console.log(`Invalid day! Days should be between 1 and 7, you entered "${day}"`);
    return { valid: false, error: `Invalid day! Days should be between 1 and 7, you entered "${day}"` };
  }

  if (completedEx > offeredEx) {
    console.log(`Completed exercises (${completedEx}) cannot exceed offered exercises (${offeredEx})`);
    return { valid: false, error: `Completed exercises (${completedEx}) cannot exceed offered exercises (${offeredEx})` };
  }

  console.log("Result is valid.");
  return { valid: true, confirmation: "Result is valid." };
}


// add new learner but just name and city
export function ajouterApprenant(name, city) {
  if (name.trim() === "") {
    console.log("Name is empty");
    return { success: false, error: "Name is empty" }
  }

  if (city.trim() === "") {
    console.log("City is empty");
    return { success: false, error: "City is empty" }
  }

  //find the highest existing id and add 1, so ids stay unique even if a learner is ever removed
  let maxId = 0
  for (let i = 0; i < apprenants.length; i++) {
    if (apprenants[i].id > maxId) maxId = apprenants[i].id
  }

  let apprenant = {
    id: maxId + 1,
    nomComplet: normaliserNom(name),
    ville: city,
    resultats: []
  }

  apprenants.push(apprenant)

  console.log(`Learner added: ${apprenant.nomComplet} (${apprenant.ville}), id ${apprenant.id}`);
  return { success: true, learner: apprenant }
}

//save the result
export function enregistrerResultat(id, day, completedEx, offeredEx, challengeDone) {
  let apprenant = null // holding matching learner if found other ways stay null

  //go through every learner in the araay and check if his id matches the given one and if yes save it to the apprenant
  for(let i = 0; i < apprenants.length; i++) {
    if(apprenants[i].id === id) {
      apprenant = apprenants[i]
    }
  }

  //if my loop didn't find a match apprenant will stay null and return that id doesn't exist
  if (apprenant === null) {
    console.log("No learner with the given id exists");
    return {success: false, error: "no learner with the given id exists"}
  }

  //check if my given info are valid
  let resultcheck = validerResultat(day, completedEx, offeredEx)

  //if not valid  return the error from the previous func
  if (!resultcheck.valid) {
    return { success: false, error: resultcheck.error }
  }

  // track if we found an existing result for this day or not
  let found = false

  // go through the existing results of the learner
  for (let i = 0; i < apprenant.resultats.length; i++) {
  
  // check if the given day matches a day that already exists and update the info
  if (apprenant.resultats[i].jour === day) {
    apprenant.resultats[i].exercicesTermines = completedEx
    apprenant.resultats[i].totalExercices = offeredEx
    apprenant.resultats[i].challengeTermine = challengeDone
    found = true
  }
}
//if the given day is new push the info to the resultes of the student
  if (!found) {
    apprenant.resultats.push({
      jour: day,
      exercicesTermines: completedEx,
      totalExercices: offeredEx,
      challengeTermine: challengeDone
    })
  }
  console.log(`Day ${day} recorded for ${apprenant.nomComplet}, challenge ${challengeDone ? "completed" : "not completed"}`);
  return { success: true, message: `Day ${day} recorded for ${apprenant.nomComplet}, challenge ${challengeDone ? "completed" : "not completed"}` }
}


//search for a student using id or name 
export function rechercherApprenant(id, name) {
  if (id !== undefined) {
    for(let i = 0; i < apprenants.length; i++) {
      if (apprenants[i].id === id) {
        return { success: true, apprenant: apprenants[i] }
      }
    }
    console.log(`No learner found with id "${id}"`);
    return { success: false, error: `No learner found with id "${id}"` }
  }

  if (name !== undefined) {
    let matches = [] // to store all the matches of the given name
    for(let i = 0; i < apprenants.length; i++) {
      if (normaliserNom(apprenants[i].nomComplet).includes(normaliserNom(name))) {
        matches.push(apprenants[i]);
      }
    }
    if (matches.length === 0) {
    console.log(`No learner found with name "${name}"`);
    return { success: false, error: `No learner found with name "${name}"` };
  }
  return { success: true, apprenants: matches }
}
}
//calculate prog for learners
export function calculerProgression(apprenant) {
  let totalComp = 0
  let totalProp = 0
  let challengeCom = 0
  let daycount = 0

  //loop through my given learner and take his data to store it in my new vars to do calculations later on
  for (let i = 0; i < apprenant.resultats.length; i++) {
    totalComp += apprenant.resultats[i].exercicesTermines
    totalProp += apprenant.resultats[i].totalExercices
    if (apprenant.resultats[i].challengeTermine == true)
      challengeCom += 1
    daycount += 1
  }

  if (totalProp === 0) {
    return {
      totalComp: 0,
      totalProp: 0,
      challengeCom: 0,
      daycount: 0,
      prog: 0,
      level: "No results yet"
    }
  }

  let prog = (totalComp / totalProp) * 100

  let level = ""
  if (prog >= 80) level = "Solide"
  else if (prog >= 50 && prog < 80) level = "En progression"
  else level = "À renforcer"

  return {
    totalComp: totalComp,
    totalProp: totalProp,
    challengeCom: challengeCom,
    daycount: daycount,
    prog: prog,
    level: level
  }
}

             

//filter the learners depending on their levels 
export function filtrerParNiveau(level) {
  let result = []// to sort the learners that matches the given level
  for (let i = 0; i < apprenants.length; i++) {
    if (calculerProgression(apprenants[i]).level === level) {
      result.push(apprenants[i].nomComplet)
    }
  }
  return result
}

//sort my learners depending on their prog
export function trierParProgression() {
  for (let i = 0; i < apprenants.length; i++) {
    for (let j = 0; j < apprenants.length - 1; j++) {
      let progA = calculerProgression(apprenants[j]).prog
      let progB = calculerProgression(apprenants[j + 1]).prog

      if (progA < progB) {
        let temp = apprenants[j]
        apprenants[j] = apprenants[j + 1]
        apprenants[j + 1] = temp
      }
    }
  }
  return apprenants
}

// sort my learners using alphabetical order 
export function filtrerParAlphabet(apprenants) {
  const list = []
  for (let i = 0; i < apprenants.length; i++) {
    list.push(apprenants[i].nomComplet)
  }
  return list.sort((a, b) => {
    let nameA = a.toLowerCase()
    let nameB = b.toLowerCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}


//display the given learner info
export function afficherApprenant(apprenant) {

  console.log("-".repeat(40));
  console.log(`ID: ${apprenant.id}`);
  console.log(`Name: ${apprenant.nomComplet}`);
  console.log(`City: ${apprenant.ville}`);

  console.log("Results:");

  for (let i = 0; i < apprenant.resultats.length; i++) {

    let resultat = apprenant.resultats[i];

    console.log(
      `Day ${resultat.jour}: ${resultat.exercicesTermines}/${resultat.totalExercices} exercises - Challenge: ${
        resultat.challengeTermine ? "Yes" : "No"
      }`
    );

  }

  console.log("-".repeat(40));

}

export function displayAllLearners(apprenants) {
  apprenants.forEach((apprenant) => {
    afficherApprenant(apprenant);
  });
}


//dashboard 
export function afficherTableauDeBord() {
  if (apprenants.length === 0) {
    console.log("No learners yet");
    return;
  }

  let totalProg = 0

  //add up everyone's progression to get the average later
  for (let i = 0; i < apprenants.length; i++) {
    totalProg += calculerProgression(apprenants[i]).prog
  }

  let avgProg = totalProg / apprenants.length

  console.log("\n=================== DASHBOARD ===================\n")
  console.log(`Total learners          : ${apprenants.length}`)
  console.log(`Average progression      : ${Math.floor(avgProg)}%\n`)

  console.log("Breakdown by level:")
  console.log(`  - Solid              : ${filtrerParNiveau("Solide").length}`)
  console.log(`  - In progress          : ${filtrerParNiveau("En progression").length}`)
  console.log(`  - Needs improvement    : ${filtrerParNiveau("À renforcer").length}\n`)

  console.log("--------------------- RANKING ---------------------")
  console.log("(sorted by descending progression)\n")

  //reuse the sorting function we already wrote so the ranking is in the right order
  let ranked = trierParProgression()

  for (let i = 0; i < ranked.length; i++) {
    let apprenant = ranked[i]
    let stats = calculerProgression(apprenant)

    let missingDays = []
    let incompleteChallenges = []

    //go through days 1 to 7 and note what's missing or not completed
    for (let day = 1; day <= 7; day++) {
      let found = null
      for (let j = 0; j < apprenant.resultats.length; j++) {
        if (apprenant.resultats[j].jour === day) found = apprenant.resultats[j]
      }

      if (found === null) {
        missingDays.push(day)
      } else if (found.challengeTermine === false) {
        incompleteChallenges.push(`Day ${day}`)
      }
    }

    console.log(`${i + 1}. ${apprenant.nomComplet.padEnd(15)} — ${stats.prog.toFixed(0)}%  [${stats.level}]`)
    console.log(`   Exercises: ${stats.totalComp} / ${stats.totalProp}   |  Challenges: ${stats.challengeCom}  |  Days recorded: ${stats.daycount}/7`)
    console.log(`   Missing days           : ${missingDays.length > 0 ? missingDays.join(", ") : "None"}`)
    console.log(`   Incomplete challenges  : ${incompleteChallenges.length > 0 ? incompleteChallenges.join(", ") : "None"}\n`)
  }
}