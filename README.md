# Race-2-1

Race-2-1 is a lightweight, interactive web game inspired by mathematical strategy, turn-based logic, and competitive decision-making.  
Two players race to reach the number **21**, taking turns adding 1, 2, or 3 to the running total — but only one player can land on the winning number.

This project demonstrates frontend logic, state management, UI design, and clean mathematics-based game mechanics in a simple, polished interface.

🔗 **Live Demo:** https://race-2-1.vercel.app  
🔗 **Repository:** https://github.com/DMDTague/Race-2-1

---

## 📌 Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [How the Game Works](#how-the-game-works)
- [How I Built It](#how-i-built-it)
- [What I Learned](#what-i-learned)
- [Improvements / Future Work](#improvements--future-work)
- [Why This Matters](#why-this-matters)
- [Summary](#summary)

---

## 🧠 Overview

Race-2-1 takes a simple numerical game and transforms it into a clean, interactive experience.  
Users can play against a deterministic optimal strategy or against random moves. The UI makes the flow intuitive while the backend logic ensures mathematically optimal gameplay when enabled.

This project serves as a great demonstration of:
- Game logic implementation  
- Mathematical reasoning translated into code  
- Clean UI/UX for interactive apps  
- Vercel deployment + modern JavaScript tooling  

---

## 🛠️ Technologies Used

### **Frontend**
- **React**
- **Vite**
- **JavaScript**
- **HTML / CSS**

### **Logic / Game Engine**
- Custom-written game logic for:
  - Turn-taking  
  - Valid move calculations  
  - Optimal strategy implementation  

### **Deployment**
- **Vercel** for instant CI/CD hosting  

---

## ⭐ Features

- 🎮 **Interactive turn-based gameplay**  
- 🧠 **Optional optimal-strategy AI**  
- 🔢 **Real-time running total with visual updates**  
- 😎 **Clean, minimalist UI**  
- 🔄 **Restart / reset system**  
- 📱 **Responsive design for mobile and desktop**  

---

## 🔢 How the Game Works

Players take turns adding **1, 2, or 3** to a shared total.  
Whoever lands exactly on **21** wins.

Mathematically, the optimal strategy is to always force the total to land on:


If a player can force their opponent to face these numbers, they can guarantee a win.

This logic is implemented cleanly in your game’s code.

---

## 🏗️ How I Built It

1. Implemented the game state: current total, current turn, and win condition  
2. Built UI components to display moves, totals, and game flow  
3. Developed optional **optimal AI** that uses modular arithmetic  
4. Added responsive styling for clarity and ease of use  
5. Set up Vite for fast local dev  
6. Deployed to Vercel for simple public access  

---

## 📚 What I Learned

- Translating mathematical strategy into **deterministic game logic**
- Managing **state** in lightweight React components
- Designing a clean and intuitive **UI/UX**
- Structuring a small interactive game using modern frontend tools
- Deploying front-end projects quickly and effectively with Vercel

---

## 🚀 Improvements / Future Work

- Add difficulty modes (random, optimal, hybrid)  
- Create a “teaching mode” that explains why each optimal move is optimal  
- Add animations or sound effects  
- Add online PvP or local two-player mode  
- Style upgrades with themes or color palettes  
- Create a leaderboard or scoring system  

---

## 🎯 Why This Matters

This project:

- Demonstrates how mathematical strategy can be implemented in interactive software  
- Shows the ability to build a clean, intuitive interface around logical turn-based gameplay  
- Highlights skill in state management, frontend architecture, and UI design  
- Turns a classic number game into a polished, deployable web app  
- Reflects full-stack thinking even in a minimalist project  
  *(logic → UI → deployment)*  

---

## ✅ Summary

**Race-2-1** is a polished, minimalist game that transforms strategic number play into a modern web experience.  
It combines mathematical logic, clean interface design, and efficient deployment into a cohesive project.

It showcases skills in:

- Game logic & mathematics  
- React development  
- Frontend architecture  
- Deployment (Vercel)  
- Interactive UI design  
- Clear communication of logic & flow
- 
