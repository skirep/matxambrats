document.getElementById('new-game').addEventListener('click', startGame);
document.getElementById('highscores').addEventListener('click', showHighscores);
document.getElementById('credits').addEventListener('click', showCredits);
document.getElementById('back-to-menu').addEventListener('click', () => {
    document.getElementById('highscores-screen').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';
});

document.getElementById('left').addEventListener('click', () => movePiece('left'));
document.getElementById('rotate').addEventListener('click', () => rotatePiece());
document.getElementById('right').addEventListener('click', () => movePiece('right'));
document.getElementById('down').addEventListener('click', () => movePiece('down'));

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

const colors = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // I
    '#0DFF72', // O
    '#F538FF', // L
    '#FF8E0D', // J
    '#FFE138', // S
    '#3877FF', // Z
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
    level: { ca: 'Nivell', en: 'Level' }
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
    updateLanguage(currentLanguage);

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

    // Inicialitzar l'idioma per defecte
    updateLanguage('ca');
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
    
    ctx.fillStyle = color;
    ctx.fillRect(pixelX, pixelY, blockSize, blockSize);

    // Simple 3D/pixelated effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(pixelX, pixelY, blockSize, 2);
    ctx.fillRect(pixelX, pixelY, 2, blockSize);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(pixelX, pixelY + blockSize - 2, blockSize, 2);
    ctx.fillRect(pixelX + blockSize - 2, pixelY, 2, blockSize);
}

function drawMatrix(matrix, offsetX, offsetY, ctx) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const drawX = offsetX * blockSize;
                const drawY = offsetY * blockSize;
                drawBlock(x, y, colors[value], ctx, drawX, drawY);
            }
        });
    });
}

function drawNextPiece() {
    nextPieceContext.fillStyle = '#000';
    nextPieceContext.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

    const matrix = nextPiece;
    const offsetX = (nextPieceCanvas.width / blockSize - matrix[0].length) / 2;
    const offsetY = (nextPieceCanvas.height / blockSize - matrix.length) / 2;

    drawMatrix(matrix, offsetX, offsetY, nextPieceContext);
}

function draw(timestamp = 0) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        movePiece('down');
        dropCounter = 0;
    }

    // Clear board
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw landed pieces
    drawMatrix(board, 0, 0, context);
    
    // Draw current piece with pixel-perfect position
    if (!isAnimating && currentPiece) {
        const drawY = currentY + (pixelY / blockSize);
        drawMatrix(currentPiece, currentX, drawY, context);
    }

    if (isGameActive) {
        requestAnimationFrame(draw);
    }
}

function movePiece(dir) {
    if (isAnimating) return;
    
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
        const previousPixelY = pixelY;
        pixelY += 10;
        
        if (checkCollision()) {
            // Retrocedim al punt exacte de col·lisió
            pixelY = previousPixelY;
            if (pixelY === previousPixelY) {
                // Si ja estàvem en col·lisió, fusionem la peça
                mergePiece();
                checkRows();
                if (!isAnimating) {
                    createPiece();
                }
            }
        } else if (pixelY >= blockSize) {
            // Actualitzem la posició de la graella quan creuem un bloc complet
            currentY++;
            pixelY = 0;
            
            if (checkCollision()) {
                currentY--;
                mergePiece();
                checkRows();
                if (!isAnimating) {
                    createPiece();
                }
            }
        }
    }
}

function rotatePiece() {
    if (isAnimating) return;
    const rotated = [];
    for (let i = 0; i < currentPiece[0].length; i++) {
        const newRow = currentPiece.map(row => row[i]).reverse();
        rotated.push(newRow);
    }
    const originalX = currentX;
    let offset = 1;
    currentPiece = rotated;
    while (checkCollision()) {
        currentX += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > currentPiece[0].length) {
            // Revert rotation
            rotatePiece();
            rotatePiece();
            rotatePiece();
            currentX = originalX;
            return;
        }
    }
}

function checkCollision() {
    const yWithPixels = currentY + Math.floor((pixelY + blockSize - 1) / blockSize);
    
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] !== 0) {
                // Comprova col·lisió amb el fons del tauler
                if (y + yWithPixels >= boardHeight) {
                    return true;
                }
                // Comprova col·lisió amb les vores
                if (x + currentX < 0 || x + currentX >= boardWidth) {
                    return true;
                }
                // Comprova col·lisió amb altres peces
                if (board[y + yWithPixels] && board[y + yWithPixels][x + currentX] !== 0) {
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
    let rowsToClear = [];
    outer: for (let y = board.length - 1; y > 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        rowsToClear.push(y);
    }

    if (rowsToClear.length > 0) {
        isAnimating = true;

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

                const clearedCount = rowsToClear.length;
                score += clearedCount * 10;
                scoreElement.textContent = score;

                linesCleared += clearedCount;
                updateLevel();
                if (Math.floor(linesCleared / 10) > Math.floor((linesCleared - clearedCount) / 10)) {
                    gameSpeed = Math.max(100, gameSpeed - 50);
                    dropInterval = gameSpeed; // mantenim compatibilitat amb antiga lògica
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
}

function updateTimer() {
    elapsedTime++;
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
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
    lastTime = 0;
    dropCounter = 0;
    document.getElementById('timer').textContent = '00:00';
    nextPiece = generatePiece();
    createPiece();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    resizeGame();
    // Restaurar volum/mute cada partida
    if (bgMusic) {
        bgMusic.volume = parseFloat(localStorage.getItem('dejocoBlocksVolume') || musicVolumeSlider?.value || '0.5');
        bgMusic.muted = (localStorage.getItem('dejocoBlocksMuted') === 'true');
    }
    requestAnimationFrame(draw);
}

// --- Firebase Highscores (Public Leaderboard) ---
let firebaseApp = null;
let firestore = null;
let firestoreEnabled = false; // Canvi a true automàtic després de config vàlida

function initFirebase() {
    if (firebaseApp) return;
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

async function saveRemoteHighscore(name, scoreValue) {
    try {
        initFirebase();
        if (!firestoreEnabled) return; // Sense config -> sortim
        const safeName = (name || 'Player').substring(0, 12);
        await firestore.collection('highscores').add({
            name: safeName,
            score: scoreValue,
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

function showHighscores() {
    if (isGameActive && !confirm(translations.confirmExit[currentLanguage])) return;
    isGameActive = false; // aturem loop suau
    document.getElementById('menu').style.display = 'none';
    document.getElementById('highscores-screen').style.display = 'flex';
    const highscoresList = document.getElementById('highscores-list');
    highscoresList.innerHTML = '<li>Loading...</li>';

    (async () => {
        let remote = await fetchRemoteHighscores(10);
        if (remote && remote.length > 0) {
            highscoresList.innerHTML = '';
            remote.forEach(entry => {
                const li = document.createElement('li');
                const dateStr = entry.ts ? new Date(entry.ts).toLocaleDateString(currentLanguage==='ca'?'ca-ES':'en-US',{month:'short',day:'numeric'}) : '';
                li.textContent = `${entry.name}: ${entry.score}${dateStr? ' ('+dateStr+')':''}`;
                highscoresList.appendChild(li);
            });
        } else {
            const highscores = JSON.parse(localStorage.getItem('tetrisHighscores')) || [];
            highscoresList.innerHTML = '';
            if (highscores.length === 0) {
                highscoresList.innerHTML = '<li>' + translations.noScores[currentLanguage] + '</li>';
            } else {
                highscores
                    .sort((a, b) => b - a)
                    .slice(0, 10)
                    .forEach(scoreValue => {
                        const li = document.createElement('li');
                        li.textContent = scoreValue;
                        highscoresList.appendChild(li);
                    });
            }
        }
    })();
}

function saveHighscore() {
    if (score < 10) return; // Ignorem puntuacions massa baixes
    const highscores = JSON.parse(localStorage.getItem('tetrisHighscores')) || [];
    highscores.push(score);
    localStorage.setItem('tetrisHighscores', JSON.stringify(highscores));
    // Enviar també a Firestore
    const playerName = sanitizePlayerName((playerNameInput && playerNameInput.value.trim()) || 'Player');
    saveRemoteHighscore(playerName, score);
}

function sanitizePlayerName(name) {
    const cleaned = name.replace(/[^A-Za-zÀ-ÿ0-9_]/g, '').substring(0,12);
    return cleaned || 'Player';
}

function showCredits() {
    alert(translations.credits[currentLanguage]);
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

// Prevent accidental navigation from game (credits button)
const creditsBtn = document.getElementById('credits');
if (creditsBtn) {
    const originalCreditsHandler = showCredits;
    creditsBtn.removeEventListener('click', showCredits);
    creditsBtn.addEventListener('click', () => {
        if (isGameActive && !confirm(translations.confirmExit[currentLanguage])) return;
        originalCreditsHandler();
    });
}

// Integrate with language change (existing updateLanguage)
const oldUpdateLanguage = updateLanguage;
updateLanguage = function (lang) {
    oldUpdateLanguage(lang);
};

// Ensure music state when starting the game
const oldStartGame = startGame;
startGame = function () {
    oldStartGame();
    toggleMusic(true);
};

// Stop music on Game Over
const oldGameOver = gameOver;
gameOver = function () {
    oldGameOver();
    // Keep music if checkbox remains active; to stop it, uncomment:
    // bgMusic.pause();
};