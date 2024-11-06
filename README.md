# Olympic Basketball Tournament Simulation App

The **Basketball Tournament App** simulates an Olympic-style basketball tournament, featuring a group stage followed by an elimination phase. It simulates matches, ranks teams, and generates tournament results based on factors like team strength, match outcomes, and exhibition data.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Features
- **Group Stage Simulation**: Simulates all group stage matches, ranking teams based on points, head-to-head results, and goal differences.
- **Match Outcomes**: Simulated results based on FIBA rankings to determine winning and losing probabilities.
- **Ranked Teams**: Teams are ranked within their groups, with further ranking based on goal difference and points scored.
- **Elimination Phase**: Top 8 teams advance to the knockout rounds (quarterfinals, semifinals, finals).
- **Randomized Draw**: Quarterfinal teams are drawn randomly, ensuring no repeats from the group stage.
- **Tournament Rounds**: Matches continue through the knockout rounds to determine the final results (gold, silver, bronze).
- **Exhibition Match Data**: Includes exhibition match data to calculate team form and influence match probabilities.

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
