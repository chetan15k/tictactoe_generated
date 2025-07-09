<script lang="ts">
	import { createInitialGameState, makeMove as makeGameMove, resetGame as resetGameState, type GameState } from '$lib/game-logic';

	let gameState: GameState = createInitialGameState();

	function makeMove(index: number) {
		gameState = makeGameMove(gameState, index);
	}

	function resetGame() {
		gameState = resetGameState();
	}

	// Reactive declarations for easier template access
	$: ({ board, currentPlayer, winner, gameOver, isDraw } = gameState);
</script>

<main>
	<h1>Tic Tac Toe</h1>

	<div class="game-info">
		{#if gameOver}
			{#if winner}
				<h2>🎉 Player {winner} wins!</h2>
			{:else if isDraw}
				<h2>🤝 It's a draw!</h2>
			{/if}
		{:else}
			<h2>Current player: <span class="current-player">{currentPlayer}</span></h2>
		{/if}
	</div>

	<div class="board">
		{#each board as cell, index}
			<button
				class="cell"
				class:x={cell === 'X'}
				class:o={cell === 'O'}
				on:click={() => makeMove(index)}
				disabled={cell !== null || gameOver}
			>
				{cell || ''}
			</button>
		{/each}
	</div>

	<button class="reset-btn" on:click={resetGame}> New Game </button>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		font-family: 'Arial', sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 20px;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.game-info {
		margin-bottom: 2rem;
		text-align: center;
	}

	.game-info h2 {
		font-size: 1.5rem;
		margin: 0;
	}

	.current-player {
		color: #ffd700;
		font-weight: bold;
		font-size: 1.8rem;
	}

	.board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 8px;
		background-color: #333;
		padding: 8px;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		margin-bottom: 2rem;
	}

	.cell {
		width: 100px;
		height: 100px;
		background-color: #fff;
		border: none;
		border-radius: 8px;
		font-size: 2.5rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.cell:hover:not(:disabled) {
		background-color: #f0f0f0;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.cell:disabled {
		cursor: not-allowed;
	}

	.cell.x {
		color: #e74c3c;
	}

	.cell.o {
		color: #3498db;
	}

	.reset-btn {
		background: linear-gradient(45deg, #ff6b6b, #ee5a24);
		color: white;
		border: none;
		padding: 12px 24px;
		font-size: 1.1rem;
		font-weight: bold;
		border-radius: 25px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	}

	.reset-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	}

	.reset-btn:active {
		transform: translateY(0);
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 2rem;
		}

		.cell {
			width: 80px;
			height: 80px;
			font-size: 2rem;
		}

		.board {
			grid-gap: 6px;
			padding: 6px;
		}
	}
</style>
