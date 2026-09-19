import { learners } from "./data.js";

// clean name with all the white spaces in start, end, and middle and make the name in lowercase
export function normalizeName(name) {
  let cleanName = name.trim();
  cleanName = cleanName.replace(/\s+/g, " ");
  cleanName = cleanName.toLowerCase();
  return cleanName;
}


// checks if days number is valid and  compares the completedEx with the offeredEx
export function validateResult(day, completedEx, offeredEx) {

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
export function addLearner(name, city) {
  if (name.trim() === "" || name.typeof != "string") {
    console.log("Name is empty");
    return { success: false, error: "Error: Name is invalid or empty" }
  }

  if (city.trim() === "") {
    console.log("City is empty");
    return { success: false, error: "Error: City is invalid or empty" || city.typeof != "string" }
  }

  //find the highest existing id and add 1, so ids stay unique even if a learner is ever removed
  let maxId = 0
  for (let i = 0; i < learners.length; i++) {
    if (learners[i].id > maxId) maxId = learners[i].id
  }

  let learner = {
    id: maxId + 1,
    fullName: normalizeName(name),
    city: city,
    results: []
  }

  learners.push(learner)

  console.log(`Learner added: ${learner.fullName} (${learner.city}), id ${learner.id}`);
  return { success: true, learner: learner }
}

//save the result
export function saveResult(id, day, completedEx, offeredEx, challengeDone) {
  let learner = null // holding matching learner if found other ways stay null

  //go through every learner in the array and check if his id matches the given one and if yes save it to the learner
  for(let i = 0; i < learners.length; i++) {
    if(learners[i].id === id) {
      learner = learners[i]
    }
  }

  //if my loop didn't find a match learner will stay null and return that id doesn't exist
  if (learner === null) {
    console.log("No learner with the given id exists");
    return {success: false, error: "no learner with the given id exists"}
  }

  //check if my given info are valid
  let resultCheck = validateResult(day, completedEx, offeredEx)

  //if not valid  return the error from the previous func
  if (!resultCheck.valid) {
    return { success: false, error: resultCheck.error }
  }

  // track if we found an existing result for this day or not
  let found = false

  // go through the existing results of the learner
  for (let i = 0; i < learner.results.length; i++) {
  
  // check if the given day matches a day that already exists and update the info
  if (learner.results[i].day === day) {
    learner.results[i].completedExercises = completedEx
    learner.results[i].totalExercises = offeredEx
    learner.results[i].challengeCompleted = challengeDone
    found = true
  }
}
//if the given day is new push the info to the results of the student
  if (!found) {
    learner.results.push({
      day: day,
      completedExercises: completedEx,
      totalExercises: offeredEx,
      challengeCompleted: challengeDone
    })
  }
  console.log(`Day ${day} recorded for ${learner.fullName}, challenge ${challengeDone ? "completed" : "not completed"}`);
  return { success: true, message: `Day ${day} recorded for ${learner.fullName}, challenge ${challengeDone ? "completed" : "not completed"}` }
}


//search for a student using id or name 
export function searchLearner(id, name) {
  if (id !== undefined) {
    for(let i = 0; i < learners.length; i++) {
      if (learners[i].id === id) {
        return { success: true, learner: learners[i] }
      }
    }
    console.log(`No learner found with id "${id}"`);
    return { success: false, error: `No learner found with id "${id}"` }
  }

  if (name !== undefined) {
    let matches = [] // to store all the matches of the given name
    for(let i = 0; i < learners.length; i++) {
      if (normalizeName(learners[i].fullName).includes(normalizeName(name))) {
        matches.push(learners[i]);
      }
    }
    if (matches.length === 0) {
    console.log(`No learner found with name "${name}"`);
    return { success: false, error: `No learner found with name "${name}"` };
  }
  return { success: true, learners: matches }
}
}
//calculate progression for learners
export function calculateProgression(learner) {
  let totalComp = 0
  let totalProp = 0
  let challengeCom = 0
  let dayCount = 0

  //loop through my given learner and take his data to store it in my new vars to do calculations later on
  for (let i = 0; i < learner.results.length; i++) {
    totalComp += learner.results[i].completedExercises
    totalProp += learner.results[i].totalExercises
    if (learner.results[i].challengeCompleted == true)
      challengeCom += 1
    dayCount += 1
  }

  if (totalProp === 0) {
    return {
      totalComp: 0,
      totalProp: 0,
      challengeCom: 0,
      dayCount: 0,
      prog: 0,
      level: "No results yet"
    }
  }

  let prog = (totalComp / totalProp) * 100

  let level = ""
  if (prog >= 80) level = "Solid"
  else if (prog >= 50 && prog < 80) level = "In progress"
  else level = "Needs reinforcement"

  return {
    totalComp: totalComp,
    totalProp: totalProp,
    challengeCom: challengeCom,
    dayCount: dayCount,
    prog: prog,
    level: level
  }
}

             

//filter the learners depending on their levels 
export function filterByLevel(level) {
  let result = []// to sort the learners that matches the given level
  for (let i = 0; i < learners.length; i++) {
    if (calculateProgression(learners[i]).level === level) {
      result.push(learners[i].fullName)
    }
  }
  return result
}

//sort my learners depending on their prog
export function sortByProgression() {
  for (let i = 0; i < learners.length; i++) {
    for (let j = 0; j < learners.length - 1; j++) {
      let progA = calculateProgression(learners[j]).prog
      let progB = calculateProgression(learners[j + 1]).prog

      if (progA < progB) {
        let temp = learners[j]
        learners[j] = learners[j + 1]
        learners[j + 1] = temp
      }
    }
  }
  return learners
}

// sort my learners using alphabetical order 
export function sortAlphabetically(learners) {
  const list = []
  for (let i = 0; i < learners.length; i++) {
    list.push(learners[i].fullName)
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
export function displayLearner(learner) {

  console.log("-".repeat(40));
  console.log(`ID: ${learner.id}`);
  console.log(`Name: ${learner.fullName}`);
  console.log(`City: ${learner.city}`);

  console.log("Results:");

  for (let i = 0; i < learner.results.length; i++) {

    let result = learner.results[i];

    console.log(
      `Day ${result.day}: ${result.completedExercises}/${result.totalExercises} exercises - Challenge: ${
        result.challengeCompleted ? "Yes" : "No"
      }`
    );

  }

  console.log("-".repeat(40));

}

export function displayAllLearners(learners) {
  learners.forEach((learner) => {
    displayLearner(learner);
  });
}


//dashboard 
export function displayDashboard() {
  if (learners.length === 0) {
    console.log("No learners yet");
    return;
  }

  let totalProg = 0

  //add up everyone's progression to get the average later
  for (let i = 0; i < learners.length; i++) {
    totalProg += calculateProgression(learners[i]).prog
  }

  let avgProg = totalProg / learners.length

  console.log("\n=================== DASHBOARD ===================\n")
  console.log(`Total learners          : ${learners.length}`)
  console.log(`Average progression      : ${Math.floor(avgProg)}%\n`)

  console.log("Breakdown by level:")
  console.log(`  - Solid              : ${filterByLevel("Solid").length}`)
  console.log(`  - In progress          : ${filterByLevel("In progress").length}`)
  console.log(`  - Needs improvement    : ${filterByLevel("Needs reinforcement").length}\n`)

  console.log("--------------------- RANKING ---------------------")
  console.log("(sorted by descending progression)\n")

  //reuse the sorting function we already wrote so the ranking is in the right order
  let ranked = sortByProgression()

  for (let i = 0; i < ranked.length; i++) {
    let learner = ranked[i]
    let stats = calculateProgression(learner)

    let missingDays = []
    let incompleteChallenges = []

    //go through days 1 to 7 and note what's missing or not completed
    for (let day = 1; day <= 7; day++) {
      let found = null
      for (let j = 0; j < learner.results.length; j++) {
        if (learner.results[j].day === day) found = learner.results[j]
      }

      if (found === null) {
        missingDays.push(day)
      } else if (found.challengeCompleted === false) {
        incompleteChallenges.push(`Day ${day}`)
      }
    }

    console.log(`${i + 1}. ${learner.fullName.padEnd(15)} — ${stats.prog.toFixed(0)}%  [${stats.level}]`)
    console.log(`   Exercises: ${stats.totalComp} / ${stats.totalProp}   |  Challenges: ${stats.challengeCom}  |  Days recorded: ${stats.dayCount}/7`)
    console.log(`   Missing days           : ${missingDays.length > 0 ? missingDays.join(", ") : "None"}`)
    console.log(`   Incomplete challenges  : ${incompleteChallenges.length > 0 ? incompleteChallenges.join(", ") : "None"}\n`)
  }
}