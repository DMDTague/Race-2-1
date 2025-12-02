# Race-2-1: When “Optimal” Strategy Depends on the Rules

## Overview

Race-2-1 is an interactive case study in **how small rule changes can quietly reshape “optimal strategy”**.

The project looks at the game **Guess Who?** through the lens of data modeling:

- I rebuilt Dr. Mihai Nica’s Guess Who simulator in code.
- I show how his version effectively turns the game into a **race to narrow down to one candidate**.
- I contrast that with the **actual board-game rules**, where turn order still matters even when you know the answer.
- I then build a corrected version of the game and let you:
  - Play against an **optimal strategy bot**, and  
  - See live feedback on how strong each move is.

If you work with data or models, you will recognize the theme:

> When the **business rules** and the **model’s rules** drift apart, your “optimal” results can be misleading.

This project is about spotting that drift, fixing it, and making the whole process **visible and explainable** in the browser.

Live demo: **https://race-2-1.vercel.app/**

---

## Technologies

**Frontend & Framework**

- React (functional components, hooks)
- Vite (bundler and dev server)
- JavaScript (ES6+)
- JSX

**UI & Styling**

- Plain CSS (custom layout and animations)
- In-component `<style>` block for page-scoped styling
- lucide-react (icon set)
- CSS transitions, keyframe animations, progress bars

**Game Logic & Modeling**

- Custom decision engine written in JavaScript
- Dynamic programming style value table for game states
- In-browser simulation of “who is winning” as the game evolves

**Tooling & Deployment**

- Node.js and npm
- Vercel for hosting and deployment

---

## Features

What makes this more than a written report or a static math paper:

- **Narrative walkthrough, not just code**
  - Starts with Mark Rober’s viral Guess Who video.
  - Moves into Dr. Nica’s paper and simulator.
  - Then shows where the model quietly changes the rules of the game.

- **Race-to-1 playback**
  - Step-by-step game playback that shows:
    - Both players’ remaining options at each move.
    - The exact point where the simulator declares “win” too early.
  - Clear warning banners so you can see the mismatch without reading code.

- **Death Valley visual**
  - Animated view of a key state I call **Death Valley**:
    - You have only one option left.
    - You know the opponent’s card.
    - But it is not your turn.
  - The app explains why this is **not** a guaranteed win under the real rules.

- **Side-by-side rule comparison**
  - One column for “Race-to-1” (the simplified model).
  - One column for “Real Guess Who” (the physical game).
  - Same sequence of questions, different winners.
  - It feels like comparing two dashboards built on slightly different definitions.

- **Corrected game vs optimal bot**
  - An interactive game where:
    - You choose ranges or exact guesses by clicking numbers.
    - The bot responds using a strategy computed from the corrected rules.
  - You see your win chance and the bot’s win chance after each move.

- **Move quality grading**
  - Every move gets a badge based on its impact:
    - Best, Great, Good, Inaccuracy, Mistake, Blunder, or even “Brilliant move” in big turnarounds.
  - The grading is based on **expected value**, not gut feeling.
  - Descriptions explain what happened in plain language:
    - “Good decision, bad result”
    - “Lead squandered”
    - “Clutch comeback”
    - “Engine blunder”

- **Session history**
  - Tracks your wins and losses against the bot during the session.
  - Shows a running win rate, similar to a simple analytics KPI.

- **Technical notes panel**
  - A short, readable explanation of:
    - How the engine weighs “ask a question” vs “make a guess”.
    - Why wrong guesses do not instantly lose under the corrected rules.
    - How decision error is turned into move labels.

---

## Process

How this went from a curiosity to a full interactive analysis:

1. **Initial spark**
   - Watched Mark Rober’s Guess Who strategy video.
   - Read Dr. Nica’s paper on “optimal” play that goes “beyond binary search”.
   - Noticed that his later simulator did not feel like the physical game I knew.

2. **Reverse-engineering the model**
   - Recreated his logic in simple code.
   - Treated that as a **specification of the model**, not of the game.
   - Saw that the model ends the game the moment a player’s shortlist shrinks to one.

3. **Identifying the rules gap**
   - Compared that behavior to the actual board-game rules:
     - In the real game, you must spend a turn to **say** your final guess.
     - Your opponent still gets their turn if you just narrowed it down on your turn.
   - Realized this missing step creates a blind spot in the model.

4. **Defining Death Valley**
   - Gave a name to the critical state: **Death Valley**.
     - You basically know the answer.
     - It is still possible to lose because your opponent gets to move first.
   - This is the kind of edge case that matters a lot in strategy and risk.

5. **Building the decision engine**
   - Designed a value function that answers:
     - “Given my current options and the opponent’s, how good is my position?”
   - For each state, the engine chooses between:
     - Guessing now (with a penalty if wrong), or
     - Asking a question that splits the search space.
   - Computed this across all reasonable combinations of “my options” and “their options”.

6. **Bringing it into the browser**
   - Implemented the engine in JavaScript, running entirely in the browser.
   - Wired it into a React app that:
     - Shows live win probabilities.
     - Chooses moves for the bot.
     - Grades human and bot moves side by side.

7. **Designing the story**
   - Structured the page to read like a guided case study:
     - From viral content, to academic model, to rules mismatch, to corrected solution.
   - Added visual components:
     - Game playback.
     - Death Valley animation.
     - Side-by-side turn trees.
     - Interactive game, log, and stats.

8. **Polishing and deployment**
   - Tuned delays and animations so people can actually read the explanations.
   - Deployed with Vercel so anyone can click a link and experience the project without setup.

---

## What I Learned

- **Modeling is never neutral**
  - Choosing when a game “ends” is part of the model.
  - Here, “win when you know the card” vs “win when you say the card” leads to different strategies.
  - This is very similar to analytics work where small changes in definitions can flip conclusions.

- **Dynamic programming in a human-facing way**
  - I used a dynamic programming approach behind the scenes.
  - The user never sees formulas. They see:
    - Win chance bars.
    - Move labels.
    - Short text explaining what just happened.
  - The math is there, but the surface is approachable.

- **Explaining complex ideas to non-specialists**
  - I learned to explain:
    - Race-to-1 vs real turn-based rules.
    - Why “you know but must wait” is such an important state.
  - All in language that a data-oriented person can follow without a math degree.

- **Designing feedback that teaches**
  - A move is not just “good” or “bad”.
  - The app explains *why* it was strong or weak in terms of win probability.
  - This mirrors how good analytics tools explain **why** a metric changed, not just the fact that it did.

---

## Overall Growth

This project stretched me in several directions at once:

- As a **modeler**, I had to:
  - Translate informal game rules into precise, checkable logic.
  - Notice when an elegant model no longer matches reality.

- As a **developer**, I had to:
  - Turn a research-style idea into a real-time engine.
  - Integrate that engine into a React interface that stays fast and responsive.

- As a **communicator**, I had to:
  - Frame the whole thing as a story:
    - A viral video.
    - A clever paper.
    - A rules mismatch.
    - A corrected model you can actually play with.
  - Make sure someone with a data background, not a math background, can follow the reasoning and feel like they gained insight.

In short, Race-2-1 is a proof that I can **spot hidden modeling assumptions, correct them, and build tools that explain the difference to others**.

---

## Running the Project

### Quick start: use the live demo

The easiest way to experience Race-2-1 is the hosted version:

1. Go to **https://race-2-1.vercel.app/**
2. Scroll through the story.
3. Try the interactive pieces:
   - The Race-to-1 playback.
   - The Death Valley animation.
   - The corrected game against the optimal bot.
4. Watch how your win chance and move quality change as you play.
