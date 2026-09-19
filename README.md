# SAS Progress Console

A small console app for the YouCode SAS JavaScript module. It keeps track of learners and their daily exercise results, and shows a dashboard so a trainer can quickly see who's doing well and who needs help.

Everything runs in the terminal with plain Node.js. No database, no framework.

## What it does

- Add a learner (name + city)
- Look up a learner by ID
- Search learners by name (partial match, not case sensitive)
- Add or update a learner's result for a given day (1 to 7)
- See a full dashboard: total learners, average progression, how many are in each level, and a ranked list
- Filter learners by level (Solid / In progress / Needs reinforcement)
- Sort learners by progression (highest first) or alphabetically

The app never decides if someone "passes" or "fails" anything. The levels are just a way to read the numbers, not a judgment.

## The data

Each learner looks like this:

```js
{
  id: 1,
  fullName: "Sara Dev",
  city: "Nador",
  results: [
    { day: 1, completedExercises: 18, totalExercises: 20, challengeCompleted: true }
  ]
}
```

A day that isn't in the `results` array just means that day hasn't been recorded yet. That's different from a challenge that was recorded but not completed. The dashboard shows both separately ("missing days" vs "incomplete challenges") so it's clear which is which.

## How progression is calculated

For each learner:

- **Exercises done** = sum of `completedExercises` across all recorded days
- **Exercises offered** = sum of `totalExercises` across all recorded days
- **Progression %** = (done / offered) × 100
- If a learner has no results yet, offered exercises is 0, so we just show 0% instead of dividing by zero

Levels are based on the percentage:

- **Solid**: 80% and up
- **In progress**: 50% up to (but not including) 80%
- **Needs reinforcement**: below 50%

Percentages aren't rounded when they're calculated, only when they're displayed (with `.toFixed(0)`). So a value like 79.6% is compared against the thresholds using its real value, not the rounded one.

The group average on the dashboard is just the average of every learner's progression %, rounded down.

## Getting started

You'll need Node.js installed. From the project folder:

```bash
npm install
node index.js
```

`npm install` is only needed because the menu uses `prompt-sync` to read your input from the terminal. This was cleared with the teacher directly, since Node doesn't have a clean built-in way to read input synchronously.

## Using the menu

When you run it, you'll get a numbered menu. Type a number and hit enter. A few notes:

- Adding a result (option 5) asks for the learner's ID, the day, the numbers, and whether the challenge was completed (yes/no). If the day is outside 1-7, or completed exercises is more than the total offered, it'll tell you and won't save anything.
- If you give a day that already has a result, it just updates it. You won't end up with two entries for the same day.
- Option 0 quits.

## Tests

There's no formal test runner, since we can't use external libraries. Instead, there's a script that runs through a series of scenarios and logs whether each one behaves as expected. Run it with:

```bash
node tests/scenarios.js
```

Scenarios covered:

1. Adding a valid learner. Can be found afterward by ID
2. Updating an existing day's result. Replaces it instead of creating a duplicate
3. Calculating progression and searching by a partial, differently-cased name
4. Trying to add a learner with an ID that's already taken. Gets rejected
5. Trying to save a result with an invalid day or too many completed exercises. Gets rejected

## A note on the structure

Everything is split into three files:

- `data.js`: the learners array (the starting fictional data)
- `functions.js`: all the logic. Validating, adding, searching, calculating, sorting, displaying
- `index.js`: the menu loop that ties it together

All the people in the data are made up. No real names or real results were used anywhere.