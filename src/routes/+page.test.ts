import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('Tic Tac Toe Page', () => {
	it('should render the game title', () => {
		render(Page);
		expect(screen.getByText('Tic Tac Toe')).toBeInTheDocument();
	});

	it('should render a 3x3 grid of cells', () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));
		expect(cells).toHaveLength(9);
	});

	it('should show current player at start', () => {
		render(Page);
		expect(screen.getByText(/Current player:/)).toBeInTheDocument();
		expect(screen.getByText('X')).toBeInTheDocument();
	});

	it('should render reset button', () => {
		render(Page);
		expect(screen.getByText('New Game')).toBeInTheDocument();
	});

	it('should make a move when cell is clicked', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveTextContent('X');
	});

	it('should alternate players', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// First move - X
		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveTextContent('X');
		expect(screen.getByText('O')).toBeInTheDocument(); // Current player should be O

		// Second move - O
		await fireEvent.click(cells[1]);
		expect(cells[1]).toHaveTextContent('O');
		expect(screen.getByText('Current player:')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Current player: X'); // Current player should be X again
	});

	it('should not allow move on occupied cell', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// First move
		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveTextContent('X');

		// Try to click same cell again
		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveTextContent('X'); // Should still be X, not O
		expect(screen.getByText('O')).toBeInTheDocument(); // Current player should still be O
	});

	it('should detect and display winner', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// Create winning condition for X (top row)
		await fireEvent.click(cells[0]); // X
		await fireEvent.click(cells[3]); // O
		await fireEvent.click(cells[1]); // X
		await fireEvent.click(cells[4]); // O
		await fireEvent.click(cells[2]); // X wins

		expect(screen.getByText('🎉 Player X wins!')).toBeInTheDocument();
	});

	it('should disable cells after game ends', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// Create winning condition for X (top row)
		await fireEvent.click(cells[0]); // X
		await fireEvent.click(cells[3]); // O
		await fireEvent.click(cells[1]); // X
		await fireEvent.click(cells[4]); // O
		await fireEvent.click(cells[2]); // X wins

		// All cells should be disabled
		cells.forEach((cell) => {
			expect(cell).toBeDisabled();
		});
	});

	it('should detect and display draw', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// Create a draw scenario
		// O X O
		// X X O
		// X O X
		const moves = [3, 0, 4, 2, 6, 5, 8, 7, 1]; // Sequence that results in draw

		for (const move of moves) {
			await fireEvent.click(cells[move]);
		}

		expect(screen.getByText("🤝 It's a draw!")).toBeInTheDocument();
	});

	it('should reset game when New Game button is clicked', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));
		const resetButton = screen.getByText('New Game');

		// Make some moves
		await fireEvent.click(cells[0]);
		await fireEvent.click(cells[1]);

		// Reset game
		await fireEvent.click(resetButton);

		// Check that board is cleared
		cells.forEach((cell) => {
			expect(cell).toHaveTextContent('');
			expect(cell).not.toBeDisabled();
		});

		// Check that current player is X
		expect(screen.getByText(/Current player:/)).toBeInTheDocument();
		expect(screen.getByText('X')).toBeInTheDocument();
	});

	it('should apply correct CSS classes to cells', async () => {
		render(Page);
		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// Make X move
		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveClass('x');

		// Make O move
		await fireEvent.click(cells[1]);
		expect(cells[1]).toHaveClass('o');
	});
});
