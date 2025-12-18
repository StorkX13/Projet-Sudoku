document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("container");

    // ======================
    // FEUX D’ARTIFICE (VICTOIRE)
    // ======================

    function spawnFirework(x, y) {
        const f = document.createElement("div");
        f.className = "firework";
        f.style.left = x + "px";
        f.style.top = y + "px";
        document.body.appendChild(f);

        setTimeout(() => {
            explodeFirework(x, y - 240);
            f.remove();
        }, 850);
    }

    function explodeFirework(x, y) {
        const particles = 26;
        const sparks = 36;
        const colors = [
            "#ff5f8d", "#ffdd55", "#7b2ff7", "#4f9dff",
            "#00ffcc", "#ff9933", "#ff2b2b", "#ffe600"
        ];

        for (let i = 0; i < particles; i++) {
            const p = document.createElement("div");
            p.className = "firework-explosion";

            const angle = (2 * Math.PI * i) / particles;
            const dist = 150 + Math.random() * 80;

            p.style.left = x + "px";
            p.style.top = y + "px";
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
            p.style.setProperty("--dy", Math.sin(angle) * dist + "px");

            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1600);
        }

        for (let i = 0; i < sparks; i++) {
            const s = document.createElement("div");
            s.className = "spark";

            const angle = (2 * Math.PI * i) / sparks;
            const dist = 180 + Math.random() * 120;

            s.style.left = x + "px";
            s.style.top = y + "px";
            s.style.background = colors[Math.floor(Math.random() * colors.length)];
            s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
            s.style.setProperty("--dy", Math.sin(angle) * dist + "px");

            document.body.appendChild(s);
            setTimeout(() => s.remove(), 800);
        }
    }

    // ======================
    // SUDOKU : LOGIQUE
    // ======================

    // Grille de base (0 = vide)
    // (Tu peux remplacer plus tard par une vraie génération aléatoire)
    function generateRandomSudoku() {
        return [
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
    }

    function solveSudoku(board) {
        const solved = JSON.parse(JSON.stringify(board));
        solveHelper(solved);
        return solved;
    }

    function solveHelper(board) {
        const empty = findEmptyCell(board);
        if (!empty) return true;

        const [r, c] = empty;

        for (let n = 1; n <= 9; n++) {
            if (isValidMove(board, r, c, n)) {
                board[r][c] = n;
                if (solveHelper(board)) return true;
                board[r][c] = 0;
            }
        }
        return false;
    }

    function findEmptyCell(board) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) return [r, c];
            }
        }
        return null;
    }

    function isValidMove(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false;
            if (board[i][col] === num) return false;
        }

        const sr = Math.floor(row / 3) * 3;
        const sc = Math.floor(col / 3) * 3;

        for (let r = sr; r < sr + 3; r++) {
            for (let c = sc; c < sc + 3; c++) {
                if (board[r][c] === num) return false;
            }
        }
        return true;
    }

    // ======================
    // UI : SURBRILLANCE
    // ======================

    function highlightRelatedCells(row, col, val) {
        const cells = document.querySelectorAll(".cell");

        cells.forEach(cell => {
            cell.classList.remove("highlight", "focusCell", "sameValue");

            const r = Number(cell.dataset.row);
            const c = Number(cell.dataset.col);

            if (
                r === row || c === col ||
                (Math.floor(r / 3) === Math.floor(row / 3) &&
                 Math.floor(c / 3) === Math.floor(col / 3))
            ) {
                cell.classList.add("highlight");
            }

            if (r === row && c === col) {
                cell.classList.add("focusCell");
            }

            if (cell.value === val && val !== "") {
                cell.classList.add("sameValue");
            }
        });
    }

    // ======================
    // UI : CRÉATION GRILLE
    // ======================

    function createSudokuGrid(puzzleRef) {
        container.innerHTML = "";

        puzzleRef.forEach((row, r) => {
            const rowEl = document.createElement("div");
            rowEl.classList.add("row");

            row.forEach((value, c) => {
                const cell = document.createElement("input");
                cell.classList.add("cell");
                cell.type = "text";
                cell.maxLength = 1;

                cell.dataset.row = r;
                cell.dataset.col = c;

                // (Garde tes classes si tu les utilises en CSS)
                cell.classList.add((r + c) % 2 === 0 ? "lightBackground" : "darkBackground");

                // Case donnée au départ → bloquée
                if (initialPuzzle[r][c] !== 0) {
                    cell.value = initialPuzzle[r][c];
                    cell.disabled = true;
                } else {
                    cell.value = puzzleRef[r][c] || "";

                    cell.addEventListener("input", () => {
                        const val = parseInt(cell.value, 10);

                        // Nettoyage si pas 1..9
                        if (!val || val < 1 || val > 9) {
                            cell.value = "";
                            puzzleRef[r][c] = 0;
                            cell.classList.remove("correctInput", "incorrectInput");
                            return;
                        }

                        // On teste la validité : on enlève temporairement la valeur
                        puzzleRef[r][c] = 0;

                        if (isValidMove(puzzleRef, r, c, val)) {
                            cell.classList.add("correctInput");
                            cell.classList.remove("incorrectInput");
                        } else {
                            cell.classList.add("incorrectInput");
                            cell.classList.remove("correctInput");
                        }

                        // On remet la valeur
                        puzzleRef[r][c] = val;

                        // Mettre à jour surbrillance "mêmes chiffres"
                        highlightRelatedCells(r, c, String(val));
                    });

                    cell.addEventListener("focus", () => {
                        highlightRelatedCells(r, c, cell.value);
                    });
                }

                rowEl.appendChild(cell);
            });

            container.appendChild(rowEl);
        });
    }

    // ======================
    // ÉTAT DU JEU
    // ======================

    let initialPuzzle = generateRandomSudoku();
    let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
    let solvedPuzzle = solveSudoku(initialPuzzle);

    // ======================
    // STATISTIQUES (localStorage)
    // ======================

    function initStats() {
        if (!localStorage.getItem("gamesPlayed")) {
            localStorage.setItem("gamesPlayed", "0");
            localStorage.setItem("gamesWon", "0");
            localStorage.setItem("bestTime", "");
        }
    }

    function formatTime(sec) {
        const s = Number(sec);
        const min = String(Math.floor(s / 60)).padStart(2, "0");
        const se = String(s % 60).padStart(2, "0");
        return `${min}:${se}`;
    }

    function updateStatsDisplay() {
        const playedEl = document.getElementById("gamesPlayed");
        const wonEl = document.getElementById("gamesWon");
        const bestEl = document.getElementById("bestTime");

        if (playedEl) playedEl.textContent = localStorage.getItem("gamesPlayed") || "0";
        if (wonEl) wonEl.textContent = localStorage.getItem("gamesWon") || "0";

        const best = localStorage.getItem("bestTime");
        if (bestEl) bestEl.textContent = best ? formatTime(best) : "--:--";
    }

    function incrementGamesPlayed() {
        const current = Number(localStorage.getItem("gamesPlayed") || "0");
        localStorage.setItem("gamesPlayed", String(current + 1));
        updateStatsDisplay();
    }

    function registerWin(timeSec) {
        const currentWon = Number(localStorage.getItem("gamesWon") || "0");
        localStorage.setItem("gamesWon", String(currentWon + 1));

        const best = localStorage.getItem("bestTime");
        if (!best || Number(timeSec) < Number(best)) {
            localStorage.setItem("bestTime", String(timeSec));
        }

        updateStatsDisplay();
    }

    // ======================
    // CHRONOMÈTRE + TEXTE FUN
    // ======================

    let seconds = 0;
    let timerInterval = null;

    function updateFunText(sec) {
        const funText = document.getElementById("funText");
        if (!funText) return;

        if (sec < 120) funText.textContent = "Ça commence fort 🕺";
        else if (sec < 300) funText.textContent = "Toujours en rythme 💃";
        else if (sec < 600) funText.textContent = "Ça transpire un peu là 😅";
        else funText.textContent = "Toujours vivant ? 👀";
    }

    function startTimer() {
        stopTimer();
        timerInterval = setInterval(() => {
            seconds++;
            const min = String(Math.floor(seconds / 60)).padStart(2, "0");
            const sec = String(seconds % 60).padStart(2, "0");

            const timerEl = document.getElementById("timer");
            if (timerEl) timerEl.textContent = `⏱️ ${min}:${sec}`;

            updateFunText(seconds);
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function resetTimer() {
        seconds = 0;
        const timerEl = document.getElementById("timer");
        if (timerEl) timerEl.textContent = "⏱️ 00:00";
        updateFunText(0);
        startTimer();
    }

    // ======================
    // DIFFICULTÉ
    // ======================

    const difficultySettings = {
        easy: 35,
        medium: 45,
        hard: 55
    };

    function getFullGrid() {
        // On part d’une grille “pleine” (solution)
        return solveSudoku(generateRandomSudoku());
    }

    function applyDifficulty(level) {
        const fullGrid = getFullGrid();

        // On remet une base propre
        initialPuzzle = JSON.parse(JSON.stringify(fullGrid));
        puzzle = JSON.parse(JSON.stringify(fullGrid));
        solvedPuzzle = JSON.parse(JSON.stringify(fullGrid));

        // On retire des cases selon la difficulté
        let removed = 0;
        const target = difficultySettings[level] ?? difficultySettings.medium;

        while (removed < target) {
            const r = Math.floor(Math.random() * 9);
            const c = Math.floor(Math.random() * 9);

            if (puzzle[r][c] !== 0) {
                puzzle[r][c] = 0;
                initialPuzzle[r][c] = 0;
                removed++;
            }
        }

        createSudokuGrid(puzzle);
        incrementGamesPlayed();
        resetTimer();
    }

    // ======================
    // BOUTONS
    // ======================

    function solvePuzzle() {
        puzzle = JSON.parse(JSON.stringify(solvedPuzzle));
        createSudokuGrid(puzzle);
    }

    function resetPuzzle() {
        // On redémarre une partie avec la difficulté actuelle si possible
        const diffEl = document.getElementById("difficulty");
        const currentLevel = diffEl ? diffEl.value : "medium";
        applyDifficulty(currentLevel);
    }

    function checkPuzzle() {
        const correct = JSON.stringify(puzzle) === JSON.stringify(solvedPuzzle);

        if (!correct) {
            alert("❌ La grille est incorrecte");
            return;
        }

        alert("🎉 Bravo !");
        stopTimer();
        registerWin(seconds);

        const w = window.innerWidth;
        const h = window.innerHeight;

        spawnFirework(100, h - 80);
        spawnFirework(w - 100, h - 80);
    }

    // ======================
    // LISTENERS
    // ======================

    const solveBtn = document.getElementById("solveButton");
    const resetBtn = document.getElementById("resetButton");
    const checkBtn = document.getElementById("checkButton");
    const diffSelect = document.getElementById("difficulty");

    if (solveBtn) solveBtn.addEventListener("click", solvePuzzle);
    if (resetBtn) resetBtn.addEventListener("click", resetPuzzle);
    if (checkBtn) checkBtn.addEventListener("click", checkPuzzle);

    if (diffSelect) {
        diffSelect.addEventListener("change", (e) => {
            applyDifficulty(e.target.value);
        });
    }

    // ======================
    // DÉMARRAGE
    // ======================

    initStats();
    updateStatsDisplay();

    // Lance une première partie (avec la difficulté sélectionnée si présente)
    const startLevel = diffSelect ? diffSelect.value : "medium";
    applyDifficulty(startLevel);

});
