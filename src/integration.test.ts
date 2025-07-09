import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Page from './routes/+page.svelte';

describe('Tic Tac Toe Integration Tests', () => {
	it('should play a complete game with X winning', async () => {
		render(Page);

		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// Game sequence: X wins with top row
		// X | O | X
		// O | X | O
		// _ | _ | _

		// Move 1: X at position 0
		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveTextContent('X');
		expect(screen.getByText('O')).toBeInTheDocument();

		// Move 2: O at position 1
		await fireEvent.click(cells[1]);
		expect(cells[1]).toHaveTextContent('O');
		expect(screen.getByText('Current player:')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Current player: X');

		// Move 3: X at position 2
		await fireEvent.click(cells[2]);
		expect(cells[2]).toHaveTextContent('X');
		expect(screen.getByText('Current player:')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Current player: O');

		// Move 4: O at position 3
		await fireEvent.click(cells[3]);
		expect(cells[3]).toHaveTextContent('O');
		expect(screen.getByText('Current player:')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Current player: X');

		// Move 5: X at position 4 (center)
		await fireEvent.click(cells[4]);
		expect(cells[4]).toHaveTextContent('X');
		expect(screen.getByText('Current player:')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Current player: O');

		// Move 6: O at position 5
		await fireEvent.click(cells[5]);
		expect(cells[5]).toHaveTextContent('O');

		// At this point, X should have a winning opportunity at position 8 (diagonal)
		// Move 7: X at position 8 - X wins!
		await fireEvent.click(cells[8]);
		expect(cells[8]).toHaveTextContent('X');

		// Check win condition
		expect(screen.getByText('🎉 Player X wins!')).toBeInTheDocument();

		// All cells should be disabled
		cells.forEach((cell) => {
			expect(cell).toBeDisabled();
		});
	});

	it('should play a complete game ending in draw', async () => {
		render(Page);

		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));

		// Game sequence resulting in draw:
		// X | O | X
		// O | X | O
		// O | X | O

		const moveSequence = [
			{ index: 0, player: 'X' }, // X
			{ index: 1, player: 'O' }, // O
			{ index: 2, player: 'X' }, // X
			{ index: 3, player: 'O' }, // O
			{ index: 4, player: 'X' }, // X
			{ index: 5, player: 'O' }, // O
			{ index: 6, player: 'O' }, // O (note: this is actually X's turn)
			{ index: 7, player: 'X' }, // X
			{ index: 8, player: 'O' } // O
		];

		// Execute the sequence to create a draw
		// Final board: O | X | O
		//              X | X | O
		//              X | O | X
		await fireEvent.click(cells[3]); // X
		await fireEvent.click(cells[0]); // O
		await fireEvent.click(cells[4]); // X
		await fireEvent.click(cells[2]); // O
		await fireEvent.click(cells[6]); // X
		await fireEvent.click(cells[5]); // O
		await fireEvent.click(cells[8]); // X
		await fireEvent.click(cells[7]); // O
		await fireEvent.click(cells[1]); // X

		// Check for draw
		expect(screen.getByText("🤝 It's a draw!")).toBeInTheDocument();

		// All cells should be disabled
		cells.forEach((cell) => {
			expect(cell).toBeDisabled();
		});
	});

	it('should handle multiple game resets correctly', async () => {
		render(Page);

		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));
		const resetButton = screen.getByText('New Game');

		// Play partial game 1
		await fireEvent.click(cells[0]); // X
		await fireEvent.click(cells[1]); // O
		await fireEvent.click(cells[2]); // X

		// Reset and verify
		await fireEvent.click(resetButton);
		cells.forEach((cell) => {
			expect(cell).toHaveTextContent('');
			expect(cell).not.toBeDisabled();
		});
		expect(screen.getByText(/Current player:/)).toBeInTheDocument();

		// Play partial game 2
		await fireEvent.click(cells[4]); // X (center)
		await fireEvent.click(cells[0]); // O

		// Reset again and verify
		await fireEvent.click(resetButton);
		cells.forEach((cell) => {
			expect(cell).toHaveTextContent('');
			expect(cell).not.toBeDisabled();
		});
		expect(screen.getByText(/Current player:/)).toBeInTheDocument();

		// Play complete game 3 - X wins
		await fireEvent.click(cells[0]); // X
		await fireEvent.click(cells[3]); // O
		await fireEvent.click(cells[1]); // X
		await fireEvent.click(cells[4]); // O
		await fireEvent.click(cells[2]); // X wins (top row)

		expect(screen.getByText('🎉 Player X wins!')).toBeInTheDocument();

		// Final reset
		await fireEvent.click(resetButton);
		cells.forEach((cell) => {
			expect(cell).toHaveTextContent('');
			expect(cell).not.toBeDisabled();
		});
		expect(screen.getByText(/Current player:/)).toBeInTheDocument();
	});

	it('should prevent moves after game ends and allow reset', async () => {
		render(Page);

		const cells = screen
			.getAllByRole('button')
			.filter((button) => button.classList.contains('cell'));
		const resetButton = screen.getByText('New Game');

		// Create winning condition
		await fireEvent.click(cells[0]); // X
		await fireEvent.click(cells[3]); // O
		await fireEvent.click(cells[1]); // X
		await fireEvent.click(cells[4]); // O
		await fireEvent.click(cells[2]); // X wins

		expect(screen.getByText('🎉 Player X wins!')).toBeInTheDocument();

		// Try to make more moves - should be prevented
		const emptyCell = cells.find((cell) => cell.textContent === '');
		if (emptyCell) {
			await fireEvent.click(emptyCell);
			expect(emptyCell).toHaveTextContent(''); // Should remain empty
		}

		// Reset should work
		await fireEvent.click(resetButton);
		expect(screen.getByText(/Current player:/)).toBeInTheDocument();

		// Should be able to make moves again
		await fireEvent.click(cells[0]);
		expect(cells[0]).toHaveTextContent('X');
	});
});
