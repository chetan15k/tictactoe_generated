# Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with SvelteKit and TypeScript.

## How to Play

### Game Rules

1. **Objective**: Be the first player to get three of your marks (X or O) in a row
2. **Players**: Two players take turns - X always goes first
3. **Winning**: Get three marks in a row horizontally, vertically, or diagonally
4. **Draw**: If all 9 squares are filled and no player has won, the game is a draw

### Game Controls

- **Making a Move**: Click on any empty cell to place your mark
- **Current Player**: The game displays whose turn it is at the top
- **New Game**: Click the "New Game" button to reset the board and start over

### Visual Indicators

- **X marks** appear in red
- **O marks** appear in blue
- **Winning message** displays when a player wins
- **Draw message** displays when the game ends in a tie
- **Disabled cells** cannot be clicked after the game ends

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Game

```bash
# Start development server
npm run dev

# Open your browser and navigate to http://localhost:5173
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```
