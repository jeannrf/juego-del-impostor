/* REFERENCIAS DEL DOM (Los huesos) */
// Usamos comprobación de nulidad antes de usar
const screenWelcome = document.getElementById('screen-welcome');
const screenSetup = document.getElementById('screen-setup');
const btnStart = document.getElementById('btn-start'); // En index.html
const btnAddPlayer = document.getElementById('btn-add-player'); // En play.html
const inputPlayer = document.getElementById('input-player');
const playerList = document.getElementById('player-list');
const btnStartGame = document.getElementById('btn-start-game');

// Referencias para Instrucciones
const screenInstructions = document.getElementById('screen-instructions');
const btnHowToPlay = document.getElementById('btn-how-to-play'); // En index.html
const btnBackHome = document.getElementById('btn-back-home'); // En how_to_play.html

/* ESTADO (La memoria) */
let players = [];

/* EVENTOS (Las acciones) */

/* GESTIÓN DE NAVEGACIÓN (History API) */
// La navegación ahora se gestiona directamente con enlaces HTML o window.location.href

// Guardar estado inicial al cargar
// if (!history.state) {
//   history.replaceState({ screen: 'screen-welcome' }, '', '#home');
// }


/* EVENTOS (Las acciones) */

// 1. Botón Jugar Ahora
if (btnStart) {
  btnStart.addEventListener('click', () => {
    window.location.href = 'play.html';
  });
}

// Navegación a Instrucciones
if (btnHowToPlay) {
  btnHowToPlay.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'how_to_play.html';
  });
}

if (btnBackHome) {
  btnBackHome.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// LOGO HOME LINK
const logos = document.querySelectorAll('.logo');
logos.forEach(logo => {
  logo.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});

// Lógica de agregar jugador
function addPlayer() {
  if (!inputPlayer) return;
  const name = inputPlayer.value.trim();
  if (name) {
    players.push(name);
    updateUI(); // Actualizar visualmente
    inputPlayer.value = ''; // Limpiar input
    inputPlayer.focus();
  }
}

// 2. Agregar jugador (Click)
if (btnAddPlayer) {
  btnAddPlayer.addEventListener('click', addPlayer);
}

// 3. Agregar jugador (Enter)
if (inputPlayer) {
  inputPlayer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  });
}

// Función para pintar la lista en pantalla
function updateUI() {
  if (!playerList) return;
  playerList.innerHTML = ''; // Borrar lista actual

  players.forEach((player, index) => {
    const li = document.createElement('li');
    li.style.background = '#333';
    li.style.margin = '5px 0';
    li.style.padding = '10px';
    li.style.borderRadius = '8px';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';

    li.innerHTML = `
            <span>${player}</span>
            <button onclick="removePlayer(${index})" style="background:transparent; border:none; color: #ff6b6b; cursor:pointer;">❌</button>
        `;
    playerList.appendChild(li);
  });

  // Mostrar botón de inicio si hay al menos 3 jugadores
  if (btnStartGame) { // Asegurarse de que el botón existe en la página actual
    if (players.length >= 3) {
      btnStartGame.style.display = 'inline-block';
    } else {
      btnStartGame.style.display = 'none';
    }
  }
}

// Necesitamos hacer esta función global para que el botón HTML la encuentre
window.removePlayer = (index) => {
  players.splice(index, 1);
  updateUI();
};

/* LOGICA DE JUEGO Y DATOS */
// BBDD vacía, se llenará con fetch
let GAME_DATABASE = [];

// Cargar datos al iniciar
fetch('basededatos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    GAME_DATABASE = data;
    console.log("Base de datos cargada:", GAME_DATABASE.length, "palabras.");
  })
  .catch(error => {
    console.error("No se pudo cargar la base de datos:", error);
    // Solo alertar si estamos en la página de jugar
    if (screenSetup) {
      alert("Error: No se carga la base de datos. Usa live-server o servidor local.");
    }
  });


let gameSession = {
  impostorCount: 1,
  currentWordObj: null, // {id, word, hint}
  playersRoles: [], // { name, isImpostor, isAlive }
  currentPlayerRevealIndex: 0,
  votes: {}
};

/* LOGICA DE IMPOSTORES Y CONFIGITURACIÓN */
const modalImpostors = document.getElementById('modal-impostors');
const btnCancelImpostors = document.getElementById('btn-cancel-impostors');
const btnConfirmImpostors = document.getElementById('btn-confirm-impostors');
const inputImpostorCount = document.getElementById('input-impostor-count');
const labelMaxImpostors = document.getElementById('label-max-impostors');
// Nota: selectCategory ya no es necesario con el nuevo JSON sin categorías fijas.

// Referencias nuevas pantallas
const screenRoleReveal = document.getElementById('screen-role-reveal');
const roleRevealTitle = document.getElementById('role-reveal-title');
const btnRevealRole = document.getElementById('btn-reveal-role');
const roleSecretContainer = document.getElementById('role-secret-container');
const secretWordDisplay = document.getElementById('secret-word-display');
const secretRoleDesc = document.getElementById('secret-role-desc');

const screenGameRound = document.getElementById('screen-game-round');
const roundOrderList = document.getElementById('round-order-list');
// btnGotoVote se declarará más abajo junto a la lógica de la ronda

const screenVoting = document.getElementById('screen-voting');
const votingGrid = document.getElementById('voting-grid');

const screenFinalDuel = document.getElementById('screen-final-duel');
const finalGuessOptions = document.getElementById('final-guess-options');

// Botón "Hecho" (Antes Start Game) -> Configuración
btnStartGame.addEventListener('click', () => {
  const maxImpostors = Math.floor((players.length - 0.1) / 3) || 1; // Mínimo 1 lógico aunque la regla sea estricta

  inputImpostorCount.max = maxImpostors;
  inputImpostorCount.value = 1;
  if (inputImpostorCount.value > maxImpostors) inputImpostorCount.value = maxImpostors;

  labelMaxImpostors.textContent = `Impostores (Máximo: ${maxImpostors})`;
  modalImpostors.classList.remove('hidden');
});

// Cancelar modal
if (btnCancelImpostors) {
  btnCancelImpostors.addEventListener('click', () => {
    modalImpostors.classList.add('hidden');
  });
}

// Confirmar impostores -> INICIAR JUEGO
if (btnConfirmImpostors) {
  btnConfirmImpostors.addEventListener('click', () => {
    const count = parseInt(inputImpostorCount.value);
    // const cat = selectCategory.value; // Ya no usamos categorías

    if (players.length < 3) {
      alert("Necesitas al menos 3 jugadores para jugar.");
      return;
    }

    modalImpostors.classList.add('hidden');
    initGame(count);
  });
}

/* ==========================================
   LÓGICA DEL CORE DEL JUEGO
   ========================================== */

function initGame(impostorCount) {
  if (GAME_DATABASE.length === 0) {
    alert("La base de datos de palabras no se ha cargado correctamente. Recarga la página.");
    return;
  }

  // 1. Elegir Palabra Random de la Base de Datos
  const randomIndex = Math.floor(Math.random() * GAME_DATABASE.length);
  const selectedObj = GAME_DATABASE[randomIndex];

  // 2. Asignar Roles
  // Creamos array de indices [0, 1, 2...]
  let indices = players.map((_, i) => i);
  // Mezclamos indices
  indices.sort(() => Math.random() - 0.5);

  // Los primeros 'impostorCount' son impostores
  const impostorIndices = indices.slice(0, impostorCount);

  gameSession = {
    impostorCount: impostorCount,
    currentWordObj: selectedObj, // Guardamos el objeto completo (word + hint)
    playersRoles: players.map((p, i) => ({
      name: p,
      isImpostor: impostorIndices.includes(i),
      isAlive: true
    })),
    currentPlayerRevealIndex: 0
  };

  // 3. Ir a Pantalla de "Pasar el móvil"
  startRoleRevealPhase();
}

/* FASE 1: REVELAR ROLES (Cartas paso a paso) */

// Referencias nuevas de la tarjeta
const cardReveal = document.getElementById('card-reveal');
const cardIcon = document.getElementById('card-icon');
const cardTitle = document.getElementById('card-title');
const cardInstruction = document.getElementById('card-instruction');
const cardSecretContent = document.getElementById('card-secret-content');
const cardWord = document.getElementById('card-word');
const cardRoleDesc = document.getElementById('card-role-desc');
const btnCardAction = document.getElementById('btn-card-action');

// Estado interno de la fase de revelación
let revealState = 'handover';

function startRoleRevealPhase() {
  if (screenSetup) screenSetup.classList.add('hidden');
  if (screenRoleReveal) screenRoleReveal.classList.remove('hidden');
  showHandoverScreen();
}

function showHandoverScreen() {
  if (!cardTitle) return; // Si no hay tarjeta, salir
  const pIndex = gameSession.currentPlayerRevealIndex;

  // Si ya pasaron todos, iniciar juego
  if (pIndex >= gameSession.playersRoles.length) {
    startGameRound();
    return;
  }

  const player = gameSession.playersRoles[pIndex];
  revealState = 'handover';

  // UI: "Pasa el móvil A..."
  cardIcon.textContent = "📱";
  cardTitle.textContent = `Turno de ${player.name}`;
  cardTitle.style.color = "white";
  cardInstruction.textContent = "Pasa el móvil a este jugador. Nadie más debe mirar.";
  cardSecretContent.classList.add('hidden');

  btnCardAction.textContent = `Soy ${player.name}`;
  btnCardAction.classList.remove('btn-secondary');
}

function showReadyToRevealScreen() {
  revealState = 'ready';

  // UI: "Presiona para ver"
  cardIcon.textContent = "🔒";
  cardTitle.textContent = "¿Listo?";
  cardInstruction.textContent = "Asegúrate de que nadie más esté mirando la pantalla.";

  btnCardAction.textContent = "Revelar Rol";
  btnCardAction.classList.remove('btn-secondary');
}

function showRevealedScreen() {
  revealState = 'revealed';
  const pIndex = gameSession.currentPlayerRevealIndex;
  const player = gameSession.playersRoles[pIndex];

  // UI: El Rol
  cardIcon.textContent = player.isImpostor ? "😈" : "😇";

  // Contenido secreto
  cardSecretContent.classList.remove('hidden');
  cardTitle.textContent = "Tu Rol";

  if (player.isImpostor) {
    // IMPOSTOR: Ve la PISTA (Hint)
    cardWord.textContent = `PISTA: ${gameSession.currentWordObj.hint}`;
    cardWord.style.color = "#ff6b6b";
    cardWord.style.fontSize = "2.5rem";
    cardInstruction.textContent = "Eres el IMPOSTOR. Intenta deducir la palabra con esta pista.";
    cardRoleDesc.textContent = "¡Nadie sabe que eres tú!";
  } else {
    // CIVIL: Ve la PALABRA (Word)
    cardWord.textContent = gameSession.currentWordObj.word;
    cardWord.style.color = "#E85D04";
    cardWord.style.fontSize = "3rem";
    cardInstruction.textContent = "Memoriza tu palabra secreta.";
    cardRoleDesc.textContent = "Eres un CIVIL.";
  }

  btnCardAction.textContent = "Entendido / Borrar";
  btnCardAction.classList.add('btn-secondary');
}

// Único botón de acción para controlar el flujo
if (btnCardAction) {
  btnCardAction.addEventListener('click', () => {
    if (revealState === 'handover') {
      showReadyToRevealScreen();
    } else if (revealState === 'ready') {
      showRevealedScreen();
    } else if (revealState === 'revealed') {
      gameSession.currentPlayerRevealIndex++;
      showHandoverScreen();
    }
  });
}

const btnNewWord = document.getElementById('btn-new-word');
const btnGotoVote = document.getElementById('btn-goto-vote'); // This might be already declared but checking won't hurt
const roundStarterMsg = document.getElementById('round-starter-msg');

let currentStarterIndex = 0; // Se mantiene durante la sesión mientras no se cierre la página

/* FASE 2: RONDA DE MESA */
let timerInterval;

function startGameRound() {
  if (screenRoleReveal) screenRoleReveal.classList.add('hidden');
  if (screenGameRound) screenGameRound.classList.remove('hidden');
  // En caso de volver de votación:
  if (screenVoting) screenVoting.classList.add('hidden');

  // Mostrar botón de Nueva Palabra (Fixed)
  if (btnNewWord) btnNewWord.classList.remove('hidden');

  // Actualizar mensaje del jugador inicial
  if (roundStarterMsg && players.length > 0) {
    const starterName = players[currentStarterIndex % players.length];
    roundStarterMsg.innerHTML = `El jugador <strong style="color:var(--primary-color)">${starterName}</strong> comienza la ronda`;
  }
}

// Botón "Mostrar resultados" (Ir a votación)
if (btnGotoVote) {
  btnGotoVote.addEventListener('click', () => {
    startVotingPhase();
  });
}

// Botón "Nueva Palabra" (Reiniciar ronda con mismos players)
if (btnNewWord) {
  btnNewWord.addEventListener('click', () => {
    if (confirm("¿Estás seguro? Se sorteará una nueva palabra y nuevos roles.")) {
      // Ocultar botón al reiniciar
      btnNewWord.classList.add('hidden');

      // Rotar jugador inicial
      currentStarterIndex = (currentStarterIndex + 1) % players.length;

      // Reiniciar juego con los mismos parámetros
      // Necesitamos recordar cuantos impostores habíamos configurado en la sesión actual
      const currentImpostorCount = gameSession.impostorCount || 1;

      // Ocultar pantalla actual
      screenGameRound.classList.add('hidden');

      // Re-init
      initGame(currentImpostorCount);
    }
  });
}

/* FASE 3: VOTACIÓN */
function startVotingPhase() {
  if (screenGameRound) screenGameRound.classList.add('hidden');
  if (screenVoting) screenVoting.classList.remove('hidden');

  // Ocultar botón de nueva palabra en votación
  if (btnNewWord) btnNewWord.classList.add('hidden');

  renderVotingGrid();
}

function renderVotingGrid() {
  if (!votingGrid) return;
  votingGrid.innerHTML = '';
  gameSession.playersRoles.forEach((p, index) => {
    if (!p.isAlive) return; // Si ya fue eliminado 

    const btn = document.createElement('button');
    btn.innerHTML = `<div style="font-size:2rem; margin-bottom:0.5rem;">👤</div>${p.name}`;
    btn.onclick = () => handleVote(index);
    votingGrid.appendChild(btn);
  });
}

function handleVote(targetIndex) {
  const target = gameSession.playersRoles[targetIndex];
  const isImpostor = target.isImpostor;

  if (confirm(`¿Seguros que quieren expulsar a ${target.name}?`)) {
    if (isImpostor) {
      // IMPOSTOR ATRAPADO -> VA A DUELO FINAL
      startFinalDuel(target);
    } else {
      // CIVIL ELIMINADO
      alert(`${target.name} ERA... ¡UN CIVIL! 😱`);
      target.isAlive = false;

      // Verificar si ganaron los impostores (Impostores >= Civiles)
      const aliveImpostors = gameSession.playersRoles.filter(p => p.isImpostor && p.isAlive).length;
      const aliveCivilians = gameSession.playersRoles.filter(p => !p.isImpostor && p.isAlive).length;

      if (aliveImpostors >= aliveCivilians) {
        alert("¡LOS IMPOSTORES GANAN! Han igualado en número a los civiles.");
        window.location.href = 'index.html'; // Volver al inicio
      } else {
        alert("El juego continúa...");
        startGameRound();
      }
    }
  }
}

/* FASE 4: DUELO FINAL (Impostor Opportunity) */
function startFinalDuel(impostorPlayer) {
  if (screenVoting) screenVoting.classList.add('hidden');
  if (screenFinalDuel) screenFinalDuel.classList.remove('hidden');

  const inputGuess = document.getElementById('final-guess-input');
  const btnSubmitGuess = document.getElementById('btn-submit-guess');

  if (!inputGuess || !btnSubmitGuess) return;

  // Limpiar input anterior
  inputGuess.value = '';

  // Remover listeners anteriores para evitar duplicados
  const newBtn = btnSubmitGuess.cloneNode(true);
  btnSubmitGuess.parentNode.replaceChild(newBtn, btnSubmitGuess);

  newBtn.addEventListener('click', () => {
    const guees = inputGuess.value.trim();
    if (!guees) return;

    const correctWord = gameSession.currentWordObj.word;

    if (guees.toLowerCase() === correctWord.toLowerCase()) {
      alert(`¡${impostorPlayer.name} HA ACERTADO! 🎭\nLa palabra era "${correctWord}".\nEL IMPOSTOR GANA LA PARTIDA.`);
    } else {
      alert(`¡FALLÓ! Escribió "${guees}".\nLa palabra correcta era "${correctWord}".\n👮 LOS CIVILES GANAN.`);
    }
    window.location.href = 'index.html';
  });
}

/* LOGICA SALIDA DEL JUEGO (Botón X) */
const btnExitGame = document.getElementById('btn-exit-game');
const modalExitConfirm = document.getElementById('modal-exit-confirm');
const btnCancelExit = document.getElementById('btn-cancel-exit');
const btnConfirmExit = document.getElementById('btn-confirm-exit');

if (btnExitGame) {
  btnExitGame.addEventListener('click', () => {
    if (modalExitConfirm) modalExitConfirm.classList.remove('hidden');
  });
}

if (btnCancelExit) {
  btnCancelExit.addEventListener('click', () => {
    if (modalExitConfirm) modalExitConfirm.classList.add('hidden');
  });
}

if (btnConfirmExit) {
  btnConfirmExit.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}
