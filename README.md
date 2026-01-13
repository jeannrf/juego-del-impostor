# 🎭 El Juego del Impostor

![Estado del Proyecto](https://img.shields.io/badge/Estado-Funcional-green)
![Tecnologias](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-orange)

Un emocionante juego web de deducción social optimizado para móviles (diseño "Mobile First"). Reúnete con tus amigos, asignen roles y descubran quién es el impostor antes de que sea demasiado tarde.

---

## 🚀 Características Principales

### 📱 Experiencia Móvil Premium
*   **Diseño Responsivo**: Interfaz optimizada para iPhones y dispositivos Android. Sin elementos cortados ni scroll innecesario.
*   **Modo Oscuro (Dark Mode)**: Colores neón y fondos oscuros "Deep Black" para una apariencia moderna y elegante.
*   **Botones Táctiles**: Elementos de UI grandes y fáciles de pulsar.

### 🎮 Flujo de Juego Completo
1.  **Configuración Rápida**: Agrega jugadores dinámicamente.
2.  **Revelación de Roles ("Pasar el móvil")**:
    *   Tarjetas interactivas con efecto de "vidrio" (Glassmorphism).
    *   Sistema seguro para ver tu rol y palabra secreta sin que otros lo vean.
3.  **Ronda de Juego**:
    *   Temporizador visual (opcional) y guía de fases.
    *   Lista de jugadores ordenada.
4.  **Votación y Expulsión**:
    *   Sistema de votación para eliminar sospechosos.
    *   **Duelo Final**: Si queda un último impostor, tiene una oportunidad final para adivinar la palabra y ganar.
5.  **Resultados y Revancha**:
    *   Pantalla de resumen con la palabra secreta, lista de impostores y ganadores.
    *   Botón **"Nueva Palabra"** para reiniciar la ronda rápidamente con los mismos jugadores.

### ⚙️ Tecnología
*   **HTML5**: Estructura semántica dividida en múltiples vistas (`index.html`, `play.html`, `how_to_play.html`) para mejor organización.
*   **CSS3**: Estilos avanzados sin frameworks. Uso de Variables CSS, Flexbox, Grid y Media Queries específicas para móviles.
*   **JavaScript (ES6+)**: Lógica de juego robusta, manejo del DOM y máquina de estados para las fases del juego.
*   **JSON**: Base de datos de palabras flexible y fácil de expandir en `database.json`.

---

## 📂 Estructura del Proyecto

```text
/
├── index.html          # Pantalla de inicio (Landing Page)
├── play.html           # Núcleo del juego (Setup, Ronda, Votación, Resultados)
├── how_to_play.html    # Guía visual de instrucciones
├── style.css           # Estilos globales y temas
├── main.js             # Lógica principal y control de flujo
├── database.json       # Colección de palabras y pistas
└── README.md           # Documentación
```

## 📖 Cómo Jugar

1.  **Inicio**: Abre el juego en tu navegador móvil.
2.  **Jugadores**: Ingresa los nombres de todos los participantes (mínimo 3).
3.  **Roles**: Elige cuántos impostores habrá en la partida.
4.  **Revelación**: Pasen el dispositivo uno a uno.
    *   **Civiles**: Ven la "Palabra Secreta".
    *   **Impostores**: Ven una "Pista" (o nada, según la dificultad) y saben que son impostores.
5.  **Debate**: Todos dicen una palabra relacionada con la secreta. El impostor debe mentir y mezclarse.
6.  **Votación**: Al terminar el tiempo, voten a quién expulsar.
7.  **Final**:
    *   Si expulsan a todos los impostores -> **Ganan los Civiles**.
    *   Si los impostores igualan en número a los civiles -> **Ganan los Impostores**.
    *   Si el último impostor adivina la palabra -> **Gana el Impostor**.

---

## 🛠️ Instalación / Desarrollo

Simplemente clona el repositorio y abre `index.html` en tu navegador.

```bash
git clone https://github.com/tu-usuario/juego-del-impostor.git
cd juego-del-impostor
# Abre index.html
```

*Nota: Para que cargue correctamente el archivo JSON de palabras, es recomendable usar un servidor local (como Live Server en VSCode) debido a políticas de seguridad CORS de los navegadores.*

---
Hecho con ❤️ para jugar entre amigos.
