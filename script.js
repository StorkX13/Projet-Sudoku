document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("container");

    function generateRandomSudoku() {
        const puzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        return puzzle;
    }

    function solveSudoku(board) {
        const solvedPuzzle = JSON.parse(JSON.stringify(board));
        solveHelper(solvedPuzzle);
        return solvedPuzzle;
    }

    function solveHelper(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) return true;

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
                board[row][col] = num;
                if (solveHelper(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    function findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    }

    function isValidMove(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false;
        }
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        return true;
    }

    function createSudokuGrid(puzzle) {
        container.innerHTML = '';

        puzzle.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');

            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('input');
                cellElement.classList.add('cell');
                cellElement.type = 'text';
                cellElement.maxLength = 1;

                cellElement.classList.add(
                    (rowIndex + colIndex) % 2 === 0 ? "lightBackground" : "darkBackground"
                );

                if (initialPuzzle[rowIndex][colIndex] !== 0) {
                    cellElement.value = initialPuzzle[rowIndex][colIndex];
                    cellElement.disabled = true;
                } else {
                    cellElement.value = puzzle[rowIndex][colIndex] || "";

                    cellElement.addEventListener("input", () => {
                        const val = parseInt(cellElement.value);

                        if (isNaN(val) || val < 1 || val > 9) {
                            cellElement.value = "";
                            puzzle[rowIndex][colIndex] = 0;
                            cellElement.classList.remove("correctInput", "incorrectInput");
                            return;
                        }

                        puzzle[rowIndex][colIndex] = val;

                        if (isValidMove(puzzle, rowIndex, colIndex, val)) {
                            cellElement.classList.add("correctInput");
                            cellElement.classList.remove("incorrectInput");
                        } else {
                            cellElement.classList.add("incorrectInput");
                            cellElement.classList.remove("correctInput");
                        }
                    });
                }

                rowElement.appendChild(cellElement);
            });

            container.appendChild(rowElement);
        });
    }

    let initialPuzzle = generateRandomSudoku();
    let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
    let solvedPuzzle = solveSudoku(initialPuzzle);

    function solvePuzzle() {
        createSudokuGrid(solvedPuzzle);
    }

    function resetPuzzle() {
        initialPuzzle = generateRandomSudoku();
        puzzle = JSON.parse(JSON.stringify(initialPuzzle));
        solvedPuzzle = solveSudoku(initialPuzzle);
        createSudokuGrid(puzzle);
    }

    function checkPuzzle() {
        const correct = JSON.stringify(puzzle) === JSON.stringify(solvedPuzzle);

        if (correct) {
            alert("🎉 Bravo ! La grille est correcte !");
        } else {
            alert("❌ La grille est incorrecte !");
        }
    }

    document.getElementById("solveButton").addEventListener("click", solvePuzzle);
    document.getElementById("resetButton").addEventListener("click", resetPuzzle);
    document.getElementById("checkButton").addEventListener("click", checkPuzzle);

    createSudokuGrid(puzzle);

});
