# Olympic Basketball Tournament Simulation App

A Command Line Interface (CLI) application built with Node.js to simulate an Olympic-style basketball tournament. This app handles match scheduling, group stages, and exhibition matches for teams.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Features
- Simulate basketball tournament matches
- Manage groups and teams
- Schedule exhibition matches
- Generate match results

## Technologies Used
- Node.js v20.17.0
- JavaScript

## Installation

To run the Basketball Tournament App locally, follow these steps:

### 1. Clone the repository:
```bash
git clone https://github.com/JovanMihic99/basketball-tournament-app.git
```

### 2. Navigate to the project directory:
```bash
cd basketball-tournament-app
```

### 3. Install dependencies:
Run the following command to install the required dependencies:

```bash
npm install
```

### 4. Run the app:
To run the app via CLI, use the following command:

```bash
npm start
```

The app will then simulate the basketball tournament through the command line.

## Usage
1. Open your terminal.
2. Run the command `npm start` to begin the simulation.
3. The app will interact with you via the terminal, simulating tournament matches and generating results based on predefined groupings.

## Configuration
Ensure that all configurations (such as teams and match details) are set in the appropriate JSON files:
- `teams.json` - List of teams.
- `matches.json` - Match schedule details.
- `groups.json` - Team groupings.

Modify these files as needed before running the simulation.
