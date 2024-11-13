class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusElement = document.getElementById('status');
        this.cells = document.querySelectorAll('.cell');
        this.resetButton = document.getElementById('reset-button');
        
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        if (this.board[index] === '' && this.gameActive) {
            this.board[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.style.color = this.currentPlayer === 'X' ? '#ff4757' : '#2ed573';

            if (this.checkWin()) {
                this.statusElement.textContent = `Player ${this.currentPlayer} wins!`;
                this.gameActive = false;
                return;
            }

            if (this.checkDraw()) {
                this.statusElement.textContent = "Game ended in a draw!";
                this.gameActive = false;
                return;
            }

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusElement.textContent = "Player X's turn";
        
        this.cells.forEach(cell => {
            cell.textContent = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
