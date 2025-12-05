const grid = [];
const sudokuDiv = document.getElementById("sudoku");

for (let row = 0; row < 9; row++) {
    grid[row] = [];
    for (let col = 0; col < 9; col++) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.max = 9;
        input.className = "cell";

        if (row % 3 === 0) input.classList.add("rowStart");
        if (row % 3 === 2) input.classList.add("rowEnd");

        sudokuDiv.appendChild(input);
        grid[row][col] = input;
    }
}

function isValid(board, row, col, num) {
    num = num.toString();

    for (let x = 0; x < 9; x++)
        if (board[row][x] === num) return false;

    for (let x = 0; x < 9; x++)
        if (board[x][col] === num) return false;

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++)
            if (board[startRow + r][startCol + c] === num)
                return false;

    return true;
}

function solve(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === "") {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num.toString();
                        if (solve(board)) return true;
                        board[row][col] = "";
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function solveSudoku() {
    const board = [];

    for (let row = 0; row < 9; row++) {
        board[row] = [];
        for (let col = 0; col < 9; col++)
            board[row][col] = grid[row][col].value;
    }

    if (solve(board)) {
        for (let row = 0; row < 9; row++)
            for (let col = 0; col < 9; col++)
                grid[row][col].value = board[row][col];
    } else {
        alert("Aucune solution trouvée !");
    }
}

function clearGrid() {
    for (let row = 0; row < 9; row++)
        for (let col = 0; col < 9; col++)
            grid[row][col].value = "";
}
