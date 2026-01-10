/* REFERENCIAS DEL DOM (Los huesos) */
const screenWelcome = document.getElementById('screen-welcome');
const screenSetup = document.getElementById('screen-setup');
const btnStart = document.getElementById('btn-start');
const btnAddPlayer = document.getElementById('btn-add-player');
const inputPlayer = document.getElementById('input-player');
const playerList = document.getElementById('player-list');
const btnStartGame = document.getElementById('btn-start-game');

// Referencias para Instrucciones
const screenInstructions = document.getElementById('screen-instructions');
const btnHowToPlay = document.getElementById('btn-how-to-play');
const btnBackHome = document.getElementById('btn-back-home');

/* ESTADO (La memoria) */
let players = [];

/* EVENTOS (Las acciones) */

/* GESTIÓN DE NAVEGACIÓN (History API) */

// Función centralizada para navegar
function navigateTo(screenId, pushToHistory = true) {
  // 1. Ocultar todas las pantallas
  screenWelcome.classList.add('hidden');
  screenSetup.classList.add('hidden');
  screenInstructions.classList.add('hidden');

  // 2. Mostrar la pantalla deseada
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }

  // 3. Modificar historial del navegador
  if (pushToHistory) {
    // Si vamos al inicio, limpiamos el hash o usamos 'home'
    const stateId = screenId === 'screen-welcome' ? 'home' : screenId;
    history.pushState({ screen: screenId }, '', `#${stateId}`);
  }
}

// Escuchar eventos de atrás/adelante del navegador
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.screen) {
    navigateTo(event.state.screen, false); // false para no volver a empujar al historial
  } else {
    // Si no hay estado (carga inicial o raiz), ir a welcome
    navigateTo('screen-welcome', false);
  }
});

// Guardar estado inicial al cargar
if (!history.state) {
  history.replaceState({ screen: 'screen-welcome' }, '', '#home');
}


/* EVENTOS (Las acciones) */

// 1. Botón Jugar Ahora
btnStart.addEventListener('click', () => {
  navigateTo('screen-setup');
});

// Navegación a Instrucciones
if (btnHowToPlay) {
  btnHowToPlay.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('screen-instructions');
  });
}

if (btnBackHome) {
  btnBackHome.addEventListener('click', () => {
    navigateTo('screen-welcome');
  });
}

// LOGO HOME LINK
const logos = document.querySelectorAll('.logo');
logos.forEach(logo => {
  logo.addEventListener('click', () => {
    navigateTo('screen-welcome');
  });
});

// Lógica de agregar jugador
function addPlayer() {
  const name = inputPlayer.value.trim();
  if (name) {
    players.push(name);
    updateUI(); // Actualizar visualmente
    inputPlayer.value = ''; // Limpiar input
    inputPlayer.focus();
  }
}

// 2. Agregar jugador (Click)
btnAddPlayer.addEventListener('click', addPlayer);

// 3. Agregar jugador (Enter)
inputPlayer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addPlayer();
  }
});

// Función para pintar la lista en pantalla
function updateUI() {
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

  // Mostrar botón de inicio si hay al menos 4 jugadores (Regla < 1/3)
  if (players.length >= 4) {
    btnStartGame.style.display = 'inline-block';
  } else {
    btnStartGame.style.display = 'none';
  }
}

// Necesitamos hacer esta función global para que el botón HTML la encuentre
window.removePlayer = (index) => {
  players.splice(index, 1);
  updateUI();
};

/* LOGICA DE IMPOSTORES */
const modalImpostors = document.getElementById('modal-impostors');
const btnCancelImpostors = document.getElementById('btn-cancel-impostors');
const btnConfirmImpostors = document.getElementById('btn-confirm-impostors');
const inputImpostorCount = document.getElementById('input-impostor-count');
const labelMaxImpostors = document.getElementById('label-max-impostors');

// Botón "Hecho" (Antes Start Game)
btnStartGame.addEventListener('click', () => {
  // Calcular maximo de impostores: < 1/3 del total
  // Ejemplo: 8 jugadores -> 8/3 = 2.66 -> Max 2
  // Ejemplo: 4 jugadores -> 4/3 = 1.33 -> Max 1
  const maxImpostors = Math.floor((players.length - 0.1) / 3);

  // Actualizar UI del modal
  inputImpostorCount.max = maxImpostors;
  inputImpostorCount.value = 1; // Resetear a 1
  if (inputImpostorCount.value > maxImpostors) inputImpostorCount.value = maxImpostors;

  labelMaxImpostors.textContent = `Máximo: ${maxImpostors}`;

  // Mostrar modal
  modalImpostors.classList.remove('hidden');
});

// Cancelar modal
if (btnCancelImpostors) {
  btnCancelImpostors.addEventListener('click', () => {
    modalImpostors.classList.add('hidden');
  });
}

// Confirmar impostores
if (btnConfirmImpostors) {
  btnConfirmImpostors.addEventListener('click', () => {
    const count = parseInt(inputImpostorCount.value);
    const max = parseInt(inputImpostorCount.max);

    if (count > 0 && count <= max) {
      alert(`Juego comenzaría con ${count} impostores para ${players.length} jugadores.`);
      modalImpostors.classList.add('hidden');
      // Aquí iría la lógica para iniciar el juego...
    } else {
      alert(`Por favor elige entre 1 y ${max} impostores.`);
    }
  });
}
