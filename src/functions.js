import { apprenants } from "./data.js";

export function afficherApprenant(apprenants) {
  if (apprenants.length == 0) {
    return `the list is empty`;
  }
  for (let apprenant of apprenants) {
    console.log(`
id:  ${apprenant.id}
nom: ${apprenant.nomComplet}
ville: ${apprenant.ville} 
`);
  }
}

export function normaliserNom(nom) {
  return nom.trim().toLowerCase()
}


// checks if days number is valid and  compares the comEx with the offeredEx
export function validerResultat(day, completedEx, offeredEx) {

if (day < 1 || day > 7) {
  return false
}

if (completedEx > offeredEx) {
    return false;
}
    return true
}



export function ajouterApprenant(nom, ville) {
  let apprenant = {
    id: apprenants.length + 1,
    nom: normaliserNom(nom),
    ville: ville,
  };
  return apprenants.push(apprenant);
}

export function enregistrerResultat() {}

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