document.getElementById('new-game').addEventListener('click', handleNewGameClick);
document.getElementById('how-to-play').addEventListener('click', showInstructions);
document.getElementById('highscores').addEventListener('click', showHighscores);
document.getElementById('credits').addEventListener('click', showCredits);
document.getElementById('back-to-menu').addEventListener('click', () => {
    // Use history.back() to trigger popstate for proper navigation
    history.back();
});
document.getElementById('back-to-menu-game').addEventListener('click', () => {
    // Use history.back() to trigger popstate for proper navigation
    history.back();
});
document.getElementById('back-to-menu-instructions').addEventListener('click', () => {
    // Use history.back() to trigger popstate for proper navigation
    history.back();
});

// Mobile control buttons with hold-to-repeat functionality
let buttonRepeatInterval = null;
let buttonRepeatTimeout = null;

function startButtonRepeat(action) {
    // Clear any existing intervals
    stopButtonRepeat();
    
    // Execute action immediately
    action();
    
    // Wait a bit before starting to repeat (initial delay)
    buttonRepeatTimeout = setTimeout(() => {
        // Start repeating the action
        buttonRepeatInterval = setInterval(action, 100); // Repeat every 100ms
    }, 300); // Initial delay of 300ms
}

function stopButtonRepeat() {
    if (buttonRepeatInterval) {
        clearInterval(buttonRepeatInterval);
        buttonRepeatInterval = null;
    }
    if (buttonRepeatTimeout) {
        clearTimeout(buttonRepeatTimeout);
        buttonRepeatTimeout = null;
    }
}

// Left button
const leftBtn = document.getElementById('left');
leftBtn.addEventListener('mousedown', () => startButtonRepeat(() => movePiece('left')));
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startButtonRepeat(() => movePiece('left'));
});
leftBtn.addEventListener('mouseup', stopButtonRepeat);
leftBtn.addEventListener('mouseleave', stopButtonRepeat);
leftBtn.addEventListener('touchend', stopButtonRepeat);
leftBtn.addEventListener('touchcancel', stopButtonRepeat);

// Rotate button
const rotateBtn = document.getElementById('rotate');
rotateBtn.addEventListener('mousedown', () => startButtonRepeat(() => rotatePiece()));
rotateBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startButtonRepeat(() => rotatePiece());
});
rotateBtn.addEventListener('mouseup', stopButtonRepeat);
rotateBtn.addEventListener('mouseleave', stopButtonRepeat);
rotateBtn.addEventListener('touchend', stopButtonRepeat);
rotateBtn.addEventListener('touchcancel', stopButtonRepeat);

// Right button
const rightBtn = document.getElementById('right');
rightBtn.addEventListener('mousedown', () => startButtonRepeat(() => movePiece('right')));
rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startButtonRepeat(() => movePiece('right'));
});
rightBtn.addEventListener('mouseup', stopButtonRepeat);
rightBtn.addEventListener('mouseleave', stopButtonRepeat);
rightBtn.addEventListener('touchend', stopButtonRepeat);
rightBtn.addEventListener('touchcancel', stopButtonRepeat);

// Down button
const downBtn = document.getElementById('down');
downBtn.addEventListener('mousedown', () => startButtonRepeat(() => movePiece('down', 3)));
downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startButtonRepeat(() => movePiece('down', 3));
});
downBtn.addEventListener('mouseup', stopButtonRepeat);
downBtn.addEventListener('mouseleave', stopButtonRepeat);
downBtn.addEventListener('touchend', stopButtonRepeat);
downBtn.addEventListener('touchcancel', stopButtonRepeat);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            movePiece('left');
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case 'ArrowRight':
            movePiece('right');
            break;
        case 'ArrowDown':
            movePiece('down');
            break;
        case ' ':
        case 'p':
        case 'P':
            event.preventDefault();
            togglePause();
            break;
    }
});

// Game constants
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('next-piece-canvas');
const nextPieceContext = nextPieceCanvas.getContext('2d');
const boardWidth = 10;
const boardHeight = 20;
const blockSize = 30; // Size of each block in pixels

canvas.width = boardWidth * blockSize;
canvas.height = boardHeight * blockSize;

const board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(0));
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const clearLocalBtn = document.getElementById('clear-local-scores');
const musicMuteBtn = document.getElementById('music-mute');
const musicVolumeSlider = document.getElementById('music-volume');
let isMuted = false;
let baseDropInterval = 400;

nextPieceCanvas.width = 4 * blockSize;
nextPieceCanvas.height = 4 * blockSize;

// Game Boy colors - monochrome green palette
const colors = [
    null,
    '#306230', // T - dark green
    '#306230', // I - dark green
    '#306230', // O - dark green
    '#306230', // L - dark green
    '#306230', // J - dark green
    '#306230', // S - dark green
    '#306230', // Z - dark green
];

const tetrominos = {
    'T': [[1, 1, 1], [0, 1, 0]],
    'I': [[2, 2, 2, 2]],
    'O': [[3, 3], [3, 3]],
    'L': [[0, 0, 4], [4, 4, 4]],
    'J': [[5, 0, 0], [5, 5, 5]],
    'S': [[0, 6, 6], [6, 6, 0]],
    'Z': [[7, 7, 0], [0, 7, 7]]
};

let score = 0;
let gameInterval;
let currentPiece;
let currentX;
let currentY;
let pixelY = 0;
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 400;
let nextPiece;
let linesCleared = 0;
let gameSpeed = 400;
let timerInterval;
let elapsedTime = 0;
let isAnimating = false;
let animationFrame = 0;
let isGameActive = false;
let isPaused = false;

let currentLanguage = 'ca';

const translations = {
    gameOver: {
        ca: 'Fi del joc! La teva puntuació: ',
        en: 'Game Over! Your score: '
    },
    noScores: {
        ca: 'Encara no hi ha puntuacions!',
        en: 'No scores yet!'
    },
    credits: {
        ca: 'Dejoco Blocks\nDesenvolupat per un assistent d\'IA',
        en: 'Dejoco Blocks\nDeveloped by an AI assistant'
    },
    clearLocal: { ca: 'Esborrat puntuacions locals', en: 'Local scores cleared' },
    confirmExit: { ca: 'Vols sortir de la partida en curs?', en: 'Leave the current game?' },
    nameLabel: { ca: 'Nom', en: 'Name' },
    mute: { ca: 'Silenciar', en: 'Mute' },
    unmute: { ca: 'Activar', en: 'Unmute' },
    volume: { ca: 'Volum', en: 'Volume' },
    level: { ca: 'Nivell', en: 'Level' },
    pointsSuffix: { ca: 'pts', en: 'pts' },
    pause: { ca: 'Pausa', en: 'Pause' },
    resume: { ca: 'Reprendre', en: 'Resume' },
    continueGame: { ca: 'Continuar', en: 'Continue' },
    newGame: { ca: 'Nova Partida', en: 'New Game' }
};

// Funció per actualitzar l'idioma
function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('dejocoBlocksLang', lang);
    
    // Seleccionem tots els elements que tenen atributs data-ca o data-en
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(element => {
        const newText = element.getAttribute('data-' + lang);
        if (newText) {
            element.textContent = newText;
        }
    });
    
    // Actualitzar classe activa dels botons d'idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('lang-' + lang).classList.add('active');

    // Actualitzar text botó mute segons estat
    if (musicMuteBtn) {
        musicMuteBtn.textContent = isMuted ? translations.unmute[currentLanguage] : translations.mute[currentLanguage];
    }
}

// Event listeners per als botons d'idioma
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-ca').addEventListener('click', () => updateLanguage('ca'));
    document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));
    
    // Restaurar idioma
    const storedLang = localStorage.getItem('dejocoBlocksLang');
    if (storedLang === 'ca' || storedLang === 'en') {
        currentLanguage = storedLang;
    }

    // Restaurar estat música
    const storedMusic = localStorage.getItem('dejocoBlocksMusic');
    if (storedMusic !== null && musicCheckbox) {
        musicCheckbox.checked = storedMusic === 'true';
    }

    // Restaurar volum i mute
    const storedVol = localStorage.getItem('dejocoBlocksVolume');
    if (storedVol && musicVolumeSlider) {
        musicVolumeSlider.value = storedVol;
        if (bgMusic) bgMusic.volume = parseFloat(storedVol);
    }
    const storedMuted = localStorage.getItem('dejocoBlocksMuted');
    if (storedMuted) {
        isMuted = storedMuted === 'true';
        if (bgMusic) bgMusic.muted = isMuted;
    }
    if (musicMuteBtn) musicMuteBtn.textContent = isMuted ? translations.unmute[currentLanguage] : translations.mute[currentLanguage];

    // Iniciar música si cal (després del primer gesture es reproduirà correctament)
    if (musicCheckbox && musicCheckbox.checked) {
        toggleMusic();
    }

    // Inicialitzar l'idioma (només una vegada)
    updateLanguage(currentLanguage);
    
    // Event listener per al botó de pausa
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }

    // Handle browser back button to return to menu from any screen
    window.addEventListener('popstate', (event) => {
        // Check if we're on the game screen
        if (document.getElementById('game-container').style.display !== 'none') {
            returnToMenu();
        }
        // Check if we're on the highscores screen
        else if (document.getElementById('highscores-screen').style.display !== 'none') {
            document.getElementById('highscores-screen').style.display = 'none';
            document.getElementById('menu').style.display = 'flex';
            updateNewGameButton();
        }
        // Check if we're on the instructions screen
        else if (document.getElementById('instructions-screen').style.display !== 'none') {
            document.getElementById('instructions-screen').style.display = 'none';
            document.getElementById('menu').style.display = 'flex';
            updateNewGameButton();
        }
    });
});

// Funció per ajustar la mida del canvas
function resizeGame() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    const maxWidth = Math.min(containerWidth - 20, 300); // 20px de marge
    const scaleFactor = maxWidth / (boardWidth * blockSize);
    
    canvas.style.width = `${boardWidth * blockSize * scaleFactor}px`;
    canvas.style.height = `${boardHeight * blockSize * scaleFactor}px`;
}

// Event listener per redimensionar
window.addEventListener('resize', resizeGame);

function generatePiece() {
    const pieces = 'TJLOSZI';
    const type = pieces[pieces.length * Math.random() | 0];
    return tetrominos[type];
}

function createPiece() {
    currentPiece = nextPiece;
    nextPiece = generatePiece();
    drawNextPiece();
    currentX = Math.floor(boardWidth / 2) - Math.floor(currentPiece[0].length / 2);
    currentY = 0;
    pixelY = 0;

    if (checkCollision()) {
        gameOver();
    }
}

function drawBlock(x, y, color, ctx, offsetX = 0, offsetY = 0) {
    const pixelX = offsetX + (x * blockSize);
    const pixelY = offsetY + (y * blockSize);
    
    // Main block color
    ctx.fillStyle = color;
    ctx.fillRect(pixelX, pixelY, blockSize, blockSize);

    // Game Boy style border (darker outline)
    ctx.strokeStyle = '#0f380f';
    ctx.lineWidth = 2;
    ctx.strokeRect(pixelX, pixelY, blockSize, blockSize);
}

function drawMatrix(matrix, offsetX, offsetY, ctx) {
    const drawX = offsetX * blockSize;
    const drawY = offsetY * blockSize;
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(x, y, colors[value], ctx, drawX, drawY);
            }
        });
    });
}

function drawNextPiece() {
    nextPieceContext.fillStyle = '#9bbc0f';
    nextPieceContext.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

    const matrix = nextPiece;
    const offsetX = (nextPieceCanvas.width / blockSize - matrix[0].length) / 2;
    const offsetY = (nextPieceCanvas.height / blockSize - matrix.length) / 2;

    drawMatrix(matrix, offsetX, offsetY, nextPieceContext);
}

function draw(timestamp = 0) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            movePiece('down');
            dropCounter = 0;
        }
    }

    // Clear board
    context.fillStyle = '#9bbc0f';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw landed pieces
    drawMatrix(board, 0, 0, context);
    
    // Draw current piece at collision-checked position to prevent visual overlap
    if (!isAnimating && currentPiece) {
        // Use the same calculation as checkCollision to prevent visual overlap
        const yWithPixels = currentY + Math.floor(pixelY / blockSize);
        drawMatrix(currentPiece, currentX, yWithPixels, context);
    }

    if (isGameActive && !isPaused) {
        requestAnimationFrame(draw);
    }
}

function movePiece(dir, speedMultiplier = 1) {
    if (isAnimating || isPaused) return;
    
    if (dir === 'left') {
        currentX--;
        if (checkCollision()) {
            currentX++;
        }
    } else if (dir === 'right') {
        currentX++;
        if (checkCollision()) {
            currentX--;
        }
    } else if (dir === 'down') {
        const previousY = currentY;
        const previousPixelY = pixelY;
        pixelY += 10 * speedMultiplier; // cada unitat = 10px; botó web usa 3 => 30px
        
        // Normalitzar pixelY si supera blockSize
        while (pixelY >= blockSize) {
            currentY++;
            pixelY -= blockSize;
        }
        
        if (checkCollision()) {
            // Revertir tots els canvis
            currentY = previousY;
            pixelY = previousPixelY;
            // Si no hem pogut moure, la peça ha tocat fons
            mergePiece();
            checkRows();
            if (!isAnimating) {
                createPiece();
            }
        }
    }
}

function rotatePiece() {
    if (isAnimating || isPaused) return;
    const originalPiece = currentPiece;
    const originalX = currentX;
    const rotated = [];
    for (let i = 0; i < currentPiece[0].length; i++) {
        const newRow = currentPiece.map(row => row[i]).reverse();
        rotated.push(newRow);
    }
    let offset = 1;
    currentPiece = rotated;
    while (checkCollision()) {
        currentX += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > currentPiece[0].length) {
            // Revert rotation
            currentPiece = originalPiece;
            currentX = originalX;
            return;
        }
    }
}

function togglePause() {
    if (!isGameActive) return;
    
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pause-btn');
    
    if (isPaused) {
        // Pause the game
        clearInterval(timerInterval);
        pauseBtn.classList.add('paused');
        pauseBtn.textContent = '▶';
        pauseBtn.setAttribute('data-ca', translations.resume.ca);
        pauseBtn.setAttribute('data-en', translations.resume.en);
        if (currentLanguage === 'ca') {
            pauseBtn.setAttribute('title', 'Reprendre (Espai)');
        } else {
            pauseBtn.setAttribute('title', 'Resume (Space)');
        }
    } else {
        // Resume the game
        timerInterval = setInterval(updateTimer, 1000);
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = '⏸';
        pauseBtn.setAttribute('data-ca', translations.pause.ca);
        pauseBtn.setAttribute('data-en', translations.pause.en);
        if (currentLanguage === 'ca') {
            pauseBtn.setAttribute('title', 'Pausa (Espai)');
        } else {
            pauseBtn.setAttribute('title', 'Pause (Space)');
        }
        lastTime = performance.now();
        dropCounter = 0;
        requestAnimationFrame(draw);
    }
}

function checkCollision() {
    const yWithPixels = currentY + Math.floor(pixelY / blockSize);
    
    for (let y = 0; y < currentPiece.length; y++) {
        const boardY = y + yWithPixels;
        // Comprova col·lisió amb el fons del tauler
        if (boardY >= boardHeight) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x] !== 0) return true;
            }
            continue;
        }
        
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
                const boardX = x + currentX;
                // Comprova col·lisió amb les vores
                if (boardX < 0 || boardX >= boardWidth) {
                    return true;
                }
                // Comprova col·lisió amb altres peces
                if (board[boardY][boardX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergePiece() {
    const yWithPixels = currentY + Math.floor(pixelY / blockSize);
    currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (y + yWithPixels >= 0 && y + yWithPixels < boardHeight &&
                    x + currentX >= 0 && x + currentX < boardWidth) {
                    board[y + yWithPixels][x + currentX] = value;
                }
            }
        });
    });
}

function checkRows() {
    const rowsToClear = [];
    outer: for (let y = board.length - 1; y > 0; --y) {
        for (let x = 0; x < boardWidth; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        rowsToClear.push(y);
    }

    if (rowsToClear.length > 0) {
        isAnimating = true;
        const clearedCount = rowsToClear.length;
        const previousLinesCleared = linesCleared;

        // Flash animation
        const flashRow = () => {
            rowsToClear.forEach(y => {
                for (let x = 0; x < boardWidth; x++) {
                    context.fillStyle = '#FFF';
                    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            });

            requestAnimationFrame(() => {
                // Clear the rows and update the game state
                rowsToClear.sort((a, b) => a - b).forEach(y_to_remove => {
                    const row = board.splice(y_to_remove, 1)[0].fill(0);
                    board.unshift(row);
                });

                score += clearedCount * 10;
                scoreElement.textContent = score;

                linesCleared += clearedCount;
                updateLevel();
                if (Math.floor(linesCleared / 10) > Math.floor(previousLinesCleared / 10)) {
                    gameSpeed = Math.max(100, gameSpeed - 50);
                    dropInterval = gameSpeed;
                }
                
                isAnimating = false;
                createPiece();
            });
        };

        flashRow();
    }
}

function updateLevel() {
    const level = Math.floor(linesCleared / 10) + 1;
    if (levelElement) levelElement.textContent = level;
    // Ajustem velocitat: cada nivell resta 35ms fins mínim 80
    dropInterval = Math.max(80, baseDropInterval - (level - 1) * 35);
}

function gameOver() {
    isGameActive = false;
    clearInterval(timerInterval);
    saveHighscore();
    alert(translations.gameOver[currentLanguage] + score);
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
    updateNewGameButton();
}

function updateTimer() {
    elapsedTime++;
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function handleNewGameClick() {
    if (isGameActive) {
        // Resume game if one is already active
        resumeGame();
    } else {
        // Start new game
        startGame();
    }
}

function updateNewGameButton() {
    const newGameBtn = document.getElementById('new-game');
    if (isGameActive) {
        newGameBtn.textContent = translations.continueGame[currentLanguage];
        newGameBtn.setAttribute('data-ca', translations.continueGame.ca);
        newGameBtn.setAttribute('data-en', translations.continueGame.en);
    } else {
        newGameBtn.textContent = translations.newGame[currentLanguage];
        newGameBtn.setAttribute('data-ca', translations.newGame.ca);
        newGameBtn.setAttribute('data-en', translations.newGame.en);
    }
}

function returnToMenu() {
    if (!isGameActive) return;
    
    // Pause the game if it's not already paused
    if (!isPaused) {
        togglePause();
    }
    
    // Hide game and show menu
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
    
    // Update the button text to show "Continue"
    updateNewGameButton();
}

function resumeGame() {
    if (!isGameActive) return;
    
    // Show game and hide menu
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    // Add history entry for back button navigation
    history.pushState({ screen: 'game' }, '', '');
    
    // Resume if paused
    if (isPaused) {
        togglePause();
    }
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    // Add history entry for back button navigation
    history.pushState({ screen: 'game' }, '', '');
    board.forEach(row => row.fill(0));
    score = 0;
    scoreElement.textContent = score;
    linesCleared = 0;
    updateLevel();
    baseDropInterval = 400;
    dropInterval = baseDropInterval;
    elapsedTime = 0;
    isAnimating = false;
    isGameActive = true;
    isPaused = false;
    lastTime = 0;
    dropCounter = 0;
    document.getElementById('timer').textContent = '00:00';
    nextPiece = generatePiece();
    createPiece();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    resizeGame();
    // Reset pause button state
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.classList.remove('paused');
        pauseBtn.textContent = '⏸';
        pauseBtn.setAttribute('data-ca', translations.pause.ca);
        pauseBtn.setAttribute('data-en', translations.pause.en);
        if (currentLanguage === 'ca') {
            pauseBtn.setAttribute('title', 'Pausa (Espai)');
        } else {
            pauseBtn.setAttribute('title', 'Pause (Space)');
        }
    }
    // Restaurar volum/mute cada partida
    if (bgMusic) {
        const savedVolume = localStorage.getItem('dejocoBlocksVolume');
        const savedMuted = localStorage.getItem('dejocoBlocksMuted');
        bgMusic.volume = parseFloat(savedVolume || musicVolumeSlider?.value || '0.5');
        bgMusic.muted = (savedMuted === 'true');
    }
    toggleMusic(true);
    updateNewGameButton();
    requestAnimationFrame(draw);
}

// --- Firebase Highscores (Public Leaderboard) ---
let firebaseApp = null;
let firestore = null;
let firestoreEnabled = false; // Canvi a true automàtic després de config vàlida

function initFirebase() {
    if (firebaseApp) return;
    // Check if firebase is available (CDN scripts loaded successfully)
    if (typeof firebase === 'undefined') {
        console.warn('Firebase no disponible (scripts bloquejats o no carregats). S\'utilitzarà només el mode local.');
        return;
    }
    // Introdueix aquí la teva configuració de Firebase (PLACEHOLDERS)
    const firebaseConfig = {
        apiKey: "AIzaSyAKe5KSEh71w1ik2ynRYBEyd9jWOY-Dl5U",
        authDomain: "dejoco-blocks.firebaseapp.com",
        projectId: "dejoco-blocks",
    };
    // Validació mínima perquè l'usuari ompli
    if (!firebaseConfig.apiKey.startsWith('REEMPLENA')) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firestore = firebase.firestore();
        firestoreEnabled = true;
    } else {
        console.warn('Firebase no configurat. S\'utilitzarà només el mode local.');
    }
}

async function saveRemoteHighscore(name, scoreValue, timeValue) {
    try {
        initFirebase();
        if (!firestoreEnabled) return; // Sense config -> sortim
        const safeName = (name || 'Player').substring(0, 12);
        await firestore.collection('highscores').add({
            name: safeName,
            score: scoreValue,
            time: timeValue,
            ts: Date.now()
        });
    } catch (e) {
        console.warn('No s\'ha pogut desar el highscore remot:', e);
    }
}

async function fetchRemoteHighscores(limit = 10) {
    try {
        initFirebase();
        if (!firestoreEnabled) return null;
        const snap = await firestore.collection('highscores')
            .orderBy('score', 'desc')
            .orderBy('time', 'asc')
            .limit(limit)
            .get();
        return snap.docs.map(d => d.data());
    } catch (e) {
        console.warn('Falla obtenint highscores remots:', e);
        return null;
    }
}
// --- Fi Firebase ---

// Guardar nom jugador a localStorage
const playerNameInput = document.getElementById('player-name');
if (playerNameInput) {
    const storedName = localStorage.getItem('dejocoBlocksPlayerName');
    if (storedName) playerNameInput.value = storedName;
    playerNameInput.addEventListener('input', () => {
        localStorage.setItem('dejocoBlocksPlayerName', playerNameInput.value.trim());
    });
}

function renderHighscoreList(entries, isRemote) {
    const list = document.getElementById('highscores-list');
    list.innerHTML = '';
    if (!entries || entries.length === 0) {
        list.innerHTML = '<li>' + translations.noScores[currentLanguage] + '</li>';
        return;
    }
    entries.forEach((entry, i) => {
        const li = document.createElement('li');
        if (i === 0) li.classList.add('top-1');
        else if (i === 1) li.classList.add('top-2');
        else if (i === 2) li.classList.add('top-3');
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
        const pos = document.createElement('span'); pos.className='pos'; pos.textContent = (i+1)+'.';
        const name = document.createElement('span'); name.className='name'; name.textContent = medal ? medal+' '+entry.name : entry.name;
        const scoreSpan = document.createElement('span'); scoreSpan.className='score'; scoreSpan.textContent = entry.score + ' ' + translations.pointsSuffix[currentLanguage];
        const timeSpan = document.createElement('span'); timeSpan.className='time';
        if (entry.time !== undefined && entry.time !== null) {
            const minutes = Math.floor(entry.time / 60).toString().padStart(2, '0');
            const seconds = (entry.time % 60).toString().padStart(2, '0');
            timeSpan.textContent = `${minutes}:${seconds}`;
        }
        const dateSpan = document.createElement('span'); dateSpan.className='date';
        if (entry.ts) {
            const d = new Date(entry.ts);
            dateSpan.textContent = d.toLocaleDateString(currentLanguage==='ca'?'ca-ES':'en-US',{year:'2-digit',month:'2-digit',day:'2-digit'}) + ' ' + d.toLocaleTimeString(currentLanguage==='ca'?'ca-ES':'en-US',{hour:'2-digit',minute:'2-digit'});
        }
        li.appendChild(pos);
        li.appendChild(name);
        li.appendChild(scoreSpan);
        li.appendChild(timeSpan);
        li.appendChild(dateSpan);
        list.appendChild(li);
    });
}

async function loadHighscores(limit=50) {
    const highscoresList = document.getElementById('highscores-list');
    highscoresList.innerHTML = '<li>Loading...</li>';
    let remote = await fetchRemoteHighscores(limit);
    if (remote && remote.length > 0) {
        renderHighscoreList(remote.map(r=>({name:r.name, score:r.score, time:r.time, ts:r.ts})), true);
    } else {
        let local = JSON.parse(localStorage.getItem('tetrisHighscores')) || [];
        // Handle both old format (numbers) and new format (objects)
        local = local.map(entry => {
            if (typeof entry === 'number') {
                return { score: entry, time: null };
            }
            return entry;
        });
        // Sort by score descending, then by time ascending
        local.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            // For same score, sort by time (ascending, lower time is better)
            // Entries without time are treated as having the best time (0)
            if (a.time === null || a.time === undefined) return -1;
            if (b.time === null || b.time === undefined) return 1;
            return a.time - b.time;
        });
        local = local.slice(0, limit).map(s => ({name:'—', score:s.score, time:s.time, ts:null}));
        renderHighscoreList(local, false);
    }
}

function showHighscores() {
    if (isGameActive && !confirm(translations.confirmExit[currentLanguage])) return;
    isGameActive = false; // aturem loop suau
    document.getElementById('menu').style.display = 'none';
    document.getElementById('highscores-screen').style.display = 'flex';
    loadHighscores(50);
    // Add history entry for back button navigation
    history.pushState({ screen: 'highscores' }, '', '');
}

function saveHighscore() {
    if (score < 10) return; // Ignorem puntuacions massa baixes
    const highscores = JSON.parse(localStorage.getItem('tetrisHighscores')) || [];
    highscores.push({ score: score, time: elapsedTime });
    localStorage.setItem('tetrisHighscores', JSON.stringify(highscores));
    // Enviar també a Firestore
    const playerName = sanitizePlayerName((playerNameInput && playerNameInput.value.trim()) || 'Player');
    saveRemoteHighscore(playerName, score, elapsedTime);
}

function sanitizePlayerName(name) {
    const cleaned = name.replace(/[^A-Za-zÀ-ÿ0-9_]/g, '').substring(0,12);
    return cleaned || 'Player';
}

function showCredits() {
    if (isGameActive && !confirm(translations.confirmExit[currentLanguage])) return;
    alert(translations.credits[currentLanguage]);
}

function showInstructions() {
    if (isGameActive && !confirm(translations.confirmExit[currentLanguage])) return;
    isGameActive = false;
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions-screen').style.display = 'flex';
    // Add history entry for back button navigation
    history.pushState({ screen: 'instructions' }, '', '');
}

// Music control logic
const musicCheckbox = document.getElementById('music-enabled');
const bgMusic = document.getElementById('bg-music');

function toggleMusic(auto = false) {
    if (!bgMusic) return;
    localStorage.setItem('dejocoBlocksMusic', musicCheckbox.checked ? 'true' : 'false');
    if (musicCheckbox.checked) {
        const playPromise = bgMusic.play();
        if (playPromise) {
            playPromise.catch(() => {});
        }
    } else {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

if (musicCheckbox) {
    musicCheckbox.addEventListener('change', () => toggleMusic());
}

if (musicMuteBtn) {
    musicMuteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (bgMusic) bgMusic.muted = isMuted;
        localStorage.setItem('dejocoBlocksMuted', isMuted ? 'true':'false');
        musicMuteBtn.textContent = isMuted ? translations.unmute[currentLanguage] : translations.mute[currentLanguage];
    });
}
if (musicVolumeSlider) {
    musicVolumeSlider.addEventListener('input', () => {
        const v = parseFloat(musicVolumeSlider.value);
        localStorage.setItem('dejocoBlocksVolume', v.toString());
        if (bgMusic && !isMuted) bgMusic.volume = v;
    });
}

// Clear local scores
if (clearLocalBtn) {
    clearLocalBtn.addEventListener('click', () => {
        if (confirm(currentLanguage==='ca'? 'Segur que vols esborrar les puntuacions locals?':'Are you sure you want to clear local scores?')) {
            localStorage.removeItem('tetrisHighscores');
            alert(translations.clearLocal[currentLanguage]);
        }
    });
}



const refreshBtn = document.getElementById('refresh-highscores');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        loadHighscores(50);
    });
}