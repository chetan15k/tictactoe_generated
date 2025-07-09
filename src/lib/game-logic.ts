export type Player = 'X' | 'O' | null;
export type Board = Player[];

export interface GameState {
	board: Board;
	currentPlayer: 'X' | 'O';
	winner: Player;
	gameOver: boolean;
	isDraw: boolean;
}

// Winning combinations
export const winningCombinations = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8], // rows
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8], // columns
	[0, 4, 8],
	[2, 4, 6] // diagonals
];

export function createInitialGameState(): GameState {
	return {
		board: Array(9).fill(null),
		currentPlayer: 'X',
		winner: null,
		gameOver: false,
		isDraw: false
	};
}

export function checkWinner(board: Board, player: Player): boolean {
	if (!player) return false;
	
	return winningCombinations.some((combination) =>
		combination.every((index) => board[index] === player)
	);
}

export function checkDraw(board: Board): boolean {
	return board.every((cell) => cell !== null);
}

export function makeMove(gameState: GameState, index: number): GameState {
	// Return current state if move is invalid
	if (gameState.board[index] || gameState.gameOver || index < 0 || index > 8) {
		return gameState;
	}

	const newBoard = [...gameState.board];
	newBoard[index] = gameState.currentPlayer;

	const hasWinner = checkWinner(newBoard, gameState.currentPlayer);
	const isDraw = !hasWinner && checkDraw(newBoard);

	return {
		board: newBoard,
		currentPlayer: hasWinner || isDraw ? gameState.currentPlayer : gameState.currentPlayer === 'X' ? 'O' : 'X',
		winner: hasWinner ? gameState.currentPlayer : null,
		gameOver: hasWinner || isDraw,
		isDraw
	};
}

export function resetGame(): GameState {
	return createInitialGameState();
}
