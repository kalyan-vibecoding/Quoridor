# Quoridor

Quoridor is a strategic board game for 2 or 4 players. The objective is to be the first player to move your pawn to the opposite side of the board while placing walls to hinder your opponents. This repository contains an implementation of Quoridor (digital/console/GUI) and supporting assets.

## Table of Contents

- [Overview](#overview)
- [Rules](#rules)
  - [Setup](#setup)
  - [Goal](#goal)
  - [Turn Structure](#turn-structure)
  - [Moving a Pawn](#moving-a-pawn)
  - [Placing Walls](#placing-walls)
  - [Restrictions & Constraints](#restrictions--constraints)
- [Game Variants](#game-variants)
- [Running the Game](#running-the-game)
  - [Requirements](#requirements)
  - [Build & Run](#build--run)
- [Controls](#controls)
- [Design & Implementation Notes](#design--implementation-notes)
- [Testing](#testing)
- [Contributing](#contributing)
- [Assets & Credits](#assets--credits)
- [License](#license)

## Overview

Quoridor is played on a 9x9 grid of squares. Each player controls a single pawn and starts on the center square of one side of the board (for 2 players) or on one of the four central squares of each side (for 4 players). Players also have a limited number of walls (10 in the standard 2-player game, 5 per player in some variants) which they can place to block opponents.

This implementation aims to provide:
- A faithful ruleset for classic Quoridor
- Single-player (AI), local multiplayer, and network play where applicable
- Clear visuals and intuitive controls (depending on the frontend)

## Rules

### Setup
- Board: 9x9 squares.
- Pawns: Each player has one pawn. In a 2-player game pawns start at the center square of opposite sides (for example, Player 1 at e1 and Player 2 at e9 if using algebraic notation). In a 4-player game pawns start at the midpoints of each side.
- Walls: Each player is allocated a fixed number of walls (commonly 10 for each player in 2-player games). Walls are placed between squares and span two edges (i.e., a wall covers two adjacent gaps).

### Goal
Be the first to move your pawn to any square on the opponent's starting edge (the opposite side of the board).

### Turn Structure
On a player's turn, they must either:
- Move their pawn according to the movement rules, OR
- Place a wall on the board (if they have any walls remaining).

### Moving a Pawn
- Pawns move one square orthogonally (up, down, left, or right) into an unoccupied square.
- If an adjacent square is occupied by an opponent pawn, the player may jump over that pawn into the square directly on the other side, as long as that square is empty and there is no wall immediately behind the opponent pawn.
- If the jump square is blocked by a wall or the board edge, lateral jumps (left or right around the occupied pawn) are permitted where valid.
- Pawns cannot move diagonally except as part of a legal lateral jump around another pawn.

### Placing Walls
- Walls are placed between squares along the grid lines and always align with the grid (no diagonal walls).
- A wall occupies the space between two rows or two columns and extends across two adjacent edge gaps (i.e., it spans the gap between two pairs of neighboring squares).
- Walls cannot overlap or cross existing walls.
- A wall may never be placed such that it makes it impossible for any pawn to reach the opposite side — every player must retain at least one path to their goal after a wall placement.

### Restrictions & Constraints
- Players may not place a wall on top of or crossing an existing wall.
- A wall placement that fully blocks an opponent's access to their goal is illegal.
- Passing is not allowed; a player must either move a pawn or place a wall on their turn.

## Game Variants
- 2-player standard: 9x9 board, 10 walls per player.
- 4-player standard: 9x9 board, 5 walls per player, play proceeds clockwise.
- Custom variants: Board size, wall counts, and starting positions may be adjusted in configuration.

## Running the Game

### Requirements
- A supported programming language runtime (e.g., Node.js >= 14, Python 3.8+, Java 11+, or other depending on implementation).
- Optional: SDL/GUI dependencies if the project includes a graphical frontend.

### Build & Run
See the project-specific subfolders for platform-specific instructions. Typical commands:

- If Node.js (example):
  - Install: `npm install`
  - Run: `npm start` or `node index.js`
- If Python (example):
  - Create virtual environment: `python -m venv venv`
  - Activate: `source venv/bin/activate` (Linux/macOS) or `venv\Scripts\activate` (Windows)
  - Install: `pip install -r requirements.txt`
  - Run: `python main.py`
- If Java (example):
  - Build: `./gradlew build` or `mvn package`
  - Run: `java -jar build/libs/quoridor.jar`

If this repository has a `README.md` already with platform-specific instructions, follow those instead. If you need help running the project, open an issue describing your platform, runtime versions, and the exact command you ran.

## Controls
- Keyboard and/or mouse controls vary depending on the frontend.
- Common controls:
  - Arrow keys / WASD: move selection cursor
  - Enter / Space: confirm move or place wall
  - Right-click or special key: toggle wall orientation (horizontal/vertical)
  - Click on a square or edge to move pawn or place wall directly

## Design & Implementation Notes
- Board model: 9x9 grid of cells with separate edge/wall occupancy representation.
- Movement rules are enforced in game logic and validated before applying.
- Pathfinding: When placing walls, the game runs a pathfinding check (e.g., BFS or A*) to ensure each pawn still has at least one valid path to their goal.
- AI: If AI opponents are included, common approaches are Minimax with heuristic evaluation or Monte Carlo Tree Search. See `docs/ai.md` if present.

## Testing
- Unit tests should cover movement rules, wall placement validation, pathfinding checks, and win condition detection.
- Use the language-specific test runner (e.g., `npm test`, `pytest`, `gradle test`).

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Add tests for new behavior where applicable.
4. Open a pull request describing your changes and why they are needed.

Please adhere to the project's code style and include clear commit messages.

## Assets & Credits
- Any artwork, icons, or audio used should be credited here with licenses.
- If you add assets from third parties, include attribution and license terms in this section.

## License
This project is provided under the MIT License unless otherwise specified in `LICENSE`.