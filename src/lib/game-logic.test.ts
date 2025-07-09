import { describe, it, expect } from 'vitest';
import {
	createInitialGameState,
	checkWinner,
	checkDraw,
	makeMove,
	resetGame,
	winningCombinations,
	type GameState,
	type Board
} from './game-logic';

describe('Game Logic', () => {
	describe('createInitialGameState', () => {
		it('should create initial game state with correct defaults', () => {
			const state = createInitialGameState();
			
			expect(state.board).toEqual(Array(9).fill(null));
			expect(state.currentPlayer).toBe('X');
			expect(state.winner).toBe(null);
			expect(state.gameOver).toBe(false);
			expect(state.isDraw).toBe(false);
		});
	});

	describe('checkWinner', () => {
		it('should return false for empty board', () => {
			const board: Board = Array(9).fill(null);
			expect(checkWinner(board, 'X')).toBe(false);
			expect(checkWinner(board, 'O')).toBe(false);
		});

		it('should return false for null player', () => {
			const board: Board = Array(9).fill('X');
			expect(checkWinner(board, null)).toBe(false);
		});

		it('should detect horizontal wins', () => {
			// Top row
			let board: Board = ['X', 'X', 'X', null, null, null, null, null, null];
			expect(checkWinner(board, 'X')).toBe(true);
			
			// Middle row
			board = [null, null, null, 'O', 'O', 'O', null, null, null];
			expect(checkWinner(board, 'O')).toBe(true);
			
			// Bottom row
			board = [null, null, null, null, null, null, 'X', 'X', 'X'];
			expect(checkWinner(board, 'X')).toBe(true);
		});

		it('should detect vertical wins', () => {
			// Left column
			let board: Board = ['X', null, null, 'X', null, null, 'X', null, null];
			expect(checkWinner(board, 'X')).toBe(true);
			
			// Middle column
			board = [null, 'O', null, null, 'O', null, null, 'O', null];
			expect(checkWinner(board, 'O')).toBe(true);
			
			// Right column
			board = [null, null, 'X', null, null, 'X', null, null, 'X'];
			expect(checkWinner(board, 'X')).toBe(true);
		});

		it('should detect diagonal wins', () => {
			// Top-left to bottom-right
			let board: Board = ['X', null, null, null, 'X', null, null, null, 'X'];
			expect(checkWinner(board, 'X')).toBe(true);
			
			// Top-right to bottom-left
			board = [null, null, 'O', null, 'O', null, 'O', null, null];
			expect(checkWinner(board, 'O')).toBe(true);
		});

		it('should not detect false wins', () => {
			const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
			expect(checkWinner(board, 'X')).toBe(false);
			expect(checkWinner(board, 'O')).toBe(false);
		});
	});

	describe('checkDraw', () => {
		it('should return false for empty board', () => {
			const board: Board = Array(9).fill(null);
			expect(checkDraw(board)).toBe(false);
		});

		it('should return false for partially filled board', () => {
			const board: Board = ['X', 'O', null, 'X', 'O', null, null, null, null];
			expect(checkDraw(board)).toBe(false);
		});

		it('should return true for completely filled board', () => {
			const board: Board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
			expect(checkDraw(board)).toBe(true);
		});
	});

	describe('makeMove', () => {
		it('should make a valid move', () => {
			const initialState = createInitialGameState();
			const newState = makeMove(initialState, 0);
			
			expect(newState.board[0]).toBe('X');
			expect(newState.currentPlayer).toBe('O');
			expect(newState.gameOver).toBe(false);
			expect(newState.winner).toBe(null);
		});

		it('should alternate players', () => {
			let state = createInitialGameState();
			
			state = makeMove(state, 0);
			expect(state.currentPlayer).toBe('O');
			
			state = makeMove(state, 1);
			expect(state.currentPlayer).toBe('X');
		});

		it('should reject move on occupied cell', () => {
			let state = createInitialGameState();
			state = makeMove(state, 0); // X moves
			const beforeState = { ...state };
			
			state = makeMove(state, 0); // Try to move on same cell
			expect(state).toEqual(beforeState);
		});

		it('should reject move when game is over', () => {
			let state = createInitialGameState();
			// Create winning condition
			state.board = ['X', 'X', null, null, null, null, null, null, null];
			state = makeMove(state, 2); // X wins
			
			expect(state.gameOver).toBe(true);
			expect(state.winner).toBe('X');
			
			const beforeState = { ...state };
			state = makeMove(state, 3); // Try to move after game over
			expect(state).toEqual(beforeState);
		});

		it('should detect win condition', () => {
			let state = createInitialGameState();
			state.board = ['X', 'X', null, null, null, null, null, null, null];
			
			state = makeMove(state, 2); // Complete the win
			
			expect(state.winner).toBe('X');
			expect(state.gameOver).toBe(true);
			expect(state.isDraw).toBe(false);
		});

		it('should detect draw condition', () => {
			let state = createInitialGameState();
			// Set up a board that will be draw on next move
			state.board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', null];
			state.currentPlayer = 'O';
			
			state = makeMove(state, 8); // Fill last cell
			
			expect(state.isDraw).toBe(true);
			expect(state.gameOver).toBe(true);
			expect(state.winner).toBe(null);
		});

		it('should reject invalid indices', () => {
			const state = createInitialGameState();
			
			expect(makeMove(state, -1)).toEqual(state);
			expect(makeMove(state, 9)).toEqual(state);
			expect(makeMove(state, 10)).toEqual(state);
		});
	});

	describe('resetGame', () => {
		it('should reset to initial state', () => {
			const resetState = resetGame();
			const initialState = createInitialGameState();
			
			expect(resetState).toEqual(initialState);
		});
	});

	describe('winningCombinations', () => {
		it('should have correct number of combinations', () => {
			expect(winningCombinations).toHaveLength(8);
		});

		it('should contain all valid winning patterns', () => {
			const expectedCombinations = [
				[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
				[0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
				[0, 4, 8], [2, 4, 6] // diagonals
			];
			
			expect(winningCombinations).toEqual(expectedCombinations);
		});
	});
});
