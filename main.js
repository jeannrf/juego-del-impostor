/* REFERENCIAS DEL DOM (Los huesos) */
const screenWelcome = document.getElementById('screen-welcome');
const screenSetup = document.getElementById('screen-setup');
const btnStart = document.getElementById('btn-start');
const btnAddPlayer = document.getElementById('btn-add-player');
const inputPlayer = document.getElementById('input-player');
const playerList = document.getElementById('player-list');
const btnStartGame = document.getElementById('btn-start-game');

/* ESTADO (La memoria) */
let players = [];

/* EVENTOS (Las acciones) */

// 1. Cambiar de pantalla al dar clic en "Jugar Ahora"
btnStart.addEventListener('click', () => {
  screenWelcome.classList.add('hidden'); // Ocultar portada
  screenSetup.classList.remove('hidden'); // Mostrar config
});

// 2. Agregar jugador a la lista
btnAddPlayer.addEventListener('click', () => {
  const name = inputPlayer.value.trim();
  if (name) {
    players.push(name);
    updateUI(); // Actualizar visualmente
    inputPlayer.value = ''; // Limpiar input
    inputPlayer.focus();
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

  // Mostrar botón de inicio si hay al menos 3 jugadores
  if (players.length >= 3) {
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
