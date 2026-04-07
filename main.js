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
fetch('database.json')
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

// Stepper Ref
const btnDecImpostor = document.getElementById('btn-dec-impostor');
const btnIncImpostor = document.getElementById('btn-inc-impostor');
const displayImpostorCount = document.getElementById('display-impostor-count');

// function updateStepperUI: Actualiza visualmente el contador y los botones
// Verifica límites (mínimo 1, máximo dinámico según jugadores)
// Deshabilita botones si se llega al límite
function updateStepperUI(val, max) {
  if (val < 1) val = 1;
  if (val > max) val = max;

  inputImpostorCount.value = val;
  if (displayImpostorCount) displayImpostorCount.textContent = val;

  if (btnDecImpostor) {
    btnDecImpostor.style.opacity = val <= 1 ? "0.3" : "1";
    btnDecImpostor.style.pointerEvents = val <= 1 ? "none" : "auto";
  }
  if (btnIncImpostor) {
    btnIncImpostor.style.opacity = val >= max ? "0.3" : "1";
    btnIncImpostor.style.pointerEvents = val >= max ? "none" : "auto";
  }
}

// Event Listeners para los botones del Stepper
// Calculan el nuevo valor basándose en el input oculto y el atributo max asignado dinámicamente
// Stepper Listeners
if (btnDecImpostor) {
  btnDecImpostor.addEventListener('click', () => {
    let max = parseInt(inputImpostorCount.getAttribute('max')) || 1;
    let current = parseInt(inputImpostorCount.value) || 1;
    updateStepperUI(current - 1, max);
  });
}

if (btnIncImpostor) {
  btnIncImpostor.addEventListener('click', () => {
    let max = parseInt(inputImpostorCount.getAttribute('max')) || 1;
    let current = parseInt(inputImpostorCount.value) || 1;
    updateStepperUI(current + 1, max);
  });
}
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
  let maxImpostors = Math.ceil(players.length / 2) - 1;
  if (maxImpostors < 1) maxImpostors = 1;

  inputImpostorCount.setAttribute('max', maxImpostors);

  labelMaxImpostors.textContent = `Impostores (Máximo: ${maxImpostors})`;

  // Init Stepper
  updateStepperUI(1, maxImpostors);

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
      showModal("Error", "Necesitas al menos 3 jugadores para jugar.", null, null, "Entendido");
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
  // Mezclamos indices usando Fisher-Yates (Mejor aleatoriedad)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

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
  // Insertar entrada falsa en el historial para interceptar el botón "Atrás" del celular
  pushFakeHistory();
  showHandoverScreen();
}

function showHandoverScreen() {
  if (!cardTitle) return; // Si no hay tarjeta, salir
  setRevealMode(false);
  cardReveal.classList.remove('is-impostor'); // Reiniciar estado de impostor
  cardReveal.classList.remove('is-civil');    // Reiniciar estado de civil
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
  setRevealMode(false);
  revealState = 'ready';

  // UI: "Presiona para ver"
  cardIcon.textContent = "🔒";
  cardTitle.textContent = "¿Listo?";
  cardInstruction.textContent = "Asegúrate de que nadie más esté mirando la pantalla.";

  btnCardAction.textContent = "Revelar Rol";
  btnCardAction.classList.remove('btn-secondary');
}

function showRevealedScreen() {
  setRevealMode(true);
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
    cardReveal.classList.add('is-impostor');
    cardReveal.classList.remove('is-civil');
    cardWord.textContent = `PISTA: ${gameSession.currentWordObj.hint}`;
    // Estilos en línea eliminados a favor de clases CSS
    cardWord.removeAttribute('style');
    cardInstruction.textContent = "Eres el IMPOSTOR";
    cardRoleDesc.textContent = "¡Nadie sabe que eres tú!";
  } else {
    // CIVIL: Ve la PALABRA (Word)
    cardReveal.classList.remove('is-impostor');
    cardReveal.classList.add('is-civil');
    cardWord.textContent = gameSession.currentWordObj.word;
    // Estilos en línea eliminados a favor de clases CSS
    cardWord.removeAttribute('style');
    cardInstruction.textContent = "Memoriza tu palabra secreta.";
    cardRoleDesc.textContent = "Eres un CIVIL.";
  }

  btnCardAction.textContent = "Entendido";
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

// Ayudante para mantener consistente el tamaño de la tarjeta
function setRevealMode(isRevealed) {
  if (isRevealed) {
    cardReveal.classList.add('revealed-mode');
  } else {
    cardReveal.classList.remove('revealed-mode');
  }
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

// Sistema de Modal Personalizado para reemplazar alert/confirm
function showModal(title, msg, onConfirm, onCancel, confirmText = "Aceptar", cancelText = "Cancelar") {
  const modal = document.getElementById('modal-generic');
  const mTitle = document.getElementById('modal-generic-title');
  const mMsg = document.getElementById('modal-generic-msg');
  const mActions = document.getElementById('modal-generic-actions');

  if (!modal) return;

  mTitle.textContent = title;
  // Permitir HTML en el mensaje para saltos de línea
  mMsg.innerHTML = msg.replace(/\n/g, '<br>');
  mActions.innerHTML = '';

  // Botón Cancelar (Solo si hay callback de cancelar o es tipo confirmación)
  if (onCancel) {
    const btnCancel = document.createElement('button');
    btnCancel.textContent = cancelText;
    btnCancel.className = 'btn btn-secondary';
    btnCancel.onclick = () => {
      modal.classList.add('hidden');
      onCancel();
    };
    mActions.appendChild(btnCancel);
  }

  // Botón Confirmar
  const btnConfirm = document.createElement('button');
  btnConfirm.textContent = confirmText;
  btnConfirm.className = 'btn';
  // Si es alerta simple, quizás queramos otro color, pero dejémoslo estándar por ahora
  btnConfirm.onclick = () => {
    modal.classList.add('hidden');
    if (onConfirm) onConfirm();
  };
  mActions.appendChild(btnConfirm);

  modal.classList.remove('hidden');
}

// Botón "Nueva Palabra" (Reiniciar ronda con mismos players)
if (btnNewWord) {
  btnNewWord.addEventListener('click', () => {
    showModal(
      "¿Nueva Ronda?",
      "Se sorteará una nueva palabra y nuevos roles.",
      () => {
        // Ocultar botón al reiniciar
        btnNewWord.classList.add('hidden');

        // Rotar jugador inicial
        currentStarterIndex = (currentStarterIndex + 1) % players.length;

        // Reiniciar juego con los mismos parámetros
        const currentImpostorCount = gameSession.impostorCount || 1;

        // Ocultar pantalla actual
        screenGameRound.classList.add('hidden');

        // Re-init
        initGame(currentImpostorCount);
      },
      () => { } // Cancelar hace nada
    );
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

  showModal(
    "¿Expulsar Jugador?",
    `¿Seguros que quieren expulsar a ${target.name}?`,
    () => {
      // CONFIRMADO
      if (isImpostor) {
        // Verificar cuántos impostores quedan (incluyendo al actual que vamos a eliminar)
        const activeImpostorsCount = gameSession.playersRoles.filter(p => p.isImpostor && p.isAlive).length;

        if (activeImpostorsCount > 1) {
          // HAY MÁS IMPOSTORES: Solo se elimina a este
          target.isAlive = false;
          showModal(
            "¡IMPOSTOR ELIMINADO! 🎭",
            `Has atrapado a ${target.name}. Pero cuidado... ¡Quedan más impostores!`,
            () => {
              // Verificar si con esta baja los civiles ya ganaron automáticamente 
              // (Aunque usualmente si quedan impostores el juego sigue, a menos que queden 0, que es el `else` de abajo)
              startGameRound();
            },
            null,
            "Continuar Juego"
          );
        } else {
          // ES EL ÚLTIMO IMPOSTOR -> VA A DUELO FINAL (Oportunidad de ganar)
          startFinalDuel(target);
        }
      } else {
        // CIVIL ELIMINADO
        target.isAlive = false;

        showModal(
          "¡ERROR! 😱",
          `${target.name} ERA... ¡UN CIVIL!`,
          () => {
            // AL CERRAR EL MODAL DE ERROR...
            // Verificar si ganaron los impostores
            const aliveImpostors = gameSession.playersRoles.filter(p => p.isImpostor && p.isAlive).length;
            const aliveCivilians = gameSession.playersRoles.filter(p => !p.isImpostor && p.isAlive).length;

            if (aliveImpostors >= aliveCivilians) {
              showGameOver(
                "¡LOS IMPOSTORES GANAN!",
                "Han igualado en número a los civiles."
              );
            } else {
              // Si el juego sigue
              showModal(
                "El juego continúa",
                "Quedan más civiles que impostores.",
                () => { startGameRound(); },
                null,
                "Seguir Jugando"
              );
            }
          },
          null,
          "Entendido"
        );
      }
    },
    () => { }
  );
}

/* FASE 4: DUELO FINAL (Impostor Opportunity) */
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
      showGameOver(
        "¡EL IMPOSTOR GANA!",
        `${impostorPlayer.name} adivinó la palabra secreta.`
      );
    } else {
      showGameOver(
        "¡GANAN LOS CIVILES!",
        `${impostorPlayer.name} falló el intento final.` // Redundancy removed
      );
    }
  });
}

// Nueva función para manejar el fin del juego sin salir de play.html
function showGameOver(title, description) {
  // Ocultar pantallas activas
  if (screenVoting) screenVoting.classList.add('hidden');
  if (screenFinalDuel) screenFinalDuel.classList.add('hidden');

  // Mostrar pantalla principal de ronda
  if (screenGameRound) {
    screenGameRound.classList.remove('hidden');
    screenGameRound.classList.add('results-mode'); // Add class for CSS scrolling
  }

  // Referencias a elementos de Game Over
  const resultContainer = document.getElementById('game-result-container');
  const resultTitle = document.getElementById('game-result-title');
  const resultSubtitle = document.getElementById('game-result-subtitle');
  const instructionsList = document.getElementById('game-instructions-list');
  const btnGotoVote = document.getElementById('btn-goto-vote');

  // Referencias al Resumen
  const sumWord = document.getElementById('summary-word');
  const sumHint = document.getElementById('summary-hint');
  const sumImpostors = document.getElementById('summary-impostors');

  // Actualizar contenido Título y Subtítulo
  if (resultTitle) resultTitle.textContent = title;
  if (resultSubtitle) resultSubtitle.textContent = description;

  // POPULAR DATOS DE RESUMEN
  if (sumWord && gameSession.currentWordObj) {
    sumWord.textContent = gameSession.currentWordObj.word;
  }
  if (sumHint && gameSession.currentWordObj) {
    sumHint.textContent = gameSession.currentWordObj.hint;
  }

  if (sumImpostors) {
    sumImpostors.innerHTML = ''; // Limpiar
    // Filtrar impostores de la sesión
    const impostors = gameSession.playersRoles.filter(p => p.isImpostor);
    impostors.forEach(imp => {
      const li = document.createElement('li');
      li.textContent = imp.name;
      sumImpostors.appendChild(li);
    });
  }

  // Mostrar contenedor de resultado y ocultar instrucciones
  if (resultContainer) resultContainer.classList.remove('hidden');
  if (instructionsList) instructionsList.classList.add('hidden');
  if (btnGotoVote) btnGotoVote.classList.add('hidden');

  // Mostrar botón "Nueva Palabra" RESALTADO
  if (btnNewWord) {
    btnNewWord.classList.remove('hidden');
    // Añadir animación pulsante extra si se desea
    btnNewWord.style.animation = "pulse 1.5s infinite";
  }
}

// Actualizar startGameRound para resetear la vista de Game Over
const originalStartGameRound = startGameRound;
startGameRound = function () {
  // Resetear UI de Game Over
  const resultContainer = document.getElementById('game-result-container');
  const instructionsList = document.getElementById('game-instructions-list');
  const btnGotoVote = document.getElementById('btn-goto-vote');

  if (screenGameRound) screenGameRound.classList.remove('results-mode'); // Reset CSS class

  if (resultContainer) resultContainer.classList.add('hidden');
  if (instructionsList) instructionsList.classList.remove('hidden');
  if (btnGotoVote) btnGotoVote.classList.remove('hidden');

  // Resetear animación del botón
  if (btnNewWord) btnNewWord.style.animation = "";

  // Llamar a la función original (que ya habíamos definido arriba, pero como es function declaration, esto puede ser tricky. 
  // Mejor reescribimos el cuerpo de la función original aquí para evitar problemas de hoisting/redefinición complejos).

  if (screenRoleReveal) screenRoleReveal.classList.add('hidden');
  if (screenGameRound) screenGameRound.classList.remove('hidden');
  if (screenVoting) screenVoting.classList.add('hidden');

  if (btnNewWord) btnNewWord.classList.remove('hidden');

  if (roundStarterMsg && players.length > 0) {
    const starterName = players[currentStarterIndex % players.length];
    roundStarterMsg.innerHTML = `El jugador <strong style="color:var(--primary-color)">${starterName}</strong> comienza la ronda`;
  }
};

/* BOTÓN FÍSICO "ATRÁS" DEL CELULAR */
// Cuando empieza la fase de revelación, empujamos un estado falso al historial.
// Así el botón "Atrás" no sale de la página, sino que dispara un popstate
// que podemos interceptar para mostrar el modal de confirmación.

function pushFakeHistory() {
  history.pushState({ gameActive: true }, '', window.location.href);
}

window.addEventListener('popstate', (e) => {
  // Solo actuar si el juego está activo (la pantalla de revelación o de ronda está visible)
  const revealVisible = screenRoleReveal && !screenRoleReveal.classList.contains('hidden');
  const roundVisible = screenGameRound && !screenGameRound.classList.contains('hidden');
  const votingVisible = screenVoting && !screenVoting.classList.contains('hidden');
  const duelVisible = screenFinalDuel && !screenFinalDuel.classList.contains('hidden');

  if (revealVisible || roundVisible || votingVisible || duelVisible) {
    // Re-empujar el estado falso para que el botón "Atrás" vuelva a funcionar la próxima vez
    pushFakeHistory();

    // Mostrar modal de confirmación reutilizando el sistema ya existente
    showModal(
      '¿Salir de la partida?',
      '¿Estás seguro que quieres salir?\nSe perderá el progreso de la partida actual.',
      () => {
        // Confirmado: ir al inicio
        window.location.href = 'index.html';
      },
      () => {
        // Cancelado: no hacer nada
      },
      'Sí, salir',
      'Seguir jugando'
    );
  }
});

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
