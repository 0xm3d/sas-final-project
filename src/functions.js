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
    return { valid: false, error: `Invalid day! Days should be between 1 and 7, you entered "${day}"` };
  }

  if (completedEx > offeredEx) {
    return { valid: false, error: `Completed exercises (${completedEx}) cannot exceed offered exercises (${offeredEx})` };
  }

  return { valid: true, confirmation: "Result is valid." };
}


// add new learner but just name and city
export function ajouterApprenant(name, city) {
  if (name.trim() === "") {
    return { success: false, error: "Name is empty" }
  }

  if (city.trim() === "") {
    return { success: false, error: "City is empty" }
  }

  let apprenant = {
    id: apprenants.length + 1,
    nomComplet: normaliserNom(name),
    ville: city,
    resultats: []
  }

  apprenants.push(apprenant)

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

  return { success: true, message: `Day ${day} recorded for ${apprenant.nomComplet}, ${apprenant.challengeTermine} challenge done` }
}


//search for a student using id or name 
export function rechercherApprenant(id, name) {
  if (id !== undefined) {
    for(let i = 0; i < apprenants.length; i++) {
      if (apprenants[i].id === id) {
        return { success: true, apprenant: apprenants[i] }
      }
    }
    return { success: false, error: `No learner found with id "${id}"` }
  }

  if (name !== undefined) {
    for(let i = 0; i < apprenants.length; i++) {
      if (normaliserNom(apprenants[i].nomComplet).includes(normaliserNom(name))) {
        return { success: true, apprenant: apprenants[i] }
      }
    }
    return { success: false, error: `No learner found with name "${name}"` }
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




export function filtrerParAlphabet(apprenants) {
  const list = []
  for (let i = 0; i < apprenants.length; i++) {
    list.push(apprenants[i].nomComplet)
  }
  return list.sort()
}




//dashboard 
export function afficherTableauDeBord() {
  
}