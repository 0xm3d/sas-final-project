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




export function rechercherApprenant() {}

export function calculerProgression(apprenant) {
  let totalComp = 0;
  let totalProp = 0;
  let challengeCom = 0;
  let daycount = 0;
  for (let i = 0; i < apprenant.resultats.length; i++) {
    totalComp += apprenant.resultats[i].exercicesTermines;
    totalProp += apprenant.resultats[i].totalExercices;
    if (apprenant.resultats[i].challengeTermine == true) 
      challengeCom += 1;
    daycount += 1;
  }
  let prog = (totalComp / totalProp) * 100;

  let level = "";
  if (prog >= 80) level = "Solide";
  else if (prog >= 50 && prog < 80) level = "En progression";
  else level = "À renforcer";

  return `
    The total of exercices is : ${totalProp}
    The total of completed exercices is : ${totalComp}
    The total of completed challenges is : ${challengeCom}
    total of days is : ${daycount}
    The progress of the student is : ${prog}%
    The level of the student is: ${level}
    `;
}

export function filtrerParNiveau() {}

export function trierParProgression() {}

export function afficherTableauDeBord() {}


export function filtrerParAlphabet(apprenants) {
  const list = []
  for (let i = 0; i < apprenants.length; i++) {
    list.push(apprenants[i].nomComplet)
  }
  return list.sort()
}